import mongoose from "mongoose";

const contentPostSchema = new mongoose.Schema(
  {
    collaboration: { type: mongoose.Schema.Types.ObjectId, ref: "Collaboration", required: true },
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    platform: String, // e.g. "Instagram", "YouTube"
    mediaUrl: { type: String, required: true },
    caption: String,
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("ContentPost", contentPostSchema);
