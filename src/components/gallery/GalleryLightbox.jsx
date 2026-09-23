import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Star,
  MapPin,
  ShieldCheck,
  Share2,
  Heart,
  ExternalLink,
  Flame,
  Eye,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Check,
  Tag,
} from "lucide-react";
import Avatar from "../dashboard/influencer/Avatar";
import { API_ORIGIN } from "../../config/api";

export default function GalleryLightbox({
  item,
  items = [],
  onClose,
  onSelectItem,
}) {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const videoRef = useRef(null);
  const theaterContainerRef = useRef(null);

  const isVideo =
    item?.mediaType === "video" || /\.(mp4|mov|webm|m4v)$/i.test(item?.mediaUrl || "");

  const mediaSrc = item?.mediaUrl?.startsWith("http")
    ? item.mediaUrl
    : `${API_ORIGIN}${item?.mediaUrl}`;

  // Current item index in items list
  const currentIndex = items.findIndex((i) => i.id === item?.id);

  const handlePrev = useCallback(() => {
    if (items.length > 1 && onSelectItem) {
      const prevIdx = (currentIndex - 1 + items.length) % items.length;
      onSelectItem(items[prevIdx]);
    }
  }, [items, currentIndex, onSelectItem]);

  const handleNext = useCallback(() => {
    if (items.length > 1 && onSelectItem) {
      const nextIdx = (currentIndex + 1) % items.length;
      onSelectItem(items[nextIdx]);
    }
  }, [items, currentIndex, onSelectItem]);

  // Keyboard navigation
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === " " && isVideo) {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, handlePrev, handleNext, isVideo, onClose]);

  // Reset video state on item change
  useEffect(() => {
    setIsPlaying(true);
    setProgress(0);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [item?.id]);

  if (!item) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!theaterContainerRef.current) return;
    if (!document.fullscreenElement) {
      theaterContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 1;
      setCurrentTime(current);
      setDuration(total);
      setProgress((current / total) * 100);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current && duration) {
      videoRef.current.currentTime = pos * duration;
    }
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/content-gallery?item=${item.id}`;
    if (navigator.share) {
      navigator.share({
        title: `${item.influencerName || item.handle}'s Content on Influenza`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const creatorProfileLink = item.influencerId
    ? `/creators/${item.influencerId}`
    : `/creators/${item.handle || "creator"}`;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-2 sm:p-4 md:p-6 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      {/* Navigation Arrows for desktop */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous item"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 hover:scale-110 shadow-lg cursor-pointer"
          >
            <ChevronLeft size={26} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next item"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 hover:scale-110 shadow-lg cursor-pointer"
          >
            <ChevronRight size={26} />
          </button>
        </>
      )}

      {/* Main Split-Screen Modal Container */}
      <div
        className="relative flex flex-col lg:flex-row w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-zinc-800/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/90 cursor-pointer shadow-md"
        >
          <X size={18} />
        </button>

        {/* LEFT PANE: Media Theater Player */}
        <div
          ref={theaterContainerRef}
          className="relative flex-1 bg-zinc-950 flex items-center justify-center overflow-hidden min-h-[300px] lg:min-h-[580px]"
        >
          {isVideo ? (
            <div className="relative h-full w-full flex items-center justify-center group/video">
              <video
                ref={videoRef}
                src={mediaSrc}
                className="max-h-[82vh] w-full object-contain cursor-pointer"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                playsInline
                autoPlay
                loop
                muted={isMuted}
              />

              {/* Center Play/Pause indicator on click / paused */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-2xl backdrop-blur-md transition hover:scale-110"
                >
                  <Play size={26} className="ml-1 fill-zinc-950 text-zinc-950" />
                </button>
              )}

              {/* Custom Video Control Bar */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-black/70 flex flex-col gap-2 transition-opacity duration-300">
                {/* Seek Bar */}
                <div
                  onClick={handleSeek}
                  className="relative h-1.5 w-full rounded-full bg-white/30 cursor-pointer hover:h-2 transition-all"
                >
                  <div
                    className="absolute top-0 left-0 h-full rounded-full bg-white"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Control Icons */}
                <div className="flex items-center justify-between text-white text-xs font-mono font-medium">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-1 hover:text-zinc-300 transition"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause size={17} /> : <Play size={17} />}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1 hover:text-zinc-300 transition"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                    </button>

                    <span>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {item.platform || "Reel"}
                    </span>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="p-1 hover:text-zinc-300 transition"
                      title="Toggle Fullscreen"
                    >
                      {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-full w-full flex items-center justify-center p-4">
              <img
                src={mediaSrc}
                alt={item.caption || item.handle}
                className="max-h-[82vh] w-full object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        {/* RIGHT PANE: Creator Intelligence & Actions Panel */}
        <div className="w-full lg:w-[380px] xl:w-[410px] flex flex-col justify-between bg-white p-6 overflow-y-auto max-h-[85vh]">
          <div className="space-y-5">
            {/* Top Badge & Platform Strip */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800 border border-zinc-200">
                <Sparkles size={13} className="text-zinc-700" />
                {item.source === "collaboration" ? "Verified Campaign" : "Creator Showcase"}
              </span>

              <div className="flex items-center gap-2 pr-8 lg:pr-0">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition"
                  title="Share link"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                </button>

                <button
                  type="button"
                  onClick={() => setSaved(!saved)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                    saved
                      ? "border-rose-200 bg-rose-50 text-rose-600"
                      : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                  title={saved ? "Saved" : "Save item"}
                >
                  <Heart size={14} className={saved ? "fill-rose-600" : ""} />
                </button>
              </div>
            </div>

            {/* Creator Profile Header */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-50/80 border border-zinc-200/80">
              <Avatar
                name={item.influencerName || item.handle}
                avatarUrl={item.avatar}
                size={48}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate font-extrabold text-sm text-zinc-950">
                    {item.influencerName || `@${item.handle}`}
                  </h3>
                  {item.verified && (
                    <ShieldCheck size={16} className="text-sky-500 shrink-0" />
                  )}
                </div>

                <p className="text-xs font-semibold text-zinc-500">
                  @{item.handle}
                </p>

                <div className="mt-1 flex items-center gap-2 text-xs">
                  {item.locality && (
                    <span className="flex items-center gap-0.5 text-[11px] text-zinc-400 truncate">
                      <MapPin size={11} /> {item.locality}
                    </span>
                  )}
                  {item.rating && (
                    <span className="flex items-center gap-1 font-bold text-zinc-800 text-[11px] ml-auto shrink-0">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      {Number(item.rating).toFixed(1)}
                      {item.reviewsCount && (
                        <span className="text-zinc-400 font-normal">
                          ({item.reviewsCount})
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Analytics Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-zinc-50 p-2.5 border border-zinc-200/60 text-center">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Views
                </p>
                <p className="text-sm font-extrabold text-zinc-900 mt-0.5">
                  {item.views
                    ? item.views >= 1000
                      ? `${(item.views / 1000).toFixed(1)}k`
                      : item.views
                    : "42.5k"}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-50 p-2.5 border border-zinc-200/60 text-center">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Engagement
                </p>
                <p className="text-sm font-extrabold text-amber-600 mt-0.5">
                  {item.engagementRate || "5.4%"}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-50 p-2.5 border border-zinc-200/60 text-center">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Reach
                </p>
                <p className="text-sm font-extrabold text-zinc-900 mt-0.5">
                  {item.followers
                    ? item.followers >= 1000
                      ? `${(item.followers / 1000).toFixed(0)}k`
                      : item.followers
                    : "85k"}
                </p>
              </div>
            </div>

            {/* Caption & Content Description */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Deliverable Overview
              </p>
              <p className="text-xs font-medium text-zinc-800 leading-relaxed bg-zinc-50/50 p-3 rounded-xl border border-zinc-100">
                {item.caption || "Authentic high-definition content produced for social media."}
              </p>
            </div>

            {/* Category / Taxonomy Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Tag size={11} /> Niche & Keywords
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 border border-zinc-200/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Call to Actions */}
          <div className="pt-5 mt-5 border-t border-zinc-100 space-y-2.5">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-zinc-500">Starting Rate:</span>
              <span className="text-sm font-extrabold text-zinc-950">
                ${item.basePrice || 150} <span className="text-xs text-zinc-400 font-normal">/ deliverable</span>
              </span>
            </div>

            <Link
              to={creatorProfileLink}
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-950 hover:bg-black py-3 px-4 text-xs font-bold text-white shadow-sm transition active:scale-98"
            >
              <span>View Full Creator Profile</span>
              <ArrowUpRight size={14} />
            </Link>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`/creators/${item.influencerId || item.handle}`);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-300 hover:bg-zinc-50 py-2.5 px-4 text-xs font-bold text-zinc-800 transition"
            >
              <span>Collaborate / Request Brief</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

