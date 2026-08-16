import InfluencerProfile from "../models/InfluencerProfile.js";

// GET /api/public/creators-by-category?category=Skincare
// Public — no auth. Only surfaces approved influencers, and only the fields
// safe to show to a logged-out visitor.
export const getCreatorsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "category query param is required." });
    }

    const creators = await InfluencerProfile.find({
      approved: true,
      categories: category,
    })
      .populate("user", "name")
      .select("handle socialAccounts categories user")
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ category, creators });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to fetch creators for this category.",
      error: error.message,
    });
  }
};
