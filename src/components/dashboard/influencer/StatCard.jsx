import React from "react";

export default function StatCard({ icon, label, value, suffix }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)] flex items-center gap-4">
      <div className="p-3 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
        {icon}
      </div>
      <div>
        <p className="text-sm text-[var(--color-text-light)]">{label}</p>
        <p className="font-bold text-xl text-[var(--color-text)]">
          {value} {suffix && <span className="text-sm font-medium text-[var(--color-text-light)]">{suffix}</span>}
        </p>
      </div>
    </div>
  );
}