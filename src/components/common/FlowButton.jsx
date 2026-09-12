import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

export default function FlowButton({
  children,
  text = "Get Started",
  to,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  showArrow = true,
  ...props
}) {
  const content = children || text;

  const baseStyles = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold",
    "cursor-pointer select-none transition-all duration-300 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
    "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    variant === "primary" && [
      "bg-[var(--color-primary)] text-white shadow-sm hover:shadow-md",
      "hover:bg-[var(--color-primary-hover)]",
    ],
    variant === "outline" && [
      "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]",
      "hover:border-[var(--color-primary)] hover:text-white",
    ],
    className
  );

  const innerContent = (
    <>
      <span className="relative z-[1] transition-transform duration-300 ease-out group-hover:-translate-x-1">
        {content}
      </span>

      {showArrow && (
        <ArrowRight
          size={16}
          className="relative z-[1] -ml-1 -translate-x-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
        />
      )}

      {/* Expanding flow fill effect */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full",
          "opacity-0 transition-all duration-500 ease-out group-hover:h-[600px] group-hover:w-[600px] group-hover:opacity-100",
          variant === "primary" ? "bg-[var(--color-primary-hover)]" : "bg-[var(--color-primary)]"
        )}
      />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseStyles} onClick={onClick} {...props}>
        {innerContent}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseStyles} onClick={onClick} {...props}>
        {innerContent}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={baseStyles}
      onClick={onClick}
      {...props}
    >
      {innerContent}
    </button>
  );
}