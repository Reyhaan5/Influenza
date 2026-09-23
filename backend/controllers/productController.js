import Product from "../models/Product.js";

// ======================================
// CREATE PRODUCT (a brand can have many)
// ======================================
export const createProduct = async (req, res) => {
  try {
    const {
      brand, // Brand ObjectId
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
      productImages, // array or JSON string of URLs
    } = req.body;

    if (!productName) {
      return res.status(400).json({ message: "Product name is required." });
    }

    let parsedImages = [];
    if (Array.isArray(productImages)) {
      parsedImages = productImages;
    } else if (typeof productImages === "string" && productImages.trim()) {
      try {
        parsedImages = JSON.parse(productImages);
      } catch {
        parsedImages = [productImages];
      }
    }

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

    let parsedImages = undefined;
    if (productImages !== undefined) {
      if (Array.isArray(productImages)) {
        parsedImages = productImages;
      } else if (typeof productImages === "string" && productImages.trim()) {
        try {
          parsedImages = JSON.parse(productImages);
        } catch {
          parsedImages = [productImages];
        }
      }
    }

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
      $or: [{ user: req.user._id }, { brand: req.user._id }],
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