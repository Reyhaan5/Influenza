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
    rewardValue: String,
    deliverablesRequired: { type: Number, default: 1 },
    requirements: String,
    deadline: Date,
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("Opportunity", opportunitySchema);