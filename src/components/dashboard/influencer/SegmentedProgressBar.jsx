import React from "react";

// 10 color-graded palette matching the exact spectrum in the reference image
// Red -> Orange -> Amber -> Yellow -> Lime -> Green -> Sky Blue -> Deep Blue
const SEGMENT_COLORS = [
  "#E11D48", // 1. Crimson Red
  "#EA580C", // 2. Red-Orange
  "#F97316", // 3. Orange
  "#FB923C", // 4. Light Orange
  "#FBBF24", // 5. Amber
  "#FACC15", // 6. Yellow
  "#A3E635", // 7. Lime Green
  "#84CC16", // 8. Green
  "#38BDF8", // 9. Sky Blue
  "#0EA5E9", // 10. Deep Blue
];

export default function SegmentedProgressBar({
  profile,
  packages = [],
  galleryItems = [],
  socialAccounts = [],
}) {
  const p = profile || {};
  const personalInfo = p.personalInfo || {};
  const address = p.address || {};
  const bio = p.matchProfile?.bio || personalInfo.description || "";
  const categories = p.categories || [];

  // 10 genuine profile requirements
  const hasCover = (personalInfo.coverPhotos && personalInfo.coverPhotos.length > 0) || !!personalInfo.coverPhoto;

  const checks = [
    !!hasCover,
    !!personalInfo.avatar,
    !!personalInfo.title?.trim(),
    !!(address.city || address.state),
    socialAccounts.some((s) => s.platform?.toLowerCase() === "instagram"),
    categories.length > 0,
    bio.trim().length >= 10,
    packages.length >= 3,
    galleryItems.length >= 3,
    !!p.payoutInfo?.isConfigured,
  ];

  const completedCount = checks.filter(Boolean).length;
  const activeSegmentsCount = completedCount;

  return (
    <div className="w-full py-2">
      {/* 10 Graded Capsule Segments */}
      <div className="grid grid-cols-10 gap-2 sm:gap-2.5">
        {SEGMENT_COLORS.map((color, index) => {
          const isFilled = index < activeSegmentsCount;
          return (
            <div
              key={index}
              className="h-3.5 sm:h-4 rounded-full transition-all duration-300"
              style={{
                backgroundColor: isFilled ? color : "#E5E7EB",
                boxShadow: isFilled ? `0 2px 8px ${color}60` : "none",
              }}
            />
          );
        })}
      </div>

      {/* 0%, 50%, 100% Labels directly under the bar */}
      <div className="flex justify-between text-[11px] font-bold text-gray-400 mt-1.5 px-0.5">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
