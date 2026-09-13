/**
 * InfluRate Calculation Engine
 * 
 * Implements:
 * 1. Overall Rating (0–100 score) based on Logarithmic Reach, Engagement Rate, Quality, and Verification.
 * 2. Rate Card (₹ Pricing) for Reels, Posts, Stories, Bundles, and Retainers based on Tier, Niche, Engagement, and Quality.
 */

export const NICHE_MULTIPLIERS = {
  finance: 1.6,
  tech: 1.5,
  business: 1.4,
  fitness: 1.3,
  health: 1.3,
  beauty: 1.2,
  fashion: 1.2,
  travel: 1.1,
  food: 1.1,
  lifestyle: 1.0,
  gaming: 1.0,
  comedy: 0.95,
  entertainment: 0.9,
  other: 1.0,
};

export const CREATOR_TIERS = [
  { name: "Starter", min: 0, max: 1000, baseRatePerFollower: 1.2 },
  { name: "Nano", min: 1000, max: 10000, baseRatePerFollower: 0.35 },
  { name: "Micro", min: 10000, max: 50000, baseRatePerFollower: 0.28 },
  { name: "Mid", min: 50000, max: 200000, baseRatePerFollower: 0.22 },
  { name: "Macro", min: 200000, max: 500000, baseRatePerFollower: 0.16 },
  { name: "Mega", min: 500000, max: 1000000, baseRatePerFollower: 0.12 },
  { name: "Celebrity", min: 1000000, max: Infinity, baseRatePerFollower: 0.08 },
];

/**
 * Clean practical rounding in INR (₹)
 */
function roundToCleanINR(val) {
  if (val <= 0) return 0;
  if (val < 2000) return Math.round(val / 100) * 100;
  if (val < 10000) return Math.round(val / 250) * 250;
  if (val < 50000) return Math.round(val / 500) * 500;
  if (val < 200000) return Math.round(val / 1000) * 1000;
  return Math.round(val / 5000) * 5000;
}

export function calculateInfluRate({
  followers = 0,
  avgLikes = 0,
  avgComments = 0,
  verified = false,
  niche = "lifestyle",
}) {
  const safeFollowers = Math.max(1, Number(followers) || 1);
  const safeLikes = Math.max(0, Number(avgLikes) || 0);
  const safeComments = Math.max(0, Number(avgComments) || 0);

  // 1. Engagement Rate Calculation
  const totalInteractions = safeLikes + safeComments;
  const engagementRate = Number(((totalInteractions / safeFollowers) * 100).toFixed(2));

  // 2. Audience Quality Tier
  let qualityLabel = "Low";
  let qualityScore = 5;
  let qualityFactor = 0.75;

  if (engagementRate >= 6.0) {
    qualityLabel = "Excellent";
    qualityScore = 20;
    qualityFactor = 1.2;
  } else if (engagementRate >= 3.0) {
    qualityLabel = "Good";
    qualityScore = 15;
    qualityFactor = 1.05;
  } else if (engagementRate >= 1.0) {
    qualityLabel = "Average";
    qualityScore = 10;
    qualityFactor = 0.9;
  } else {
    qualityLabel = "Low";
    qualityScore = 5;
    qualityFactor = 0.75;
  }

  // 3. Overall Rating Breakdown (0 - 100)
  // Reach Score: min(35, log10(Followers) * 6)
  const reachScoreRaw = Math.log10(safeFollowers) * 6;
  const reachScore = Number(Math.min(35, Math.max(0, reachScoreRaw)).toFixed(1));

  // Engagement Score: min(35, Engagement Rate * 8)
  const engagementScoreRaw = engagementRate * 8;
  const engagementScore = Number(Math.min(35, Math.max(0, engagementScoreRaw)).toFixed(1));

  // Verified Score: 10 vs 5
  const verifiedScore = verified ? 10 : 5;

  // Composite InfluRate Score
  const rawTotal = reachScore + engagementScore + qualityScore + verifiedScore;
  const overallRating = Math.min(100, Math.max(0, Math.round(rawTotal)));

  // 4. Rate Card Calculation (₹ Pricing)
  // Determine Creator Tier
  const tier =
    CREATOR_TIERS.find((t) => safeFollowers >= t.min && safeFollowers < t.max) ||
    CREATOR_TIERS[0];

  // Niche Multiplier
  const normalizedNiche = String(niche || "").toLowerCase().trim();
  const nicheMultiplier = NICHE_MULTIPLIERS[normalizedNiche] || 1.0;

  // Engagement Factor: clamped(Engagement Rate / 3, 0.7, 1.8)
  const rawEngagementFactor = engagementRate / 3;
  const engagementFactor = Number(
    Math.min(1.8, Math.max(0.7, rawEngagementFactor)).toFixed(2)
  );

  // Combined Pricing Multiplier Factor
  const factor = Number((nicheMultiplier * engagementFactor * qualityFactor).toFixed(3));

  // Base Reel Calculation
  const rawReelPrice = safeFollowers * tier.baseRatePerFollower * factor;
  const reelPrice = roundToCleanINR(rawReelPrice);

  // Derived Deliverable Pricing
  const postPrice = roundToCleanINR(reelPrice * 0.7);
  const storyPrice = roundToCleanINR(reelPrice * 0.3);
  const bundleReels3Price = roundToCleanINR(reelPrice * 3 * 0.85); // 15% discount for 3 reels
  const monthlyRetainerPrice = roundToCleanINR((reelPrice * 4 + storyPrice * 8) * 0.8); // 4 Reels + 8 Stories (20% retainer discount)

  return {
    metrics: {
      followers: safeFollowers,
      avgLikes: safeLikes,
      avgComments: safeComments,
      engagementRate,
      verified: Boolean(verified),
      niche: normalizedNiche,
      tier: tier.name,
    },
    overallRating: {
      score: overallRating,
      grade: overallRating >= 80 ? "A+" : overallRating >= 65 ? "A" : overallRating >= 50 ? "B" : "C",
      breakdown: {
        reachScore: { score: reachScore, max: 35, description: "Logarithmic follower reach" },
        engagementScore: { score: engagementScore, max: 35, description: "Active follower engagement" },
        qualityScore: { score: qualityScore, max: 20, qualityLabel, description: "Audience authenticity & interaction quality" },
        verifiedScore: { score: verifiedScore, max: 10, isVerified: Boolean(verified), description: "Identity & profile verification" },
      },
    },
    rateCard: {
      currency: "INR",
      currencySymbol: "₹",
      multiplierDetails: {
        tier: tier.name,
        tierBaseRate: tier.baseRatePerFollower,
        nicheMultiplier,
        engagementFactor,
        qualityFactor,
        combinedFactor: factor,
      },
      deliverables: {
        reel: { name: "Instagram Reel", price: reelPrice, unit: "per Reel" },
        post: { name: "Dedicated Feed Post", price: postPrice, unit: "per Post" },
        story: { name: "Story (Set of 2)", price: storyPrice, unit: "per Story" },
        reelBundle: { name: "3-Reel Campaign Bundle", price: bundleReels3Price, unit: "3 Reels (15% Off)", savings: roundToCleanINR(reelPrice * 3 * 0.15) },
        monthlyRetainer: { name: "Monthly Brand Retainer", price: monthlyRetainerPrice, unit: "4 Reels + 8 Stories (20% Off)", savings: roundToCleanINR((reelPrice * 4 + storyPrice * 8) * 0.2) },
      },
    },
  };
}
