import React from "react";
import Avatar from "../influencer/Avatar";
import { BadgeCheck } from "lucide-react";

export default function BrandProfileCard({
  companyName,
  industry,
  campaignsRun,
  creatorsPartnered,
  totalReach,
  verified,
}) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] flex flex-col gap-5 h-full">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar name={companyName} />
          {verified && (
            <span className="absolute -bottom-1 -right-1 bg-[var(--color-primary)] rounded-full p-0.5 border-2 border-[var(--color-surface)]">
              <BadgeCheck size={14} className="text-white" />
            </span>
          )}
        </div>
        <div>
          <span className="font-bold text-[var(--color-text)] text-lg">{companyName}</span>
          <p className="text-xs text-[var(--color-text-light)]">{industry}</p>
        </div>
      </div>

      <div className="flex items-center justify-around text-center">
        <div>
          <div className="font-bold text-[var(--color-text)]">{campaignsRun}</div>
          <div className="text-xs text-[var(--color-text-light)]">campaigns run</div>
        </div>
        <div className="w-px h-8 bg-[var(--color-border)]" />
        <div>
          <div className="font-bold text-[var(--color-text)]">{creatorsPartnered}</div>
          <div className="text-xs text-[var(--color-text-light)]">creators partnered</div>
        </div>
        <div className="w-px h-8 bg-[var(--color-border)]" />
        <div>
          <div className="font-bold text-[var(--color-text)]">{totalReach}</div>
          <div className="text-xs text-[var(--color-text-light)]">total reach</div>
        </div>
      </div>

      {!verified && (
        <div className="text-sm text-[var(--color-warning)] bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 rounded-xl px-4 py-2.5">
          Your brand has not been verified yet.
        </div>
      )}
    </div>
  );
}