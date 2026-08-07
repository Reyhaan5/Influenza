import React from "react";
import { Building2, Package } from "lucide-react";

export default function CompanyDetailsCard({
  details,
  onChange,
  onSave,
}) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)]">

      {/* ================= COMPANY INFORMATION ================= */}

      <div className="flex items-center gap-2 mb-5">
        <Building2
          size={18}
          className="text-[var(--color-primary)]"
        />

        <h3 className="text-lg font-bold text-[var(--color-text)]">
          Company Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Input
          label="Company Name"
          value={details.companyName}
          placeholder="Enter company name"
          onChange={(e) =>
            onChange("companyName", e.target.value)
          }
        />

        <Input
          label="Industry"
          value={details.industry}
          placeholder="Fashion, Food, Technology..."
          onChange={(e) =>
            onChange("industry", e.target.value)
          }
        />

        <Input
          label="Website"
          value={details.website}
          placeholder="https://example.com"
          onChange={(e) =>
            onChange("website", e.target.value)
          }
        />

        <Input
          label="Contact Email"
          value={details.email}
          readOnly
        />

        <Input
          label="Location"
          value={details.location}
          placeholder="Mumbai, India"
          onChange={(e) =>
            onChange("location", e.target.value)
          }
        />

      </div>

      {/* ================= PRODUCT INFORMATION ================= */}

      <div className="flex items-center gap-2 mt-10 mb-5">
        <Package
          size={18}
          className="text-[var(--color-primary)]"
        />

        <h3 className="text-lg font-bold text-[var(--color-text)]">
          Product Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Input
          label="Product / Brand Name"
          value={details.productName}
          placeholder="Enter product name"
          onChange={(e) =>
            onChange("productName", e.target.value)
          }
        />

        <Input
          label="Product Category"
          value={details.productCategory}
          placeholder="Fashion, Electronics..."
          onChange={(e) =>
            onChange("productCategory", e.target.value)
          }
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
            Product Description
          </label>

          <textarea
            rows={5}
            value={details.productDescription}
            placeholder="Describe your product..."
            onChange={(e) =>
              onChange("productDescription", e.target.value)
            }
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <Input
          label="Target Audience"
          value={details.targetAudience}
          placeholder="18-30, Students..."
          onChange={(e) =>
            onChange("targetAudience", e.target.value)
          }
        />

        <Input
          label="Product Price"
          type="number"
          value={details.productPrice}
          placeholder="999"
          onChange={(e) =>
            onChange("productPrice", e.target.value)
          }
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              onChange("productImage", e.target.files[0])
            }
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2"
          />
        </div>

      </div>

      {/* ================= SAVE BUTTON ================= */}

      <div className="flex justify-end mt-8">

        <button
          onClick={onSave}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold px-8 py-3 rounded-xl transition"
        >
          Save Profile
        </button>

      </div>

    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  type = "text",
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-[var(--color-border)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
        ${
          readOnly
            ? "bg-[var(--color-background)] cursor-not-allowed"
            : "bg-[var(--color-background)]"
        }`}
      />

    </div>
  );
}