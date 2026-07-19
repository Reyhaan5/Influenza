import React from 'react';

const variants = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-[var(--shadow-card)] hover:shadow-lg",

  secondary:
    "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-background)]",

  outline:
    "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white",

  ghost:
    "text-[var(--color-text)] hover:text-[var(--color-primary)]",
};

function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      className={`
        inline-flex
        items-center
        justify-center
        rounded-xl
        px-6
        py-3
        font-semibold
        transition-all
        duration-300
        hover:scale-[1.02]
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;