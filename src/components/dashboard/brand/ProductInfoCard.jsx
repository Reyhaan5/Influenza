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
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)]">

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Package
            size={18}
            className="text-[var(--color-primary)]"
          />

          <h3 className="text-lg font-bold text-[var(--color-text)]">
            {isEditing ? "Edit Product" : "Add a Product"}
          </h3>
        </div>

        {isEditing && (
          <button
            onClick={onCancelEdit}
            className="flex items-center gap-1 text-xs font-semibold text-[var(--color-text-light)] hover:text-[var(--color-text)]"
          >
            <X size={14} />
            Cancel
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
          placeholder="Fashion, Electronics..."
          onChange={(e) => onChange("productCategory", e.target.value)}
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
            Product Description
          </label>
          <p className="text-xs text-[var(--color-text-light)] mb-2">
            One point per line — each line becomes a separate bullet point.
          </p>

          <textarea
            rows={6}
            value={details.productDescription}
            placeholder={"Premium 100% cotton fabric\nHandcrafted by local artisans\nMachine washable, colorfast dye"}
            onChange={(e) => onChange("productDescription", e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Target Gender */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
            Target Gender
          </label>
          <select
            value={details.targetGender}
            onChange={(e) => onChange("targetGender", e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Target Age Group */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
            Target Age Group
          </label>
          <select
            value={details.targetAgeGroup}
            onChange={(e) => onChange("targetAgeGroup", e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {AGE_OPTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Custom Age — only shown when "Custom" is picked above */}
        {details.targetAgeGroup === "Custom" && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Custom Age Range
            </label>
            <input
              type="text"
              value={details.targetAgeCustom}
              placeholder="e.g. 28-52 or 60+"
              onChange={(e) => onChange("targetAgeCustom", e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        )}

        <Input
          label="Product Price"
          type="number"
          value={details.productPrice}
          placeholder="999"
          onChange={(e) => onChange("productPrice", e.target.value)}
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
            Product Image {isEditing && "(leave empty to keep current image)"}
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => onChange("productImageFile", e.target.files[0])}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2"
          />
        </div>

      </div>

      <div className="flex justify-end gap-3 mt-8">
        {isEditing && (
          <button
            onClick={onCancelEdit}
            className="px-6 py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-[var(--color-background)] transition"
          >
            Cancel
          </button>
        )}

        <button
          onClick={onSave}
          disabled={saving}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold px-8 py-3 rounded-xl transition disabled:opacity-60"
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
      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      />
    </div>
  );
}