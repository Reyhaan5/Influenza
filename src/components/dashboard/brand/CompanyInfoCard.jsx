import React from "react";
import { Building2 } from "lucide-react";

export default function CompanyInfoCard({
  details,
  onChange,
  onSave,
  saving,
}) {
  return (
    <div id="company-form-section" className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-2xl bg-zinc-100/90 border border-zinc-200/80 text-zinc-900 flex items-center justify-center">
          <Building2 size={18} />
        </div>

        <div>
          <h3 className="text-lg font-black text-zinc-950">
            Company Information
          </h3>
          <p className="text-xs text-zinc-500 font-medium">
            Core brand details displayed on collaboration invites and campaigns.
          </p>
        </div>
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
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-60"
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
      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-2xl border border-zinc-200 px-4 py-3 text-xs font-semibold focus:outline-none focus:border-zinc-950
        ${readOnly ? "bg-zinc-100 text-zinc-500 cursor-not-allowed border-zinc-200" : "bg-zinc-50/60 text-zinc-950 focus:bg-white"}`}
      />
    </div>
  );
}