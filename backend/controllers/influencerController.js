import InfluencerProfile from "../models/InfluencerProfile.js";

// GET /api/influencer/profile  (protected)
// Returns everything InfluencerDashboard.jsx needs in one call:
// handle, followers, stats, challenges, trophies.
export const getMyProfile = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/influencer/profile  (protected)
// Lets the influencer update editable fields (e.g. after connecting
// TikTok, or updating handle). We only allow specific fields to change
// so someone can't PUT { approved: true } and self-approve.
export const updateMyProfile = async (req, res) => {
  try {
    const allowedUpdates = ["handle", "posts", "followers", "following"];
    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const profile = await InfluencerProfile.findOneAndUpdate(
      { user: req.user._id },
      updates,
      { new: true } // return the UPDATED document, not the old one
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
