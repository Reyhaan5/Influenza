function StatusChip({
    label,
    color = "green",
    className = "",
  }) {
    const colors = {
      green: {
        dot: "bg-green-500",
        text: "text-green-700",
        bg: "bg-green-50",
      },
  
      purple: {
        dot: "bg-[#8B5FBF]",
        text: "text-[#8B5FBF]",
        bg: "bg-[#F3EDFA]",
      },
  
      orange: {
        dot: "bg-orange-500",
        text: "text-orange-700",
        bg: "bg-orange-50",
      },
  
      red: {
        dot: "bg-red-500",
        text: "text-red-700",
        bg: "bg-red-50",
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
          border-white/60
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