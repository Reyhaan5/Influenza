import express from "express";
import {
  getBrandProfile,
  saveCompanyInfo,
  getBrandDashboardStats,
  getMyBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getTeamMembers,
  inviteTeamMember,
  deleteTeamMember,
  getSavedCreators,
  toggleSaveCreator,
  getSavedCreatorIds,
  getCreativeLibrary,
  uploadFile,
} from "../controllers/brandController.js";
import {
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  getMyCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaignController.js";
import { searchCreators } from "../controllers/searchController.js";
import {
  getMyCollaborations,
  updateCollaboration,
} from "../controllers/collaborationController.js";
import {
  createReview,
  getReviewByCollab,
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/*
GET PROFILE & STATS
*/
router.get("/profile", protect, getBrandProfile);
router.get("/dashboard", protect, getBrandDashboardStats);
router.put("/profile/company", protect, saveCompanyInfo);

/*
FILE UPLOADS
*/
router.post("/upload", protect, upload.single("file"), uploadFile);
router.post("/upload-multiple", protect, upload.array("files", 6), uploadFile);

/*
BRANDS — a user can manage multiple brands / sub-brands
*/
router.get("/brands", protect, getMyBrands);
router.post("/brands", protect, upload.single("logo"), createBrand);
router.put("/brands/:id", protect, upload.single("logo"), updateBrand);
router.delete("/brands/:id", protect, deleteBrand);

/*
ORGANIZATION / TEAM MEMBERS
*/
router.get("/team", protect, getTeamMembers);
router.post("/team/invite", protect, inviteTeamMember);
router.delete("/team/:id", protect, deleteTeamMember);

/*
SAVED CREATORS / FAVORITES
*/
router.get("/saved-creators", protect, getSavedCreators);
router.get("/saved-creators/ids", protect, getSavedCreatorIds);
router.post("/saved-creators/:creatorId", protect, toggleSaveCreator);
router.delete("/saved-creators/:creatorId", protect, toggleSaveCreator);

/*
CREATIVE LIBRARY
*/
router.get("/creatives", protect, getCreativeLibrary);

/*
PRODUCTS — associated with brands
*/
router.get("/products", protect, getMyProducts);
router.post("/products", protect, upload.array("productImages", 6), createProduct);
router.put("/products/:id", protect, upload.array("productImages", 6), updateProduct);
router.delete("/products/:id", protect, deleteProduct);

/*
CAMPAIGNS
*/
router.get("/campaigns", protect, getMyCampaigns);
router.post("/campaigns", protect, createCampaign);
router.put("/campaigns/:id", protect, updateCampaign);
router.delete("/campaigns/:id", protect, deleteCampaign);

/*
SEARCH CREATORS
*/
router.get("/search-creators", protect, searchCreators);

/*
COLLABORATIONS
*/
router.get("/collaborations", protect, getMyCollaborations);
router.put("/collaborations/:id", protect, updateCollaboration);

/*
REVIEWS
*/
router.post("/reviews", protect, createReview);
router.get("/reviews/:collabId", protect, getReviewByCollab);

export default router;