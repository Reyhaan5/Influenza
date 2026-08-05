import Opportunity from "../models/Opportunity.js";

// ======================================
// GET ALL CAMPAIGNS FOR THIS BRAND
// ======================================
export const getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await Opportunity.find({ brand: req.user._id }).sort({
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
      description,
      format,
      rewardValue,
      deliverablesRequired,
      requirements,
      deadline,
    } = req.body;

    if (!title || !format) {
      return res.status(400).json({ message: "Title and format are required." });
    }

    const campaign = await Opportunity.create({
      brand: req.user._id,
      title,
      description,
      format,
      rewardValue,
      deliverablesRequired: deliverablesRequired || 1,
      requirements,
      deadline: deadline || undefined,
    });

    res.status(201).json({
      message: "Campaign created successfully.",
      campaign,
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
    if (description !== undefined) campaign.description = description;
    if (format !== undefined) campaign.format = format;
    if (rewardValue !== undefined) campaign.rewardValue = rewardValue;
    if (deliverablesRequired !== undefined) campaign.deliverablesRequired = deliverablesRequired;
    if (requirements !== undefined) campaign.requirements = requirements;
    if (deadline !== undefined) campaign.deadline = deadline;
    if (status !== undefined) campaign.status = status;

    await campaign.save();

    res.status(200).json({
      message: "Campaign updated successfully.",
      campaign,
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