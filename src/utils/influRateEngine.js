// InfluRate scoring + rate-card engine.
// Consumes only the fields already returned by the Instagram handle
// lookup (followers, avgLikes, avgComments) — nothing here changes
// how that data is pulled.

// Placeholder per-follower Reel rates (₹) per tier — adjust to your
// real pricing once finalized, the formula shape stays the same.
export const CREATOR_TIERS = [
  { id: "nano",      label: "Nano",      min: 0,        max: 10000,    reelRatePerFollower: 0.90 },
  { id: "micro",     label: "Micro",     min: 10000,    max: 50000,    reelRatePerFollower: 0.65 },
  { id: "mid",       label: "Mid",       min: 50000,    max: 250000,   reelRatePerFollower: 0.48 },
  { id: "macro",     label: "Macro",     min: 250000,   max: 1000000,  reelRatePerFollower: 0.36 },
  { id: "mega",      label: "Mega",      min: 1000000,  max: 10000000, reelRatePerFollower: 0.26 },
  { id: "celebrity", label: "Celebrity", min: 10000000, max: Infinity, reelRatePerFollower: 0.18 },
];

// Only the niche values given so far — extend this map as needed.
export const NICHE_MULTIPLIERS = {
  finance: 1.6,
  tech: 1.5,
  fashion: 1.2,
  comedy: 0.95,
  entertainment: 0.9,
};
const DEFAULT_NICHE_MULTIPLIER = 1.0;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// ---------------------------------------------------------------------
// 1. Engagement Rate
// ---------------------------------------------------------------------
export function calculateEngagementRate(avgLikes, avgComments, followers) {
  if (!followers) return 0;
  return ((Number(avgLikes) || 0) + (Number(avgComments) || 0)) / followers * 100;
}

// Audience Quality tiers, derived from Engagement Rate
export function getAudienceQuality(engagementRatePct) {
  if (engagementRatePct >= 6) return "Excellent";
  if (engagementRatePct >= 3) return "Good";
  if (engagementRatePct >= 1) return "Average";
  return "Low";
}

const QUALITY_SCORE = { Excellent: 20, Good: 15, Average: 10, Low: 5 };
const QUALITY_FACTOR = { Excellent: 1.2, Good: 1.05, Average: 0.9, Low: 0.75 };

// ---------------------------------------------------------------------
// 2. Overall Rating (0–100)
// `verified` defaults to false since it isn't part of the current
// lookup response — pass it in later if/when you add it.
// ---------------------------------------------------------------------
export function calculateOverallRating({ followers, avgLikes, avgComments, verified = false }) {
  const engagementRatePct = calculateEngagementRate(avgLikes, avgComments, followers);
  const audienceQuality = getAudienceQuality(engagementRatePct);

  const reachScore = followers > 0 ? Math.min(35, Math.log10(followers) * 6) : 0;
  const engagementScore = Math.min(35, engagementRatePct * 8);
  const qualityScore = QUALITY_SCORE[audienceQuality];
  const verifiedScore = verified ? 10 : 5;

  const overallRating = clamp(
    Math.round(reachScore + engagementScore + qualityScore + verifiedScore),
    0,
    100
  );

  return {
    engagementRatePct: Math.round(engagementRatePct * 100) / 100,
    audienceQuality,
    breakdown: {
      reachScore: Math.round(reachScore * 10) / 10,
      engagementScore: Math.round(engagementScore * 10) / 10,
      qualityScore,
      verifiedScore,
    },
    overallRating,
  };
}

// ---------------------------------------------------------------------
// Creator Tier
// ---------------------------------------------------------------------
export function getCreatorTier(followers) {
  return CREATOR_TIERS.find((t) => followers >= t.min && followers < t.max) || CREATOR_TIERS[0];
}

// ---------------------------------------------------------------------
// 3. Rate Card (Reel price)
// ---------------------------------------------------------------------
export function calculateRateCard({ followers, avgLikes, avgComments, nicheId }) {
  const engagementRatePct = calculateEngagementRate(avgLikes, avgComments, followers);
  const audienceQuality = getAudienceQuality(engagementRatePct);
  const tier = getCreatorTier(followers);

  const nicheMultiplier = NICHE_MULTIPLIERS[nicheId] ?? DEFAULT_NICHE_MULTIPLIER;
  const engagementFactor = clamp(engagementRatePct / 3, 0.7, 1.8);
  const qualityFactor = QUALITY_FACTOR[audienceQuality];

  const factor = nicheMultiplier * engagementFactor * qualityFactor;
  const reelPrice = Math.round(followers * tier.reelRatePerFollower * factor);

  return {
    tier,
    engagementRatePct: Math.round(engagementRatePct * 100) / 100,
    audienceQuality,
    factors: {
      nicheMultiplier,
      engagementFactor: Math.round(engagementFactor * 100) / 100,
      qualityFactor,
      combinedFactor: Math.round(factor * 100) / 100,
    },
    reelPrice,
  };
}