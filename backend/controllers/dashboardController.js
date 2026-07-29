import Collaboration from "../models/Collaboration.js";
import CollaborationRequest from "../models/CollaborationRequest.js";  // ← fixed, two L's
import Review from "../models/Review.js";

// GET /api/influencer/dashboard  (protected)
// Everything here is computed on the fly from real documents —
// no counters stored anywhere, so numbers can never go stale or fake.
export const getDashboardStats = async (req, res) => {
  try {
    const influencerId = req.user._id;

    const completedCollabs = await Collaboration.find({
      influencer: influencerId,
      stage: "completed",
    });

    const reviews = await Review.find({ influencer: influencerId });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    // Response time challenge: average time (hours) between a brand-sent
    // request and the influencer responding to it.
    const respondedRequests = await CollaborationRequest.find({
      influencer: influencerId,
      initiatedBy: "brand",
      respondedAt: { $ne: null },
    });
    const avgResponseHours =
      respondedRequests.length > 0
        ? respondedRequests.reduce((sum, r) => {
            const hours = (r.respondedAt - r.requestedAt) / (1000 * 60 * 60);
            return sum + hours;
          }, 0) / respondedRequests.length
        : null;

    // Activeness challenge: how many opportunities the influencer applied
    // to (self-initiated) in the last 7 days.
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentApplications = await CollaborationRequest.countDocuments({
      influencer: influencerId,
      initiatedBy: "influencer",
      requestedAt: { $gte: sevenDaysAgo },
    });

    // "Complete one collab in each format" challenge
    const formatsCompleted = [
      ...new Set(completedCollabs.map((c) => c.format)),
    ];

    res.json({
      stats: {
        collaborationsCompleted: completedCollabs.length,
        rating: Number(avgRating.toFixed(1)),
        reviewsCount: reviews.length,
      },
      challenges: {
        responseTime: {
          avgHours: avgResponseHours !== null ? Number(avgResponseHours.toFixed(1)) : null,
          achieved: avgResponseHours !== null && avgResponseHours < 48, // under 2 days
        },
        activeness: {
          applicationsThisWeek: recentApplications,
          achieved: recentApplications >= 7,
        },
        allFormats: {
          completed: formatsCompleted,
          achieved: formatsCompleted.length >= 3,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};