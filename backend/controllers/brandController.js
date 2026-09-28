import mongoose from "mongoose";
import BrandProfile from "../models/BrandProfile.js";
import Brand from "../models/Brand.js";
import Opportunity from "../models/Opportunity.js";
import Collaboration from "../models/Collaboration.js";
import TeamMember from "../models/TeamMember.js";
import SavedCreator from "../models/SavedCreator.js";
import InfluencerProfile from "../models/InfluencerProfile.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// ======================================
// GET & UPDATE BRAND PROFILE
// ======================================
export const getBrandProfile = asyncHandler(async (req, res) => {
  let profile = await BrandProfile.findOne({ user: req.user._id });
  if (!profile) {
    profile = await BrandProfile.create({ user: req.user._id, email: req.user.email });
  }
  res.status(200).json(profile);
});

export const saveCompanyInfo = asyncHandler(async (req, res) => {
  const { companyName, industry, website, location } = req.body;
  const profile = await BrandProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: { companyName, industry, website, email: req.user.email, location } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.status(200).json({ message: "Company information saved successfully.", profile });
});

// ======================================
// BRAND DASHBOARD STATS
// ======================================
export const getBrandDashboardStats = asyncHandler(async (req, res) => {
  const [activeCampaigns, collaborations] = await Promise.all([
    Opportunity.countDocuments({ brand: req.user._id, status: "open" }),
    Collaboration.countDocuments({ brand: req.user._id }),
  ]);
  res.status(200).json({ stats: { activeCampaigns, collaborations } });
});

// ======================================
// BRAND CRUD
// ======================================
export const getMyBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  const brandIds = brands.map((b) => b._id);
  
  const counts = await Opportunity.aggregate([
    { $match: { brandEntity: { $in: brandIds } } },
    { $group: { _id: "$brandEntity", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));

  const brandsWithCounts = brands.map((b) => ({
    ...b,
    campaignCount: countMap.get(String(b._id)) || 0,
  }));

  res.status(200).json({ brands: brandsWithCounts });
});

export const createBrand = asyncHandler(async (req, res) => {
  const { name, logo, websiteOrSocialLink, category, description, status } = req.body;
  if (!name) return res.status(400).json({ message: "Brand name is required." });

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

  res.status(201).json({ message: "Brand created successfully.", brand: { ...brand.toObject(), campaignCount: 0 } });
});

export const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  if (req.file) updates.logo = `/uploads/${req.file.filename}`;

  const brand = await Brand.findOneAndUpdate({ _id: id, user: req.user._id }, { $set: updates }, { new: true }).lean();
  if (!brand) return res.status(404).json({ message: "Brand not found." });

  const campaignCount = await Opportunity.countDocuments({ brandEntity: brand._id });
  res.status(200).json({ message: "Brand updated successfully.", brand: { ...brand, campaignCount } });
});

export const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const brand = await Brand.findOneAndDelete({ _id: id, user: req.user._id });
  if (!brand) return res.status(404).json({ message: "Brand not found." });
  res.status(200).json({ message: "Brand removed successfully.", brandId: id });
});

// ======================================
// TEAM MANAGEMENT
// ======================================
export const getTeamMembers = asyncHandler(async (req, res) => {
  const members = await TeamMember.find({ organizationUser: req.user._id }).sort({ createdAt: 1 }).lean();
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
  res.status(200).json({ members: [ownerMember, ...members], count: members.length + 1 });
});

export const inviteTeamMember = asyncHandler(async (req, res) => {
  const { name, email, access } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  const member = await TeamMember.create({
    organizationUser: req.user._id,
    name: name || email.split("@")[0],
    email,
    access: access || "Full Access",
    status: "active",
    isOwner: false,
  });
  res.status(201).json({ message: "Team member invited successfully.", member });
});

export const deleteTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (id.startsWith("owner_")) return res.status(400).json({ message: "Cannot remove the organization owner." });

  const member = await TeamMember.findOneAndDelete({ _id: id, organizationUser: req.user._id });
  if (!member) return res.status(404).json({ message: "Team member not found." });
  res.status(200).json({ message: "Team member removed.", memberId: id });
});

// ======================================
// SAVED CREATORS / FAVORITES
// ======================================
export const getSavedCreators = asyncHandler(async (req, res) => {
  const saved = await SavedCreator.find({ user: req.user._id })
    .populate({ path: "creator", populate: { path: "user", select: "name email avatar" } })
    .sort({ createdAt: -1 });
  res.status(200).json({ savedCreators: saved.filter((s) => s.creator) });
});

export const toggleSaveCreator = asyncHandler(async (req, res) => {
  const { creatorId } = req.params;
  let targetProfileId = creatorId;

  if (mongoose.Types.ObjectId.isValid(creatorId)) {
    const prof = await InfluencerProfile.findOne({ $or: [{ _id: creatorId }, { user: creatorId }] });
    if (prof) targetProfileId = prof._id;
  }

  const existing = await SavedCreator.findOne({ user: req.user._id, creator: targetProfileId });
  if (existing) {
    await SavedCreator.findByIdAndDelete(existing._id);
    return res.status(200).json({ message: "Removed from saved creators.", isSaved: false });
  }

  const newSaved = await SavedCreator.create({
    user: req.user._id,
    creator: targetProfileId,
    listName: req.body.listName || "Favorites",
    notes: req.body.notes || "",
  });
  const populated = await SavedCreator.findById(newSaved._id).populate({
    path: "creator",
    populate: { path: "user", select: "name email avatar" },
  });

  res.status(201).json({ message: "Creator saved to list.", isSaved: true, savedCreator: populated });
});

export const getSavedCreatorIds = asyncHandler(async (req, res) => {
  const saved = await SavedCreator.find({ user: req.user._id }).populate("creator", "user").select("creator");
  const ids = new Set();
  saved.forEach((s) => {
    if (s.creator) {
      ids.add(String(s.creator._id || s.creator));
      if (s.creator.user) ids.add(String(s.creator.user._id || s.creator.user));
    }
  });
  res.status(200).json({ savedIds: Array.from(ids) });
});

// ======================================
// CREATIVE LIBRARY & UPLOAD HELPER
// ======================================
export const getCreativeLibrary = asyncHandler(async (req, res) => {
  const campaigns = await Opportunity.find({ brand: req.user._id })
    .populate("brandEntity")
    .populate("product")
    .lean();

  const creatives = [];
  campaigns.forEach((camp) => {
    const brandName = camp.brandEntity?.name || "Brand";
    const brandLogo = camp.brandEntity?.logo || "";

    (camp.deliverables || []).forEach((deliv, idx) => {
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
        creator: { name: "Featured UGC Creator", handle: "@creator", avatar: "" },
      });
    });

    (camp.product?.productImages || []).forEach((img, idx) => {
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
        creator: { name: brandName, handle: `@${brandName.toLowerCase().replace(/\s+/g, "")}`, avatar: brandLogo },
      });
    });
  });

  res.status(200).json({ creatives });
});

export const uploadFile = asyncHandler(async (req, res) => {
  if (req.files && Array.isArray(req.files)) {
    return res.status(200).json({ urls: req.files.map((f) => `/uploads/${f.filename}`) });
  }
  if (req.file) {
    return res.status(200).json({ url: `/uploads/${req.file.filename}` });
  }
  res.status(400).json({ message: "No file provided." });
});