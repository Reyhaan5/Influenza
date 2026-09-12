import React, { useState } from "react";

export default function Avatar({ name, avatarUrl, avatar, size = 56, className = "" }) {
  const [imgError, setImgError] = useState(false);
  const src = avatarUrl || avatar;
  const initial = name?.trim()?.[0]?.toUpperCase() || "?";

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`rounded-full object-cover flex-shrink-0 shadow-sm border border-black/5 ${className}`}
        style={{
          width: size,
          height: size,
        }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 select-none ${className}`}
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, var(--color-primary, #FA2B56), var(--color-primary-hover, #E0244B))",
        fontSize: size * 0.4,
      }}
    >
      {initial}
    </div>
  );
}