import React from "react";
import { Building2, Globe, Mail, MapPin, Tag } from "lucide-react";
import FormField from "../../auth/FormField";

export default function CompanyDetailsCard({ details }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)]">
      <h4 className="font-bold text-[var(--color-text)] mb-5">Company details</h4>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Company name" icon={<Building2 size={18} />} defaultValue={details.companyName} />
        <FormField label="Industry" icon={<Tag size={18} />} defaultValue={details.industry} />
        <FormField label="Website" icon={<Globe size={18} />} defaultValue={details.website} />
        <FormField label="Contact email" type="email" icon={<Mail size={18} />} defaultValue={details.email} />
        <div className="sm:col-span-2">
          <FormField label="Location" icon={<MapPin size={18} />} defaultValue={details.location} />
        </div>
      </div>

      <button className="mt-6 rounded-xl bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[var(--color-primary-hover)] hover:-translate-y-0.5">
        Save changes
      </button>
    </div>
  );
}