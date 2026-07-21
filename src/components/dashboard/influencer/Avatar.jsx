import React from "react";

export default function Avatar({ name, size = 56 }) {
  const initial = name?.trim()?.[0]?.toUpperCase() || "?";
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
        fontSize: size * 0.4,
      }}
    >
      {initial}
    </div>
  );
}