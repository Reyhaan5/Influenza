import React from "react";
import { Play, Star } from "lucide-react";
import Avatar from "../dashboard/influencer/Avatar";
import { API_ORIGIN } from "../../config/api";

export default function GalleryCard({ item, onOpen }) {
  const mediaSrc = item.mediaUrl?.startsWith("http")
    ? item.mediaUrl
    : `${API_ORIGIN}${item.mediaUrl}`;

  return (
    <button
      onClick={() => onOpen(item)}
      className="
        group
        relative
        flex
        w-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        text-left
        shadow-[var(--shadow-card)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-background)]">
        {item.mediaType === "video" ? (
          <video
            src={mediaSrc}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={mediaSrc}
            alt={item.caption || item.handle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {item.mediaType === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-white/85
                shadow-lg
                backdrop-blur-sm
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              <Play
                size={18}
                className="ml-0.5 fill-[var(--color-text)] text-[var(--color-text)]"
              />
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/55 py-1 pl-1 pr-3 backdrop-blur-sm">
          <Avatar name={item.handle || item.influencerName} size={24} />
          <span className="text-xs font-semibold text-white">
            {item.handle || item.influencerName}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--color-text)]">
            {item.handle || item.influencerName}
          </p>
          {item.platform && (
            <p className="text-xs text-[var(--color-text-light)]">{item.platform}</p>
          )}
        </div>

        {item.rating && (
          <span className="flex flex-shrink-0 items-center gap-1 text-xs font-bold text-[var(--color-text)]">
            <Star size={13} className="fill-[var(--color-warning)] text-[var(--color-warning)]" />
            {item.rating}
          </span>
        )}
      </div>
    </button>
  );
}
