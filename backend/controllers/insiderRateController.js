// backend/controllers/insiderRateController.js
import RateCard from "../models/RateCard.js";
import { computeInfluencerStats } from "../services/statsService.js";

function computeInsiderMultiplier(stats) {
  let multiplier = 1;
  const breakdown = [];

  const collabBonus = Math.min(stats.collaborationsCompleted * 0.02, 0.2);
  if (collabBonus > 0) {
    multiplier += collabBonus;
    breakdown.push({
      label: `${stats.collaborationsCompleted} completed collaborations`,
      impact: `+${Math.round(collabBonus * 100)}%`,
    });
  }

  if (stats.reviewsCount >= 3 && stats.rating > 4.0) {
    const ratingBonus = Math.min((stats.rating - 4.0) * 0.1, 0.1);
    multiplier += ratingBonus;
    breakdown.push({
      label: `${stats.rating}★ average across ${stats.reviewsCount} reviews`,
      impact: `+${Math.round(ratingBonus * 100)}%`,
    });
  }

  if (stats.allFormats.achieved) {
    multiplier += 0.05;
    breakdown.push({ label: "Proven across all collab formats", impact: "+5%" });
  }

  if (stats.responseTime.achieved) {
    multiplier += 0.03;
    breakdown.push({ label: "Fast, reliable response time", impact: "+3%" });
  }

  return { multiplier: Math.round(multiplier * 100) / 100, breakdown };
}

export const getInsiderRate = async (req, res) => {
  try {
    const latestCard = await RateCard.findOne({ influencer: req.user._id }).sort({ createdAt: -1 });

    if (!latestCard) {
      return res.status(404).json({
        message: "Print a rate card first — the insider rate builds on top of your base numbers.",
      });
    }

    const stats = await computeInfluencerStats(req.user._id);
    const { multiplier, breakdown } = computeInsiderMultiplier(stats);

    const adjustedRates = Object.fromEntries(
      Object.entries(latestCard.rates.toObject ? latestCard.rates.toObject() : latestCard.rates).map(
        ([format, value]) => [format, Math.round(value * multiplier)]
      )
    );

    res.json({
      baseRates: latestCard.rates,
      multiplier,
      breakdown,
      adjustedRates,
      basedOn: { collaborationsCompleted: stats.collaborationsCompleted, rating: stats.rating },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
