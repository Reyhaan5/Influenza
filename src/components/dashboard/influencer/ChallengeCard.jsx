import React from "react";

export default function ChallengeCard({ title, description, note, progress, total, bonus, status = "Active" }) {
  const pct = Math.min(100, (progress / total) * 100);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-bold text-[var(--color-text)]">{title}</h4>
          <p className="text-sm text-[var(--color-text-light)] mt-1">{description}</p>
          {note && <p className="text-xs text-[var(--color-text)]/60 mt-1 italic">{note}</p>}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-success)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
            {status}
          </span>
          <span className="text-xs font-bold text-[var(--color-primary-hover)]">${bonus} bonus bid</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 h-2 bg-[var(--color-background)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-[var(--color-text-light)] w-10 text-right">
          {progress}/{total}
        </span>
      </div>
    </div>
  );
}