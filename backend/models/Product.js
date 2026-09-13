import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // The user (brand account) who owns this product
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Associated brand entity
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },

    productName: { type: String, required: true, trim: true },
    productLink: { type: String, default: "", trim: true },
    productCategory: { type: String, default: "", trim: true },
    productDescription: { type: String, default: "" },

    // Physical vs Digital product
    productType: {
      type: String,
      enum: ["Physical", "Digital", "Physical product", "Digital product"],
      default: "Physical product",
    },

    // Gallery images: min 3, max 6
    productImages: {
      type: [String],
      default: [],
    },
    // Single image for backward compatibility
    productImage: { type: String, default: "" },

    productPrice: { type: Number, default: 0 },
    idealCreatorProfile: { type: String, default: "" },

    // Target audience (legacy compatibility)
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
    targetAgeCustom: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);