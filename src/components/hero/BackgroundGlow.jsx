function BackgroundGlow() {
    return (
      <>
        {/* Left Glow */}
        <div
          className="absolute -top-20 -left-24 w-96 h-96 rounded-full blur-[120px] opacity-30"
          style={{ backgroundColor: "#8B5FBF" }}
        />
  
        {/* Right Glow */}
        <div
          className="absolute top-40 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-25"
          style={{ backgroundColor: "#61398F" }}
        />
      </>
    );
  }
  
  export default BackgroundGlow;