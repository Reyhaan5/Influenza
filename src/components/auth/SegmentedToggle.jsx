import React from "react";

export default function SegmentedToggle({ value, onChange }) {
  return (
    <div className="w-full flex p-1.5 bg-[var(--color-background)] rounded-full border border-[var(--color-border)]/50">
      <button
        type="button"
        onClick={() => onChange("signup")}
        className={`flex-1 py-3 px-4 text-center text-[clamp(0.875rem,1.5vw,1rem)] font-semibold rounded-full transition-all duration-300 min-h-[3rem] flex items-center justify-center ${
          value === "signup"
            ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-card)]"
            : "text-[var(--color-text)]/70 hover:text-[var(--color-primary-hover)]"
        }`}
      >
        Sign Up
      </button>

      <button
        type="button"
        onClick={() => onChange("login")}
        className={`flex-1 py-3 px-4 text-center text-[clamp(0.875rem,1.5vw,1rem)] font-semibold rounded-full transition-all duration-300 min-h-[3rem] flex items-center justify-center ${
          value === "login"
            ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-card)]"
            : "text-[var(--color-text)]/70 hover:text-[var(--color-primary-hover)]"
        }`}
      >
        Log In
      </button>
    </div>
  );
}