import React from "react";
import { Sparkles } from "lucide-react";

function HeroBadge() {
  return (
    <div
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        px-4
        py-2
        shadow-sm
      "
    >
      <Sparkles
        size={16}
        className="text-[var(--color-primary)]"
      />

      <span className="text-sm font-semibold text-[var(--color-primary-hover)]">
        Campaign Intelligence Platform
      </span>
    </div>
  );
}

export default HeroBadge;