import React from "react";
import LiveStatCard from "./LiveStatCard";

export default function AuthSidebar() {
  return (
    <div className="hidden lg:flex relative flex-col justify-between items-center px-[clamp(2rem,5vw,4rem)] py-12 bg-brandSecondary overflow-hidden w-full min-h-screen">
      {/* Decorative Orbs */}
      <div className="absolute -top-16 -left-10 w-72 h-72 rounded-full bg-brandPrimary/40 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-16 -right-10 w-80 h-80 rounded-full bg-brandAccent/30 blur-[90px] pointer-events-none" />

      {/* Top Section */}
      <div className="relative z-10 w-full max-w-[24rem]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-brandAccent" />
          <span className="text-[#FFFFFF] font-bold text-[clamp(1.1rem,1.8vw,1.35rem)] tracking-tight">
            Influenze
          </span>
        </div>
      </div>

      {/* Center Section */}
      <div className="relative z-10 w-full max-w-[24rem]">
        <h2 className="text-[#FFFFFF] text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold leading-[1.2] tracking-tight">
          Grow your reach.
          <br />
          Track it live.
        </h2>
        <p className="mt-4 text-brandAccent/80 text-[clamp(0.875rem,1.5vw,1.05rem)] font-medium leading-relaxed">
          One dashboard for every collaboration, every platform, every metric that matters.
        </p>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 w-full max-w-[24rem] flex justify-start">
        <LiveStatCard />
      </div>
    </div>
  );
}