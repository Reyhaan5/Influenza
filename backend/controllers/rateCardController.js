import RateCard from "../models/RateCard.js";

// POST /api/influencer/rate-cards  (protected)
export const saveRateCard = async (req, res) => {
  try {
    const { followers, avgLikes, avgComments, nicheId, marketId, rates } = req.body;
    const card = await RateCard.create({
      influencer: req.user._id,
      followers,
      avgLikes,
      avgComments,
      nicheId,
      marketId,
      rates,
    });
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/influencer/rate-cards  (protected)
export const getMyRateCards = async (req, res) => {
  try {
    const cards = await RateCard.find({ influencer: req.user._id }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};