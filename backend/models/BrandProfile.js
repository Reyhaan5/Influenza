import mongoose from "mongoose";

const brandProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ===========================
    // Company Information
    // ===========================

    companyName: {
      type: String,
      default: "",
      trim: true,
    },

    industry: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    // ===========================
    // Product Information
    // ===========================

    productName: {
      type: String,
      default: "",
      trim: true,
    },

    productCategory: {
      type: String,
      default: "",
      trim: true,
    },

    productDescription: {
      type: String,
      default: "",
    },

    targetAudience: {
      type: String,
      default: "",
      trim: true,
    },

    productPrice: {
      type: Number,
      default: 0,
    },

    productImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("BrandProfile", brandProfileSchema);