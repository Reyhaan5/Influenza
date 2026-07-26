import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  addSocialAccount,
  removeSocialAccount,
} from "../controllers/influencerController.js";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, requireRole("influencer"), getMyProfile);
router.put("/profile", protect, requireRole("influencer"), updateMyProfile);
router.get("/dashboard", protect, requireRole("influencer"), getDashboardStats);

router.post("/social-accounts", protect, requireRole("influencer"), addSocialAccount);
router.delete("/social-accounts/:platform", protect, requireRole("influencer"), removeSocialAccount);

export default router;