import React from "react";
import { Check } from "lucide-react";

// `multi=true`: `selected` is an array, `onToggle` receives the new array.
// `multi=false`: `selected` is a single string, `onToggle` receives the clicked option.
export default function ChipMultiSelect({ options, selected, onToggle, multi = true }) {
  const isSelected = (opt) => (multi ? selected.includes(opt) : selected === opt);

  const handleClick = (opt) => {
    if (multi) {
      onToggle(isSelected(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
    } else {
      onToggle(opt);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = isSelected(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => handleClick(opt)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
            }`}
          >
            {active && <Check size={12} />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}