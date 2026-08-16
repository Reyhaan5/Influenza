import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import influencerRoutes from "./routes/influencerRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import collaborationRequestRoutes from "./routes/collaborationRequestRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { initSocket } from "./socket/index.js";

// Registering every model here ensures Mongoose knows about them before
// any .populate() call tries to reference them — even ones without full
// controllers/routes built yet.
import "./models/User.js";
import "./models/InfluencerProfile.js";
import "./models/Opportunity.js";
import "./models/CollaborationRequest.js";
import "./models/Collaboration.js";
import "./models/ContentPost.js";
import "./models/Review.js";
import "./models/Product.js";
import "./models/Conversation.js";
import "./models/Message.js";
import "./models/GalleryContent.js";

dotenv.config(); // loads variables from .env into process.env
connectDB(); // connect to MongoDB Atlas (see config/db.js)

const app = express();

// Lets your React app (running on localhost:5173) call this server
// (running on localhost:5000) without the browser blocking it.
app.use(cors());

// Lets Express understand JSON bodies sent from axios/fetch,
// e.g. req.body.email in your controllers.
app.use(express.json());

// Serves uploaded product images statically, e.g.
// http://localhost:5000/uploads/<filename>
app.use("/uploads", express.static("uploads"));

// Every URL starting with /api/auth goes to authRoutes.js
app.use("/api/auth", authRoutes);
// Every URL starting with /api/influencer goes to influencerRoutes.js
app.use("/api/influencer", influencerRoutes);
app.use("/api/public", publicRoutes);
// Every URL starting with /api/brand goes to brandRoutes.js
app.use("/api/brand", brandRoutes);
// Every URL starting with /api/collaboration-requests goes to collaborationRequestRoutes.js
app.use("/api/collaboration-requests", collaborationRequestRoutes);
// Every URL starting with /api/messages goes to messageRoutes.js
app.use("/api/messages", messageRoutes);

// Simple health check — visit http://localhost:5000/ to confirm it's running
app.get("/", (req, res) => {
  res.send("Influenza API is running.");
});

// Wrap Express in a raw HTTP server so Socket.IO can attach to the same port
const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
