import mongoose from "mongoose";

const socialAccountSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    handle: { type: String, required: true },
    followers: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
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
    approved: { type: Boolean, default: true },

    socialAccounts: [socialAccountSchema],
    savedOpportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" }],

    categories: {
      type: [String],
      default: [],
    },

    // ===========================
    // Account Settings & Onboarding
    // ===========================
    personalInfo: {
      firstName: { type: String, default: "" },
      lastName: { type: String, default: "" },
      title: { type: String, default: "" },
      avatar: { type: String, default: "" },
      coverPhoto: { type: String, default: "" },
      coverPhotos: { type: [String], default: [] },
      birthday: { type: Date },
      gender: { type: String, default: "" },
      ethnicity: { type: String, default: "" },
      languages: { type: [String], default: ["English"] },
      petOwner: { type: String, enum: ["Yes", "No", "I have a cat", "I have a dog", "I have another pet"], default: "No" },
    },

    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
      city: { type: String, default: "" },
      county: { type: String, default: "" },
      state: { type: String, default: "" },
      postcode: { type: String, default: "" },
      country: { type: String, default: "" },
      phoneNumber: { type: String, default: "" },
    },

    notifications: {
      dailyDigest: { type: Boolean, default: true },
      marketing: { type: Boolean, default: true },
      unreadMessages: { type: Boolean, default: true },
      contractAgreements: { type: Boolean, default: true },
      automaticFollowups: { type: Boolean, default: true },
    },

    // ===========================
    // Match Profile tab
    // ===========================
    matchProfile: {
      campaignActive: { type: Boolean, default: true },
      invitationsActive: { type: Boolean, default: true },
      collaborationFormats: { type: [String], default: [] }, // "Instagram Reels" | "Instagram Stories" | "Instagram Post"
      paymentType: { type: String, enum: ["gifted", "paid", "affiliate"], default: "gifted" },
      minAskingPrice: { type: Number },
      maxAskingPrice: { type: Number },
      bio: { type: String, default: "" },
      passions: { type: String, default: "" },
      topics: { type: [String], default: [] },
      niche: { type: [String], default: [] },
      leadTimeDays: { type: Number },
      preferredCompanies: { type: [String], default: [] },
      interestedBrands: { type: [String], default: [] },
      audienceGender: { type: String, default: "" },
      audienceAgeRange: { type: String, default: "" },
      audience: { type: [String], default: [] },
      followersLocations: { type: [String], default: [] }, // country codes
    },

    // ===========================
    // Payout & Payment Details (Step 3)
    // ===========================
    payoutInfo: {
      method: { type: String, enum: ["bank", "upi", "paypal", "stripe"], default: "bank" },
      accountHolderName: { type: String, default: "" },
      bankName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      ifscOrRouting: { type: String, default: "" },
      upiId: { type: String, default: "" },
      paypalEmail: { type: String, default: "" },
      currency: { type: String, default: "USD" },
      isConfigured: { type: Boolean, default: false },
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

    isProfileComplete: { type: Boolean, default: false },

    // NOTE: collaborationsCompleted, rating, challenges, and milestones are
    // NOT stored here — they're computed live from CollaborationRequest,
    // Collaboration, and Review documents. See dashboardController.js.
  },
  { timestamps: true }
);

export default mongoose.model("InfluencerProfile", influencerProfileSchema);