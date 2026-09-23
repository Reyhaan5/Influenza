import mongoose from "mongoose";

const deliverableSchema = new mongoose.Schema(
  {
    mediaType: { type: String, enum: ["Video", "Photo"], default: "Video" },
    postingType: { type: String, enum: ["Posting", "No posting"], default: "Posting" },
    brandTag: { type: String, default: "" },
    hashtags: { type: String, default: "" },
    placement: { type: String, enum: ["Stories", "Feed", "Reels"], default: "Reels" },
    format: {
      type: String,
      enum: ["9:16 Vertical", "4:5 Vertical", "1:1 Square", "16:9 Horizontal", ""],
      default: "4:5 Vertical",
    },
    videoMinLength: { type: Number, default: 15 },
    videoMaxLength: { type: Number, default: 60 },
    rawOrReady: {
      type: String,
      enum: ["Raw footage", "Ready to use Ad", "Ready to use Ad + Raw footage", ""],
      default: "Ready to use Ad",
    },
    contentType: {
      type: String,
      default: "Testimonial",
    },
    creatorGuide: {
      type: String,
      default: "",
    },
    requestHooksAndBRolls: { type: Boolean, default: false },
    musicRequirement: {
      type: String,
      enum: ["No music", "Music required", ""],
      default: "No music",
    },
    whatShouldAvoid: { type: String, default: "" },
    referenceFiles: { type: [String], default: [] },
    numberOfPhotos: { type: Number, default: 1 },
  },
  { _id: true }
);

const opportunitySchema = new mongoose.Schema(
  {
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    brandEntity: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

    title: { type: String, required: true },
    description: { type: String, default: "" },

    // Step 2 Campaign Info
    campaignGoal: {
      type: String,
      enum: ["Multi-Channel UGC", "Awareness & Reach", "Conversions & Sales", ""],
      default: "Multi-Channel UGC",
    },
    platform: {
      type: String,
      enum: ["Meta", "TikTok", "YouTube (Shorts)", "YouTube", ""],
      default: "Meta",
    },
    campaignType: {
      type: String,
      default: "User-Generated Content",
    },
    boostWithPartnershipAds: {
      type: Boolean,
      default: false,
    },
    campaignVisibility: {
      type: String,
      enum: ["Visible to matched creators", "Invite only", ""],
      default: "Visible to matched creators",
    },
    productDelivery: {
      type: String,
      enum: [
        "No delivery needed",
        "I'll reimburse",
        "I'll ship the product",
        "No delivery needed - Product not needed",
        "I’ll reimburse - Pay creator to buy it",
        "I’ll ship the product - You’ll send it to the creator",
        "no_delivery",
        "reimburse",
        "ship",
        "",
      ],
      default: "",
    },

    // Step 3 Manage Creators
    creatorsCountTier: {
      type: String,
      enum: ["<5", "5-10", "10-20", ">20", ""],
      default: "<5",
    },
    targetCreatorsCount: { type: Number, default: 3 },
    lookalikesLink: { type: String, default: "" },
    autoInviteSource: { type: String, default: "From Lists" },
    excludePastCampaigns: { type: Boolean, default: false },
    excludeCreatorsType: { type: String, default: "All creators" },
    excludeCampaignNames: { type: [String], default: [] },

    // Step 4 Deliverables
    deliverables: {
      type: [deliverableSchema],
      default: [],
    },

    // Step 5 Payment Terms
    minFeePerCreator: { type: Number, default: 0 },
    maxFeePerCreator: { type: Number, default: 0 },
    salesCommissionsEnabled: { type: Boolean, default: false },
    commissionRate: { type: Number, default: 10 },

    // Wizard Step Tracking
    currentStep: { type: Number, default: 1 },

    // Existing fields for backward compatibility
    format: {
      type: String,
      enum: ["money", "barter", "product", "mixed", "ugc", ""],
      default: "money",
    },
    rewardValue: { type: String, default: "" },
    deliverablesRequired: { type: Number, default: 1 },
    requirements: { type: String, default: "" },
    deadline: { type: Date },
    status: { type: String, enum: ["open", "closed", "draft"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("Opportunity", opportunitySchema);