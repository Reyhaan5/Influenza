import React from "react";

const GLOWS = [
  { cls: "-top-20 -left-24 w-96 h-96 blur-[120px] opacity-30", bg: "var(--color-primary)" },
  { cls: "top-40 -right-20 w-80 h-80 blur-[100px] opacity-25", bg: "var(--color-primary-hover)" },
];

export default function BackgroundGlow() {
  return (
    <>
      {GLOWS.map(({ cls, bg }, i) => (
        <div key={i} className={`absolute rounded-full ${cls}`} style={{ backgroundColor: bg }} />
      ))}
    </>
  );
}