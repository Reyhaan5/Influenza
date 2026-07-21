function SectionHeading({
    eyebrow,
    title,
    subtitle,
    center = true,
  }) {
    return (
      <div
        className={`max-w-3xl ${
          center ? "mx-auto text-center" : ""
        }`}
      >
        {eyebrow && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#8B5FBF]">
            {eyebrow}
          </p>
        )}
  
        <h2 className="text-4xl font-bold leading-tight text-[var(--color-text)] lg:text-5xl">
          {title}
        </h2>
  
        {subtitle && (
          <p className="mt-6 text-lg leading-8 text-[var(--color-text-light)]">
            {subtitle}
          </p>
        )}
      </div>
    );
  }
  
  export default SectionHeading;