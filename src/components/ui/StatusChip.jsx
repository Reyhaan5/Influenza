function StatusChip({
    label,
    color = "green",
    className = "",
  }) {
    const colors = {
      green: {
        dot: "bg-[var(--color-success)]",
        text: "text-[var(--color-success)]",
        bg: "bg-[var(--color-success)]/10",
      },
  
      purple: {
        dot: "bg-[var(--color-primary)]",
        text: "text-[var(--color-primary)]",
        bg: "bg-[var(--color-primary)]/10",
      },
  
      orange: {
        dot: "bg-[var(--color-warning)]",
        text: "text-[var(--color-warning)]",
        bg: "bg-[var(--color-warning)]/10",
      },
  
      red: {
        dot: "bg-[var(--color-danger)]",
        text: "text-[var(--color-danger)]",
        bg: "bg-[var(--color-danger)]/10",
      },
    };
  
    const current = colors[color];
  
    return (
      <div
        className={`
          inline-flex
          items-center
          gap-3
          rounded-full
          border
          border-[var(--color-surface)]/60
          px-4
          py-2.5
          text-sm
          font-semibold
          backdrop-blur-xl
          shadow-sm
          transition-all
          duration-300
          hover:scale-105
          ${current.bg}
          ${current.text}
          ${className}
        `}
      >
        <span className="relative flex h-3 w-3">
          <span
            className={`
              absolute
              inline-flex
              h-full
              w-full
              animate-ping
              rounded-full
              opacity-60
              ${current.dot}
            `}
          />
  
          <span
            className={`
              relative
              inline-flex
              h-3
              w-3
              rounded-full
              ${current.dot}
            `}
          />
        </span>
  
        {label}
      </div>
    );
  }
  
  export default StatusChip;