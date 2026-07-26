import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: String,
    format: {
      type: String,
      enum: ["money", "barter", "product"],
      required: true,
    },
    rewardValue: String, // e.g. "$500" or "Product worth $200" — display string, not payment processing
    deliverablesRequired: { type: Number, default: 1 }, // e.g. 5 posts
    requirements: String, // free text: niche, follower minimum, etc.
    deadline: Date,
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("Opportunity", opportunitySchema);
