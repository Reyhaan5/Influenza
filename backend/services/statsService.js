// backend/services/statsService.js
import Collaboration from "../models/Collaboration.js";
import CollaborationRequest from "../models/CollaborationRequest.js";
import Review from "../models/Review.js";

// Shared by dashboardController (Stats/Challenges tab) and the new
// Insider Rate endpoint, so both read the exact same numbers.
export async function computeInfluencerStats(influencerId) {
  const completedCollabs = await Collaboration.find({
    influencer: influencerId,
    stage: "completed",
  });

  const reviews = await Review.find({ influencer: influencerId });
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

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

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentApplications = await CollaborationRequest.countDocuments({
    influencer: influencerId,
    initiatedBy: "influencer",
    requestedAt: { $gte: sevenDaysAgo },
  });

  const formatsCompleted = [...new Set(completedCollabs.map((c) => c.format))];

  return {
    collaborationsCompleted: completedCollabs.length,
    rating: Number(avgRating.toFixed(1)),
    reviewsCount: reviews.length,
    responseTime: {
      avgHours: avgResponseHours !== null ? Number(avgResponseHours.toFixed(1)) : null,
      achieved: avgResponseHours !== null && avgResponseHours < 48,
    },
    activeness: {
      applicationsThisWeek: recentApplications,
      achieved: recentApplications >= 7,
    },
    allFormats: {
      completed: formatsCompleted,
      achieved: formatsCompleted.length >= 3,
    },
  };
}