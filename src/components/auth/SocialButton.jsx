import React from "react";

export default function SocialButton({ icon, children, ...props }) {
  // Consumers may pass either an already-created element (`<Google />`) or
  // a component reference (`Google`). Render component references instead of
  // placing their forwardRef object directly in the children tree.
  const iconNode = React.isValidElement(icon)
    ? icon
    : icon && (typeof icon === "function" || icon.$$typeof)
      ? React.createElement(icon, { "aria-hidden": true, size: 18 })
      : icon;

  return (
    <button
      type="button"
      className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 min-h-[3rem] text-sm font-semibold text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl transition-all duration-200 hover:bg-[var(--color-background)] hover:border-[var(--color-primary)] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
      {...props}
    >
      {iconNode && <span className="flex-shrink-0">{iconNode}</span>}
      <span className="text-[var(--color-text)]">{children}</span>
    </button>
  );
}
