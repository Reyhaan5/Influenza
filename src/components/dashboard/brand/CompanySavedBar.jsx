import React from "react";
import { CheckCircle2, Pencil } from "lucide-react";

export default function CompanySavedBar({ companyName, onEdit }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)] flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <CheckCircle2 size={20} className="text-[var(--color-success)]" />
        <div>
          <p className="font-semibold text-[var(--color-text)]">
            {companyName || "Company"} info saved
          </p>
          <p className="text-xs text-[var(--color-text-light)]">
            Company details are up to date.
          </p>
        </div>
      </div>

      <button
        onClick={onEdit}
        className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary-hover)] hover:underline flex-shrink-0"
      >
        <Pencil size={14} />
        Edit
      </button>
    </div>
  );
}