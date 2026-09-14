import mongoose from "mongoose";
import CollaborationRequest from "../models/CollaborationRequest.js";
import Opportunity from "../models/Opportunity.js";
import Collaboration from "../models/Collaboration.js";
import InfluencerProfile from "../models/InfluencerProfile.js";
import User from "../models/User.js";

// ======================================
// CREATE A COLLABORATION REQUEST
// Works both directions:
//   - Brand -> Influencer: body { influencerId, opportunityId?, message?, packageSelected? }
//   - Influencer -> Brand: body { opportunityId }  (applying to an open campaign)
// ======================================
export const createRequest = async (req, res) => {
  try {
    const { influencerId, opportunityId, message, packageSelected } = req.body;
    const role = req.user.role;

    let brandId;
    let targetInfluencerId;
    let opportunity = null;

    if (opportunityId) {
      opportunity = await Opportunity.findById(opportunityId);
      if (!opportunity) {
        return res.status(404).json({ message: "Campaign not found." });
      }
      if (opportunity.status !== "open") {
        return res.status(400).json({ message: "This campaign is no longer open." });
      }
    }

    if (role === "brand") {
      // Brand is reaching out to a specific influencer, optionally tied to one of their campaigns.
      if (!influencerId) {
        return res.status(400).json({ message: "influencerId is required." });
      }
      brandId = req.user._id;

      // Resolve target influencer User ID
      targetInfluencerId = influencerId;
      if (mongoose.Types.ObjectId.isValid(influencerId)) {
        const userDoc = await User.findById(influencerId);
        if (userDoc) {
          targetInfluencerId = userDoc._id;
        } else {
          const profileDoc = await InfluencerProfile.findById(influencerId);
          if (profileDoc && profileDoc.user) {
            targetInfluencerId = profileDoc.user;
          }
        }
      } else {
        const clean = String(influencerId).replace(/^@+/, "");
        const profileDoc = await InfluencerProfile.findOne({
          $or: [{ handle: influencerId }, { handle: `@${clean}` }, { handle: clean }],
        });
        if (profileDoc && profileDoc.user) {
          targetInfluencerId = profileDoc.user;
        }
      }

      // If target user is not in User collection (e.g. demo creator), ensure a valid placeholder
      let targetUser = await User.findById(targetInfluencerId);
      if (!targetUser) {
        const demoEmail = `creator_${String(influencerId).slice(-6)}@influenza.ai`;
        targetUser = await User.findOneAndUpdate(
          { email: demoEmail },
          { name: req.body.creatorName || "Featured Creator", role: "influencer" },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        targetInfluencerId = targetUser._id;
      }

      if (opportunity && String(opportunity.brand) !== String(req.user._id)) {
        return res.status(403).json({ message: "That campaign doesn't belong to you." });
      }
    } else if (role === "influencer") {
      // Influencer is applying to an open campaign — brand comes from the opportunity.
      if (!opportunity) {
        return res.status(400).json({ message: "opportunityId is required to apply." });
      }

      // Mandatory profile completeness verification
      const prof = await InfluencerProfile.findOne({ user: req.user._id });
      const missing = [];
      if (!prof) {
        missing.push("Profile Setup");
      } else {
        if (!prof.socialAccounts || prof.socialAccounts.length === 0) missing.push("Connected Instagram Account");
        if (!prof.categories || prof.categories.length === 0) missing.push("Categories / Niches");
        if (!prof.personalInfo?.coverPhoto) missing.push("Cover Photo");
        if (!prof.personalInfo?.avatar && !req.user.avatar) missing.push("Profile Avatar");
        if (!prof.personalInfo?.title && !prof.personalInfo?.firstName) missing.push("Title / Name");
        if (!prof.address?.city && !prof.address?.state) missing.push("Location");
        if (!prof.matchProfile?.bio) missing.push("Bio / Description");
      }

      if (missing.length > 0) {
        return res.status(403).json({
          message: `Please complete your creator profile before applying to campaigns. Missing: ${missing.join(", ")}.`,
          incompleteProfile: true,
          missingFields: missing,
        });
      }

      brandId = opportunity.brand;
      targetInfluencerId = req.user._id;
    } else {
      return res.status(403).json({ message: "Only brands and influencers can send requests." });
    }

    // Prevent duplicate pending requests for the same pairing (+ campaign if given).
    const existing = await CollaborationRequest.findOne({
      brand: brandId,
      influencer: targetInfluencerId,
      opportunity: opportunity ? opportunity._id : null,
      status: "pending",
    });
    if (existing) {
      return res.status(409).json({ message: "A pending request already exists for this pairing." });
    }

    const request = await CollaborationRequest.create({
      opportunity: opportunity ? opportunity._id : undefined,
      brand: brandId,
      influencer: targetInfluencerId,
      initiatedBy: role,
      message: message || undefined,
      packageSelected: packageSelected || undefined,
      status: "pending",
      requestedAt: new Date(),
    });

    const populated = await CollaborationRequest.findById(request._id)
      .populate("brand", "name email")
      .populate("influencer", "name email")
      .populate("opportunity", "title format rewardValue");

    res.status(201).json({ message: "Request sent.", request: populated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create request.", error: error.message });
  }
};

// ======================================
// GET MY REQUESTS (both sent and received, scoped by role)
// ======================================
export const getMyRequests = async (req, res) => {
  try {
    const role = req.user.role;
    const filter = role === "brand" ? { brand: req.user._id } : { influencer: req.user._id };

    const requests = await CollaborationRequest.find(filter)
      .populate("brand", "name email")
      .populate("influencer", "name email")
      .populate("opportunity", "title format rewardValue")
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch requests.", error: error.message });
  }
};

// ======================================
// RESPOND TO A REQUEST (accept / reject)
// The responder is whichever side did NOT initiate it.
// ======================================
export const respondToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "accepted" | "rejected"

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be 'accepted' or 'rejected'." });
    }

    const request = await CollaborationRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "This request has already been responded to." });
    }

    // Whoever did NOT initiate the request is the one allowed to respond.
    const responderRole = request.initiatedBy === "brand" ? "influencer" : "brand";
    const responderId = responderRole === "brand" ? request.brand : request.influencer;

    if (req.user.role !== responderRole || String(responderId) !== String(req.user._id)) {
      return res.status(403).json({ message: "You're not authorized to respond to this request." });
    }

    request.status = status;
    request.respondedAt = new Date();
    await request.save();

    let collaboration = null;
    if (status === "accepted") {
      const opportunity = request.opportunity
        ? await Opportunity.findById(request.opportunity)
        : null;

      collaboration = await Collaboration.create({
        request: request._id,
        opportunity: opportunity ? opportunity._id : undefined,
        brand: request.brand,
        influencer: request.influencer,
        format: opportunity ? opportunity.format : "money",
        deliverablesTotal: opportunity ? opportunity.deliverablesRequired || 1 : 1,
      });

      // Approve the influencer's profile the first time they land a collaboration,
      // so they start showing up in brand search results.
      await InfluencerProfile.findOneAndUpdate(
        { user: request.influencer, approved: false },
        { approved: true }
      );
    }

    res.json({ message: `Request ${status}.`, request, collaboration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to respond to request.", error: error.message });
  }
};
