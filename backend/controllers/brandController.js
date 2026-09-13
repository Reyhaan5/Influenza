import mongoose from "mongoose";
import BrandProfile from "../models/BrandProfile.js";
import Brand from "../models/Brand.js";
import Opportunity from "../models/Opportunity.js";
import Collaboration from "../models/Collaboration.js";
import TeamMember from "../models/TeamMember.js";
import SavedCreator from "../models/SavedCreator.js";
import InfluencerProfile from "../models/InfluencerProfile.js";

// ======================================
// GET BRAND PROFILE (Legacy / Settings)
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

// ======================================
// BRAND CRUD (Multiple brands / Sub-brands per user)
// ======================================

// GET ALL BRANDS FOR LOGGED-IN USER (with campaign counts)
export const getMyBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Attach campaign count for each brand
    const brandsWithCounts = await Promise.all(
      brands.map(async (b) => {
        const campaignCount = await Opportunity.countDocuments({
          brandEntity: b._id,
        });
        return {
          ...b.toObject(),
          campaignCount,
        };
      })
    );

    res.status(200).json({ brands: brandsWithCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch brands.", error: error.message });
  }
};

// CREATE A BRAND
export const createBrand = async (req, res) => {
  try {
    const { name, logo, websiteOrSocialLink, category, description, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Brand name is required." });
    }

    const brandLogo = req.file ? `/uploads/${req.file.filename}` : logo || "";

    const brand = await Brand.create({
      user: req.user._id,
      name,
      logo: brandLogo,
      websiteOrSocialLink: websiteOrSocialLink || "",
      category: category || "",
      description: description || "",
      status: status || "active",
    });

    res.status(201).json({
      message: "Brand created successfully.",
      brand: { ...brand.toObject(), campaignCount: 0 },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create brand.", error: error.message });
  }
};

// UPDATE A BRAND
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo, websiteOrSocialLink, category, description, status } = req.body;

    const brand = await Brand.findOne({ _id: id, user: req.user._id });
    if (!brand) {
      return res.status(404).json({ message: "Brand not found." });
    }

    if (name) brand.name = name;
    if (websiteOrSocialLink !== undefined) brand.websiteOrSocialLink = websiteOrSocialLink;
    if (category !== undefined) brand.category = category;
    if (description !== undefined) brand.description = description;
    if (status !== undefined) brand.status = status;

    if (req.file) {
      brand.logo = `/uploads/${req.file.filename}`;
    } else if (logo !== undefined) {
      brand.logo = logo;
    }

    await brand.save();

    const campaignCount = await Opportunity.countDocuments({ brandEntity: brand._id });

    res.status(200).json({
      message: "Brand updated successfully.",
      brand: { ...brand.toObject(), campaignCount },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update brand.", error: error.message });
  }
};

// DELETE A BRAND
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findOneAndDelete({ _id: id, user: req.user._id });
    if (!brand) {
      return res.status(404).json({ message: "Brand not found." });
    }
    res.status(200).json({ message: "Brand removed successfully.", brandId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to remove brand.", error: error.message });
  }
};

// ======================================
// TEAM MANAGEMENT (Organization members)
// ======================================
export const getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({ organizationUser: req.user._id }).sort({ createdAt: 1 });

    // Always include the current user as Organization owner
    const ownerMember = {
      _id: `owner_${req.user._id}`,
      name: req.user.name || "Organization Owner",
      email: req.user.email,
      role: "Owner",
      access: "Full Access",
      isOwner: true,
      status: "active",
      createdAt: req.user.createdAt || new Date(),
    };

    const allMembers = [ownerMember, ...members];
    res.status(200).json({ members: allMembers, count: allMembers.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch team members.", error: error.message });
  }
};

export const inviteTeamMember = async (req, res) => {
  try {
    const { name, email, access } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const memberName = name || email.split("@")[0];

    const member = await TeamMember.create({
      organizationUser: req.user._id,
      name: memberName,
      email,
      access: access || "Full Access",
      status: "active",
      isOwner: false,
    });

    res.status(201).json({ message: "Team member invited successfully.", member });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to invite team member.", error: error.message });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    if (id.startsWith("owner_")) {
      return res.status(400).json({ message: "Cannot remove the organization owner." });
    }

    const member = await TeamMember.findOneAndDelete({
      _id: id,
      organizationUser: req.user._id,
    });

    if (!member) {
      return res.status(404).json({ message: "Team member not found." });
    }

    res.status(200).json({ message: "Team member removed.", memberId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to remove member.", error: error.message });
  }
};

// ======================================
// SAVED CREATORS / FAVORITES (Real Data)
// ======================================
export const getSavedCreators = async (req, res) => {
  try {
    const saved = await SavedCreator.find({ user: req.user._id })
      .populate({
        path: "creator",
        populate: { path: "user", select: "name email avatar" },
      })
      .sort({ createdAt: -1 });

    const validSaved = saved.filter((s) => s.creator);
    res.status(200).json({ savedCreators: validSaved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch saved creators.", error: error.message });
  }
};

export const toggleSaveCreator = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { listName, notes } = req.body;

    let targetProfileId = creatorId;
    if (mongoose.Types.ObjectId.isValid(creatorId)) {
      const prof = await InfluencerProfile.findOne({
        $or: [{ _id: creatorId }, { user: creatorId }],
      });
      if (prof) targetProfileId = prof._id;
    }

    const existing = await SavedCreator.findOne({
      user: req.user._id,
      creator: targetProfileId,
    });

    if (existing) {
      await SavedCreator.findByIdAndDelete(existing._id);
      return res.status(200).json({ message: "Removed from saved creators.", isSaved: false });
    }

    const newSaved = await SavedCreator.create({
      user: req.user._id,
      creator: targetProfileId,
      listName: listName || "Favorites",
      notes: notes || "",
    });

    const populated = await SavedCreator.findById(newSaved._id).populate({
      path: "creator",
      populate: { path: "user", select: "name email avatar" },
    });

    res.status(201).json({
      message: "Creator saved to list.",
      isSaved: true,
      savedCreator: populated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to toggle creator save.", error: error.message });
  }
};

export const getSavedCreatorIds = async (req, res) => {
  try {
    const saved = await SavedCreator.find({ user: req.user._id })
      .populate("creator", "user")
      .select("creator");

    const ids = [];
    saved.forEach((s) => {
      if (s.creator) {
        ids.push(String(s.creator._id || s.creator));
        if (s.creator.user) {
          ids.push(String(s.creator.user._id || s.creator.user));
        }
      }
    });

    res.status(200).json({ savedIds: [...new Set(ids)] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch saved IDs.", error: error.message });
  }
};

// ======================================
// CREATIVE LIBRARY (Assets & Deliverables)
// ======================================
export const getCreativeLibrary = async (req, res) => {
  try {
    const campaigns = await Opportunity.find({ brand: req.user._id })
      .populate("brandEntity")
      .populate("product");

    const creatives = [];

    campaigns.forEach((camp) => {
      const brandName = camp.brandEntity?.name || "Brand";
      const brandLogo = camp.brandEntity?.logo || "";

      // Add deliverables from campaign definition
      if (camp.deliverables && camp.deliverables.length > 0) {
        camp.deliverables.forEach((deliv, idx) => {
          creatives.push({
            id: `${camp._id}_${idx}`,
            campaignId: camp._id,
            campaignTitle: camp.title,
            brandName,
            brandLogo,
            brandId: camp.brandEntity?._id,
            title: `${deliv.contentType || "UGC"} - ${deliv.mediaType || "Video"}`,
            mediaType: deliv.mediaType || "Video",
            format: deliv.format || "9:16 Vertical",
            status: "Approved",
            createdAt: camp.createdAt,
            referenceFiles: deliv.referenceFiles || [],
            rawOrReady: deliv.rawOrReady || "Ready to use Ad",
            creator: {
              name: "Featured UGC Creator",
              handle: "@creator",
              avatar: "",
            },
          });
        });
      }

      // Add product images as brand creative assets
      if (camp.product?.productImages && camp.product.productImages.length > 0) {
        camp.product.productImages.forEach((img, idx) => {
          creatives.push({
            id: `${camp.product._id}_img_${idx}`,
            campaignId: camp._id,
            campaignTitle: camp.title,
            brandName,
            brandLogo,
            brandId: camp.brandEntity?._id,
            title: `${camp.product.name || "Product"} Asset #${idx + 1}`,
            mediaType: "Photo",
            format: "1:1 Square",
            status: "Original",
            mediaUrl: img,
            createdAt: camp.product.createdAt || camp.createdAt,
            creator: {
              name: brandName,
              handle: `@${brandName.toLowerCase().replace(/\s+/g, "")}`,
              avatar: brandLogo,
            },
          });
        });
      }
    });

    res.status(200).json({ creatives });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load creative library.", error: error.message });
  }
};

// UPLOAD SINGLE / MULTIPLE ASSETS (Generic helper)
export const uploadFile = async (req, res) => {
  try {
    if (req.files && Array.isArray(req.files)) {
      const urls = req.files.map((f) => `/uploads/${f.filename}`);
      return res.status(200).json({ urls });
    }
    if (req.file) {
      return res.status(200).json({ url: `/uploads/${req.file.filename}` });
    }
    return res.status(400).json({ message: "No file provided." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed.", error: error.message });
  }
};