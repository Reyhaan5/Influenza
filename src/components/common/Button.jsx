const variants = {
    primary:
      "bg-[#8B5FBF] text-white hover:bg-[#61398F] shadow-md hover:shadow-lg",
  
    secondary:
      "bg-white text-[#4A4A4A] border border-[#D6C6E1] hover:bg-[#F5F3F7]",
  
    outline:
      "border border-[#8B5FBF] text-[#8B5FBF] hover:bg-[#8B5FBF] hover:text-white",
  
    ghost:
      "text-[#4A4A4A] hover:text-[#8B5FBF]",
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