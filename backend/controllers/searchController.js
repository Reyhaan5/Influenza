import InfluencerProfile from "../models/InfluencerProfile.js";

// ======================================
// SEARCH / BROWSE CREATORS
// Query params: q (handle search), platform, minFollowers
// ======================================
export const searchCreators = async (req, res) => {
  try {
    const { q, platform, minFollowers } = req.query;

    const filter = { approved: true };

    if (q) {
      filter.handle = { $regex: q, $options: "i" };
    }

    let profiles = await InfluencerProfile.find(filter)
      .populate("user", "name email")
      .lean();

    // Filter by platform / minFollowers on the socialAccounts sub-array —
    // easier to do in JS here than a complex Mongo query given the
    // variable-length embedded array.
    if (platform) {
      profiles = profiles.filter((p) =>
        p.socialAccounts?.some(
          (acc) => acc.platform.toLowerCase() === platform.toLowerCase()
        )
      );
    }

    if (minFollowers) {
      const min = Number(minFollowers);
      profiles = profiles.filter((p) => {
        const maxFollowers = Math.max(
          0,
          ...(p.socialAccounts || []).map((acc) => acc.followers || 0)
        );
        return maxFollowers >= min;
      });
    }

    res.status(200).json({ creators: profiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to search creators.",
      error: error.message,
    });
  }
};