// backend/controllers/insiderRateController.js
import RateCard from "../models/RateCard.js";
import InfluencerProfile from "../models/InfluencerProfile.js";
import { computeInfluencerStats } from "../services/statsService.js";
import { scrapeInstagram } from "../services/instagram/apifyService.js";

function getCreatorTier(followers = 0) {
  const f = Math.max(0, Number(followers) || 0);
  if (f >= 1000000) {
    const baseReel = Math.round(139650 + (f - 1000000) * 0.08);
    return { label: "Mega Creator", cpm: 120, baseReel };
  }
  if (f >= 250000) {
    const baseReel = Math.round(49650 + (f - 250000) * 0.12);
    return { label: "Macro Creator", cpm: 200, baseReel };
  }
  if (f >= 50000) {
    const baseReel = Math.round(13650 + (f - 50000) * 0.18);
    return { label: "Mid-Tier Creator", cpm: 280, baseReel };
  }
  if (f >= 10000) {
    const baseReel = Math.round(3650 + (f - 10000) * 0.25);
    return { label: "Micro Creator", cpm: 380, baseReel };
  }
  if (f >= 1000) {
    const baseReel = Math.round(500 + (f - 1000) * 0.35);
    return { label: "Nano Creator", cpm: 500, baseReel };
  }
  // Starter tier (< 1,000 followers, e.g. 144 followers)
  const baseReel = Math.max(150, Math.round(f * 1.2));
  return { label: "Starter Nano Creator", cpm: 750, baseReel };
}

function computeInsiderMultiplier(stats) {
  let multiplier = 1;
  const breakdown = [];

  const completed = Number(stats?.collaborationsCompleted) || 0;
  const reviewsCount = Number(stats?.reviewsCount) || 0;
  const rating = Number(stats?.rating) || 0;

  const collabBonus = Math.min(completed * 0.02, 0.2);
  if (collabBonus > 0) {
    multiplier += collabBonus;
    breakdown.push({
      label: `${completed} Completed Collaboration${completed === 1 ? "" : "s"}`,
      impact: `+${Math.round(collabBonus * 100)}%`,
    });
  }

  if (reviewsCount >= 1 && rating >= 4.5) {
    const ratingBonus = Math.min((rating - 4.0) * 0.1, 0.1);
    multiplier += ratingBonus;
    breakdown.push({
      label: `${rating.toFixed(1)}★ Average Rating (${reviewsCount} Review${reviewsCount === 1 ? "" : "s"})`,
      impact: `+${Math.round(ratingBonus * 100)}%`,
    });
  }

  if (stats?.allFormats?.achieved) {
    multiplier += 0.05;
    breakdown.push({ label: "Proven across multiple formats (Reels & Stories)", impact: "+5%" });
  }

  if (stats?.responseTime?.achieved || (stats?.responseTime?.avgHours && stats.responseTime.avgHours <= 24)) {
    multiplier += 0.03;
    breakdown.push({ label: "Fast response time (< 24h average)", impact: "+3%" });
  }

  return { multiplier: Math.round(multiplier * 100) / 100, breakdown };
}

function roundToCleanINR(val) {
  if (val <= 0) return 0;
  if (val < 2000) return Math.round(val / 100) * 100;
  if (val < 10000) return Math.round(val / 250) * 250;
  if (val < 50000) return Math.round(val / 500) * 500;
  if (val < 200000) return Math.round(val / 1000) * 1000;
  return Math.round(val / 5000) * 5000;
}

export const getInsiderRate = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOne({ user: req.user._id }).lean();
    const latestCard = await RateCard.findOne({ influencer: req.user._id }).sort({ createdAt: -1 }).lean();

    // Extract real connected Instagram account
    const instagramAccount =
      profile?.socialAccounts?.find((s) => s.platform?.toLowerCase() === "instagram" && s.handle) || null;

    const followers = Number(instagramAccount?.followers || 0);
    const handle = (instagramAccount?.handle || req.user?.name || "creator")
      .replace(/^@+/, "")
      .trim();

    const tierInfo = getCreatorTier(followers);

    // Compute base rates from tier calculation or existing INR packages
    let baseReel = tierInfo.baseReel;
    let basePost = Math.round(baseReel * 0.75);
    let baseStory = Math.round(baseReel * 0.4);

    if (profile?.packages?.length > 0) {
      const reelPkg = profile.packages.find((p) => p.contentType === "Reel");
      const postPkg = profile.packages.find((p) => p.contentType === "Post");
      const storyPkg = profile.packages.find((p) => p.contentType === "Story");

      if (reelPkg?.price && reelPkg.price >= 500) baseReel = Number(reelPkg.price);
      if (postPkg?.price && postPkg.price >= 300) basePost = Number(postPkg.price);
      if (storyPkg?.price && storyPkg.price >= 200) baseStory = Number(storyPkg.price);
    } else if (latestCard?.rates?.reel && latestCard.rates.reel >= 500) {
      baseReel = Number(latestCard.rates.reel);
      basePost = Number(latestCard.rates.post) || Math.round(baseReel * 0.75);
      baseStory = Number(latestCard.rates.story) || Math.round(baseReel * 0.4);
    }

    const stats = await computeInfluencerStats(req.user._id);
    const { multiplier, breakdown } = computeInsiderMultiplier(stats);

    // Calculate recommended deliverables in INR (₹)
    const recommendedReel = roundToCleanINR(baseReel * multiplier);
    const recommendedPost = roundToCleanINR(basePost * multiplier);
    const recommendedStory = roundToCleanINR(baseStory * multiplier);
    const recommendedBundle = roundToCleanINR(recommendedReel * 3 * 0.85); // 15% bundle discount
    const recommendedRetainer = roundToCleanINR((recommendedReel * 4 + recommendedStory * 8) * 0.8); // 20% retainer discount

    res.json({
      currency: "INR",
      currencySymbol: "₹",
      handle,
      followers,
      tier: tierInfo.label,
      connectedInstagram: Boolean(instagramAccount?.handle),
      baseRates: {
        reel: baseReel,
        post: basePost,
        story: baseStory,
      },
      multiplier,
      breakdown,
      recommendedRates: {
        reel: recommendedReel,
        post: recommendedPost,
        story: recommendedStory,
        bundleReels3: recommendedBundle,
        monthlyRetainer: recommendedRetainer,
      },
      adjustedRates: {
        reel: recommendedReel,
        post: recommendedPost,
        story: recommendedStory,
        bundleReels3: recommendedBundle,
        monthlyRetainer: recommendedRetainer,
      },
      stats: {
        collaborationsCompleted: stats.collaborationsCompleted || 0,
        rating: stats.rating || 0,
        reviewsCount: stats.reviewsCount || 0,
        responseTimeHours: stats.responseTime?.avgHours || 24,
      },
      categories: profile?.categories || [],
    });
  } catch (error) {
    console.error("Error in getInsiderRate:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const refreshInstagramStats = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    const instagramAccount =
      profile.socialAccounts?.find((s) => s.platform?.toLowerCase() === "instagram") ||
      (profile.handle && profile.handle !== "@creator" && !profile.handle.includes("@creator")
        ? { platform: "Instagram", handle: profile.handle }
        : null);

    if (!instagramAccount?.handle) {
      return res.status(400).json({
        message: "No connected Instagram account found. Please connect your account first.",
      });
    }

    const clean = instagramAccount.handle.replace(/^@+/, "").trim();
    let scraped = null;

    try {
      scraped = await scrapeInstagram(clean);
    } catch (scrapeErr) {
      console.warn("Apify scrape note on refresh:", scrapeErr.message);
    }

    if (scraped) {
      const followers = scraped.followersCount ?? scraped.followers ?? instagramAccount.followers ?? 0;
      const verified = Boolean(scraped.verified ?? scraped.isVerified);

      const existingIndex = profile.socialAccounts.findIndex(
        (s) => s.platform.toLowerCase() === "instagram"
      );

      if (existingIndex >= 0) {
        profile.socialAccounts[existingIndex].followers = followers;
        profile.socialAccounts[existingIndex].verified = verified;
      } else {
        profile.socialAccounts.push({
          platform: "Instagram",
          handle: `@${clean}`,
          followers,
          verified,
        });
      }

      await profile.save();
    }

    return getInsiderRate(req, res);
  } catch (error) {
    console.error("Error refreshing stats:", error);
    res.status(500).json({ message: "Failed to refresh stats.", error: error.message });
  }
};
