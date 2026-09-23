import Review from "../models/Review.js";
import Collaboration from "../models/Collaboration.js";

// GET /api/influencer/reviews (protected, influencer)
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ influencer: req.user._id })
      .populate("brand", "name company")
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

// POST /api/brand/reviews (protected, brand)
export const createReview = async (req, res) => {
  try {
    const { collaborationId, rating, comment } = req.body;

    if (!collaborationId || !rating) {
      return res.status(400).json({ message: "Collaboration ID and rating are required." });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    const collab = await Collaboration.findById(collaborationId);
    if (!collab) {
      return res.status(404).json({ message: "Collaboration not found." });
    }

    if (String(collab.brand) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only the hiring brand can leave a review." });
    }

    const existing = await Review.findOne({ collaboration: collaborationId });
    if (existing) {
      existing.rating = numRating;
      existing.comment = comment || "";
      await existing.save();
      return res.json({ message: "Review updated successfully.", review: existing });
    }

    const review = await Review.create({
      collaboration: collab._id,
      brand: req.user._id,
      influencer: collab.influencer,
      rating: numRating,
      comment: comment || "",
    });

    res.status(201).json({ message: "Review submitted successfully.", review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/brand/reviews/:collabId (protected)
export const getReviewByCollab = async (req, res) => {
  try {
    const { collabId } = req.params;
    const review = await Review.findOne({ collaboration: collabId });
    res.json({ review });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};