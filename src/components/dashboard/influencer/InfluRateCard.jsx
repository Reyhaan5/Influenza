import React, { useMemo } from "react";
import { ShieldCheck, ShieldOff, TrendingUp } from "lucide-react";
import Avatar from "./Avatar";
import ProgressBar from "../../ui/ProgressBar";
import {
  calculateOverallRating,
  calculateRateCard,
} from "../../../utils/influRateEngine";

const QUALITY_BADGE = {
  Excellent: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
  Good: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
  Average: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
  Low: "bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
};

export default function InfluRateCard({
  handle,
  followers,
  avgLikes,
  avgComments,
  verified = false,
  nicheId,
}) {
  const rating = useMemo(
    () => calculateOverallRating({ followers, avgLikes, avgComments, verified }),
    [followers, avgLikes, avgComments, verified]
  );

  const rateCard = useMemo(
    () => (nicheId ? calculateRateCard({ followers, avgLikes, avgComments, nicheId }) : null),
    [followers, avgLikes, avgComments, nicheId]
  );

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={(handle || "?").replace("@", "")} size={48} />
          <div>
            <p className="font-bold text-[var(--color-text)]">{handle}</p>
            <p className="text-xs text-[var(--color-text-light)]">InfluRate Score</p>
          </div>
        </div>

        <span
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
            verified
              ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
              : "bg-[var(--color-text-light)]/10 text-[var(--color-text-light)]"
          }`}
        >
          {verified ? <ShieldCheck size={13} /> : <ShieldOff size={13} />}
          {verified ? "Verified" : "Not Verified"}
        </span>
      </div>

      {/* Big score */}
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-[var(--color-primary)]/15">
          <span className="text-3xl font-extrabold text-[var(--color-text)]">
            {rating.overallRating}
          </span>
          <span className="text-[10px] font-semibold text-[var(--color-text-light)] uppercase tracking-wide">
            / 100
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[var(--color-primary)]" />
            <span className="text-sm font-semibold text-[var(--color-text)]">
              {rating.engagementRatePct}% engagement rate
            </span>
          </div>

          <span
            className={`w-fit text-xs font-bold px-2.5 py-1 rounded-full ${QUALITY_BADGE[rating.audienceQuality]}`}
          >
            {rating.audienceQuality} Audience
          </span>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="flex flex-col gap-4">
        <ProgressBar
          label="Reach"
          value={Math.round((rating.breakdown.reachScore / 35) * 100)}
        />
        <ProgressBar
          label="Engagement"
          value={Math.round((rating.breakdown.engagementScore / 35) * 100)}
          color="green"
        />
        <ProgressBar
          label="Audience Quality"
          value={Math.round((rating.breakdown.qualityScore / 20) * 100)}
          color="orange"
        />
        <ProgressBar
          label="Verification"
          value={Math.round((rating.breakdown.verifiedScore / 10) * 100)}
        />
      </div>

      {/* Rate card */}
      <div className="border-t border-[var(--color-border)] pt-5">
        <h4 className="text-sm font-bold text-[var(--color-text)] mb-3">
          Estimated Rate Card
        </h4>

        {rateCard ? (
          <div className="flex items-center justify-between bg-[var(--color-background)] rounded-xl px-4 py-3.5">
            <div>
              <p className="text-xs text-[var(--color-text-light)]">
                {rateCard.tier.label} tier · Reel
              </p>
              <p className="text-[11px] text-[var(--color-text-light)] mt-0.5">
                Niche ×{rateCard.factors.nicheMultiplier} · Engagement ×{rateCard.factors.engagementFactor} · Quality ×{rateCard.factors.qualityFactor}
              </p>
            </div>
            <p className="text-xl font-extrabold text-[var(--color-primary-hover)]">
              ₹{rateCard.reelPrice.toLocaleString("en-IN")}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-light)]">
            Select a niche to see the estimated Reel rate.
          </p>
        )}
      </div>
    </div>
  );
}