/**
 * Frontend InfluRate Calculation Utility (Client-side & Real-time)
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
  { name: "Nano", min: 0, max: 10000, baseRatePerFollower: 0.35 },
  { name: "Micro", min: 10000, max: 50000, baseRatePerFollower: 0.28 },
  { name: "Mid", min: 50000, max: 200000, baseRatePerFollower: 0.22 },
  { name: "Macro", min: 200000, max: 500000, baseRatePerFollower: 0.16 },
  { name: "Mega", min: 500000, max: 1000000, baseRatePerFollower: 0.12 },
  { name: "Celebrity", min: 1000000, max: Infinity, baseRatePerFollower: 0.08 },
];

export function formatINR(val) {
  if (typeof val !== "number" || isNaN(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

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

  // 1. Engagement Rate
  const totalInteractions = safeLikes + safeComments;
  const engagementRate = Number(((totalInteractions / safeFollowers) * 100).toFixed(2));

  // 2. Audience Quality
  let qualityLabel;
  let qualityScore;
  let qualityFactor;

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
  const reachScoreRaw = Math.log10(safeFollowers) * 6;
  const reachScore = Number(Math.min(35, Math.max(0, reachScoreRaw)).toFixed(1));

  const engagementScoreRaw = engagementRate * 8;
  const engagementScore = Number(Math.min(35, Math.max(0, engagementScoreRaw)).toFixed(1));

  const verifiedScore = verified ? 10 : 5;

  const rawTotal = reachScore + engagementScore + qualityScore + verifiedScore;
  const overallRating = Math.min(100, Math.max(0, Math.round(rawTotal)));

  // 4. Rate Card Calculation (₹ Pricing)
  const tier =
    CREATOR_TIERS.find((t) => safeFollowers >= t.min && safeFollowers < t.max) ||
    CREATOR_TIERS[0];

  const normalizedNiche = String(niche || "").toLowerCase().trim();
  const nicheMultiplier = NICHE_MULTIPLIERS[normalizedNiche] || 1.0;

  const rawEngagementFactor = engagementRate / 3;
  const engagementFactor = Number(
    Math.min(1.8, Math.max(0.7, rawEngagementFactor)).toFixed(2)
  );

  const factor = Number((nicheMultiplier * engagementFactor * qualityFactor).toFixed(3));

  const rawReelPrice = safeFollowers * tier.baseRatePerFollower * factor;
  const reelPrice = roundToCleanINR(rawReelPrice);

  const postPrice = roundToCleanINR(reelPrice * 0.7);
  const storyPrice = roundToCleanINR(reelPrice * 0.3);
  const bundleReels3Price = roundToCleanINR(reelPrice * 3 * 0.85);
  const monthlyRetainerPrice = roundToCleanINR((reelPrice * 4 + storyPrice * 8) * 0.8);

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
        reel: { name: "Instagram Reel", price: reelPrice, formattedPrice: formatINR(reelPrice), unit: "per Reel" },
        post: { name: "Dedicated Feed Post", price: postPrice, formattedPrice: formatINR(postPrice), unit: "per Post" },
        story: { name: "Story (Set of 2)", price: storyPrice, formattedPrice: formatINR(storyPrice), unit: "per Story" },
        reelBundle: { name: "3-Reel Campaign Bundle", price: bundleReels3Price, formattedPrice: formatINR(bundleReels3Price), unit: "3 Reels (15% Off)", savings: formatINR(roundToCleanINR(reelPrice * 3 * 0.15)) },
        monthlyRetainer: { name: "Monthly Brand Retainer", price: monthlyRetainerPrice, formattedPrice: formatINR(monthlyRetainerPrice), unit: "4 Reels + 8 Stories (20% Off)", savings: formatINR(roundToCleanINR((reelPrice * 4 + storyPrice * 8) * 0.2)) },
      },
    },
  };
}
