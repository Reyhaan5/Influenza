import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productName: { type: String, required: true, trim: true },
    productCategory: { type: String, default: "", trim: true },
    productDescription: { type: String, default: "" },

    // Target audience — now structured instead of one free-text field
    targetGender: {
      type: String,
      enum: ["All", "Male", "Female", "Non-binary"],
      default: "All",
    },
    targetAgeGroup: {
      type: String,
      enum: ["13-17", "18-24", "25-34", "35-44", "45-54", "55+", "Custom"],
      default: "18-24",
    },
    targetAgeCustom: { type: String, default: "", trim: true }, // only used when targetAgeGroup is "Custom"

    productPrice: { type: Number, default: 0 },
    productImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);