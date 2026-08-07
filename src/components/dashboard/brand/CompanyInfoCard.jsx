import React from "react";
import { Building2 } from "lucide-react";

export default function CompanyInfoCard({
  details,
  onChange,
  onSave,
  saving,
}) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)]">

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
          onChange={(e) => onChange("companyName", e.target.value)}
        />

        <Input
          label="Industry"
          value={details.industry}
          placeholder="Fashion, Food, Technology..."
          onChange={(e) => onChange("industry", e.target.value)}
        />

        <Input
          label="Website"
          value={details.website}
          placeholder="https://example.com"
          onChange={(e) => onChange("website", e.target.value)}
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
          onChange={(e) => onChange("location", e.target.value)}
        />

      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold px-8 py-3 rounded-xl transition disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Company Info"}
        </button>
      </div>

    </div>
  );
}

function Input({ label, value, onChange, placeholder, readOnly = false, type = "text" }) {
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
        ${readOnly ? "bg-[var(--color-background)] cursor-not-allowed" : "bg-[var(--color-background)]"}`}
      />
    </div>
  );
}