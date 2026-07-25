import express from "express";
import { getMyProfile, updateMyProfile } from "../controllers/influencerController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Every route here requires: (1) a valid login token, (2) role === "influencer"
router.get("/profile", protect, requireRole("influencer"), getMyProfile);
router.put("/profile", protect, requireRole("influencer"), updateMyProfile);

export default router;
