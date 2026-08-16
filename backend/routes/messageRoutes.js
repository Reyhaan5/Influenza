import express from "express";
import {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
  deleteConversation,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/conversations", protect, getOrCreateConversation);
router.get("/conversations", protect, getMyConversations);
router.get("/conversations/:id/messages", protect, getMessages);
router.delete("/conversations/:id", protect, deleteConversation);

export default router;