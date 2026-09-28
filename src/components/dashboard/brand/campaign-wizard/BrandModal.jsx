import React, { useState, useEffect, useRef } from "react";
import { X, Globe, Pencil } from "lucide-react";
import api, { API_ORIGIN } from "../../../../config/api";
import RichTextarea from "../../../common/RichTextarea";

const CATEGORIES = [
  "Apparel",
  "Beauty & Cosmetics",
  "Tech & Electronics",
  "Health & Fitness",
  "Food & Beverage",
  "Travel & Lifestyle",
  "Home & Living",
  "Gaming",
  "Education",
  "Jewelry & Accessories",
  "Other",
];

export default function BrandModal({ isOpen, onClose, onBrandSaved, initialBrand = null }) {
  const [name, setName] = useState("");
  const [websiteOrSocialLink, setWebsiteOrSocialLink] = useState("");
  const [category, setCategory] = useState("Apparel");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialBrand) {
      setName(initialBrand.name || "");
      setWebsiteOrSocialLink(initialBrand.websiteOrSocialLink || "");
      setCategory(initialBrand.category || "Apparel");
      setDescription(initialBrand.description || "");
      setLogoPreview(
        initialBrand.logo
          ? initialBrand.logo.startsWith("http")
            ? initialBrand.logo
            : `${API_ORIGIN}${initialBrand.logo}`
          : ""
      );
      setLogoFile(null);
    } else {
      setName("");
      setWebsiteOrSocialLink("");
      setCategory("Apparel");
      setDescription("");
      setLogoPreview("");
      setLogoFile(null);
    }
    setError("");
  }, [initialBrand, isOpen]);

  if (!isOpen) return null;

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a brand name.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("websiteOrSocialLink", websiteOrSocialLink.trim());
      formData.append("category", category);
      formData.append("description", description);
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      let res;
      if (initialBrand?._id) {
        res = await api.put(`/brand/brands/${initialBrand._id}`, formData);
      } else {
        res = await api.post("/brand/brands", formData);
      }

      onBrandSaved(res.data.brand);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save brand.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl p-7 shadow-2xl relative animate-fadeIn border border-gray-100 my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {initialBrand ? "Edit brand" : "Add brand"}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Brand Logo Row */}
          <div className="flex items-center gap-4">
            <div className="relative group flex-shrink-0">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-2xl bg-amber-500 flex items-center justify-center overflow-hidden cursor-pointer shadow-sm border-2 border-amber-400 relative"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Brand Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-extrabold text-2xl tracking-wider">
                    {name ? name.slice(0, 3).toUpperCase() : "LOGO"}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="absolute top-1.5 right-1.5 bg-white p-1.5 rounded-xl shadow-md text-gray-700 hover:text-black transition"
                  aria-label="Upload logo"
                >
                  <Pencil size={14} />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Add a brand logo. This will help you gain trust from creator and get more applications
            </p>
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Brand name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ryzwnn"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition"
              required
            />
          </div>

          {/* Brand Site or Social Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Brand site or social link
            </label>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-fuchsia-500">
              <div className="bg-gray-50 px-3.5 flex items-center border-r border-gray-200 text-gray-500">
                <Globe size={18} />
              </div>
              <input
                type="url"
                value={websiteOrSocialLink}
                onChange={(e) => setWebsiteOrSocialLink(e.target.value)}
                placeholder="https://ryzentechnologies.com/"
                className="w-full px-3.5 py-2.5 text-sm bg-white text-gray-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Brand Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Brand category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Brand description
            </label>
            <RichTextarea
              value={description}
              onChange={setDescription}
              maxLength={500}
              placeholder="Describe your brand values, mission, or aesthetic..."
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving..." : "Save Brand Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}
