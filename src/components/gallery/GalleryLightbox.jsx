import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import {
  getMediaSrc, checkIsVideo, getCreatorProfileLink,
  LightboxNavArrow, LightboxVideoPlayer, LightboxSidebar
} from "./GalleryShared";

export default function GalleryLightbox({ item, items = [], onClose, onSelectItem }) {
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

  const isVideo = checkIsVideo(item);
  const mediaSrc = getMediaSrc(item);
  const currentIndex = items.findIndex((i) => i.id === item?.id);

  const handlePrev = useCallback(() => {
    if (items.length > 1 && onSelectItem) onSelectItem(items[(currentIndex - 1 + items.length) % items.length]);
  }, [items, currentIndex, onSelectItem]);

  const handleNext = useCallback(() => {
    if (items.length > 1 && onSelectItem) onSelectItem(items[(currentIndex + 1) % items.length]);
  }, [items, currentIndex, onSelectItem]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
      else videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
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

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === " " && isVideo) { e.preventDefault(); togglePlay(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, handlePrev, handleNext, isVideo, onClose, isPlaying]);

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const total = videoRef.current.duration || 1;
      setCurrentTime(cur);
      setDuration(total);
      setProgress((cur / total) * 100);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current && duration) videoRef.current.currentTime = pos * duration;
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/content-gallery?item=${item.id}`;
    if (navigator.share) {
      navigator.share({ title: `${item.influencerName || item.handle}'s Content on Influenza`, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-2 sm:p-4 md:p-6 backdrop-blur-xl animate-fadeIn" onClick={onClose}>
      {items.length > 1 && (
        <>
          <LightboxNavArrow dir="left" onClick={handlePrev} />
          <LightboxNavArrow dir="right" onClick={handleNext} />
        </>
      )}

      <div className="relative flex flex-col lg:flex-row w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-zinc-800/40" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/90 cursor-pointer shadow-md">
          <X size={18} />
        </button>

        <LightboxVideoPlayer
          isVideo={isVideo}
          mediaSrc={mediaSrc}
          item={item}
          videoRef={videoRef}
          theaterRef={theaterContainerRef}
          isPlaying={isPlaying}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          progress={progress}
          currentTime={currentTime}
          duration={duration}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
          onTimeUpdate={handleTimeUpdate}
          onSeek={handleSeek}
        />

        <LightboxSidebar
          item={item}
          copied={copied}
          saved={saved}
          onShare={handleShare}
          onToggleSave={() => setSaved(!saved)}
          onClose={onClose}
          onNavigate={navigate}
          creatorProfileLink={getCreatorProfileLink(item)}
        />
      </div>
    </div>
  );
}
