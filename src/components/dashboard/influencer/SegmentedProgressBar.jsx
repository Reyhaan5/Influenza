import React from "react";

const SEGMENT_COLORS = [
  "#E11D48", "#EA580C", "#F97316", "#FB923C", "#FBBF24",
  "#FACC15", "#A3E635", "#84CC16", "#38BDF8", "#0EA5E9",
];

export default function SegmentedProgressBar({ profile = {}, packages = [], galleryItems = [], socialAccounts = [] }) {
  const { personalInfo = {}, address = {}, matchProfile = {}, payoutInfo = {}, categories = [] } = profile || {};
  const hasCover = (personalInfo.coverPhotos?.length > 0) || !!personalInfo.coverPhoto;
  const bio = matchProfile.bio || personalInfo.description || "";

  const completed = [
    hasCover, !!personalInfo.avatar, !!personalInfo.title?.trim(), !!(address.city || address.state),
    socialAccounts.some((s) => s.platform?.toLowerCase() === "instagram"),
    categories.length > 0, bio.trim().length >= 10, packages.length >= 3, galleryItems.length >= 3, !!payoutInfo.isConfigured,
  ].filter(Boolean).length;

  return (
    <div className="w-full py-2">
      <div className="grid grid-cols-10 gap-2 sm:gap-2.5">
        {SEGMENT_COLORS.map((color, idx) => (
          <div
            key={idx}
            className="h-3.5 sm:h-4 rounded-full transition-all duration-300"
            style={{ backgroundColor: idx < completed ? color : "#E5E7EB", boxShadow: idx < completed ? `0 2px 8px ${color}60` : "none" }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[11px] font-bold text-gray-400 mt-1.5 px-0.5">
        <span>0%</span><span>50%</span><span>100%</span>
      </div>
    </div>
  );
}
