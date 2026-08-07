import BrandProfile from "../models/BrandProfile.js";
import Opportunity from "../models/Opportunity.js";
import Collaboration from "../models/Collaboration.js";

// ======================================
// GET BRAND PROFILE
// ======================================
export const getBrandProfile = async (req, res) => {
  try {
    let profile = await BrandProfile.findOne({
      user: req.user._id,
    });

    // Create empty profile if it doesn't exist
    if (!profile) {
      profile = await BrandProfile.create({
        user: req.user._id,
        email: req.user.email,
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to fetch profile.",
    });
  }
};

// ======================================
// SAVE COMPANY INFORMATION ONLY
// ======================================
export const saveCompanyInfo = async (req, res) => {
  try {
    const { companyName, industry, website, location } = req.body;

    let profile = await BrandProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new BrandProfile({
        user: req.user._id,
        email: req.user.email,
      });
    }

    profile.companyName = companyName;
    profile.industry = industry;
    profile.website = website;
    profile.email = req.user.email;
    profile.location = location;

    await profile.save();

    res.status(200).json({
      message: "Company information saved successfully.",
      profile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to save company information.",
      error: error.message,
    });
  }
};

// ======================================
// BRAND DASHBOARD STATS (real counts)
// ======================================
export const getBrandDashboardStats = async (req, res) => {
  try {
    const brandId = req.user._id;

    const activeCampaigns = await Opportunity.countDocuments({
      brand: brandId,
      status: "open",
    });

    const collaborationsCount = await Collaboration.countDocuments({
      brand: brandId,
    });

    res.status(200).json({
      stats: {
        activeCampaigns,
        collaborations: collaborationsCount,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to fetch dashboard stats.",
      error: error.message,
    });
  }
};