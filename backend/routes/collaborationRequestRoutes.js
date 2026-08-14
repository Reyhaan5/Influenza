import express from "express";
import {
  createRequest,
  getMyRequests,
  respondToRequest,
} from "../controllers/collaborationRequestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Both brands and influencers can create/read/respond — the controller
// figures out which side is doing what based on req.user.role.
router.post("/", protect, createRequest);
router.get("/", protect, getMyRequests);
router.put("/:id", protect, respondToRequest);

export default router;
