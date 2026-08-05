// backend/routes/publicRoutes.js
import express from "express";
import { lookupInstagramHandle } from "../controllers/instagramController.js";

const router = express.Router();

// No auth — this page is intentionally usable without login.
router.get("/instagram-lookup", lookupInstagramHandle);

export default router;