// backend/controllers/insiderRateController.js
import RateCard from "../models/RateCard.js";
import InfluencerProfile from "../models/InfluencerProfile.js";
import { computeInfluencerStats } from "../services/statsService.js";

function getCreatorTier(followers = 0) {
  if (followers >= 1000000) return { label: "Mega Creator", cpm: 3.5, baseReel: 850 };
  if (followers >= 250000) return { label: "Macro Creator", cpm: 5.0, baseReel: 450 };
  if (followers >= 50000) return { label: "Mid-Tier Creator", cpm: 6.5, baseReel: 220 };
  if (followers >= 10000) return { label: "Micro Creator", cpm: 9.0, baseReel: 120 };
  return { label: "Nano Creator", cpm: 12.0, baseReel: 65 };
}

function computeInsiderMultiplier(stats) {
  let multiplier = 1;
  const breakdown = [];

  const completed = Number(stats?.collaborationsCompleted) || 0;
  const reviewsCount = Number(stats?.reviewsCount) || 0;
  const rating = Number(stats?.rating) || 5.0;

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

export const getInsiderRate = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOne({ user: req.user._id }).lean();
    const latestCard = await RateCard.findOne({ influencer: req.user._id }).sort({ createdAt: -1 }).lean();

    // Extract real connected Instagram account
    const instagramAccount =
      profile?.socialAccounts?.find((s) => s.platform?.toLowerCase() === "instagram") ||
      (profile?.handle
        ? {
            platform: "Instagram",
            handle: profile.handle,
            followers: profile.followers || profile.stats?.followers || 0,
          }
        : null);

    const followers = Number(instagramAccount?.followers || profile?.followers || 5000);
    const handle = (instagramAccount?.handle || profile?.handle || req.user.name || "creator")
      .replace(/^@+/, "")
      .trim();

    const tierInfo = getCreatorTier(followers);

    // Compute base rates from profile packages or tier calculation
    let baseReel = tierInfo.baseReel;
    let basePost = Math.round(baseReel * 0.8);
    let baseStory = Math.round(baseReel * 0.45);

    if (profile?.packages?.length > 0) {
      const reelPkg = profile.packages.find((p) => p.contentType === "Reel");
      const postPkg = profile.packages.find((p) => p.contentType === "Post");
      const storyPkg = profile.packages.find((p) => p.contentType === "Story");

      if (reelPkg?.price && reelPkg.price < 5000) baseReel = Number(reelPkg.price);
      if (postPkg?.price && postPkg.price < 5000) basePost = Number(postPkg.price);
      if (storyPkg?.price && storyPkg.price < 5000) baseStory = Number(storyPkg.price);
    } else if (latestCard?.rates?.reel && latestCard.rates.reel < 5000) {
      baseReel = Number(latestCard.rates.reel);
      basePost = Number(latestCard.rates.post) || Math.round(baseReel * 0.8);
      baseStory = Number(latestCard.rates.story) || Math.round(baseReel * 0.45);
    }

    const stats = await computeInfluencerStats(req.user._id);
    const { multiplier, breakdown } = computeInsiderMultiplier(stats);

    // Calculate recommended deliverables: What you should charge
    const recommendedReel = Math.round(baseReel * multiplier);
    const recommendedPost = Math.round(basePost * multiplier);
    const recommendedStory = Math.round(baseStory * multiplier);
    const recommendedBundle = Math.round(recommendedReel * 3 * 0.85); // 15% bundle discount
    const recommendedRetainer = Math.round((recommendedReel * 4 + recommendedStory * 8) * 0.8); // 20% retainer discount

    res.json({
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
        rating: stats.rating || 5.0,
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
