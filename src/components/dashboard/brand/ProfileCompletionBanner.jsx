import React from "react";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export default function ProfileCompletionBanner({ pct = 70 }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] h-full flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <ShieldCheck size={20} />
        </div>
        <p className="text-sm text-[var(--color-text)] leading-relaxed">
          Your profile is <span className="font-bold text-[var(--color-primary-hover)]">{pct}% complete</span>.
          Finish your company details to get a verified badge.
        </p>
      </div>
      <button className="self-start mt-4 flex items-center gap-1.5 text-sm font-bold text-[var(--color-primary-hover)] hover:underline">
        Complete profile <ArrowUpRight size={16} />
      </button>
    </div>
  );
}