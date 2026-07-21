function ProgressBar({
    label,
    value,
    color = "primary",
    className = "",
  }) {
    const colors = {
      primary:
        "bg-gradient-to-r from-[#8B5FBF] to-[#61398F]",
  
      green:
        "bg-gradient-to-r from-green-400 to-green-600",
  
      orange:
        "bg-gradient-to-r from-orange-400 to-orange-600",
  
      red:
        "bg-gradient-to-r from-red-400 to-red-600",
    };
  
    return (
      <div className={`w-full ${className}`}>
        {/* Label */}
        <div className="mb-3 flex items-center justify-between">
  
          <span className="text-base font-semibold text-[var(--color-text)]">
            {label}
          </span>
  
          <span className="rounded-full bg-[#F5F3F7] px-3 py-1 text-sm font-bold text-[var(--color-primary)]">
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
            bg-[#ECE7F4]
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