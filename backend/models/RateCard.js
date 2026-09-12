// backend/models/RateCard.js
import mongoose from "mongoose";

const rateCardSchema = new mongoose.Schema(
  {
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    followers: Number,
    avgLikes: Number,
    avgComments: Number,
    nicheId: String,
    marketId: String,
    rates: {
      post: Number,
      reel: Number,
      story: Number,
    },
    packages: [
      {
        id: String,
        title: String,
        contentType: { type: String, default: "Reel" },
        count: { type: Number, default: 1 },
        duration: { type: Number, default: 3 },
        durationUnit: { type: String, default: "Minutes" },
        price: { type: Number, default: 50 },
        description: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("RateCard", rateCardSchema);