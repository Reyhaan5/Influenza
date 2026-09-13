import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Globe,
  Plus,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Pin,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link2,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../../../../config/api";

const PRODUCT_CATEGORIES = [
  "Activewear & Sportswear",
  "Fashion & Apparel",
  "Beauty & Skincare",
  "Health & Wellness",
  "Tech & Electronics",
  "Food & Beverage",
  "Home & Lifestyle",
  "Software & Apps",
  "Courses & Education",
  "Gaming & Entertainment",
  "Other",
];

const MAX_IMAGES = 6;
const MIN_IMAGES = 3;

export default function ProductModal({
  isOpen,
  onClose,
  onProductSaved,
  initialProduct = null,
  brands = [],
  selectedBrandId = "",
}) {
  const [brandId, setBrandId] = useState("");
  const [productLink, setProductLink] = useState("");
  const [images, setImages] = useState([]); // array of { file, url, isExisting }
  const [showImageTip, setShowImageTip] = useState(false);
  const [productType, setProductType] = useState("Physical product");
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("Activewear & Sportswear");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [idealCreatorProfile, setIdealCreatorProfile] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (initialProduct) {
      setBrandId(
        initialProduct.brand?._id ||
          initialProduct.brand ||
          selectedBrandId ||
          (brands[0]?._id || "")
      );
      setProductLink(initialProduct.productLink || "");
      setProductType(
        initialProduct.productType?.toLowerCase().includes("digital")
          ? "Digital product"
          : "Physical product"
      );
      setProductName(initialProduct.productName || "");
      setProductCategory(initialProduct.productCategory || "Activewear & Sportswear");
      setProductDescription(initialProduct.productDescription || "");
      setProductPrice(initialProduct.productPrice ? String(initialProduct.productPrice) : "");
      setIdealCreatorProfile(initialProduct.idealCreatorProfile || "");

      const existingImgs = (
        initialProduct.productImages?.length > 0
          ? initialProduct.productImages
          : initialProduct.productImage
          ? [initialProduct.productImage]
          : []
      ).map((imgUrl) => ({
        file: null,
        url: imgUrl.startsWith("http") ? imgUrl : `${API_URL.replace("/api", "")}${imgUrl}`,
        rawPath: imgUrl,
        isExisting: true,
      }));
      setImages(existingImgs);
    } else {
      setBrandId(selectedBrandId || (brands[0]?._id || ""));
      setProductLink("");
      setImages([]);
      setProductType("Physical product");
      setProductName("");
      setProductCategory("Activewear & Sportswear");
      setProductDescription("");
      setProductPrice("");
      setIdealCreatorProfile("");
    }
    setError("");
  }, [initialProduct, isOpen, selectedBrandId, brands]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const availableSlots = MAX_IMAGES - images.length;
    const filesToAdd = files.slice(0, availableSlots);

    const newImageObjs = filesToAdd.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isExisting: false,
    }));

    setImages((prev) => [...prev, ...newImageObjs]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormatText = (type) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = productDescription.substring(start, end);

    let formatted = selected;
    if (type === "bold") formatted = `**${selected || "bold text"}**`;
    if (type === "italic") formatted = `*${selected || "italic text"}*`;
    if (type === "underline") formatted = `<u>${selected || "underlined text"}</u>`;
    if (type === "strike") formatted = `~~${selected || "struck text"}~~`;
    if (type === "bullet") formatted = `\n• ${selected || "item"}`;
    if (type === "numbered") formatted = `\n1. ${selected || "item"}`;
    if (type === "link") formatted = `[${selected || "link text"}](https://)`;

    const newText =
      productDescription.substring(0, start) + formatted + productDescription.substring(end);
    if (newText.length <= 500) {
      setProductDescription(newText);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!productName.trim()) {
      setError("Please enter a product name.");
      return;
    }
    if (images.length < MIN_IMAGES) {
      setError(`Please upload at least ${MIN_IMAGES} product images (currently ${images.length}).`);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("productName", productName.trim());
      formData.append("brand", brandId);
      formData.append("productLink", productLink.trim());
      formData.append("productType", productType);
      formData.append("productCategory", productCategory);
      formData.append("productDescription", productDescription);
      formData.append("productPrice", productPrice || "0");
      formData.append("idealCreatorProfile", idealCreatorProfile);

      // Existing image URLs that weren't deleted
      const existingUrls = images
        .filter((img) => img.isExisting)
        .map((img) => img.rawPath || img.url);
      formData.append("productImages", JSON.stringify(existingUrls));

      // New files to upload
      images
        .filter((img) => !img.isExisting && img.file)
        .forEach((img) => {
          formData.append("productImages", img.file);
        });

      let res;
      if (initialProduct?._id) {
        res = await axios.put(
          `${API_URL}/brand/products/${initialProduct._id}`,
          formData,
          authHeader
        );
      } else {
        res = await axios.post(`${API_URL}/brand/products`, formData, authHeader);
      }

      onProductSaved(res.data.product);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const activeBrand = brands.find((b) => b._id === brandId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl p-7 shadow-2xl relative animate-fadeIn border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {initialProduct ? "Edit Product" : "Add a Product"}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Brand Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Brand
            </label>
            <div className="relative">
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition cursor-pointer appearance-none pr-10"
              >
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          {/* Product Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Product Link
            </label>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-fuchsia-500">
              <div className="bg-gray-50 px-3.5 flex items-center border-r border-gray-200 text-gray-500">
                <Globe size={18} />
              </div>
              <input
                type="url"
                value={productLink}
                onChange={(e) => setProductLink(e.target.value)}
                placeholder="https://ryzentechnologies.com/"
                className="w-full px-3.5 py-2.5 text-sm bg-white text-gray-900 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Direct store/product link so creators can view exact specs and pricing.
            </p>
          </div>

          {/* Product Images (At least 3 images) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-semibold text-gray-900">
                Product image (At least 3 images)
              </label>
              <span className="text-xs font-semibold text-fuchsia-600">
                {images.length}/{MAX_IMAGES}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Upload high-quality images that make the product look desirable
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden shadow-sm border-2 ${
                    idx === 0 ? "border-fuchsia-600 ring-2 ring-fuchsia-100" : "border-gray-200"
                  }`}
                >
                  <img src={img.url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-white/95 text-fuchsia-700 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-0.5 transition"
                    title="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 hover:border-fuchsia-500 flex items-center justify-center text-gray-400 hover:text-fuchsia-600 transition bg-gray-50 hover:bg-fuchsia-50/30"
                >
                  <Plus size={22} />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Collapsible Image Banner */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowImageTip(!showImageTip)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-50 hover:bg-purple-100/70 text-purple-900 text-xs font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb size={16} className="text-purple-600 flex-shrink-0" />
                  Boost campaign results with images
                </span>
                {showImageTip ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showImageTip && (
                <div className="mt-1.5 p-3 rounded-xl bg-purple-50/60 text-purple-800 text-xs leading-relaxed">
                  High-resolution photos with multiple angles, in-use demonstrations, and lifestyle shots
                  make your campaign 3x more attractive to top creators.
                </div>
              )}
            </div>
          </div>

          {/* Product Type (Segmented toggle) */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Product Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProductType("Physical product")}
                className={`py-3 px-4 rounded-xl border text-sm font-bold transition flex items-center justify-center ${
                  productType === "Physical product"
                    ? "border-fuchsia-600 text-fuchsia-700 bg-fuchsia-50/40 ring-1 ring-fuchsia-600"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                }`}
              >
                Physical product
              </button>
              <button
                type="button"
                onClick={() => setProductType("Digital product")}
                className={`py-3 px-4 rounded-xl border text-sm font-bold transition flex items-center justify-center ${
                  productType === "Digital product"
                    ? "border-fuchsia-600 text-fuchsia-700 bg-fuchsia-50/40 ring-1 ring-fuchsia-600"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                }`}
              >
                Digital product
              </button>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Product name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Time Pass"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition"
              required
            />
          </div>

          {/* Product Category */}
          <div>
            <div className="mb-2 p-3 rounded-xl bg-purple-50 text-purple-900 text-xs flex items-center gap-2">
              <Pin size={15} className="text-purple-600 flex-shrink-0" />
              <span>
                Pick the category that best describes your product. We'll use it to suggest creators who
                are the best match.
              </span>
            </div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Product category
            </label>
            <div className="relative">
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition cursor-pointer appearance-none pr-10"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div>
            <div className="mb-2 p-3 rounded-xl bg-purple-50 text-purple-900 text-xs flex items-center gap-2">
              <Lightbulb size={15} className="text-purple-600 flex-shrink-0" />
              <span>
                Show creators the real-world problem your product solves, the standout benefit, and how to
                use it—in 2-3 short, friendly lines.
              </span>
            </div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Product Description
            </label>
            <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-fuchsia-500 transition">
              <div className="p-3 relative">
                <textarea
                  ref={textareaRef}
                  rows={3}
                  maxLength={500}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Describe key highlights, standout features, or problem solved..."
                  className="w-full text-sm bg-transparent text-gray-900 focus:outline-none resize-none"
                />
                <div className="text-right text-[11px] text-gray-400 mt-1">
                  {productDescription.length}/500
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="bg-gray-50 border-t border-gray-200 px-3 py-2 flex items-center gap-1.5 text-gray-600 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => handleFormatText("left")}
                  className="p-1 rounded hover:bg-gray-200 text-gray-600 transition"
                  title="Align Left"
                >
                  <AlignLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatText("center")}
                  className="p-1 rounded hover:bg-gray-200 text-gray-600 transition"
                  title="Align Center"
                >
                  <AlignCenter size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatText("right")}
                  className="p-1 rounded hover:bg-gray-200 text-gray-600 transition"
                  title="Align Right"
                >
                  <AlignRight size={16} />
                </button>
                <div className="h-4 w-[1px] bg-gray-300 mx-1" />
                <button
                  type="button"
                  onClick={() => handleFormatText("bold")}
                  className="p-1 rounded hover:bg-gray-200 text-gray-600 font-bold transition"
                  title="Bold"
                >
                  <Bold size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatText("italic")}
                  className="p-1 rounded hover:bg-gray-200 text-gray-600 italic transition"
                  title="Italic"
                >
                  <Italic size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatText("underline")}
                  className="p-1 rounded hover:bg-gray-200 text-gray-600 underline transition"
                  title="Underline"
                >
                  <Underline size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatText("strike")}
                  className="p-1 rounded hover:bg-gray-200 text-gray-600 line-through transition"
                  title="Strikethrough"
                >
                  <Strikethrough size={16} />
                </button>
                <div className="h-4 w-[1px] bg-gray-300 mx-1" />
                <button
                  type="button"
                  onClick={() => handleFormatText("bullet")}
                  className="p-1 rounded hover:bg-gray-200 text-gray-600 transition"
                  title="Bullet List"
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatText("numbered")}
                  className="p-1 rounded hover:bg-gray-200 text-gray-600 transition"
                  title="Numbered List"
                >
                  <ListOrdered size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatText("link")}
                  className="p-1 rounded hover:bg-gray-200 text-gray-600 transition"
                  title="Insert Link"
                >
                  <Link2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Product Price
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Product price visibility attracts top creators and enhances application quality
            </p>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-fuchsia-500">
              <div className="bg-gray-50 px-4 flex items-center border-r border-gray-200 text-gray-600 font-bold">
                $
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="25"
                className="w-full px-3.5 py-2.5 text-sm bg-white text-gray-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Ideal Creator Profile (Optional) */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <label className="block text-sm font-semibold text-gray-900">
                Ideal creator profile
              </label>
              <span className="text-xs text-gray-400 font-normal">optional</span>
            </div>
            <div className="mb-2 p-3 rounded-xl bg-purple-50 text-purple-900 text-xs flex items-center gap-2">
              <Lightbulb size={15} className="text-purple-600 flex-shrink-0" />
              <span>
                Tell us about your ideal creator. This won't limit your creator pool. It simply helps us
                prioritize the best matches for you.
              </span>
            </div>
            <textarea
              rows={2}
              value={idealCreatorProfile}
              onChange={(e) => setIdealCreatorProfile(e.target.value)}
              placeholder="e.g. Fitness enthusiasts aged 20-35 with authentic gym routines..."
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving || !productName.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 active:scale-95 text-white font-bold text-sm shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
