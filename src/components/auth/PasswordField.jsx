import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function PasswordField({
  label = "Password",
  placeholder = "••••••••",
  ...props
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full flex flex-col gap-1.5">
      <label className="text-[clamp(0.75rem,1.2vw,0.875rem)] font-semibold text-brandText tracking-wide">
        {label}
      </label>

      <div className="relative w-full flex items-center">
        {/* Lock Icon */}
        <div className="absolute left-3.5 flex items-center justify-center text-brandSecondary pointer-events-none">
          <Lock size={20} strokeWidth={2} />
        </div>

        {/* Input */}
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="w-full pl-11 pr-11 py-3 min-h-[3rem] text-[clamp(0.875rem,1.5vw,1rem)] text-brandText placeholder-brandText/50 bg-white border border-brandAccent rounded-xl outline-none transition-all duration-200 hover:border-brandPrimary focus:border-brandPrimary focus:ring-2 focus:ring-brandPrimary/20"
          {...props}
        />

        {/* Show / Hide Password */}
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 p-1 text-brandText/60 hover:text-brandSecondary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brandPrimary/20"
        >
          {show ? (
            <EyeOff size={20} strokeWidth={2} />
          ) : (
            <Eye size={20} strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}