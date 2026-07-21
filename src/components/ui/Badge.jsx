function Badge({
    children,
    variant = "primary",
    className = "",
  }) {
    const variants = {
      primary:
        "bg-gradient-to-r from-[#8B5FBF]/15 to-[#61398F]/15 text-[#61398F] border-[#8B5FBF]/20",
  
      success:
        "bg-green-100 text-green-700 border-green-200",
  
      warning:
        "bg-yellow-100 text-yellow-700 border-yellow-200",
  
      danger:
        "bg-red-100 text-red-700 border-red-200",
  
      white:
        "bg-white/20 text-white border-white/20",
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