import React from "react";

export default function FormField({ label, icon, type = "text", placeholder, ...props }) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-[clamp(0.75rem,1.2vw,0.875rem)] font-semibold text-[var(--color-text)] tracking-wide">
          {label}
        </label>
      )}
      <div className="relative w-full flex items-center">
        {icon && (
          <div className="absolute left-3.5 flex items-center justify-center text-[var(--color-primary-hover)] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full ${
            icon ? "pl-11" : "px-4"
          } pr-4 py-3 min-h-[3rem] text-[clamp(0.875rem,1.5vw,1rem)] text-[var(--color-text)] placeholder-[var(--color-text)]/50 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl outline-none transition-all duration-200 hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20`}
          {...props}
        />
      </div>
    </div>
  );
}