// src/components/common/BrandLogo.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * BrandText renders "Influenza" with:
 * - "Influ" in Google Font Coiny
 * - "enza" in Google Font Prompt
 */
export function BrandText({
  size = "text-2xl",
  primaryColor = "text-[var(--color-primary)]",
  secondaryColor = "text-[var(--color-primary)]",
  className = "",
}) {
  return (
    <span className={`inline-flex items-baseline tracking-normal select-none leading-none ${size} ${className}`}>
      <span className={`font-coiny ${primaryColor}`}>Influ</span>
      <span className={`font-prompt font-extrabold tracking-tight ${secondaryColor}`}>enza</span>
    </span>
  );
}

/**
 * BrandIcon renders only the Influenza brand shape / icon
 */
export function BrandIcon({ size = "h-7 w-7", className = "" }) {
  return (
    <img
      src="/favicon.svg"
      alt="Influenza Logo Shape"
      className={`${size} object-contain flex-shrink-0 ${className}`}
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
  size = "text-2xl",
  iconSize = "h-7 w-7",
  primaryColor = "text-[var(--color-primary)]",
  secondaryColor = "text-[var(--color-primary)]",
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
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
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

