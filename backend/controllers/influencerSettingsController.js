import InfluencerProfile from "../models/InfluencerProfile.js";
import User from "../models/User.js";

// ======================================
// PUT /api/influencer/profile/personal
// ======================================
export const updatePersonalInfo = async (req, res) => {
  try {
    const { firstName, lastName, email, birthday, gender, ethnicity, petOwner } = req.body;

    // Only touch User.email if it actually changed, and only if it's free.
    if (email && email !== req.user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: "That email is already in use." });
      }
      await User.findByIdAndUpdate(req.user._id, { email });
    }

    const profile = await InfluencerProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        personalInfo: {
          firstName: firstName || "",
          lastName: lastName || "",
          birthday: birthday ? new Date(birthday) : undefined,
          gender: gender || "",
          ethnicity: ethnicity || "",
          petOwner: petOwner || "No",
        },
      },
      { new: true, runValidators: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found." });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================================
// PUT /api/influencer/profile/address
// ======================================
export const updateAddress = async (req, res) => {
  try {
    const { line1, line2, city, county, state, postcode, country, phoneNumber } = req.body;

    const profile = await InfluencerProfile.findOneAndUpdate(
      { user: req.user._id },
      { address: { line1, line2, city, county, state, postcode, country, phoneNumber } },
      { new: true, runValidators: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found." });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================================
// PUT /api/influencer/profile/notifications
// ======================================
export const updateNotifications = async (req, res) => {
  try {
    const { dailyDigest, marketing, unreadMessages, contractAgreements, automaticFollowups } = req.body;

    const profile = await InfluencerProfile.findOneAndUpdate(
      { user: req.user._id },
      { notifications: { dailyDigest, marketing, unreadMessages, contractAgreements, automaticFollowups } },
      { new: true, runValidators: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found." });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================================
// PUT /api/influencer/profile/password
// ======================================
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, repeatPassword } = req.body;

    if (!oldPassword || !newPassword || !repeatPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }
    if (newPassword !== repeatPassword) {
      return res.status(400).json({ message: "New passwords do not match." });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }

    user.password = newPassword; // pre-save hook in User.js hashes it
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================================
// PUT /api/influencer/profile/match-profile
// ======================================
export const updateMatchProfile = async (req, res) => {
  try {
    const {
      campaignActive,
      invitationsActive,
      collaborationFormats,
      paymentType,
      minAskingPrice,
      maxAskingPrice,
      bio,
      passions,
      topics,
      niche,
      leadTimeDays,
      preferredCompanies,
      interestedBrands,
      audienceGender,
      audienceAgeRange,
      followersLocations,
    } = req.body;

    const profile = await InfluencerProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        matchProfile: {
          campaignActive: campaignActive !== undefined ? campaignActive : true,
          invitationsActive: invitationsActive !== undefined ? invitationsActive : true,
          collaborationFormats: collaborationFormats || [],
          paymentType: paymentType || "gifted",
          minAskingPrice: minAskingPrice || undefined,
          maxAskingPrice: maxAskingPrice || undefined,
          bio: bio || "",
          passions: passions || "",
          topics: topics || [],
          niche: niche || [],
          leadTimeDays: leadTimeDays || undefined,
          preferredCompanies: preferredCompanies || [],
          interestedBrands: interestedBrands || [],
          audienceGender: audienceGender || "",
          audienceAgeRange: audienceAgeRange || "",
          followersLocations: followersLocations || [],
        },
      },
      { new: true, runValidators: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found." });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};