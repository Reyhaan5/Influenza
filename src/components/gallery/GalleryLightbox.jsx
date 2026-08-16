import React from "react";
import { X } from "lucide-react";
import { API_ORIGIN } from "../../config/api";

export default function GalleryLightbox({ item, onClose }) {
  if (!item) return null;

  const mediaSrc = item.mediaUrl?.startsWith("http")
    ? item.mediaUrl
    : `${API_ORIGIN}${item.mediaUrl}`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[var(--color-surface)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
        >
          <X size={18} />
        </button>

        {item.mediaType === "video" ? (
          <video
            src={mediaSrc}
            className="max-h-[75vh] w-full bg-black"
            controls
            autoPlay
            playsInline
          />
        ) : (
          <img
            src={mediaSrc}
            alt={item.caption || item.handle}
            className="max-h-[75vh] w-full bg-black object-contain"
          />
        )}

        <div className="p-5">
          <p className="font-bold text-[var(--color-text)]">
            {item.handle || item.influencerName}
          </p>
          {item.caption && (
            <p className="mt-1 text-sm text-[var(--color-text-light)]">{item.caption}</p>
          )}
        </div>
      </div>
    </div>
  );
}
