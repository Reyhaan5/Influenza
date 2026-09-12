import React from "react";
import { Play } from "lucide-react";

/**
 * One 9:16 tile in the hero content grid.
 * Pass `videoSrc` once you have a real clip — it autoplays muted/looped.
 * Until then it falls back to a niche-tinted gradient placeholder so the
 * layout and motion read correctly without needing real assets yet.
 */
export default function HeroVideoTile({ video, className = "" }) {
  const { label, icon: Icon, handle, stat, gradient, videoSrc, span } = video;

  const heightClass = span === "tall" ? "h-72 sm:h-80" : "h-56 sm:h-64";

  return (
    <div
      className={`
        group relative flex-shrink-0 w-40 sm:w-44 ${heightClass}
        overflow-hidden rounded-[var(--radius-lg)]
        border border-[var(--color-border)]
        shadow-[var(--shadow-card)]
        transition-transform duration-500
        hover:-translate-y-1.5
        ${className}
      `}
    >
      {videoSrc ? (
        <video
          src={videoSrc}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{ background: gradient }}
        />
      )}

      {/* Darken bottom for legible overlay text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Live pulse chip */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-danger)] opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-danger)]" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wide text-white">Live</span>
      </div>

      {/* Play affordance */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <Play size={16} className="ml-0.5 fill-[var(--color-text)] text-[var(--color-text)]" />
        </span>
      </div>

      {/* Bottom info */}
      <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-white">
          <Icon size={13} />
          <span className="text-xs font-bold">{label}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-white/85 truncate">{handle}</span>
          <span className="flex-shrink-0 text-[10px] font-bold text-white bg-white/20 rounded-full px-2 py-0.5">
            {stat}
          </span>
        </div>
      </div>
    </div>
  );
}
