function ProgressBar({
    label,
    value,
    color = "primary",
    className = "",
  }) {
    const colors = {
      primary:
        "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)]",
  
      green:
        "bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success)]",
  
      orange:
        "bg-gradient-to-r from-[var(--color-warning)] to-[var(--color-warning)]",
  
      red:
        "bg-gradient-to-r from-[var(--color-danger)] to-[var(--color-danger)]",
    };
  
    return (
      <div className={`w-full ${className}`}>
        {/* Label */}
        <div className="mb-3 flex items-center justify-between">
  
          <span className="text-base font-semibold text-[var(--color-text)]">
            {label}
          </span>
  
          <span className="rounded-full bg-[var(--color-background)] px-3 py-1 text-sm font-bold text-[var(--color-primary)]">
            {value}%
          </span>
  
        </div>
  
        {/* Track */}
        <div
          className="
            relative
            h-4
            w-full
            overflow-hidden
            rounded-full
            bg-[var(--color-border)]/30
          "
        >
          {/* Progress */}
          <div
            className={`
              relative
              h-full
              rounded-full
              transition-all
              duration-1000
              ease-out
              ${colors[color]}
            `}
            style={{ width: `${value}%` }}
          >
            {/* Shine */}
            <div
              className="
                absolute
                inset-0
                bg-white/20
              "
            />
  
            {/* Moving Glow */}
            <div
              className="
                absolute
                right-0
                top-1/2
                h-6
                w-6
                -translate-y-1/2
                rounded-full
                bg-white/40
                blur-md
              "
            />
          </div>
        </div>
      </div>
    );
  }
  
  export default ProgressBar;