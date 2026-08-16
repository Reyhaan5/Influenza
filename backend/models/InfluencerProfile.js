import mongoose from "mongoose";

const socialAccountSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true }, // "Instagram", "YouTube", etc.
    handle: { type: String, required: true },
    followers: { type: Number, default: 0 }, // manual entry for now, OAuth later
    verified: { type: Boolean, default: false }, // flips true once "Verify with Instagram" succeeds
  },
  { _id: false }
);

const influencerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    handle: { type: String, required: true },
    approved: { type: Boolean, default: false },

    socialAccounts: [socialAccountSchema],
    savedOpportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" }],

    // Niches the influencer associates with their profile. Capped at 3 so the
    // category browse/search feature stays meaningful (see publicCreatorsController.js).
    categories: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length <= 3;
        },
        message: "You can select up to 3 categories.",
      },
    },

    // NOTE: collaborationsCompleted, rating, challenges, and milestones are
    // NOT stored here — they're computed live from CollaborationRequest,
    // Collaboration, and Review documents. See dashboardController.js.
  },
  { timestamps: true }
);

export default mongoose.model("InfluencerProfile", influencerProfileSchema);
