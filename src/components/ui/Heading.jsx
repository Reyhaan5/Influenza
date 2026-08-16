import React from "react";

const LEVEL_STYLES = {
  1: "text-4xl md:text-5xl font-extrabold leading-tight",
  2: "text-3xl md:text-4xl font-bold leading-tight",
  3: "text-xl font-bold leading-snug",
};

function Heading({
  level = 2,
  as,
  className = "",
  children,
  ...props
}) {
  const Tag = as || `h${level}`;
  const styles = LEVEL_STYLES[level] || LEVEL_STYLES[2];

  return (
    <Tag
      className={`${styles} text-[var(--color-text)] ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default Heading;