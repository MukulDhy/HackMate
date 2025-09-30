import cron from "node-cron";
import mongoose from "mongoose";
import { sendTeamNotification } from "../services/sendTeamEmail.service.js";
import Hackathon from "../models/hackthon.model.js";
import Team from "../models/team.model.js";
import TeamMember from "../models/teamMember.model.js";
import User from "../models/user.model.js";
import logger from "./logger.js";

// Error types for better handling
const ErrorTypes = {
  TRANSIENT: "TRANSIENT",
  VALIDATION: "VALIDATION",
  BUSINESS: "BUSINESS",
  FATAL: "FATAL",
};

class SchedulerError extends Error {
  constructor(message, type, code, retryable = false) {
    super(message);
    this.name = "SchedulerError";
    this.type = type;
    this.code = code;
    this.retryable = retryable;
    this.timestamp = new Date().toISOString();
  }
}

// Error classification function
const classifyError = (error) => {
  if (error.code === 112 || error.codeName === "WriteConflict") {
    return new SchedulerError(
      error.message,
      ErrorTypes.TRANSIENT,
      error.code,
      true
    );
  }

  if (error.code === 11000) {
    return new SchedulerError(
      "Duplicate key error",
      ErrorTypes.VALIDATION,
      error.code,
      false
    );
  }

  if (error.name === "ValidationError") {
    return new SchedulerError(
      `Validation error: ${error.message}`,
      ErrorTypes.VALIDATION,
      "VALIDATION_ERROR",
      false
    );
  }

  if (error.name === "CastError") {
    return new SchedulerError(
      `Invalid data format: ${error.message}`,
      ErrorTypes.VALIDATION,
      "CAST_ERROR",
      false
    );
  }

  if (
    error.message.includes("No participants") ||
    error.message.includes("No problem statements") ||
    error.message.includes("Not enough participants") ||
    error.message.includes("Hackathon already started")
  ) {
    return new SchedulerError(
      error.message,
      ErrorTypes.BUSINESS,
      "BUSINESS_RULE",
      false
    );
  }

  return new SchedulerError(
    error.message,
    ErrorTypes.FATAL,
    "UNKNOWN_ERROR",
    false
  );
};

// Retry mechanism with exponential backoff
const retryOperation = async (operation, maxRetries = 3, baseDelay = 500) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = classifyError(error);

      if (!lastError.retryable || attempt === maxRetries) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      logger.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`, {
        error: lastError.message,
        type: lastError.type,
        code: lastError.code,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

// Function to cancel hackathon and cleanup (standalone function with its own session)
const cancelHackathon = async (hackathon, reason = "Technical issues", io) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const { _id, title, participants } = hackathon;

    logger.info(`Cancelling hackathon: ${title}`, {
      hackathonId: _id,
      reason,
      participantCount: participants?.length || 0,
    });

    // Update hackathon status to cancelled
    await Hackathon.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: "cancelled",
          isActive: false,
          reason: reason,
        },
      },
      { session }
    );

    // Clear currentHackathonId for all participants
    if (participants && participants.length > 0) {
      const userUpdatePromises = participants.map((participantId) =>
        User.findByIdAndUpdate(
          participantId,
          {
            $unset: { currentHackathonId: null },
          },
          { session }
        )
      );

      await Promise.all(userUpdatePromises);
      logger.info(
        `Cleared currentHackathonId for ${participants.length} participants`
      );
    }

    // Delete any teams that were created for this hackathon
    const teamsDeleted = await Team.deleteMany(
      { hackathonId: _id },
      { session }
    );

    // Delete team members associated with those teams
    if (teamsDeleted.deletedCount > 0) {
      const teamIds = (
        await Team.find({ hackathonId: _id }).session(session)
      ).map((team) => team._id);
      await TeamMember.deleteMany({ teamId: { $in: teamIds } }, { session });
      logger.info(
        `Deleted ${teamsDeleted.deletedCount} teams and their members`
      );
    }

    await session.commitTransaction();

    logger.info(`Successfully cancelled hackathon: ${title}`, {
      hackathonId: _id,
      participantsCleared: participants?.length || 0,
      teamsDeleted: teamsDeleted.deletedCount || 0,
    });

    // Notify clients about hackathon cancellation
    if (io) {
      io.to(_id.toString()).emit("hackathon-cancelled", {
        hackathonId: _id,
        hackathonTitle: title,
        reason: reason,
        cancelledAt: new Date().toISOString(),
      });
    }

    return {
      success: true,
      hackathonId: _id,
      hackathonTitle: title,
      participantsCleared: participants?.length || 0,
      teamsDeleted: teamsDeleted.deletedCount || 0,
      reason: reason,
    };
  } catch (error) {
    await session.abortTransaction();
    logger.error(`Failed to cancel hackathon ${hackathon.title}:`, error);
    throw error;
  } finally {
    session.endSession();
  }
};

// Team creation logic with proper transaction handling and cancellation on failure
const createTeamsForHackathon = async (hackathon, io) => {
  const session = await mongoose.startSession();
  let transactionCommitted = false;

  try {
    await session.startTransaction();

    const {
      participants,
      maxTeamSize,
      problemStatements,
      minParticipantsToFormTeam,
      _id,
      title,
    } = hackathon;

    // Validation checks - throw errors instead of calling cancelHackathon here
    if (!participants || participants.length === 0) {
      const errorMsg = `No participants for hackathon: ${title}`;
      logger.warn(errorMsg);
      throw new SchedulerError(
        errorMsg,
        ErrorTypes.BUSINESS,
        "NO_PARTICIPANTS",
        false
      );
    }

    if (!problemStatements || problemStatements.length === 0) {
      const errorMsg = `No problem statements for hackathon: ${title}`;
      logger.warn(errorMsg);
      throw new SchedulerError(
        errorMsg,
        ErrorTypes.BUSINESS,
        "NO_PROBLEM_STATEMENTS",
        false
      );
    }

    if (participants.length < minParticipantsToFormTeam) {
      const errorMsg = `Not enough participants to form teams. Need at least ${minParticipantsToFormTeam}, have ${participants.length}`;
      logger.warn(errorMsg);
      throw new SchedulerError(
        errorMsg,
        ErrorTypes.BUSINESS,
        "INSUFFICIENT_PARTICIPANTS",
        false
      );
    }

    // Check if hackathon has already started
    const now = new Date();
    if (hackathon.startDate <= now) {
      const errorMsg = `Hackathon ${title} has already started. Cannot form teams.`;
      logger.error(errorMsg);
      throw new SchedulerError(
        errorMsg,
        ErrorTypes.BUSINESS,
        "HACKATHON_STARTED",
        false
      );
    }

    // Calculate optimal team distribution
    const totalParticipants = participants.length;
    const optimalTeamCount = Math.ceil(totalParticipants / maxTeamSize);
    const baseTeamSize = Math.floor(totalParticipants / optimalTeamCount);
    const remainder = totalParticipants % optimalTeamCount;

    logger.info(`Creating teams for hackathon: ${title}`, {
      totalParticipants,
      optimalTeamCount,
      baseTeamSize,
      remainder,
      minParticipantsToFormTeam,
      maxTeamSize,
    });

    // Shuffle participants randomly
    const shuffledParticipants = [...participants];
    for (let i = shuffledParticipants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledParticipants[i], shuffledParticipants[j]] = [
        shuffledParticipants[j],
        shuffledParticipants[i],
      ];
    }

    const createdTeams = [];
    const emailPromises = [];
    let participantIndex = 0;

    // Create teams with optimal distribution
    for (let teamIndex = 0; teamIndex < optimalTeamCount; teamIndex++) {
      const currentTeamSize =
        teamIndex < remainder ? baseTeamSize + 1 : baseTeamSize;

      if (participantIndex >= shuffledParticipants.length) break;

      const teamMembers = shuffledParticipants.slice(
        participantIndex,
        participantIndex + currentTeamSize
      );
      participantIndex += currentTeamSize;

      // Pick random problem statement
      const randomProblemIndex = Math.floor(
        Math.random() * problemStatements.length
      );
      const randomProblem = problemStatements[randomProblemIndex];

      // Generate unique team name
      const teamName = `Team-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

      // Create team document
      const team = await Team.create(
        [
          {
            hackathonId: _id,
            name: teamName,
            problemStatement: randomProblem,
            submissionStatus: "not_submitted",
            teamSize: currentTeamSize,
            teamMember: teamMembers,
          },
        ],
        { session }
      );

      // Create team members and update users
      const teamMemberPromises = teamMembers.map((memberId, index) => {
        const role = index === 0 ? "leader" : "developer";
        return TeamMember.create(
          [
            {
              teamId: team[0]._id,
              userId: memberId,
              role: role,
              status: "active",
            },
          ],
          { session }
        );
      });

      // Update users' current hackathon
      const userUpdatePromises = teamMembers.map((memberId) =>
        User.findByIdAndUpdate(
          memberId,
          { currentHackathonId: _id },
          { session }
        )
      );

      await Promise.all([...teamMemberPromises, ...userUpdatePromises]);

      // Populate team details
      const populatedTeam = await Team.findById(team[0]._id)
        .populate({
          path: "teamMember",
          select: "id name email skills",
        })
        .populate({
          path: "members",
          populate: {
            path: "userId",
            select: "id name email skills",
          },
        })
        .session(session);

      createdTeams.push(populatedTeam);

      // Prepare email notifications (outside transaction)
      for (const memberId of teamMembers) {
        const user = await User.findById(memberId).session(session);
        if (!user) continue;

        const teammates = teamMembers
          .filter((mId) => mId.toString() !== memberId.toString())
          .map(async (mId) => {
            const teammate = await User.findById(mId).session(session);
            return teammate ? teammate.name : "Teammate";
          });

        const teammateNames = await Promise.all(teammates);

        emailPromises.push(
          sendTeamNotification({
            email: user.email,
            name: user.name,
            hackathonTitle: title,
            teammates: teammateNames,
            problemStatement: randomProblem,
            teamName: teamName,
          }).catch((emailError) => {
            logger.error(`Failed to send email to ${user.email}:`, emailError);
            return null;
          })
        );
      }
    }

    // Update hackathon status
    await Hackathon.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: "registration_closed",
        },
      },
      { session }
    );

    await session.commitTransaction();
    transactionCommitted = true;
    logger.info(`Transaction committed successfully for hackathon: ${title}`);

    // Send emails outside transaction
    if (emailPromises.length > 0) {
      const emailResults = await Promise.allSettled(emailPromises);
      const successfulEmails = emailResults.filter(
        (r) => r.status === "fulfilled"
      ).length;
      const failedEmails = emailResults.filter(
        (r) => r.status === "rejected"
      ).length;

      logger.info(
        `Emails sent: ${successfulEmails} successful, ${failedEmails} failed`
      );

      emailResults.forEach((result, index) => {
        if (result.status === "rejected") {
          logger.error(
            `Failed to send email to participant at index ${index}: ${result.reason}`
          );
        }
      });
    }

    logger.info(
      `Successfully created ${createdTeams.length} teams for ${title}`
    );
    return {
      success: true,
      teamsCreated: createdTeams.length,
      hackathonId: _id,
      hackathonTitle: title,
    };
  } catch (error) {
    // Only abort transaction if it hasn't been committed
    if (!transactionCommitted) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        logger.warn(`Error aborting transaction: ${abortError.message}`);
      }
    }

    // If team formation fails due to business rules and hackathon hasn't started, cancel it
    const now = new Date();
    if (hackathon.startDate > now && error.type === ErrorTypes.BUSINESS) {
      logger.warn(
        `Team formation failed for hackathon ${hackathon.title} due to business rules, cancelling hackathon: ${error.message}`
      );
      try {
        // Use a separate session for cancellation
        await cancelHackathon(
          hackathon,
          `Team formation failed: ${error.message}`,
          io
        );

        // Return a success result for cancellation case instead of throwing error
        return {
          success: true,
          teamsCreated: 0,
          hackathonId: hackathon._id,
          hackathonTitle: hackathon.title,
          cancelled: true,
          reason: error.message,
        };
      } catch (cancelError) {
        logger.error(
          `Failed to cancel hackathon after team formation failure:`,
          cancelError
        );
        // Re-throw the original business error, not the cancellation error
        throw error;
      }
    } else if (error.type === ErrorTypes.FATAL) {
      logger.error(
        `Fatal error during team formation for hackathon ${hackathon.title}:`,
        error
      );
    }

    throw error;
  } finally {
    try {
      session.endSession();
    } catch (sessionError) {
      logger.warn(`Error ending session: ${sessionError.message}`);
    }
  }
};

// Function to complete hackathon and perform cleanup
const completeHackathon = async (hackathon, io) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const { _id, title, status, participants } = hackathon;

    logger.info(`Completing hackathon: ${title}`, {
      hackathonId: _id,
      currentStatus: status,
    });

    // Update hackathon status to completed
    await Hackathon.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: "completed",
          isActive: false,
        },
      },
      { session }
    );

    // Find all teams for this hackathon
    const teams = await Team.find({ hackathonId: _id }).session(session);
    logger.info(
      `Found ${teams.length} teams to process for hackathon: ${title}`
    );

    // Update team statuses to completed
    const teamUpdatePromises = teams.map((team) =>
      Team.findByIdAndUpdate(
        team._id,
        {
          $set: {
            status: "completed",
          },
        },
        { session }
      )
    );

    // Clear currentHackathonId for all participants
    const userUpdatePromises = participants.map((participantId) =>
      User.findByIdAndUpdate(
        participantId,
        {
          $unset: { currentHackathonId: null },
        },
        { session }
      )
    );

    await Promise.all([...teamUpdatePromises, ...userUpdatePromises]);
    await session.commitTransaction();

    logger.info(`Successfully completed hackathon: ${title}`);

    return {
      success: true,
      hackathonId: _id,
      hackathonTitle: title,
      teamsProcessed: teams.length,
      participantsProcessed: participants.length,
    };
  } catch (error) {
    await session.abortTransaction();
    logger.error(`Failed to complete hackathon ${hackathon.title}:`, error);
    throw error;
  } finally {
    session.endSession();
  }
};

// Main scheduler function with comprehensive error handling
export const startScheduler = (io) => {
  // Team formation scheduler (runs every 30 seconds)
  cron.schedule(
    "*/30 * * * * *",
    async () => {
      const marker = {
        status: "started",
        timestamp: new Date().toISOString(),
        hackathonsProcessed: 0,
        errors: [],
      };

      try {
        logger.debug("Team formation scheduler started", {
          timestamp: marker.timestamp,
        });

        const now = new Date();
        const twoMinutesAgo = new Date(now.getTime() - 2 * 60000);

        // Find hackathons where registration deadline has passed
        const hackathonsToProcess = await Hackathon.find({
          registrationDeadline: { $lte: now, $gte: twoMinutesAgo },
          isActive: true,
          status: "registration_open",
          participants: { $exists: true, $ne: [] },
        }).populate({
          path: "participants",
          select: "name email skills",
        });

        marker.hackathonsToProcess = hackathonsToProcess.length;
        logger.info(
          `Found ${hackathonsToProcess.length} hackathons to process for team formation`
        );

        for (const hackathon of hackathonsToProcess) {
          const hackathonMarker = {
            hackathonId: hackathon._id,
            title: hackathon.title,
            status: "processing",
            startedAt: new Date().toISOString(),
          };

          try {
            logger.info(
              `Processing hackathon for team formation: ${hackathon.title}`
            );

            const result = await retryOperation(
              () => createTeamsForHackathon(hackathon, io),
              3,
              500
            );

            // Check if hackathon was cancelled but handled successfully
            if (result.cancelled) {
              hackathonMarker.status = "cancelled";
              logger.info(
                `Hackathon cancelled successfully: ${hackathon.title} - ${result.reason}`
              );
            } else {
              hackathonMarker.status = "completed";
              marker.hackathonsProcessed++;
              logger.info(
                `Successfully processed hackathon: ${hackathon.title}`
              );
            }

            hackathonMarker.completedAt = new Date().toISOString();
            hackathonMarker.result = result;
          } catch (error) {
            hackathonMarker.status = "failed";
            hackathonMarker.error = {
              message: error.message,
              type: error.type,
              code: error.code,
              retryable: error.retryable,
            };
            hackathonMarker.completedAt = new Date().toISOString();
            marker.errors.push(hackathonMarker.error);

            if (error.type === ErrorTypes.TRANSIENT) {
              logger.warn(
                `Transient error processing hackathon ${hackathon.title}:`,
                error
              );
            } else if (error.type === ErrorTypes.BUSINESS) {
              logger.info(
                `Business rule violation for hackathon ${hackathon.title}: ${error.message}`
              );
            } else {
              logger.error(
                `Error processing hackathon ${hackathon.title}:`,
                error
              );
            }
          }
        }

        marker.status = "completed";
        marker.completedAt = new Date().toISOString();

        logger.debug("Team formation scheduler completed", {
          hackathonsProcessed: marker.hackathonsProcessed,
          totalErrors: marker.errors.length,
        });
      } catch (error) {
        marker.status = "failed";
        marker.error = classifyError(error);
        marker.completedAt = new Date().toISOString();
        logger.error("Team formation scheduler fatal error:", error);
      }
    },
    {
      scheduled: true,
      timezone: "UTC",
    }
  );

  // Hackathon completion scheduler (runs every minute)
  cron.schedule(
    "* * * * *",
    async () => {
      const marker = {
        status: "started",
        timestamp: new Date().toISOString(),
        hackathonsScheduled: 0,
        errors: [],
      };

      try {
        logger.debug("Hackathon completion scheduler started", {
          timestamp: marker.timestamp,
        });

        const now = new Date();
        const threshold = new Date(now.getTime() + 3 * 60 * 1000);

        // Find hackathons ending soon
        const hackathonsToComplete = await Hackathon.find({
          startDate: { $lte: now }, // already started
          endDate: { $gt: now, $lte: threshold }, // ending in next X minutes
          isActive: true,
          status: {
            $in: ["registration_closed", "ongoing", "winner_to_announced"],
          },
        });

        marker.hackathonsToComplete = hackathonsToComplete.length;
        logger.info(
          `Found ${hackathonsToComplete.length} hackathons to complete`
        );

        for (const hackathon of hackathonsToComplete) {
          const hackathonMarker = {
            hackathonId: hackathon._id,
            title: hackathon.title,
            status: "processing",
            startedAt: new Date().toISOString(),
          };

          try {
            logger.info(`Completing hackathon: ${hackathon.title}`);
            await retryOperation(
              () => completeHackathon(hackathon, io),
              3,
              500
            );

            hackathonMarker.status = "completed";
            hackathonMarker.completedAt = new Date().toISOString();
            marker.hackathonsScheduled++;

            logger.info(`Successfully completed hackathon: ${hackathon.title}`);
          } catch (error) {
            hackathonMarker.status = "failed";
            hackathonMarker.error = {
              message: error.message,
              type: error.type,
              code: error.code,
            };
            hackathonMarker.completedAt = new Date().toISOString();
            marker.errors.push(hackathonMarker.error);
            logger.error(
              `Error completing hackathon ${hackathon.title}:`,
              error
            );
          }
        }

        marker.status = "completed";
        marker.completedAt = new Date().toISOString();

        logger.debug("Hackathon completion scheduler completed", {
          hackathonsScheduled: marker.hackathonsScheduled,
          totalErrors: marker.errors.length,
        });
      } catch (error) {
        marker.status = "failed";
        marker.error = classifyError(error);
        marker.completedAt = new Date().toISOString();
        logger.error("Hackathon completion scheduler fatal error:", error);
      }
    },
    {
      scheduled: true,
      timezone: "UTC",
    }
  );

  // Status update scheduler (runs every 5 minutes)
  cron.schedule(
    "*/5 * * * *",
    async () => {
      try {
        logger.info("Hackathon status update scheduler started");
        const now = new Date();

        // Update hackathons that should be in "ongoing" status
        const ongoingResult = await Hackathon.updateMany(
          {
            startDate: { $lte: now },
            endDate: { $gt: now },
            status: "registration_closed",
            isActive: true,
          },
          {
            $set: { status: "ongoing" },
          }
        );

        // Update hackathons that should be in "winner_to_announced" status
        const winnerResult = await Hackathon.updateMany(
          {
            endDate: { $lte: now },
            winnerAnnouncementDate: { $gt: now },
            status: "ongoing",
            isActive: true,
          },
          {
            $set: { status: "winner_to_announced" },
          }
        );

        logger.info("Hackathon status update scheduler completed", {
          ongoingUpdated: ongoingResult.modifiedCount,
          winnerUpdated: winnerResult.modifiedCount,
        });
      } catch (error) {
        logger.error("Hackathon status update scheduler error:", error);
      }
    },
    {
      scheduled: true,
      timezone: "UTC",
    }
  );

  logger.info("All hackathon schedulers started successfully");
};

// Export for testing
export {
  ErrorTypes,
  SchedulerError,
  classifyError,
  retryOperation,
  createTeamsForHackathon,
  completeHackathon,
  cancelHackathon,
};
