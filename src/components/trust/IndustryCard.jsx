import React from "react";

function IndustryCard({ icon: Icon, title }) {
  return (
    <div
      className="
        flex
        shrink-0
        items-center
        gap-3
        rounded-full
        bg-[var(--color-surface)]
        border
        border-[var(--color-border)]
        px-6
        py-3
        transition-all
        duration-300
        hover:shadow-lg
        hover:border-[var(--color-primary)]/30
      "
    >
      <Icon size={20} className="text-[var(--color-primary)]" />

      <span className="font-semibold text-[var(--color-text)] whitespace-nowrap">
        {title}
      </span>
    </div>
  );
}

export default IndustryCard;