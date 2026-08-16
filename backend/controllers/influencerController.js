import InfluencerProfile from "../models/InfluencerProfile.js";
import Opportunity from "../models/Opportunity.js";
import CollaborationRequest from "../models/CollaborationRequest.js";

const MAX_CATEGORIES = 3;

// GET /api/influencer/profile  (protected)
export const getMyProfile = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOne({ user: req.user._id })
      .populate("savedOpportunities");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/influencer/profile  (protected)
// "handle" and "categories" are directly editable here — social accounts have
// their own dedicated endpoints below, and stats/challenges are computed elsewhere.
export const updateMyProfile = async (req, res) => {
  try {
    const allowedUpdates = ["handle", "categories"];
    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (updates.categories !== undefined) {
      if (!Array.isArray(updates.categories)) {
        return res.status(400).json({ message: "categories must be an array." });
      }

      const cleaned = [
        ...new Set(
          updates.categories
            .map((c) => String(c).trim())
            .filter(Boolean)
        ),
      ];

      if (cleaned.length > MAX_CATEGORIES) {
        return res.status(400).json({ message: `You can select up to ${MAX_CATEGORIES} categories.` });
      }

      updates.categories = cleaned;
    }

    const profile = await InfluencerProfile.findOneAndUpdate(
      { user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/influencer/social-accounts  (protected)
// Manual entry for now — no OAuth verification yet.
// Body: { platform, handle, followers }
export const addSocialAccount = async (req, res) => {
  try {
    const { platform, handle, followers } = req.body;

    if (!platform || !handle) {
      return res.status(400).json({ message: "Platform and handle are required." });
    }

    const profile = await InfluencerProfile.findOneAndUpdate(
      { user: req.user._id },
      { $push: { socialAccounts: { platform, handle, followers: followers || 0, verified: false } } },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/influencer/opportunities  (protected)
// Open campaigns an influencer can browse and apply to, annotated with
// whether they've already sent a request for each one.
export const getOpenOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ status: "open" })
      .populate("brand", "name")
      .sort({ createdAt: -1 });

    const myRequests = await CollaborationRequest.find({
      influencer: req.user._id,
      opportunity: { $ne: null },
    }).select("opportunity status");

    const requestByOpportunity = new Map(
      myRequests.map((r) => [String(r.opportunity), r.status])
    );

    const withStatus = opportunities.map((o) => ({
      ...o.toObject(),
      myRequestStatus: requestByOpportunity.get(String(o._id)) || null,
    }));

    res.json({ opportunities: withStatus });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/influencer/social-accounts/:platform  (protected)
export const removeSocialAccount = async (req, res) => {
  try {
    const { platform } = req.params;

    const profile = await InfluencerProfile.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { socialAccounts: { platform } } },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
