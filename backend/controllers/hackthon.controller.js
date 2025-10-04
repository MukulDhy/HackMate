import mongoose from "mongoose";
import Hackathon from "../models/hackthon.model.js";
import User from "../models/user.model.js";

// @desc    Get all hackathons
// @route   GET /api/hackathons
// @access  Public

// 🔹 Helper function to determine status
const determineHackathonStatus = (hackathon) => {
  const now = new Date();

  if (now < hackathon.registrationDeadline) {
    return "registration_open";
  } else if (
    now >= hackathon.registrationDeadline &&
    now < hackathon.startDate
  ) {
    return "registration_closed";
  } else if (now >= hackathon.startDate && now <= hackathon.endDate) {
    return "ongoing";
  } else if (
    hackathon.winnerAnnouncementDate &&
    now > hackathon.endDate &&
    now < hackathon.winnerAnnouncementDate
  ) {
    return "winner_to_announced";
  } else if (
    (hackathon.winnerAnnouncementDate &&
      now >= hackathon.winnerAnnouncementDate) ||
    (!hackathon.winnerAnnouncementDate && now > hackathon.endDate)
  ) {
    return "completed";
  } else {
    return hackathon.status; // fallback (maybe "cancelled" etc.)
  }
};

// @desc    Get all hackathons
// @route   GET /api/hackathons
// @access  Public
export const getHackathons = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 4,
      status,
      mode,
      tags,
      search,
      sortBy = "startDate",
      sortOrder = "desc",
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (mode) filter.mode = mode;
    if (tags)
      filter.tags = { $in: Array.isArray(tags) ? tags : tags.split(",") };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    let hackathons = await Hackathon.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // 🔹 Check & update status for each hackathon
    const updates = hackathons.map(async (hackathon) => {
      const newStatus = determineHackathonStatus(hackathon);
      if (hackathon.status !== newStatus) {
        hackathon.status = newStatus;
        await hackathon.save();
      }
      return hackathon;
    });

    hackathons = await Promise.all(updates);

    const total = await Hackathon.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: hackathons.length,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: hackathons,
    });
  } catch (error) {
    console.error("Get hackathons error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hackathons",
      error: error.message,
    });
  }
};

// @desc    Get single hackathon
// @route   GET /api/hackathons/:id
// @access  Public
export const getHackathon = async (req, res) => {
  try {
    let hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res
        .status(404)
        .json({ success: false, message: "Hackathon not found" });
    }

    // 🔹 Update status if outdated
    const newStatus = determineHackathonStatus(hackathon);
    if (hackathon.status !== newStatus) {
      hackathon.status = newStatus;
      await hackathon.save();
    }

    res.status(200).json({ success: true, data: hackathon });
  } catch (error) {
    console.error("Get hackathon error:", error);

    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ success: false, message: "Hackathon not found" });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching hackathon",
      error: error.message,
    });
  }
};

export const getHackathonByHackathonId = async (req, res) => {
  try {
    const hackathon = await Hackathon.findOne({ hackName: req.params.id });

    if (!hackathon) {
      return res
        .status(404)
        .json({ success: false, message: "Hackathon not found" });
    }

    res.status(200).json({ success: true, data: hackathon });
  } catch (error) {
    logger.info("Get hackathon error:", error);

    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ success: false, message: "Hackathon not found" });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching hackathon",
      error: error.message,
    });
  }
};
// @desc    Create hackathon
// @route   POST /api/hackathons
// @access  Admin only
export const createHackathon = async (req, res) => {
  try {
    const {
      hackName,
      extraDetail,
      title,
      description,
      registrationDeadline,
      startDate,
      endDate,
      winnerAnnouncementDate,
      problemStatements,
      maxTeamSize,
      venue,
      mode,
      registrationFee,
      prizes,
      tags,
      maxRegistrations,
      requirements,
      rules,
      bannerImage,
      evaluationCriteria,
      submissionDeadline,
      submissionFormat,
      organizer,
      faqs,
      socialLinks,
      minParticipantsToFormTeam,
    } = req.body;

    // ✅ Validate required fields
    if (
      !hackName ||
      !title ||
      !description ||
      !registrationDeadline ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide hackName, title, description, registrationDeadline, startDate, and endDate",
      });
    }

    // ✅ Validate problem statements
    if (!problemStatements || problemStatements.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one problem statement is required",
      });
    }

    // ✅ Validate dates
    const regDeadline = new Date(registrationDeadline);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (regDeadline <= now) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Registration deadline must be in the future",
        });
    }

    if (start <= regDeadline) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Start date must be after registration deadline",
        });
    }

    if (end <= start) {
      return res
        .status(400)
        .json({ success: false, message: "End date must be after start date" });
    }

    if (winnerAnnouncementDate && new Date(winnerAnnouncementDate) <= end) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Winner announcement date must be after end date",
        });
    }

    // ✅ Determine status automatically
    let status = "registration_open";
    if (now > regDeadline && now < start) status = "registration_closed";
    if (now >= start && now <= end) status = "ongoing";
    if (now > end && !winnerAnnouncementDate) status = "winner_to_announced";
    if (winnerAnnouncementDate && now > new Date(winnerAnnouncementDate))
      status = "completed";

    // ✅ Create Hackathon
    const hackathon = await Hackathon.create({
      hackName,
      extraDetail,
      title,
      description,
      registrationDeadline,
      startDate,
      endDate,
      winnerAnnouncementDate,
      problemStatements,
      maxTeamSize,
      venue,
      mode,
      registrationFee,
      prizes,
      tags,
      maxRegistrations,
      requirements,
      rules,
      bannerImage,
      evaluationCriteria,
      submissionDeadline,
      submissionFormat,
      organizer,
      faqs,
      socialLinks,
      minParticipantsToFormTeam,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Hackathon created successfully",
      data: hackathon,
    });
  } catch (error) {
    console.error("Create hackathon error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating hackathon",
      error: error.message,
    });
  }
};

// @desc    join hackathon
// @route   POST /api
// @access  authorization user only

export const joinHackathon = async (req, res) => {
  try {
    const hackathonId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔹 Check if user is already in THIS hackathon
    if (String(user.currentHackathonId) === String(hackathonId)) {
      return res.status(400).json({
        success: false,
        message: "You have already joined this hackathon",
      });
    }

    // 🔹 Check if user is in another active hackathon
    if (user.currentHackathonId !== null) {
      const currentHackathon = await Hackathon.findById(
        user.currentHackathonId
      );

      if (currentHackathon) {
        const currentStatus = determineHackathonStatus(currentHackathon);
        if (currentHackathon.status !== currentStatus) {
          currentHackathon.status = currentStatus;
          await currentHackathon.save();
        }

        // If current hackathon is still active, block joining new one
        if (
          currentHackathon.status === "registration_open" ||
          currentHackathon.status === "ongoing"
        ) {
          return res.status(400).json({
            success: false,
            message: `You are already in an active hackathon: ${currentHackathon.name}. Leave it before joining a new one.`,
          });
        } else if (
          currentHackathon.status === "completed" ||
          currentHackathon.status === "cancelled"
        ) {
          // Clean up completed/cancelled hackathon
          user.currentHackathonId = null;
          await user.save();
        }
      } else {
        // Cleanup orphaned currentHackathonId
        user.currentHackathonId = null;
        await user.save();
      }
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    // 🔹 Check if user is already in participants list (additional safety check)
    if (hackathon.participants.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "You have already joined this hackathon",
      });
    }

    // 🔹 Update status if outdated
    const newStatus = determineHackathonStatus(hackathon);
    if (hackathon.status !== newStatus) {
      hackathon.status = newStatus;
      await hackathon.save();
    }

    // 🔹 Check if hackathon is joinable
    if (hackathon.status !== "registration_open") {
      return res.status(400).json({
        success: false,
        message: `Hackathon cannot be joined now. Current status: ${hackathon.status}`,
      });
    }

    // 🔹 Check max registrations
    if (
      hackathon.maxRegistrations &&
      hackathon.totalMembersJoined >= hackathon.maxRegistrations
    ) {
      return res.status(400).json({
        success: false,
        message: "Hackathon has reached maximum registrations",
      });
    }

    // 🔹 Add user to hackathon
    user.currentHackathonId = hackathon._id;
    await user.save();

    // Add user to participants if not already there
    if (!hackathon.participants.includes(user._id)) {
      hackathon.participants.push(user._id);
      hackathon.totalMembersJoined = hackathon.participants.length;
      await hackathon.save();
    }

    return res.status(200).json({
      success: true,
      message: "Successfully joined hackathon",
      data: hackathon,
    });
  } catch (error) {
    console.error("Join hackathon error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid hackathon ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error joining hackathon",
      error: error.message,
    });
  }
};

export const leaveHackathon = async (req, res) => {
  try {
    const hackathonId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.currentHackathonId) {
      return res.status(400).json({
        success: false,
        message: "You are not part of any hackathon",
      });
    }

    // Make sure the user is leaving the hackathon they are in
    if (user.currentHackathonId.toString() !== hackathonId) {
      return res.status(400).json({
        success: false,
        message: "You are not part of this hackathon",
      });
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      // Clean up the user's currentHackathonId since the hackathon doesn't exist
      user.currentHackathonId = null;
      await user.save();

      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    // Check if hackathon allows leaving (optional - based on your business logic)
    const hackathonStatus = determineHackathonStatus(hackathon);
    if (hackathonStatus === "ongoing" || hackathonStatus === "completed") {
      return res.status(400).json({
        success: false,
        message: `Cannot leave hackathon while it is ${hackathonStatus}`,
      });
    }

    // Remove user from participants if they exist in the list
    const wasParticipant = hackathon.participants.some(
      (participantId) => participantId.toString() === user._id.toString()
    );

    if (wasParticipant) {
      hackathon.participants = hackathon.participants.filter(
        (participantId) => participantId.toString() !== user._id.toString()
      );
      hackathon.totalMembersJoined = hackathon.participants.length;
      await hackathon.save();
    }

    // Clear user's current hackathon
    user.currentHackathonId = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Successfully left hackathon",
      data: {
        hackathonId: hackathon._id,
        hackathonName: hackathon.name,
        totalMembersJoined: hackathon.totalMembersJoined,
      },
    });
  } catch (error) {
    console.error("Leave hackathon error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid hackathon ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error leaving hackathon",
      error: error.message,
    });
  }
};

// @desc    Update hackathon
// @route   PUT /api/hackathons/:id
// @access  Admin only
export const updateHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    // Validate dates if they are being updated
    const updateData = req.body;

    if (
      updateData.registrationDeadline ||
      updateData.startDate ||
      updateData.endDate
    ) {
      const regDeadline = new Date(
        updateData.registrationDeadline || hackathon.registrationDeadline
      );
      const start = new Date(updateData.startDate || hackathon.startDate);
      const end = new Date(updateData.endDate || hackathon.endDate);

      if (start <= regDeadline) {
        return res.status(400).json({
          success: false,
          message: "Start date must be after registration deadline",
        });
      }

      if (end <= start) {
        return res.status(400).json({
          success: false,
          message: "End date must be after start date",
        });
      }

      if (
        updateData.winnerAnnouncementDate &&
        new Date(updateData.winnerAnnouncementDate) <= end
      ) {
        return res.status(400).json({
          success: false,
          message: "Winner announcement date must be after end date",
        });
      }
    }

    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Hackathon updated successfully",
      data: updatedHackathon,
    });
  } catch (error) {
    console.error("Update hackathon error:", error);

    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating hackathon",
      error: error.message,
    });
  }
};

// @desc    Delete hackathon (soft delete by setting isActive to false)
// @route   DELETE /api/hackathons/:id
// @access  Admin only
export const deleteHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    // Soft delete by setting isActive to false
    hackathon.isActive = false;
    hackathon.status = "cancelled";
    hackathon.reason = req.body.reason || "Deleted by admin";

    await hackathon.save();

    res.status(200).json({
      success: true,
      message: "Hackathon deleted successfully",
    });
  } catch (error) {
    console.error("Delete hackathon error:", error);

    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting hackathon",
      error: error.message,
    });
  }
};

// @desc    Get hackathons for admin (includes inactive)
// @route   GET /api/hackathons/admin
// @access  Admin only
export const getHackathonsForAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      mode,
      isActive,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (mode) {
      filter.mode = mode;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const hackathons = await Hackathon.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Hackathon.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: hackathons.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: hackathons,
    });
  } catch (error) {
    console.error("Get hackathons for admin error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hackathons",
      error: error.message,
    });
  }
};

// @desc    Update hackathon status
// @route   PATCH /api/hackathons/:id/status
// @access  Admin only
export const updateHackathonStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = [
      "upcoming",
      "registration_open",
      "registration_closed",
      "ongoing",
      "winner_to_announced",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    hackathon.status = status;
    if (reason) {
      hackathon.reason = reason;
    }

    // If status is cancelled, set isActive to false
    if (status === "cancelled") {
      hackathon.isActive = false;
    }

    await hackathon.save();

    res.status(200).json({
      success: true,
      message: "Hackathon status updated successfully",
      data: hackathon,
    });
  } catch (error) {
    console.error("Update hackathon status error:", error);

    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating hackathon status",
      error: error.message,
    });
  }
};

// @desc    Get hackathon statistics
// @route   GET /api/hackathons/stats
// @access  Admin only
export const getHackathonStats = async (req, res) => {
  try {
    const totalHackathons = await Hackathon.countDocuments();
    const activeHackathons = await Hackathon.countDocuments({ isActive: true });

    const statusStats = await Hackathon.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const modeStats = await Hackathon.aggregate([
      {
        $group: {
          _id: "$mode",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalParticipants = await Hackathon.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalMembersJoined" },
        },
      },
    ]);

    const upcomingHackathons = await Hackathon.countDocuments({
      status: { $in: ["upcoming", "registration_open"] },
      isActive: true,
    });

    const ongoingHackathons = await Hackathon.countDocuments({
      status: "ongoing",
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: {
        totalHackathons,
        activeHackathons,
        upcomingHackathons,
        ongoingHackathons,
        totalParticipants: totalParticipants[0]?.total || 0,
        statusBreakdown: statusStats,
        modeBreakdown: modeStats,
      },
    });
  } catch (error) {
    console.error("Get hackathon stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hackathon statistics",
      error: error.message,
    });
  }
};

// @desc    Get featured hackathons
// @route   GET /api/hackathons/featured
// @access  Public
export const getFeaturedHackathons = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const featuredHackathons = await Hackathon.find({
      isActive: true,
      status: { $in: ["upcoming", "registration_open", "ongoing"] },
    })
      .sort({ totalMembersJoined: -1, startDate: 1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: featuredHackathons.length,
      data: featuredHackathons,
    });
  } catch (error) {
    console.error("Get featured hackathons error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured hackathons",
      error: error.message,
    });
  }
};

// @desc    Search hackathons by tags
// @route   GET /api/hackathons/tags/:tag
// @access  Public
export const getHackathonsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const hackathons = await Hackathon.find({
      tags: { $in: [tag] },
      isActive: true,
    })
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Hackathon.countDocuments({
      tags: { $in: [tag] },
      isActive: true,
    });

    res.status(200).json({
      success: true,
      count: hackathons.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: hackathons,
    });
  } catch (error) {
    console.error("Get hackathons by tag error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hackathons by tag",
      error: error.message,
    });
  }
};
