import RateCard from "../models/RateCard.js";
import InfluencerProfile from "../models/InfluencerProfile.js";

// POST or PUT /api/influencer/rate-cards & /api/influencer/rate-card (protected)
export const saveRateCard = async (req, res) => {
  try {
    const { followers, avgLikes, avgComments, nicheId, marketId, rates, packages } = req.body;

    let card = await RateCard.findOne({ influencer: req.user._id });

    if (card) {
      if (followers !== undefined) card.followers = followers;
      if (avgLikes !== undefined) card.avgLikes = avgLikes;
      if (avgComments !== undefined) card.avgComments = avgComments;
      if (nicheId !== undefined) card.nicheId = nicheId;
      if (marketId !== undefined) card.marketId = marketId;
      if (rates !== undefined) card.rates = rates;
      if (packages !== undefined) card.packages = packages;
      await card.save();
    } else {
      card = await RateCard.create({
        influencer: req.user._id,
        followers: followers || 0,
        avgLikes: avgLikes || 0,
        avgComments: avgComments || 0,
        nicheId: nicheId || "general",
        marketId: marketId || "global",
        rates: rates || { post: 50, reel: 60, story: 30 },
        packages: packages || [],
      });
    }

    // Sync packages to InfluencerProfile as well
    if (packages && Array.isArray(packages)) {
      await InfluencerProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: { packages } }
      );
    }

    res.status(200).json(card);
  } catch (error) {
    console.error("Error saving rate card:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/influencer/rate-cards & /api/influencer/rate-card (protected)
export const getMyRateCards = async (req, res) => {
  try {
    const cards = await RateCard.find({ influencer: req.user._id }).sort({ createdAt: -1 });
    const profile = await InfluencerProfile.findOne({ user: req.user._id }).select("packages");

    if (cards.length > 0) {
      const latest = cards[0].toObject();
      if (profile?.packages?.length > 0 && (!latest.packages || latest.packages.length === 0)) {
        latest.packages = profile.packages;
      }
      return res.json(latest);
    }

    // Fallback if no ratecard exists yet
    res.json({
      influencer: req.user._id,
      followers: 0,
      rates: { post: 50, reel: 60, story: 30 },
      packages: profile?.packages || [],
    });
  } catch (error) {
    console.error("Error getting rate cards:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};