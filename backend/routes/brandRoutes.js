import express from "express";
import {
  getBrandProfile,
  saveCompanyInfo,
  getBrandDashboardStats,
} from "../controllers/BrandController.js";
import {
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

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

export default router;