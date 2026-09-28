import React from "react";
import { X, Play } from "lucide-react";

function CloseButton({ onClose, className = "" }) {
  return (
    <button onClick={onClose} className={`p-2 rounded-full text-white cursor-pointer ${className}`}>
      <X size={20} />
    </button>
  );
}

export function FullGalleryModal({ isOpen, onClose, creatorName, portfolio = [], onSelectMedia }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-4 sm:p-8">
      <div className="flex items-center justify-between text-white mb-6">
        <h3 className="font-bold text-lg">
          {creatorName}'s Portfolio ({portfolio.length})
        </h3>
        <CloseButton onClose={onClose} className="bg-white/10 hover:bg-white/20" />
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {portfolio.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectMedia(item)}
            className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-800 cursor-pointer group"
          >
            <img
              src={item.mediaUrl}
              alt={item.caption || "Photo"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            {item.mediaType === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play size={24} className="fill-white text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MediaLightboxModal({ media, onClose }) {
  if (!media) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl max-h-[85vh] w-full rounded-2xl overflow-hidden bg-black flex flex-col items-center"
      >
        <CloseButton onClose={onClose} className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black" />

        {media.mediaType === "video" || media.mediaUrl?.endsWith(".mp4") ? (
          <video src={media.mediaUrl} controls autoPlay className="max-h-[75vh] w-auto max-w-full rounded-2xl" />
        ) : (
          <img src={media.mediaUrl} alt={media.caption || "Preview"} className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl" />
        )}

        {media.caption && <p className="p-4 text-xs text-white text-center">{media.caption}</p>}
      </div>
    </div>
  );
}
