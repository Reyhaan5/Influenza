import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  updateMatchProfile,
  addSocialAccount,
  removeSocialAccount,
  getOpenOpportunities,
} from "../controllers/influencerController.js";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { saveRateCard, getMyRateCards } from "../controllers/rateCardController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { getInsiderRate } from "../controllers/insiderRateController.js";
import {
  uploadGalleryItem,
  getMyGalleryItems,
  toggleHighlight,
  deleteGalleryItem,
} from "../controllers/galleryController.js";
import { getMyReviews } from "../controllers/reviewController.js";
import upload from "../middleware/upload.js";


const router = express.Router();

router.get("/profile", protect, requireRole("influencer"), getMyProfile);
router.put("/profile", protect, requireRole("influencer"), updateMyProfile);
router.put("/match-profile", protect, requireRole("influencer"), updateMatchProfile);
router.get("/dashboard", protect, requireRole("influencer"), getDashboardStats);

router.post("/social-accounts", protect, requireRole("influencer"), addSocialAccount);
router.delete("/social-accounts/:platform", protect, requireRole("influencer"), removeSocialAccount);

router.post("/rate-cards", protect, requireRole("influencer"), saveRateCard);
router.get("/rate-cards", protect, requireRole("influencer"), getMyRateCards);

router.get("/insider-rate", protect, requireRole("influencer"), getInsiderRate);

router.get("/opportunities", protect, requireRole("influencer"), getOpenOpportunities);

router.get("/reviews", protect, requireRole("influencer"), getMyReviews);

/*
CONTENT GALLERY — showcase uploads that power the public Content Gallery page
*/
router.post("/gallery", protect, requireRole("influencer"), upload.single("media"), uploadGalleryItem);
router.get("/gallery", protect, requireRole("influencer"), getMyGalleryItems);
router.patch("/gallery/:id/highlight", protect, requireRole("influencer"), toggleHighlight);
router.delete("/gallery/:id", protect, requireRole("influencer"), deleteGalleryItem);

export default router;