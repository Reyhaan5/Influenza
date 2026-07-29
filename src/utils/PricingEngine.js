// Tiers are based on real-world observation: smaller accounts often earn MORE
// per-follower than huge ones, because their audience trusts them more closely.
export const TIERS = [
  { id: "nano",  label: "Nano",     min: 1000,    max: 10000,   cpmINR: 900, cpmUSD: 12,  benchmarkEngagement: 6 },
  { id: "micro", label: "Micro",    min: 10000,   max: 50000,   cpmINR: 650, cpmUSD: 9,   benchmarkEngagement: 4 },
  { id: "mid",   label: "Mid-tier", min: 50000,   max: 250000,  cpmINR: 480, cpmUSD: 6.5, benchmarkEngagement: 2.5 },
  { id: "macro", label: "Macro",    min: 250000,  max: 1000000, cpmINR: 360, cpmUSD: 5,   benchmarkEngagement: 1.5 },
  { id: "mega",  label: "Mega",     min: 1000000, max: Infinity, cpmINR: 260, cpmUSD: 3.5, benchmarkEngagement: 1 },
];

// Category rates — some niches simply command higher brand budgets.
export const NICHES = [
  { id: "finance",   label: "Finance",   multiplier: 1.35 },
  { id: "tech",      label: "Tech",      multiplier: 1.3 },
  { id: "beauty",    label: "Beauty",    multiplier: 1.25 },
  { id: "fashion",   label: "Fashion",   multiplier: 1.15 },
  { id: "fitness",   label: "Fitness",   multiplier: 1.15 },
  { id: "food",      label: "Food",      multiplier: 1.1 },
  { id: "travel",    label: "Travel",    multiplier: 1.1 },
  { id: "education", label: "Education", multiplier: 1.1 },
  { id: "parenting", label: "Parenting", multiplier: 1.05 },
  { id: "gaming",    label: "Gaming",    multiplier: 1.0 },
  { id: "lifestyle", label: "Lifestyle", multiplier: 1.0 },
  { id: "comedy",    label: "Comedy",    multiplier: 0.95 },
];

// Different formats carry different value — a Reel reaches non-followers,
// a Story disappears in 24h so it's priced lowest.
export const FORMATS = [
  { id: "post",  label: "Feed Post", multiplier: 1 },
  { id: "reel",  label: "Reel",      multiplier: 1.2 },
  { id: "story", label: "Story",     multiplier: 0.35 },
];

export const MARKETS = [
  { id: "india", label: "India (₹)", symbol: "₹" },
  { id: "global", label: "Global ($)", symbol: "$" },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getTier(followers) {
  return TIERS.find((t) => followers >= t.min && followers < t.max) || TIERS[0];
}

export function getEngagementRate(followers, avgLikes, avgComments) {
  if (!followers) return 0;
  return ((avgLikes + avgComments) / followers) * 100;
}

// How much better/worse is this creator's engagement vs. what's typical
// for their tier? Clamped so one viral post (or one bad post) can't
// swing the estimate to an absurd number.
export function getEngagementMultiplier(engagementRatePct, benchmarkPct) {
  if (!benchmarkPct) return 1;
  const ratio = engagementRatePct / benchmarkPct;
  return clamp(ratio, 0.6, 1.8);
}

export function calculatePricing({
  followers = 0,
  avgLikes = 0,
  avgComments = 0,
  nicheId = "lifestyle",
  marketId = "india",
}) {
  const tier = getTier(followers);
  const niche = NICHES.find((n) => n.id === nicheId) || NICHES[0];
  const market = MARKETS.find((m) => m.id === marketId) || MARKETS[0];

  const engagementRatePct = getEngagementRate(followers, avgLikes, avgComments);
  const engagementMultiplier = getEngagementMultiplier(engagementRatePct, tier.benchmarkEngagement);

  const cpm = marketId === "india" ? tier.cpmINR : tier.cpmUSD;
  const basePrice = (followers / 1000) * cpm * engagementMultiplier * niche.multiplier;

  const rates = FORMATS.reduce((acc, format) => {
    acc[format.id] = Math.round(basePrice * format.multiplier);
    return acc;
  }, {});

  return {
    tier,
    niche,
    market,
    engagementRatePct: Math.round(engagementRatePct * 100) / 100,
    engagementMultiplier: Math.round(engagementMultiplier * 100) / 100,
    rates,
  };
}

const STORAGE_KEY = "influenza_last_rate_card";

export function saveLastEntry(entry) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...entry, savedAt: Date.now() }));
  } catch (e) {
    // localStorage unavailable — fail silently, feature just won't remember
  }
}

export function loadLastEntry() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function daysAgo(timestamp) {
  return Math.max(0, Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24)));
}

export function getDeltaPct(oldValue, newValue) {
  if (!oldValue) return null;
  return Math.round(((newValue - oldValue) / oldValue) * 100);
}