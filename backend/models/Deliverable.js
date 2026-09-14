import mongoose from "mongoose";

const deliverableSchema = new mongoose.Schema(
  {
    collaboration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collaboration",
      required: true,
      index: true,
    },
    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["draft", "live_post"],
      default: "draft",
      required: true,
    },
    title: {
      type: String,
      default: "Deliverable Submission",
    },
    platform: {
      type: String,
      enum: ["Instagram", "YouTube", "TikTok", "Twitter", "Other"],
      default: "Instagram",
    },
    contentUrl: {
      type: String,
      default: "",
    },
    postUrl: {
      type: String,
      default: "",
    },
    caption: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["submitted", "approved", "revision_requested"],
      default: "submitted",
    },
    feedback: {
      type: String,
      default: "",
    },
    proofScreenshot: {
      type: String,
      default: "",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Deliverable", deliverableSchema);