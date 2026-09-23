import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Star,
  Eye,
  Heart,
  ExternalLink,
  ShieldCheck,
  Flame,
  Volume2,
  VolumeX,
} from "lucide-react";
import Avatar from "../dashboard/influencer/Avatar";
import { API_ORIGIN } from "../../config/api";

export default function GalleryCard({ item, onOpen, isSaved, onToggleSave }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [saved, setSaved] = useState(isSaved || false);
  const videoRef = useRef(null);

  const mediaSrc = item.mediaUrl?.startsWith("http")
    ? item.mediaUrl
    : `${API_ORIGIN}${item.mediaUrl}`;

  const isVideo = item.mediaType === "video" || /\.(mp4|mov|webm|m4v)$/i.test(item.mediaUrl || "");

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isVideo && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay policy prevented playback
          });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    setSaved((prev) => !prev);
    if (onToggleSave) {
      onToggleSave(item);
    }
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const getPlatformBadge = (platform) => {
    const p = (platform || "Instagram").toLowerCase();
    if (p.includes("youtube")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> YouTube
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-pink-500" /> Instagram
      </span>
    );
  };

  const creatorProfileLink = item.influencerId
    ? `/creators/${item.influencerId}`
    : `/creators/${item.handle || "creator"}`;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        border-zinc-200/90
        bg-white
        text-left
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:border-zinc-400
        hover:shadow-2xl
        cursor-pointer
      "
    >
      {/* Media Box */}
      <div
        className={`
          relative
          w-full
          overflow-hidden
          bg-zinc-950
          ${item.aspectRatio === "vertical" ? "aspect-[9/16]" : "aspect-[4/5]"}
        `}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            src={mediaSrc}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            muted={isMuted}
            playsInline
            loop
            preload="metadata"
          />
        ) : (
          <img
            src={mediaSrc}
            alt={item.caption || item.handle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80";
            }}
          />
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            {getPlatformBadge(item.platform)}
            {item.highlighted && (
              <span className="rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-xs backdrop-blur-md">
                Featured
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {isVideo && isPlaying && (
              <button
                type="button"
                onClick={handleMuteToggle}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/90 transition shadow-xs"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
            )}

            {isVideo && item.duration && (
              <span className="rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-mono font-bold text-white backdrop-blur-md shadow-xs">
                {item.duration}
              </span>
            )}

            <button
              type="button"
              onClick={handleSaveClick}
              className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition shadow-xs ${
                saved
                  ? "bg-rose-500 text-white"
                  : "bg-black/50 text-white hover:bg-black/80"
              }`}
              title={saved ? "Saved" : "Save to moodboard"}
            >
              <Heart size={13} className={saved ? "fill-white" : ""} />
            </button>
          </div>
        </div>

        {/* Video Play indicator overlay if not playing */}
        {isVideo && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-white/90
                shadow-xl
                backdrop-blur-md
                transition-all
                duration-300
                group-hover:scale-115
                group-hover:bg-white
              "
            >
              <Play size={20} className="ml-1 fill-zinc-950 text-zinc-950" />
            </span>
          </div>
        )}

        {/* Gradient Overlay for bottom text readability */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        {/* Bottom Floating Creator & Tag bar inside Media */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Avatar
                name={item.influencerName || item.handle}
                avatarUrl={item.avatar}
                size={28}
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white flex items-center gap-1 drop-shadow-sm">
                  {item.influencerName || `@${item.handle}`}
                  {item.verified && (
                    <ShieldCheck size={14} className="text-sky-400 shrink-0 inline" />
                  )}
                </p>
                <p className="truncate text-[11px] font-medium text-zinc-300">
                  @{item.handle}
                </p>
              </div>
            </div>
          </div>

          {item.rating && (
            <div className="flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-md text-white shrink-0 border border-white/10">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold font-mono">
                {Number(item.rating).toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Info Details */}
      <div className="flex flex-col gap-2.5 p-3.5 bg-white">
        {/* Caption */}
        {item.caption && (
          <p className="line-clamp-2 text-xs font-medium text-zinc-700 leading-relaxed">
            {item.caption}
          </p>
        )}

        {/* Tags / Categories */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {item.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 border border-zinc-200/60"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="text-[10px] font-semibold text-zinc-400">
                +{item.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer Metrics & Actions */}
        <div className="mt-1 flex items-center justify-between border-t border-zinc-100 pt-2.5 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            {item.views && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-600">
                <Eye size={13} className="text-zinc-400" />
                {item.views >= 1000 ? `${(item.views / 1000).toFixed(1)}k` : item.views}
              </span>
            )}

            {item.engagementRate && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
                <Flame size={12} className="text-amber-500" />
                {item.engagementRate}
              </span>
            )}
          </div>

          <Link
            to={creatorProfileLink}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[11px] font-bold text-zinc-900 hover:text-black hover:underline"
          >
            <span>Profile</span>
            <ExternalLink size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}

