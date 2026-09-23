import React from "react";
import { Package, X } from "lucide-react";

const GENDER_OPTIONS = ["All", "Male", "Female", "Non-binary"];
const AGE_OPTIONS = ["13-17", "18-24", "25-34", "35-44", "45-54", "55+", "Custom"];

export default function ProductInfoCard({
  details,
  onChange,
  onSave,
  saving,
  isEditing,
  onCancelEdit,
}) {
  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-zinc-100/90 border border-zinc-200/80 text-zinc-900 flex items-center justify-center">
            <Package size={18} />
          </div>

          <div>
            <h3 className="text-lg font-black text-zinc-950">
              {isEditing ? "Edit Product" : "Add a Product"}
            </h3>
            <p className="text-xs text-zinc-500 font-medium">
              Configure product details, target demographics, and pricing.
            </p>
          </div>
        </div>

        {isEditing && (
          <button
            onClick={onCancelEdit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition cursor-pointer"
          >
            <X size={14} />
            <span>Cancel</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Product / Brand Name"
          value={details.productName}
          placeholder="Enter product name"
          onChange={(e) => onChange("productName", e.target.value)}
        />

        <Input
          label="Product Category"
          value={details.productCategory}
          placeholder="Fashion, Electronics, Food..."
          onChange={(e) => onChange("productCategory", e.target.value)}
        />

        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
            Product Description
          </label>
          <p className="text-xs text-zinc-400 font-medium mb-2">
            One point per line — each line becomes a separate bullet point.
          </p>

          <textarea
            rows={5}
            value={details.productDescription}
            placeholder={"Premium 100% cotton fabric\nHandcrafted by local artisans\nMachine washable, colorfast dye"}
            onChange={(e) => onChange("productDescription", e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-xs font-medium text-zinc-950 resize-none focus:outline-none focus:border-zinc-950 focus:bg-white"
          />
        </div>

        {/* Target Gender */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
            Target Gender
          </label>
          <select
            value={details.targetGender}
            onChange={(e) => onChange("targetGender", e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
          >
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Target Age Group */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
            Target Age Group
          </label>
          <select
            value={details.targetAgeGroup}
            onChange={(e) => onChange("targetAgeGroup", e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white"
          >
            {AGE_OPTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Custom Age — only shown when "Custom" is picked above */}
        {details.targetAgeGroup === "Custom" && (
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Custom Age Range
            </label>
            <input
              type="text"
              value={details.targetAgeCustom}
              placeholder="e.g. 28-52 or 60+"
              onChange={(e) => onChange("targetAgeCustom", e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-xs font-semibold text-zinc-950 focus:outline-none focus:border-zinc-950 focus:bg-white"
            />
          </div>
        )}

        <Input
          label="Product Price (₹ INR)"
          type="number"
          value={details.productPrice}
          placeholder="999"
          onChange={(e) => onChange("productPrice", e.target.value)}
        />

        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
            Product Image {isEditing && "(leave empty to keep current image)"}
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => onChange("productImageFile", e.target.files[0])}
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-2.5 text-xs text-zinc-700 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-zinc-950 file:text-white hover:file:bg-zinc-800 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        {isEditing && (
          <button
            onClick={onCancelEdit}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-60"
        >
          {saving
            ? (isEditing ? "Updating..." : "Adding...")
            : (isEditing ? "Update Product" : "Add Product")}
        </button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-xs font-semibold text-zinc-950 focus:outline-none focus:border-zinc-950 focus:bg-white"
      />
    </div>
  );
}