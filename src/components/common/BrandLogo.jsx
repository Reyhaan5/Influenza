import React from "react";
import { Link } from "react-router-dom";

export function BrandText({
  size = "text-2xl sm:text-3xl",
  gradient = true,
  primaryColor = "text-[#5E01CE]",
  secondaryColor = "text-[#FE00A4]",
  className = "",
}) {
  const c1 = gradient ? "bg-gradient-to-r from-[#5E01CE] via-[#7E22CE] to-[#A855F7] bg-clip-text text-transparent pr-px" : primaryColor;
  const c2 = gradient ? "bg-gradient-to-r from-[#A855F7] to-[#FE00A4] bg-clip-text text-transparent" : secondaryColor;

  return (
    <span className={`inline-flex items-baseline tracking-tight select-none leading-none ${size} ${className}`}>
      <span className={`font-coiny ${c1}`}>Influ</span>
      <span className={`font-prompt font-black tracking-tight ${c2}`}>enza</span>
    </span>
  );
}

export function BrandIcon({ size = "h-8 w-8", className = "" }) {
  return <img src="/Influenza icon.svg" alt="Influenza Logo Shape" className={`${size} object-contain shrink-0 ${className}`} />;
}

export default function BrandLogo({
  to = "/",
  iconOnly = false,
  textOnly = false,
  size = "text-2xl sm:text-3xl",
  iconSize = "h-8 w-8",
  gradient = true,
  primaryColor,
  secondaryColor,
  className = "",
  gap = "gap-2.5",
  onClick,
}) {
  const content = (
    <div className={`inline-flex items-center ${gap} ${className}`}>
      {!textOnly && <BrandIcon size={iconSize} />}
      {!iconOnly && (
        <BrandText
          size={size}
          gradient={gradient}
          {...(primaryColor ? { primaryColor, gradient: false } : {})}
          {...(secondaryColor ? { secondaryColor, gradient: false } : {})}
        />
      )}
    </div>
  );

  return to ? (
    <Link to={to} onClick={onClick} className="inline-block group transition-transform hover:scale-[1.02]">{content}</Link>
  ) : (
    <div onClick={onClick} className="inline-block">{content}</div>
  );
}
