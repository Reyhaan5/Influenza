import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  HelpCircle,
  Video,
  Image as ImageIcon,
  Layers,
  Package,
  CalendarCheck,
  ChevronDown,
  Info,
} from "lucide-react";
import { SegmentedProgress } from "@/components/ui/progress-bar";
import { QualityPill } from "@/components/ui/QualityBadge";
import { calculateInfluRate, formatINR } from "@/utils/influRateCalculator";
import { cn } from "@/lib/utils";

export function InfluRateCard({
  profileData,
  className,
  showRateCard = true,
  interactive = false,
}) {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState("reel");

  // Support direct props or Apify/Instagram scraper payload formats
  const followers =
    profileData?.followers ||
    profileData?.followersCount ||
    profileData?.socialAccounts?.[0]?.followers ||
    25000;

  const avgLikes =
    profileData?.avgLikes ||
    profileData?.latestPostsSummary?.avgLikes ||
    Math.round(followers * 0.042);

  const avgComments =
    profileData?.avgComments ||
    profileData?.latestPostsSummary?.avgComments ||
    Math.round(followers * 0.002);

  const verified =
    profileData?.verified ||
    profileData?.isVerified ||
    profileData?.socialAccounts?.[0]?.verified ||
    false;

  const niche =
    profileData?.niche ||
    profileData?.categories?.[0] ||
    profileData?.category ||
    "tech";

  // Calculate live InfluRate metrics
  const result = calculateInfluRate({
    followers,
    avgLikes,
    avgComments,
    verified,
    niche,
  });

  const { overallRating, rateCard, metrics } = result;

  const deliverableIcons = {
    reel: Video,
    post: ImageIcon,
    story: Layers,
    reelBundle: Package,
    monthlyRetainer: CalendarCheck,
  };

  return (
    <div
      className={cn(
        "rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7 shadow-[var(--shadow-card)] flex flex-col gap-6 transition-all",
        className
      )}
    >
      {/* ============================================================
          HEADER: Overall InfluRate Score & Audience Quality
      ============================================================ */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div className="flex items-center gap-4">
          {/* Big Circular Score Badge */}
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] shadow-inner">
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
                {overallRating.score}
              </span>
              <span className="block text-[10px] uppercase font-bold text-[var(--color-primary)]">
                / 100
              </span>
            </div>
            <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-xs font-bold shadow-md">
              {overallRating.grade}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text)] tracking-tight">
                InfluRate™ Score
              </h3>
              <button
                onClick={() => setShowFormulaDetails((v) => !v)}
                className="text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition"
                title="View Score Calculation Logic"
              >
                <HelpCircle size={16} />
              </button>
            </div>
            <p className="text-xs text-[var(--color-text-light)] mt-0.5">
              Verified performance & commercial benchmark
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <QualityPill quality={overallRating.breakdown.qualityScore.qualityLabel} size="sm" />
              <span className="text-[11px] font-semibold text-[var(--color-text-light)] bg-[var(--color-background)] px-2.5 py-0.5 rounded-full border border-[var(--color-border)]">
                {metrics.tier} Tier • {metrics.engagementRate}% ER
              </span>
            </div>
          </div>
        </div>

        {/* Niche & Verification Tag */}
        <div className="flex items-center gap-2 self-start">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)]">
            {metrics.niche}
          </span>
          {metrics.verified && (
            <span className="flex items-center gap-1 text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-xl border border-blue-200 dark:border-blue-800">
              <CheckCircle2 size={13} />
              Verified
            </span>
          )}
        </div>
      </div>

      {/* ============================================================
          METRIC BREAKDOWN SECTION (Using SegmentedProgress)
      ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Reach Score (Max 35) */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--color-text-light)]">
              Logarithmic Reach
            </span>
            <span className="text-xs font-bold text-[var(--color-text)]">
              {overallRating.breakdown.reachScore.score} / 35
            </span>
          </div>
          <SegmentedProgress
            value={(overallRating.breakdown.reachScore.score / 35) * 100}
            segments={14}
            showPercentage={false}
            className="gap-0"
          />
        </div>

        {/* 2. Engagement Score (Max 35) */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--color-text-light)]">
              Engagement Strength
            </span>
            <span className="text-xs font-bold text-[var(--color-text)]">
              {overallRating.breakdown.engagementScore.score} / 35
            </span>
          </div>
          <SegmentedProgress
            value={(overallRating.breakdown.engagementScore.score / 35) * 100}
            segments={14}
            showPercentage={false}
            className="gap-0"
          />
        </div>

        {/* 3. Quality Score (Max 20) */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--color-text-light)]">
              Audience Quality
            </span>
            <span className="text-xs font-bold text-[var(--color-text)]">
              {overallRating.breakdown.qualityScore.score} / 20
            </span>
          </div>
          <SegmentedProgress
            value={(overallRating.breakdown.qualityScore.score / 20) * 100}
            segments={14}
            showPercentage={false}
            className="gap-0"
          />
        </div>

        {/* 4. Verification Score (Max 10) */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--color-text-light)]">
              Identity Verification
            </span>
            <span className="text-xs font-bold text-[var(--color-text)]">
              {overallRating.breakdown.verifiedScore.score} / 10
            </span>
          </div>
          <SegmentedProgress
            value={(overallRating.breakdown.verifiedScore.score / 10) * 100}
            segments={14}
            showPercentage={false}
            className="gap-0"
          />
        </div>
      </div>

      {/* Expandable Explanation Logic */}
      <AnimatePresence>
        {showFormulaDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] p-4 text-xs text-[var(--color-text-light)] leading-relaxed space-y-2"
          >
            <div className="flex items-center gap-1.5 font-bold text-[var(--color-text)]">
              <Info size={14} className="text-[var(--color-primary)]" />
              InfluRate™ Algorithmic Rules
            </div>
            <p>
              • <strong>Reach (max 35):</strong> Evaluated as min(35, log10(Followers) × 6) to prevent massive accounts from dominating high-engagement micro-creators.
            </p>
            <p>
              • <strong>Engagement (max 35):</strong> Computed as (Likes + Comments) ÷ Followers × 8.
            </p>
            <p>
              • <strong>₹ Rate Card:</strong> Scaled by Tier rate ({rateCard.multiplierDetails.tierBaseRate} ₹/follower) × Niche multiplier ({rateCard.multiplierDetails.nicheMultiplier}×) × Engagement factor ({rateCard.multiplierDetails.engagementFactor}×) × Quality factor ({rateCard.multiplierDetails.qualityFactor}×).
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================
          RATE CARD DELIVERABLES TABLE
      ============================================================ */}
      {showRateCard && (
        <div className="border-t border-[var(--color-border)] pt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
                Estimated ₹ Rate Card
              </h4>
              <p className="text-xs text-[var(--color-text-light)]">
                Fair market pricing based on verified reach & niche value
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
              Factor: {rateCard.multiplierDetails.combinedFactor}×
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(rateCard.deliverables).map(([key, item]) => {
              const IconComp = deliverableIcons[key] || Video;
              const isSelected = selectedDeliverable === key;

              return (
                <div
                  key={key}
                  onClick={() => setSelectedDeliverable(key)}
                  className={cn(
                    "p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between",
                    isSelected
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-sm"
                      : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-primary)]/40"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[var(--color-text)] flex items-center gap-1.5">
                      <IconComp size={15} className="text-[var(--color-primary)]" />
                      {item.name}
                    </span>
                    {item.savings && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
                        Save {item.savings}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-base sm:text-lg font-extrabold text-[var(--color-text)]">
                      {item.formattedPrice}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-light)]">
                      {item.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default InfluRateCard;
