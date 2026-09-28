import React from "react";
import { Link } from "react-router-dom";
import {
  Heart, Star, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2,
  ChevronLeft, ChevronRight, Sparkles, Share2, Check, ShieldCheck, MapPin, Tag, ArrowUpRight, ExternalLink
} from "lucide-react";
import Avatar from "../dashboard/influencer/Avatar";
import { API_ORIGIN } from "../../config/api";

export const getMediaSrc = (item) =>
  item?.mediaUrl?.startsWith("http") ? item.mediaUrl : `${API_ORIGIN}${item?.mediaUrl || ""}`;

export const checkIsVideo = (item) =>
  item?.mediaType === "video" || /\.(mp4|mov|webm|m4v)$/i.test(item?.mediaUrl || "");

export const getCreatorProfileLink = (item) =>
  item?.influencerId ? `/creators/${item.influencerId}` : `/creators/${item?.handle || "creator"}`;

export const formatCount = (num, fallback = "0") => {
  if (!num) return fallback;
  return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : String(num);
};

export const formatMediaTime = (secs) => {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

export function PlatformBadge({ platform, className = "" }) {
  const isYt = (platform || "Instagram").toLowerCase().includes("youtube");
  return (
    <span className={`inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${isYt ? "bg-red-500" : "bg-pink-500"}`} />
      {isYt ? "YouTube" : "Instagram"}
    </span>
  );
}

export function SaveHeartButton({ saved, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition shadow-xs cursor-pointer ${
        saved ? "bg-rose-500 text-white" : "bg-black/50 text-white hover:bg-black/80"
      } ${className}`}
      title={saved ? "Saved" : "Save to moodboard"}
    >
      <Heart size={13} className={saved ? "fill-white" : ""} />
    </button>
  );
}

export function StatBox({ label, value, colorClass = "text-zinc-900" }) {
  return (
    <div className="rounded-xl bg-zinc-50 p-2.5 border border-zinc-200/60 text-center">
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-extrabold mt-0.5 ${colorClass}`}>{value}</p>
    </div>
  );
}

export function LightboxNavArrow({ dir = "left", onClick }) {
  const isLeft = dir === "left";
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={`${isLeft ? "Previous" : "Next"} item`}
      className={`absolute ${isLeft ? "left-3 md:left-6" : "right-3 md:right-6"} top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 hover:scale-110 shadow-lg cursor-pointer`}
    >
      {isLeft ? <ChevronLeft size={26} /> : <ChevronRight size={26} />}
    </button>
  );
}

export function LightboxVideoPlayer({
  isVideo, mediaSrc, item, videoRef, theaterRef, isPlaying, isMuted,
  isFullscreen, progress, currentTime, duration, onTogglePlay, onToggleMute,
  onToggleFullscreen, onTimeUpdate, onSeek
}) {
  return (
    <div ref={theaterRef} className="relative flex-1 bg-zinc-950 flex items-center justify-center overflow-hidden min-h-[300px] lg:min-h-[580px]">
      {isVideo ? (
        <div className="relative h-full w-full flex items-center justify-center group/video">
          <video
            ref={videoRef}
            src={mediaSrc}
            className="max-h-[82vh] w-full object-contain cursor-pointer"
            onClick={onTogglePlay}
            onTimeUpdate={onTimeUpdate}
            playsInline
            autoPlay
            loop
            muted={isMuted}
          />
          {!isPlaying && (
            <button
              type="button"
              onClick={onTogglePlay}
              className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-2xl backdrop-blur-md transition hover:scale-110 cursor-pointer"
            >
              <Play size={26} className="ml-1 fill-zinc-950 text-zinc-950" />
            </button>
          )}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-black/70 flex flex-col gap-2 transition-opacity duration-300">
            <div onClick={onSeek} className="relative h-1.5 w-full rounded-full bg-white/30 cursor-pointer hover:h-2 transition-all">
              <div className="absolute top-0 left-0 h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center justify-between text-white text-xs font-mono font-medium">
              <div className="flex items-center gap-3">
                <button type="button" onClick={onTogglePlay} className="p-1 hover:text-zinc-300 transition cursor-pointer" title={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? <Pause size={17} /> : <Play size={17} />}
                </button>
                <button type="button" onClick={onToggleMute} className="p-1 hover:text-zinc-300 transition cursor-pointer" title={isMuted ? "Unmute" : "Mute"}>
                  {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                </button>
                <span>{formatMediaTime(currentTime)} / {formatMediaTime(duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">{item.platform || "Reel"}</span>
                <button type="button" onClick={onToggleFullscreen} className="p-1 hover:text-zinc-300 transition cursor-pointer" title="Toggle Fullscreen">
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-full w-full flex items-center justify-center p-4">
          <img src={mediaSrc} alt={item.caption || item.handle} className="max-h-[82vh] w-full object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}

export function LightboxSidebar({ item, copied, saved, onShare, onToggleSave, onClose, onNavigate, creatorProfileLink }) {
  const stats = [
    { label: "Views", value: formatCount(item.views, "42.5k") },
    { label: "Engagement", value: item.engagementRate || "5.4%", colorClass: "text-amber-600" },
    { label: "Reach", value: formatCount(item.followers, "85k") },
  ];

  return (
    <div className="w-full lg:w-[380px] xl:w-[410px] flex flex-col justify-between bg-white p-6 overflow-y-auto max-h-[85vh]">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800 border border-zinc-200">
            <Sparkles size={13} className="text-zinc-700" />
            {item.source === "collaboration" ? "Verified Campaign" : "Creator Showcase"}
          </span>
          <div className="flex items-center gap-2 pr-8 lg:pr-0">
            <button type="button" onClick={onShare} className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition cursor-pointer" title="Share link">
              {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            </button>
            <button type="button" onClick={onToggleSave} className={`flex h-8 w-8 items-center justify-center rounded-full border transition cursor-pointer ${saved ? "border-rose-200 bg-rose-50 text-rose-600" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`} title={saved ? "Saved" : "Save item"}>
              <Heart size={14} className={saved ? "fill-rose-600" : ""} />
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-50/80 border border-zinc-200/80">
          <Avatar name={item.influencerName || item.handle} avatarUrl={item.avatar} size={48} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate font-extrabold text-sm text-zinc-950">{item.influencerName || `@${item.handle}`}</h3>
              {item.verified && <ShieldCheck size={16} className="text-sky-500 shrink-0" />}
            </div>
            <p className="text-xs font-semibold text-zinc-500">@{item.handle}</p>
            <div className="mt-1 flex items-center gap-2 text-xs">
              {item.locality && <span className="flex items-center gap-0.5 text-[11px] text-zinc-400 truncate"><MapPin size={11} /> {item.locality}</span>}
              {item.rating && (
                <span className="flex items-center gap-1 font-bold text-zinc-800 text-[11px] ml-auto shrink-0">
                  <Star size={12} className="fill-amber-400 text-amber-400" />{Number(item.rating).toFixed(1)}
                  {item.reviewsCount && <span className="text-zinc-400 font-normal">({item.reviewsCount})</span>}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {stats.map((s) => <StatBox key={s.label} {...s} />)}
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Deliverable Overview</p>
          <p className="text-xs font-medium text-zinc-800 leading-relaxed bg-zinc-50/50 p-3 rounded-xl border border-zinc-100">{item.caption || "Authentic high-definition content produced for social media."}</p>
        </div>

        {item.tags?.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1"><Tag size={11} /> Niche & Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag, idx) => (
                <span key={idx} className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 border border-zinc-200/60">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-5 mt-5 border-t border-zinc-100 space-y-2.5">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-semibold text-zinc-500">Starting Rate:</span>
          <span className="text-sm font-extrabold text-zinc-950">${item.basePrice || 150} <span className="text-xs text-zinc-400 font-normal">/ deliverable</span></span>
        </div>
        <Link to={creatorProfileLink} onClick={onClose} className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-950 hover:bg-black py-3 px-4 text-xs font-bold text-white shadow-sm transition active:scale-98">
          <span>View Full Creator Profile</span><ArrowUpRight size={14} />
        </Link>
        <button type="button" onClick={() => { onClose(); onNavigate(`/creators/${item.influencerId || item.handle}`); }} className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-300 hover:bg-zinc-50 py-2.5 px-4 text-xs font-bold text-zinc-800 transition cursor-pointer">
          <span>Collaborate / Request Brief</span><ExternalLink size={13} />
        </button>
      </div>
    </div>
  );
}
