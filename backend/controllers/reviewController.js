import Review from "../models/Review.js";

// GET /api/influencer/reviews (protected, influencer)
// Powers the Reviews tab. Real Review docs left by brands after a
// completed collaboration — no fabricated data.
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ influencer: req.user._id })
      .populate("brand", "name")
      .populate({ path: "collaboration", select: "format createdAt" })
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({
      reviews,
      summary: {
        count: reviews.length,
        avgRating: Number(avgRating.toFixed(1)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch reviews.", error: error.message });
  }
};