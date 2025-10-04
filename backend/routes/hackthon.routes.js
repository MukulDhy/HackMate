import express from "express";
import {
  getHackathons,
  getHackathon,
  createHackathon,
  updateHackathon,
  deleteHackathon,
  getHackathonsForAdmin,
  updateHackathonStatus,
  getHackathonStats,
  getFeaturedHackathons,
  getHackathonsByTag,
  joinHackathon,
  leaveHackathon,
  getHackathonByHackathonId,
} from "../controllers/hackthon.controller.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/", getHackathons);
router.get("/featured", getFeaturedHackathons);
router.get("/tags/:tag", getHackathonsByTag);
router.get("/:id", getHackathon);
router.get("/name/:id", getHackathonByHackathonId);

// Admin only routes
// router.use(protect); // Apply authentication to all routes below
// router.use(authorize("admin")); // Apply admin authorization to all routes below

router.post("/create", createHackathon);
router.get("/admin/all", getHackathonsForAdmin);
router.get("/admin/stats", getHackathonStats);
router.put("/:id", updateHackathon);
router.patch("/:id/status", updateHackathonStatus);
router.delete("/:id", deleteHackathon);

router.use(protect);

router.post("/:id/join", joinHackathon);
router.post("/:id/leave", leaveHackathon);

export default router;
