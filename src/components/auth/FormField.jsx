import React from "react";

export default function FormField({ label, icon, type = "text", placeholder, ...props }) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-[clamp(0.75rem,1.2vw,0.875rem)] font-semibold text-brandText tracking-wide">
          {label}
        </label>
      )}
      <div className="relative w-full flex items-center">
        {icon && (
          <div className="absolute left-3.5 flex items-center justify-center text-brandSecondary pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full ${
            icon ? "pl-11" : "px-4"
          } pr-4 py-3 min-h-[3rem] text-[clamp(0.875rem,1.5vw,1rem)] text-brandText placeholder-brandText/50 bg-[#FFFFFF] border border-brandAccent rounded-xl outline-none transition-all duration-200 hover:border-brandPrimary focus:border-brandPrimary focus:ring-2 focus:ring-brandPrimary/20`}
          {...props}
        />
      </div>
    </div>
  );
}