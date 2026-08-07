function Badge({
    children,
    variant = "primary",
    className = "",
  }) {
    const variants = {
      primary:
        "bg-gradient-to-r from-[var(--color-primary)]/15 to-[var(--color-primary-hover)]/15 text-[var(--color-primary-hover)] border-[var(--color-primary)]/20",
  
      success:
        "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
  
      warning:
        "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20",
  
      danger:
        "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20",
  
      white:
        "bg-[var(--color-surface)]/20 text-white border-[var(--color-surface)]/20",
    };
  
    return (
      <span
        className={`
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          px-5
          py-2.5
          text-sm
          font-semibold
          backdrop-blur-xl
          shadow-sm
          transition-all
          duration-300
          hover:scale-105
          hover:shadow-md
          ${variants[variant]}
          ${className}
        `}
      >
        {children}
      </span>
    );
  }
  
  export default Badge;