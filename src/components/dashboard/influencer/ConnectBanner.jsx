import React from "react";
import { Video, ArrowUpRight } from "lucide-react";

export default function ConnectBanner() {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] h-full flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <Video size={20} />
        </div>
        <p className="text-sm text-[var(--color-text)] leading-relaxed">
          Connect your <span className="font-bold text-[var(--color-primary-hover)]">TikTok</span> account to
          increase your asking price by up to <span className="font-bold">$250</span>.
        </p>
      </div>
      <button className="self-start mt-4 flex items-center gap-1.5 text-sm font-bold text-[var(--color-primary-hover)] hover:underline">
        Connect account <ArrowUpRight size={16} />
      </button>
    </div>
  );
}