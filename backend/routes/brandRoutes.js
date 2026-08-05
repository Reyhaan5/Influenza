import express from "express";
import {
  getBrandProfile,
  saveCompanyInfo,
  getBrandDashboardStats,
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

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/*
GET PROFILE
*/
router.get("/profile", protect, getBrandProfile);

/*
DASHBOARD STATS (active campaigns, collaborations — real counts)
*/
router.get("/dashboard", protect, getBrandDashboardStats);

/*
SAVE COMPANY INFO ONLY
*/
router.put("/profile/company", protect, saveCompanyInfo);

/*
PRODUCTS — a brand can add multiple
*/
router.post("/products", protect, upload.single("productImage"), createProduct);
router.get("/products", protect, getMyProducts);
router.put("/products/:id", protect, upload.single("productImage"), updateProduct);
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

export default router;