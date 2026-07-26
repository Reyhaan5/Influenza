import InfluencerProfile from "../models/InfluencerProfile.js";

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
// Only "handle" is directly editable here — social accounts have their own
// dedicated endpoints below, and stats/challenges are computed elsewhere.
export const updateMyProfile = async (req, res) => {
  try {
    const allowedUpdates = ["handle"];
    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const profile = await InfluencerProfile.findOneAndUpdate(
      { user: req.user._id },
      updates,
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

// POST /api/influencer/social-accounts  (protected)
// Manual entry — no verification yet. Body: { platform, handle, followers }
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