import React from "react";
import { Link } from "react-router-dom";
import { Play, Heart, CheckCircle2, Star } from "lucide-react";

export default function CreatorDiscoveryCard({ creator, isSaved, onToggleFavorite }) {
  const avatarSrc = creator.coverImage || creator.avatar;
  const niches = creator.niches?.length > 0 ? creator.niches : ["UGC Creator", "Influencer"];

  return (
    <Link
      to={`/creators/${creator.id}`}
      className="group bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col overflow-hidden text-left"
    >
      {/* Creator Photo / Cover */}
      <div className="relative h-60 w-full overflow-hidden bg-gray-100">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={creator.displayName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 text-gray-700 font-bold text-3xl">
            {creator.displayName?.[0]?.toUpperCase() || "C"}
          </div>
        )}

        {creator.hasPitchVideo && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-800 shadow-sm">
            <Play size={10} className="fill-black text-black" /> Pitch Video
          </div>
        )}

        <button
          type="button"
          onClick={(e) => onToggleFavorite(creator.id, e)}
          title={isSaved ? "Remove from Saved" : "Save Creator"}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center shadow-md transition transform active:scale-90 cursor-pointer"
        >
          <Heart size={15} className={isSaved ? "text-[#FA2B56] fill-[#FA2B56]" : "text-gray-600 hover:text-[#FA2B56]"} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-[#FA2B56] transition-colors">
              {creator.displayName}
            </h3>
            {creator.verified && <CheckCircle2 size={15} className="text-[#3B82F6] fill-[#3B82F6] text-white flex-shrink-0" />}
          </div>
          {creator.locality && (
            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md flex-shrink-0">
              {creator.locality}
            </span>
          )}
        </div>

        {/* Niches */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {niches.map((niche, idx) => (
            <span key={idx} className="text-[10px] font-medium text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
              {niche}
            </span>
          ))}
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {creator.bio || "Passionate content creator producing authentic UGC, reviews, and high-impact social media assets."}
        </p>

        {/* Bottom Stats */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-700 font-semibold">
          <div className="flex items-center gap-1 text-[#F59E0B]">
            <Star size={13} className="fill-[#F59E0B]" />
            <span>{creator.rating > 0 ? creator.rating.toFixed(1) : "5.0"}</span>
            <span className="text-gray-400 font-normal text-[11px]">Rating</span>
          </div>
          <div className="h-3 w-px bg-gray-200" />
          <div className="text-right">
            <span className="text-gray-900 font-bold">{creator.jobsCompleted || 0}</span>{" "}
            <span className="text-gray-400 font-normal text-[11px]">Jobs Completed</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
