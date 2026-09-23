import Collaboration from "../models/Collaboration.js";
import CollaborationRequest from "../models/CollaborationRequest.js";
import Opportunity from "../models/Opportunity.js";
import InfluencerProfile from "../models/InfluencerProfile.js";
import Brand from "../models/Brand.js";

// ======================================
// GET ALL COLLABORATIONS FOR CALLER (Brand or Influencer)
// ======================================
export const getMyCollaborations = async (req, res) => {
  try {
    const isInfluencer = req.user.role === "influencer";
    const filter = isInfluencer
      ? { influencer: req.user._id }
      : { brand: req.user._id };

    let collaborations = await Collaboration.find(filter)
      .populate("brand", "name email company")
      .populate("influencer", "name email")
      .populate("opportunity", "title rewardValue format deliverables brandEntity")
      .populate("brandEntity", "name logo category")
      .populate("request")
      .sort({ createdAt: -1 })
      .lean();

    // Also find pending requests that don't have a collaboration record yet
    const existingCollabRequestIds = new Set(
      collaborations.map((c) => String(c.request?._id || c.request || ""))
    );

    const pendingRequests = await CollaborationRequest.find({
      ...filter,
      status: "pending",
    })
      .populate("brand", "name email company")
      .populate("influencer", "name email")
      .populate("opportunity", "title rewardValue format deliverables brandEntity")
      .populate("brandEntity", "name logo category")
      .sort({ createdAt: -1 })
      .lean();

    const requestCollabs = pendingRequests
      .filter((pr) => !existingCollabRequestIds.has(String(pr._id)))
      .map((pr) => ({
        _id: String(pr._id),
        isRequest: true,
        request: pr._id,
        stage: "application",
        format: pr.opportunity?.format || "money",
        deliverablesTotal:
          pr.opportunity?.deliverables?.length ||
          pr.opportunity?.deliverablesRequired ||
          1,
        deliverablesCompleted: 0,
        paymentStatus: "pending",
        opportunity: pr.opportunity,
        brand: pr.brand,
        brandEntity: pr.brandEntity || pr.opportunity?.brandEntity,
        influencer: pr.influencer,
        createdAt: pr.createdAt,
      }));

    let allItems = [...collaborations, ...requestCollabs];

    // Attach influencer profile details (avatar, handle, niches)
    const influencerIds = allItems
      .map((c) => c.influencer?._id || c.influencer)
      .filter(Boolean);
    const profiles = await InfluencerProfile.find({
      user: { $in: influencerIds },
    }).lean();
    const profileMap = new Map();
    profiles.forEach((p) => {
      profileMap.set(String(p.user), p);
    });

    allItems = allItems.map((c) => {
      const uId = String(c.influencer?._id || c.influencer || "");
      const prof = profileMap.get(uId);
      return {
        ...c,
        influencerProfile: prof
          ? {
              handle: prof.handle,
              avatar: prof.personalInfo?.avatar || "",
              displayName:
                [prof.personalInfo?.firstName, prof.personalInfo?.lastName]
                  .filter(Boolean)
                  .join(" ") ||
                prof.handle ||
                c.influencer?.name,
              niches: prof.categories || [],
            }
          : null,
      };
    });

    res.status(200).json({ collaborations: allItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to fetch collaborations.",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE COLLABORATION (payment status / stage / deliverables / notes)
// ======================================
export const updateCollaboration = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, stage, deliverablesCompleted, notes, deadline } = req.body;

    let collab = await Collaboration.findOne({ _id: id, brand: req.user._id });

    // If not found in active collaborations, check if it's a pending CollaborationRequest
    if (!collab) {
      const reqDoc = await CollaborationRequest.findOne({
        _id: id,
        brand: req.user._id,
      });
      if (reqDoc) {
        // Automatically accept request and instantiate collaboration
        reqDoc.status = "accepted";
        reqDoc.respondedAt = new Date();
        await reqDoc.save();

        const opp = reqDoc.opportunity
          ? await Opportunity.findById(reqDoc.opportunity)
          : null;

        collab = await Collaboration.create({
          request: reqDoc._id,
          opportunity: opp ? opp._id : undefined,
          brand: reqDoc.brand,
          influencer: reqDoc.influencer,
          format: opp ? opp.format : "money",
          deliverablesTotal: opp
            ? opp.deliverables?.length || opp.deliverablesRequired || 1
            : 1,
          stage: stage || "content_creation",
          brandEntity: reqDoc.brandEntity || (opp ? opp.brandEntity : undefined),
        });

        await InfluencerProfile.findOneAndUpdate(
          { user: reqDoc.influencer, approved: false },
          { approved: true }
        );
      }
    }

    if (!collab) {
      return res.status(404).json({ message: "Collaboration not found." });
    }

    if (paymentStatus !== undefined) collab.paymentStatus = paymentStatus;
    if (stage !== undefined) collab.stage = stage;
    if (deliverablesCompleted !== undefined)
      collab.deliverablesCompleted = deliverablesCompleted;
    if (notes !== undefined) collab.notes = notes;
    if (deadline !== undefined) collab.deadline = deadline;

    await collab.save();

    const populated = await Collaboration.findById(collab._id)
      .populate("brand", "name email company")
      .populate("influencer", "name email")
      .populate("opportunity", "title rewardValue format deliverables brandEntity")
      .populate("brandEntity", "name logo category")
      .populate("request")
      .lean();

    const prof = await InfluencerProfile.findOne({
      user: collab.influencer,
    }).lean();
    const result = {
      ...populated,
      influencerProfile: prof
        ? {
            handle: prof.handle,
            avatar: prof.personalInfo?.avatar || "",
            displayName:
              [prof.personalInfo?.firstName, prof.personalInfo?.lastName]
                .filter(Boolean)
                .join(" ") ||
              prof.handle ||
              populated.influencer?.name,
            niches: prof.categories || [],
          }
        : null,
    };

    res.status(200).json({
      message: "Collaboration updated successfully.",
      collaboration: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to update collaboration.",
      error: error.message,
    });
  }
};