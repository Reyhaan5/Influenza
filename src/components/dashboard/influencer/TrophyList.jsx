import React from "react";
import { Trophy } from "lucide-react";

export default function TrophyList({ trophies }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)]">
      <h4 className="font-bold text-[var(--color-text)] mb-4">Trophies you've collected</h4>
      <div className="flex flex-col gap-3">
        {trophies.map((t, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-background)]"
          >
            <div className="flex items-center gap-3">
              <Trophy size={18} className="text-[var(--color-primary)]" />
              <span className="text-sm font-semibold text-[var(--color-text)]">{t}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}