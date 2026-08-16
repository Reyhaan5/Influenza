import mongoose from "mongoose";

// Showcase content an influencer adds directly (independent of a specific
// brand collaboration). This is what powers the public, no-login Content
// Gallery alongside completed-collaboration ContentPost docs.
const galleryContentSchema = new mongoose.Schema(
  {
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], default: "image" },
    caption: { type: String, default: "", trim: true },
    platform: { type: String, default: "", trim: true }, // "Instagram", "YouTube", etc.
  },
  { timestamps: true }
);

export default mongoose.model("GalleryContent", galleryContentSchema);
