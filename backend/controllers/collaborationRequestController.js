import mongoose from "mongoose";
import CollaborationRequest from "../models/CollaborationRequest.js";
import Opportunity from "../models/Opportunity.js";
import Collaboration from "../models/Collaboration.js";
import InfluencerProfile from "../models/InfluencerProfile.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// ======================================
// CREATE A COLLABORATION REQUEST
// Works both directions:
//   - Brand -> Influencer: body { influencerId, opportunityId?, message?, packageSelected? }
//   - Influencer -> Brand: body { opportunityId }  (applying to an open campaign)
// ======================================
export const createRequest = asyncHandler(async (req, res) => {
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

    if (!targetInfluencerId) {
      return res.status(404).json({ message: "Creator profile not found." });
    }

    // Verify creator exists and is an influencer
    const targetUser = await User.findById(targetInfluencerId);
    if (!targetUser || targetUser.role !== "influencer") {
      return res.status(400).json({ message: "Target user is not an influencer." });
    }
  } else if (role === "influencer") {
    // Influencer is applying to an open campaign
    if (!opportunity) {
      return res.status(400).json({
        message: "opportunityId is required when an influencer applies.",
      });
    }
    targetInfluencerId = req.user._id;
    brandId = opportunity.brand;
  } else {
    return res.status(403).json({ message: "Invalid role for collaboration requests." });
  }

  // Prevent brand from collaborating with itself
  if (String(brandId) === String(targetInfluencerId)) {
    return res.status(400).json({ message: "Cannot collaborate with yourself." });
  }

  // Deduplicate: check if a pending request already exists for this pair
  const duplicateQuery = {
    brand: brandId,
    influencer: targetInfluencerId,
    status: "pending",
  };
  if (opportunity) {
    duplicateQuery.opportunity = opportunity._id;
  }

  const existing = await CollaborationRequest.findOne(duplicateQuery);
  if (existing) {
    return res.status(400).json({
      message: "A pending collaboration request already exists for this pair/campaign.",
      request: existing,
    });
  }

  const newRequest = await CollaborationRequest.create({
    opportunity: opportunity ? opportunity._id : undefined,
    brand: brandId,
    influencer: targetInfluencerId,
    initiatedBy: role,
    message: message || "",
    packageSelected: packageSelected || undefined,
  });

  const populated = await CollaborationRequest.findById(newRequest._id)
    .populate("brand", "name email")
    .populate("influencer", "name email")
    .populate("opportunity", "title format rewardValue");

  res.status(201).json({
    message: "Collaboration request submitted successfully.",
    request: populated,
  });
});

// ======================================
// GET MY REQUESTS (both sent and received, scoped by role)
// ======================================
export const getMyRequests = asyncHandler(async (req, res) => {
  const role = req.user.role;
  const filter = role === "brand" ? { brand: req.user._id } : { influencer: req.user._id };

  const requests = await CollaborationRequest.find(filter)
    .populate("brand", "name email")
    .populate("influencer", "name email")
    .populate("opportunity", "title format rewardValue")
    .sort({ createdAt: -1 });

  res.json({ requests });
});

// ======================================
// RESPOND TO A REQUEST (accept / reject)
// The responder is whichever side did NOT initiate it.
// ======================================
export const respondToRequest = asyncHandler(async (req, res) => {
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
});
