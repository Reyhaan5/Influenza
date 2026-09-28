import Product from "../models/Product.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

function parseImages(productImages) {
  if (Array.isArray(productImages)) return productImages;
  if (typeof productImages === "string" && productImages.trim()) {
    try {
      return JSON.parse(productImages);
    } catch {
      return [productImages];
    }
  }
  return [];
}

// ======================================
// CREATE PRODUCT (a brand can have many)
// ======================================
export const createProduct = asyncHandler(async (req, res) => {
  const {
    brand,
    productName,
    productLink,
    productType,
    productCategory,
    productDescription,
    productPrice,
    idealCreatorProfile,
    targetGender,
    targetAgeGroup,
    targetAgeCustom,
    productImages,
  } = req.body;

  if (!productName) {
    return res.status(400).json({ message: "Product name is required." });
  }

  let parsedImages = parseImages(productImages);

  // Append any newly uploaded files
  if (req.files && Array.isArray(req.files)) {
    const uploadedUrls = req.files.map((f) => `/uploads/${f.filename}`);
    parsedImages = [...parsedImages, ...uploadedUrls];
  } else if (req.file) {
    parsedImages = [...parsedImages, `/uploads/${req.file.filename}`];
  }

  const coverImage = parsedImages.length > 0 ? parsedImages[0] : "";

  const product = await Product.create({
    user: req.user._id,
    brand: brand || undefined,
    productName,
    productLink: productLink || "",
    productType: productType || "Physical product",
    productCategory: productCategory || "",
    productDescription: productDescription || "",
    productPrice: Number(productPrice) || 0,
    idealCreatorProfile: idealCreatorProfile || "",
    productImages: parsedImages,
    productImage: coverImage,
    targetGender: targetGender || "All",
    targetAgeGroup: targetAgeGroup || "18-24",
    targetAgeCustom: targetAgeGroup === "Custom" ? targetAgeCustom : "",
  });

  const populatedProduct = await Product.findById(product._id).populate("brand");

  res.status(201).json({
    message: "Product added successfully.",
    product: populatedProduct || product,
  });
});

// ======================================
// GET ALL PRODUCTS FOR THE LOGGED-IN BRAND
// ======================================
export const getMyProducts = asyncHandler(async (req, res) => {
  const { brandId } = req.query;
  const filter = {
    $or: [{ user: req.user._id }, { brand: req.user._id }],
  };

  if (brandId) {
    filter.brand = brandId;
  }

  const products = await Product.find(filter)
    .populate("brand")
    .sort({ createdAt: -1 });

  res.status(200).json({ products });
});

// ======================================
// UPDATE AN EXISTING PRODUCT
// ======================================
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    brand,
    productName,
    productLink,
    productType,
    productCategory,
    productDescription,
    productPrice,
    idealCreatorProfile,
    targetGender,
    targetAgeGroup,
    targetAgeCustom,
    productImages,
  } = req.body;

  const product = await Product.findOne({
    _id: id,
    $or: [{ user: req.user._id }, { brand: req.user._id }],
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  if (productName !== undefined) product.productName = productName;
  if (brand !== undefined) product.brand = brand || undefined;
  if (productLink !== undefined) product.productLink = productLink;
  if (productType !== undefined) product.productType = productType;
  if (productCategory !== undefined) product.productCategory = productCategory;
  if (productDescription !== undefined) product.productDescription = productDescription;
  if (productPrice !== undefined) product.productPrice = Number(productPrice) || 0;
  if (idealCreatorProfile !== undefined) product.idealCreatorProfile = idealCreatorProfile;
  if (targetGender !== undefined) product.targetGender = targetGender;
  if (targetAgeGroup !== undefined) product.targetAgeGroup = targetAgeGroup;
  if (targetAgeCustom !== undefined) {
    product.targetAgeCustom = targetAgeGroup === "Custom" ? targetAgeCustom : "";
  }

  let parsedImages = productImages !== undefined ? parseImages(productImages) : undefined;

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const uploadedUrls = req.files.map((f) => `/uploads/${f.filename}`);
    parsedImages = [...(parsedImages || product.productImages || []), ...uploadedUrls];
  } else if (req.file) {
    parsedImages = [...(parsedImages || product.productImages || []), `/uploads/${req.file.filename}`];
  }

  if (parsedImages !== undefined) {
    product.productImages = parsedImages;
    product.productImage = parsedImages.length > 0 ? parsedImages[0] : "";
  }

  await product.save();
  const updated = await Product.findById(product._id).populate("brand");

  res.status(200).json({
    message: "Product updated successfully.",
    product: updated || product,
  });
});

// ======================================
// DELETE A PRODUCT
// ======================================
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOneAndDelete({
    _id: id,
    $or: [{ user: req.user._id }, { brand: req.user._id }],
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  res.status(200).json({
    message: "Product removed successfully.",
    productId: id,
  });
});