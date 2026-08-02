import Product from "../models/Product.js";

// ======================================
// CREATE PRODUCT (a brand can have many)
// ======================================
export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productCategory,
      productDescription,
      targetGender,
      targetAgeGroup,
      targetAgeCustom,
      productPrice,
    } = req.body;

    if (!productName) {
      return res.status(400).json({ message: "Product name is required." });
    }

    const product = await Product.create({
      brand: req.user._id,
      productName,
      productCategory,
      productDescription,
      targetGender,
      targetAgeGroup,
      targetAgeCustom: targetAgeGroup === "Custom" ? targetAgeCustom : "",
      productPrice,
      productImage: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json({
      message: "Product added successfully.",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to add product.",
      error: error.message,
    });
  }
};

// ======================================
// GET ALL PRODUCTS FOR THE LOGGED-IN BRAND
// ======================================
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ brand: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to fetch products.",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE AN EXISTING PRODUCT
// ======================================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      productCategory,
      productDescription,
      targetGender,
      targetAgeGroup,
      targetAgeCustom,
      productPrice,
    } = req.body;

    // Scoped to req.user._id so a brand can only ever edit its own product.
    const product = await Product.findOne({ _id: id, brand: req.user._id });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (!productName) {
      return res.status(400).json({ message: "Product name is required." });
    }

    product.productName = productName;
    product.productCategory = productCategory;
    product.productDescription = productDescription;
    product.targetGender = targetGender;
    product.targetAgeGroup = targetAgeGroup;
    product.targetAgeCustom = targetAgeGroup === "Custom" ? targetAgeCustom : "";
    product.productPrice = productPrice;

    // Only replace the image if a new one was actually uploaded —
    // otherwise keep whatever image was already saved.
    if (req.file) {
      product.productImage = `/uploads/${req.file.filename}`;
    }

    await product.save();

    res.status(200).json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to update product.",
      error: error.message,
    });
  }
};

// ======================================
// DELETE A PRODUCT
// ======================================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({
      _id: id,
      brand: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({
      message: "Product removed successfully.",
      productId: id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to remove product.",
      error: error.message,
    });
  }
};