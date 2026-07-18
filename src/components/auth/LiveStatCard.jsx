import React from "react";

export default function LiveStatCard() {
  const bars = [40, 55, 35, 70, 50, 90, 65];

  return (
    <div className="w-full max-w-[18rem] p-5 bg-[#FFFFFF]/10 backdrop-blur-md border border-[#FFFFFF]/20 rounded-2xl shadow-xl transition-transform hover:scale-[1.02] duration-300">
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-1.5 text-brandAccent text-[11px] font-bold tracking-widest uppercase">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-brandPrimary animate-pulse" />
          Live
        </span>
        <span className="text-[11px] text-brandAccent/70 font-medium tracking-wider uppercase">
          Today
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-[#FFFFFF] text-[clamp(1.5rem,2.5vw,2rem)] font-bold leading-none">
            128.4K
          </div>
          <div className="text-[11px] text-brandAccent/70 font-semibold tracking-wider uppercase mt-1">
            Total reach
          </div>
        </div>
        <span className="flex items-center gap-0.5 text-brandAccent text-xs font-semibold">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
          12.3%
        </span>
      </div>

      <div className="mt-5 flex items-end gap-1.5 h-10 w-full">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm transition-all duration-300"
            style={{
              height: `${h}%`,
              background: i === 5 ? "#8B5FBF" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}