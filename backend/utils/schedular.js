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
  TRANSIENT: "TRANSIENT", // Retryable errors
  VALIDATION: "VALIDATION", // Schema validation errors
  BUSINESS: "BUSINESS", // Business logic errors
  FATAL: "FATAL", // Non-retryable system errors
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
  // MongoDB Transient errors
  if (error.code === 112 || error.codeName === "WriteConflict") {
    return new SchedulerError(
      error.message,
      ErrorTypes.TRANSIENT,
      error.code,
      true
    );
  }

  // MongoDB duplicate key errors
  if (error.code === 11000) {
    return new SchedulerError(
      "Duplicate key error",
      ErrorTypes.VALIDATION,
      error.code,
      false
    );
  }

  // MongoDB validation errors
  if (error.name === "ValidationError") {
    return new SchedulerError(
      `Validation error: ${error.message}`,
      ErrorTypes.VALIDATION,
      "VALIDATION_ERROR",
      false
    );
  }

  // Mongoose Cast errors (invalid ObjectId, etc.)
  if (error.name === "CastError") {
    return new SchedulerError(
      `Invalid data format: ${error.message}`,
      ErrorTypes.VALIDATION,
      "CAST_ERROR",
      false
    );
  }

  // Business logic errors (no participants, etc.)
  if (
    error.message.includes("No participants") ||
    error.message.includes("No problem statements")
  ) {
    return new SchedulerError(
      error.message,
      ErrorTypes.BUSINESS,
      "BUSINESS_RULE",
      false
    );
  }

  // Default to fatal error
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

      // Only retry transient errors
      if (!lastError.retryable || attempt === maxRetries) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`, {
        error: lastError.message,
        type: lastError.type,
        code: lastError.code,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

// Team creation logic with proper transaction handling
const createTeamsForHackathon = async (hackathon, io) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const {
      participants,
      maxTeamSize,
      problemStatements,
      minParticipantsToFormTeam,
      title,
      _id,
    } = hackathon;

    // Validation checks
    if (!participants || participants.length === 0) {
      logger.info(`No participants for hackathon: ${title}`);
      return false;
    }

    if (!problemStatements || problemStatements.length === 0) {
      logger.info(`No problem statements for hackathon: ${title}`);
      return false;
    }

    if (participants.length < minParticipantsToFormTeam) {
      logger.info(
        `Not enough participants to form teams. Need at least ${minParticipantsToFormTeam}, have ${participants.length}`
      );
      return false;
    }

    // Calculate optimal team distribution
    const totalParticipants = participants.length;
    const optimalTeamCount = Math.ceil(totalParticipants / maxTeamSize);
    const baseTeamSize = Math.floor(totalParticipants / optimalTeamCount);
    const remainder = totalParticipants % optimalTeamCount;

    console.log(`Creating teams for hackathon: ${title}`, {
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

      // Validate team size meets requirements
      if (currentTeamSize < minParticipantsToFormTeam) {
        console.info(
          `Skipping team: size ${currentTeamSize} is below minimum ${minParticipantsToFormTeam}`
        );
        continue;
      }

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
      const teamMemberIds = teamMembers.map((member) => member._id);

      // Create team document
      const team = await Team.create(
        [
          {
            hackathonId: _id,
            name: teamName,
            problemStatement: randomProblem,
            submissionStatus: "not_submitted",
            teamSize: currentTeamSize,
            teamMember: teamMemberIds,
          },
        ],
        { session }
      );

      // Create team members and update users
      const teamMemberPromises = teamMembers.map((member, index) => {
        const role = index === 0 ? "leader" : "developer";

        return TeamMember.create(
          [
            {
              teamId: team[0]._id,
              userId: member._id,
              role: role,
              status: "active",
            },
          ],
          { session }
        );
      });

      // Update users' current hackathon
      const userUpdatePromises = teamMembers.map((member) =>
        User.findByIdAndUpdate(
          member._id,
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
      for (const member of teamMembers) {
        const teammates = teamMembers
          .filter((m) => m._id.toString() !== member._id.toString())
          .map((m) => m.name);

        emailPromises.push(
          sendTeamNotification({
            email: member.email,
            name: member.name,
            hackathonTitle: title,
            teammates,
            problemStatement: randomProblem,
            teamName: teamName,
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
          teamsFormed: true,
        },
      },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();

    console.log(`Transaction committed successfully for hackathon: ${title}`);

    // Send emails outside transaction
    if (emailPromises.length > 0) {
      const emailResults = await Promise.allSettled(emailPromises);
      const successfulEmails = emailResults.filter(
        (r) => r.status === "fulfilled"
      ).length;
      const failedEmails = emailResults.filter(
        (r) => r.status === "rejected"
      ).length;

      console.log(
        `Emails sent: ${successfulEmails} successful, ${failedEmails} failed`
      );

      // Log failed emails
      emailResults.forEach((result, index) => {
        if (result.status === "rejected") {
          logger.error(
            `Failed to send email to participant at index ${index}: ${result.reason}`
          );
        }
      });
    }

    // Notify clients
    // if (io && createdTeams.length > 0) {
    //   io.to(_id.toString()).emit("teams-formed", {
    //     hackathonId: _id,
    //     teams: createdTeams,
    //     timestamp: new Date().toISOString(),
    //   });
    // }

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
    // Abort transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Main scheduler function with comprehensive error handling
export const startScheduler = (io) => {
  cron.schedule(
    "* * * * *",
    async () => {
      const marker = {
        status: "started",
        timestamp: new Date().toISOString(),
        hackathonsProcessed: 0,
        errors: [],
      };

      try {
        // console.log("Scheduler started at:", marker.timestamp);
        const now = new Date();
        const twoMinutesAgo = new Date(now.getTime() - 2 * 60000);
        const hackathonsToProcess = await Hackathon.find({
          registrationDeadline: {
            $lte: now,
            $gte: twoMinutesAgo,
          },
          isActive: true,
          status: "registration_open",
          "participants.0": { $exists: true }, // has participants
        }).populate({
          path: "participants",
          select: "name email skills",
        });

        marker.hackathonsToProcess = hackathonsToProcess.length;
        logger.info(
          `Found ${hackathonsToProcess.length} hackathons to process`
        );

        for (const hackathon of hackathonsToProcess) {
          const hackathonMarker = {
            hackathonId: hackathon._id,
            title: hackathon.title,
            status: "processing",
            startedAt: new Date().toISOString(),
          };

          try {
            console.log(`Processing hackathon: ${hackathon.title}`);

            const result = await retryOperation(
              () => createTeamsForHackathon(hackathon, io),
              3, // max retries
              500 // base delay
            );

            hackathonMarker.status = "completed";
            hackathonMarker.completedAt = new Date().toISOString();
            hackathonMarker.result = result;
            marker.hackathonsProcessed++;

            console.log(`Successfully processed hackathon: ${hackathon.title}`);
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

            // Log error based on type
            if (error.type === ErrorTypes.TRANSIENT) {
              logger.warn(
                `Transient error processing hackathon ${hackathon.title}:`,
                error
              );
            } else if (error.type === ErrorTypes.BUSINESS) {
              logger.info(
                `Business rule violation for hackathon ${hackathon.title}:`,
                error.message
              );
            } else {
              logger.error(
                `Error processing hackathon ${hackathon.title}:`,
                error
              );
            }

            console.error(
              `Failed to process hackathon ${hackathon.title}:`,
              error.message
            );
          }
        }

        marker.status = "completed";
        marker.completedAt = new Date().toISOString();

        // Final status report
        // console.log("Scheduler completed", {
        //   hackathonsProcessed: marker.hackathonsProcessed,
        //   totalErrors: marker.errors.length,
        //   duration: new Date(marker.completedAt) - new Date(marker.timestamp),
        // });

        // logger.info("Scheduler completed", {
        //   hackathonsProcessed: marker.hackathonsProcessed,
        //   errors: marker.errors.length,
        //   duration: new Date(marker.completedAt) - new Date(marker.timestamp),
        // });
      } catch (error) {
        marker.status = "failed";
        marker.error = classifyError(error);
        marker.completedAt = new Date().toISOString();

        logger.error("Scheduler fatal error:", error);
        console.error("Scheduler fatal error:", error);

        // Emit error event if IO is available
        // if (io) {
        //   io.emit("scheduler-error", {
        //     error: marker.error.message,
        //     type: marker.error.type,
        //     timestamp: marker.timestamp,
        //   });
        // }
      }
    },
    {
      scheduled: true,
      timezone: "UTC",
    }
  );

  console.log("Hackathon team formation scheduler started");
  logger.info("Hackathon team formation scheduler started");
};

// Export error types and classes for testing
export { ErrorTypes, SchedulerError, classifyError, retryOperation };
