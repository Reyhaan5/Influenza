import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

let io;

// Lets REST controllers (e.g. deleteConversation) push realtime events
// without needing their own socket connection.
export function getIO() {
  return io;
}

  // ...rest unchanged

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  // Auth: every socket connection must present the same JWT used for REST calls
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token provided"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Not authorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = String(socket.user._id);
    socket.join(`user:${userId}`); // personal room, for notifications on any screen

    socket.on("joinConversation", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("leaveConversation", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("typing", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("typing", { userId });
    });

    socket.on("stopTyping", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("stopTyping", { userId });
    });

    socket.on("sendMessage", async ({ conversationId, text }, callback) => {
      try {
        if (!text?.trim()) return;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;
        if (!conversation.participants.some((p) => String(p) === userId)) return;

        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          text: text.trim(),
          readBy: [userId],
        });

        conversation.lastMessage = text.trim();
        conversation.lastMessageAt = new Date();
        await conversation.save();

        const populated = await message.populate("sender", "name email role");

        io.to(`conversation:${conversationId}`).emit("newMessage", populated);

        conversation.participants.forEach((p) => {
          io.to(`user:${p}`).emit("conversationUpdated", {
            conversationId,
            lastMessage: conversation.lastMessage,
            lastMessageAt: conversation.lastMessageAt,
          });
        });

        if (callback) callback({ status: "ok", message: populated });
      } catch (err) {
        console.error("sendMessage error:", err);
        if (callback) callback({ status: "error", error: err.message });
      }
    });

    socket.on("markRead", async ({ conversationId }) => {
      await Message.updateMany(
        { conversation: conversationId, readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } }
      );
      socket.to(`conversation:${conversationId}`).emit("messagesRead", { userId, conversationId });
    });
  });

  return io;
}