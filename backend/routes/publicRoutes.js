// backend/routes/publicRoutes.js
import express from "express";
import { lookupInstagramHandle, proxyInstagramImage } from "../controllers/instagramController.js";
import {
  getCreatorsByCategory,
  getCreatorDiscovery,
  getPublicCreatorProfile,
} from "../controllers/publicCreatorsController.js";
import { getPublicGallery } from "../controllers/galleryController.js";
import { calculateInfluRateHandler, getCreatorInfluRateHandler } from "../controllers/influRateController.js";

const router = express.Router();

// No auth — these are intentionally usable without login.
router.get("/instagram-lookup", lookupInstagramHandle);
router.get("/proxy-image", proxyInstagramImage);
router.get("/creators-by-category", getCreatorsByCategory);
router.get("/creator-discovery", getCreatorDiscovery);
router.get("/creators/:id", getPublicCreatorProfile);
router.get("/gallery", getPublicGallery);

// InfluRate Calculator API
router.post("/influrate/calculate", calculateInfluRateHandler);
router.get("/influrate/creator/:id", getCreatorInfluRateHandler);

export default router;


