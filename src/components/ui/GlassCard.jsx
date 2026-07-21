function GlassCard({
    children,
    className = "",
    hover = true,
  }) {
    return (
      <div
        className={`
          group
          relative
          overflow-hidden
          rounded-[36px]
          border
          border-white/60
          bg-white/85
          backdrop-blur-2xl
  
          shadow-[0_15px_50px_rgba(99,58,143,0.12)]
  
          transition-all
          duration-500
  
          ${
            hover
              ? "hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(99,58,143,0.18)]"
              : ""
          }
  
          ${className}
        `}
      >
        {/* Purple Glow */}
        <div
          className="
            absolute
            -top-28
            -right-24
            h-72
            w-72
            rounded-full
            bg-[#8B5FBF]/15
            blur-3xl
          "
        />
  
        {/* Secondary Glow */}
        <div
          className="
            absolute
            -bottom-32
            -left-20
            h-72
            w-72
            rounded-full
            bg-[#D6C6E1]/30
            blur-3xl
          "
        />
  
        {/* Soft Gradient */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-white/70
            via-transparent
            to-[#F5F3F7]
            opacity-80
          "
        />
  
        {/* Shine Effect */}
        <div
          className="
            absolute
            -left-1/2
            top-0
            h-full
            w-1/2
            rotate-12
            bg-white/20
            blur-2xl
            transition-all
            duration-700
            group-hover:left-full
          "
        />
  
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
  
  export default GlassCard;