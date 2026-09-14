import express from "express";
import {
  getDeliverables,
  submitDeliverable,
  reviewDeliverable,
} from "../controllers/deliverableController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", protect, getDeliverables);
router.post("/", protect, submitDeliverable);
router.patch("/:deliverableId/review", protect, reviewDeliverable);

export default router;