// src/components/common/BrandLogo.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * BrandText renders "Influenza" matching the violet-purple-pink icon:
 * - "Influ" in Google Font Coiny
 * - "enza" in Google Font Prompt
 * Styled with the icon's exact gradient palette (#5E01CE -> #8D64ED -> #FE00A4)
 */
export function BrandText({
  size = "text-2xl sm:text-3xl",
  gradient = true,
  primaryColor = "text-[#5E01CE]",
  secondaryColor = "text-[#FE00A4]",
  className = "",
}) {
  if (gradient) {
    return (
      <span className={`inline-flex items-baseline tracking-tight select-none leading-none ${size} ${className}`}>
        <span className="font-coiny bg-gradient-to-r from-[#5E01CE] via-[#7E22CE] to-[#A855F7] bg-clip-text text-transparent pr-px">
          Influ
        </span>
        <span className="font-prompt font-black tracking-tight bg-gradient-to-r from-[#A855F7] to-[#FE00A4] bg-clip-text text-transparent">
          enza
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-baseline tracking-tight select-none leading-none ${size} ${className}`}>
      <span className={`font-coiny ${primaryColor}`}>Influ</span>
      <span className={`font-prompt font-black tracking-tight ${secondaryColor}`}>enza</span>
    </span>
  );
}

/**
 * BrandIcon renders only the Influenza brand shape / icon
 */
export function BrandIcon({ size = "h-8 w-8", className = "" }) {
  return (
    <img
      src="/Influenza icon.svg"
      alt="Influenza Logo Shape"
      className={`${size} object-contain shrink-0 ${className}`}
    />
  );
}

/**
 * Combined BrandLogo with Icon + Dual-Font Text
 */
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

  if (!to) {
    return <div onClick={onClick} className="inline-block">{content}</div>;
  }

  return (
    <Link to={to} onClick={onClick} className="inline-block group transition-transform hover:scale-[1.02]">
      {content}
    </Link>
  );
}

