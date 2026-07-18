import React from "react";

export default function SocialButton({ icon, children, ...props }) {
  return (
    <button
      type="button"
      className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 min-h-[3rem] text-sm font-semibold text-brandText bg-[#FFFFFF] border border-brandAccent rounded-xl transition-all duration-200 hover:bg-brandBg hover:border-brandPrimary active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brandPrimary/20"
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="text-brandText">{children}</span>
    </button>
  );
}