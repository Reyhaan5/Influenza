import React from "react";

export default function SegmentedToggle({ value, onChange }) {
  return (
    <div className="w-full flex p-1.5 bg-brandBg rounded-full border border-brandAccent/50">
      <button
        type="button"
        onClick={() => onChange("signup")}
        className={`flex-1 py-3 px-4 text-center text-[clamp(0.875rem,1.5vw,1rem)] font-semibold rounded-full transition-all duration-300 min-h-[3rem] flex items-center justify-center ${
          value === "signup"
            ? "bg-brandPrimary text-[#FFFFFF] shadow-md"
            : "text-brandText/70 hover:text-brandSecondary"
        }`}
      >
        Sign Up
      </button>

      <button
        type="button"
        onClick={() => onChange("login")}
        className={`flex-1 py-3 px-4 text-center text-[clamp(0.875rem,1.5vw,1rem)] font-semibold rounded-full transition-all duration-300 min-h-[3rem] flex items-center justify-center ${
          value === "login"
            ? "bg-brandPrimary text-[#FFFFFF] shadow-md"
            : "text-brandText/70 hover:text-brandSecondary"
        }`}
      >
        Log In
      </button>
    </div>
  );
}