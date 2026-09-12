import { calculateInfluRate } from "../utils/influRateCalculator.js";
import InfluencerProfile from "../models/InfluencerProfile.js";

// POST /api/public/influrate/calculate (Calculate on arbitrary parameters)
export const calculateInfluRateHandler = async (req, res) => {
  try {
    const { followers, avgLikes, avgComments, verified, niche } = req.body;
    const result = calculateInfluRate({
      followers,
      avgLikes,
      avgComments,
      verified,
      niche,
    });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error calculating InfluRate", error: error.message });
  }
};

// GET /api/public/influrate/creator/:id (Calculate for a specific creator profile)
export const getCreatorInfluRateHandler = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findById(req.params.id).populate("user", "name email");
    if (!profile) {
      return res.status(404).json({ message: "Creator profile not found" });
    }

    const igAccount = profile.socialAccounts?.find((a) => a.platform?.toLowerCase() === "instagram") || profile.socialAccounts?.[0] || {};
    const followers = igAccount.followers || 10000;
    const verified = igAccount.verified || false;
    const niche = profile.categories?.[0] || profile.matchProfile?.niche?.[0] || "lifestyle";

    // Approximate engagement if not stored: estimate 3-5% base for realistic display
    const avgLikes = Math.round(followers * 0.04);
    const avgComments = Math.round(followers * 0.002);

    const result = calculateInfluRate({
      followers,
      avgLikes,
      avgComments,
      verified,
      niche,
    });

    return res.json({
      creatorId: profile._id,
      handle: profile.handle,
      name: profile.user?.name,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching creator InfluRate", error: error.message });
  }
};
