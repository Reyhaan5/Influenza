// backend/routes/publicRoutes.js
import express from "express";
import { lookupInstagramHandle } from "../controllers/instagramController.js";
import { getCreatorsByCategory } from "../controllers/publicCreatorsController.js";
import { getPublicGallery } from "../controllers/galleryController.js";

const router = express.Router();

// No auth — these are intentionally usable without login.
router.get("/instagram-lookup", lookupInstagramHandle);
router.get("/creators-by-category", getCreatorsByCategory);
router.get("/gallery", getPublicGallery);

export default router;
