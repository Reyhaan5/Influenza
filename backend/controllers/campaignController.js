import Opportunity from "../models/Opportunity.js";

// ======================================
// GET ALL CAMPAIGNS FOR THIS BRAND
// ======================================
export const getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await Opportunity.find({ brand: req.user._id })
      .populate("brandEntity")
      .populate("product")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({ campaigns });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to fetch campaigns.",
      error: error.message,
    });
  }
};

// ======================================
// CREATE A CAMPAIGN
// ======================================
export const createCampaign = async (req, res) => {
  try {
    const {
      title,
      brandEntity,
      product,
      campaignGoal,
      platform,
      campaignType,
      boostWithPartnershipAds,
      campaignVisibility,
      productDelivery,

      // Step 3
      creatorsCountTier,
      targetCreatorsCount,
      lookalikesLink,
      autoInviteSource,
      excludePastCampaigns,
      excludeCreatorsType,
      excludeCampaignNames,

      // Step 4
      deliverables,

      // Step 5
      minFeePerCreator,
      maxFeePerCreator,
      salesCommissionsEnabled,
      commissionRate,

      currentStep,
      description,
      format,
      rewardValue,
      deliverablesRequired,
      requirements,
      deadline,
      status,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Campaign title is required." });
    }

    const campaign = await Opportunity.create({
      brand: req.user._id,
      brandEntity: brandEntity || undefined,
      product: product || undefined,
      title,
      campaignGoal: campaignGoal || "Multi-Channel UGC",
      platform: platform || "Meta",
      campaignType: campaignType || "User-Generated Content",
      boostWithPartnershipAds: Boolean(boostWithPartnershipAds),
      campaignVisibility: campaignVisibility || "Visible to matched creators",
      productDelivery: productDelivery || "",

      // Step 3
      creatorsCountTier: creatorsCountTier || "<5",
      targetCreatorsCount: targetCreatorsCount ? Number(targetCreatorsCount) : 3,
      lookalikesLink: lookalikesLink || "",
      autoInviteSource: autoInviteSource || "From Lists",
      excludePastCampaigns: Boolean(excludePastCampaigns),
      excludeCreatorsType: excludeCreatorsType || "All creators",
      excludeCampaignNames: excludeCampaignNames || [],

      // Step 4
      deliverables: deliverables && Array.isArray(deliverables) ? deliverables : undefined,

      // Step 5
      minFeePerCreator: Number(minFeePerCreator) || 0,
      maxFeePerCreator: Number(maxFeePerCreator) || 0,
      salesCommissionsEnabled: Boolean(salesCommissionsEnabled),
      commissionRate: commissionRate !== undefined ? Number(commissionRate) : 10,

      currentStep: currentStep || 1,
      description: description || "",
      format: format || "money",
      rewardValue:
        rewardValue ||
        (minFeePerCreator && maxFeePerCreator
          ? `$${minFeePerCreator} - $${maxFeePerCreator}`
          : ""),
      deliverablesRequired:
        deliverables && Array.isArray(deliverables)
          ? deliverables.length
          : deliverablesRequired || 1,
      requirements: requirements || "",
      deadline: deadline || undefined,
      status: status || "open",
    });

    const populated = await Opportunity.findById(campaign._id)
      .populate("brandEntity")
      .populate("product");

    res.status(201).json({
      message: "Campaign created successfully.",
      campaign: populated || campaign,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to create campaign.",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE A CAMPAIGN
// ======================================
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      brandEntity,
      product,
      campaignGoal,
      platform,
      campaignType,
      boostWithPartnershipAds,
      campaignVisibility,
      productDelivery,

      // Step 3
      creatorsCountTier,
      targetCreatorsCount,
      lookalikesLink,
      autoInviteSource,
      excludePastCampaigns,
      excludeCreatorsType,
      excludeCampaignNames,

      // Step 4
      deliverables,

      // Step 5
      minFeePerCreator,
      maxFeePerCreator,
      salesCommissionsEnabled,
      commissionRate,

      currentStep,
      description,
      format,
      rewardValue,
      deliverablesRequired,
      requirements,
      deadline,
      status,
    } = req.body;

    const campaign = await Opportunity.findOne({ _id: id, brand: req.user._id });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    if (title !== undefined) campaign.title = title;
    if (brandEntity !== undefined) campaign.brandEntity = brandEntity || undefined;
    if (product !== undefined) campaign.product = product || undefined;
    if (campaignGoal !== undefined) campaign.campaignGoal = campaignGoal;
    if (platform !== undefined) campaign.platform = platform;
    if (campaignType !== undefined) campaign.campaignType = campaignType;
    if (boostWithPartnershipAds !== undefined) {
      campaign.boostWithPartnershipAds = Boolean(boostWithPartnershipAds);
    }
    if (campaignVisibility !== undefined) campaign.campaignVisibility = campaignVisibility;
    if (productDelivery !== undefined) campaign.productDelivery = productDelivery;

    // Step 3
    if (creatorsCountTier !== undefined) campaign.creatorsCountTier = creatorsCountTier;
    if (targetCreatorsCount !== undefined) {
      campaign.targetCreatorsCount = Number(targetCreatorsCount);
    }
    if (lookalikesLink !== undefined) campaign.lookalikesLink = lookalikesLink;
    if (autoInviteSource !== undefined) campaign.autoInviteSource = autoInviteSource;
    if (excludePastCampaigns !== undefined) {
      campaign.excludePastCampaigns = Boolean(excludePastCampaigns);
    }
    if (excludeCreatorsType !== undefined) campaign.excludeCreatorsType = excludeCreatorsType;
    if (excludeCampaignNames !== undefined) campaign.excludeCampaignNames = excludeCampaignNames;

    // Step 4
    if (deliverables !== undefined && Array.isArray(deliverables)) {
      campaign.deliverables = deliverables;
      campaign.deliverablesRequired = deliverables.length;
    }

    // Step 5
    if (minFeePerCreator !== undefined) campaign.minFeePerCreator = Number(minFeePerCreator);
    if (maxFeePerCreator !== undefined) campaign.maxFeePerCreator = Number(maxFeePerCreator);
    if (salesCommissionsEnabled !== undefined) {
      campaign.salesCommissionsEnabled = Boolean(salesCommissionsEnabled);
    }
    if (commissionRate !== undefined) campaign.commissionRate = Number(commissionRate);

    if (currentStep !== undefined) campaign.currentStep = currentStep;
    if (description !== undefined) campaign.description = description;
    if (format !== undefined) campaign.format = format;
    if (rewardValue !== undefined) campaign.rewardValue = rewardValue;
    if (deliverablesRequired !== undefined) campaign.deliverablesRequired = deliverablesRequired;
    if (requirements !== undefined) campaign.requirements = requirements;
    if (deadline !== undefined) campaign.deadline = deadline;
    if (status !== undefined) campaign.status = status;

    await campaign.save();

    const populated = await Opportunity.findById(campaign._id)
      .populate("brandEntity")
      .populate("product");

    res.status(200).json({
      message: "Campaign updated successfully.",
      campaign: populated || campaign,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to update campaign.",
      error: error.message,
    });
  }
};

// ======================================
// DELETE A CAMPAIGN
// ======================================
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Opportunity.findOneAndDelete({
      _id: id,
      brand: req.user._id,
    });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    res.status(200).json({
      message: "Campaign removed successfully.",
      campaignId: id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to remove campaign.",
      error: error.message,
    });
  }
};