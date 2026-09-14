import Deliverable from "../models/Deliverable.js";
import Collaboration from "../models/Collaboration.js";
import ContentPost from "../models/ContentPost.js";

// GET ALL DELIVERABLES FOR A COLLABORATION
export const getDeliverables = async (req, res) => {
  try {
    const { collabId } = req.params;

    const collab = await Collaboration.findById(collabId);
    if (!collab) {
      return res.status(404).json({ message: "Collaboration not found." });
    }

    const userId = String(req.user._id);
    if (String(collab.brand) !== userId && String(collab.influencer) !== userId) {
      return res.status(403).json({ message: "Access denied." });
    }

    const deliverables = await Deliverable.find({ collaboration: collabId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ deliverables, collaboration: collab });
  } catch (error) {
    console.error("Error fetching deliverables:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// SUBMIT DELIVERABLE (Influencer)
export const submitDeliverable = async (req, res) => {
  try {
    const { collabId } = req.params;
    const {
      type = "draft",
      title,
      platform = "Instagram",
      contentUrl,
      postUrl,
      caption,
      notes,
      proofScreenshot,
    } = req.body;

    const collab = await Collaboration.findById(collabId);
    if (!collab) {
      return res.status(404).json({ message: "Collaboration not found." });
    }

    if (String(collab.influencer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only the assigned creator can submit deliverables." });
    }

    if (type === "draft" && !contentUrl) {
      return res.status(400).json({ message: "Preview link / content URL is required for drafts." });
    }
    if (type === "live_post" && !postUrl) {
      return res.status(400).json({ message: "Live post URL is required for live post submissions." });
    }

    const deliverable = await Deliverable.create({
      collaboration: collab._id,
      influencer: collab.influencer,
      brand: collab.brand,
      type,
      title: title || (type === "draft" ? "Content Draft Submission" : "Live Post Submission"),
      platform,
      contentUrl: contentUrl || "",
      postUrl: postUrl || "",
      caption: caption || "",
      notes: notes || "",
      proofScreenshot: proofScreenshot || "",
      status: "submitted",
      submittedAt: new Date(),
    });

    collab.stage = "review";
    await collab.save();

    res.status(201).json({
      message: "Deliverable submitted successfully.",
      deliverable,
      collaboration: collab,
    });
  } catch (error) {
    console.error("Error submitting deliverable:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// REVIEW DELIVERABLE (Brand Approves / Requests Revision)
export const reviewDeliverable = async (req, res) => {
  try {
    const { collabId, deliverableId } = req.params;
    const { action, feedback } = req.body;

    if (!["approve", "request_revision"].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Must be 'approve' or 'request_revision'." });
    }

    const collab = await Collaboration.findById(collabId);
    if (!collab) {
      return res.status(404).json({ message: "Collaboration not found." });
    }

    if (String(collab.brand) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only the brand can review deliverables." });
    }

    const deliverable = await Deliverable.findOne({
      _id: deliverableId,
      collaboration: collabId,
    });
    if (!deliverable) {
      return res.status(404).json({ message: "Deliverable not found." });
    }

    deliverable.reviewedAt = new Date();
    deliverable.feedback = feedback || "";

    if (action === "request_revision") {
      deliverable.status = "revision_requested";
      collab.stage = "content_creation";
      collab.notes = feedback ? `Revision requested: ${feedback}` : "Changes requested by brand.";
    } else if (action === "approve") {
      deliverable.status = "approved";

      if (deliverable.type === "draft") {
        collab.stage = "posting";
        collab.notes = "Draft approved! Creator is authorized to post live.";
      } else if (deliverable.type === "live_post") {
        collab.deliverablesCompleted = (collab.deliverablesCompleted || 0) + 1;

        await ContentPost.create({
          collaboration: collab._id,
          influencer: collab.influencer,
          platform: deliverable.platform || "Instagram",
          mediaUrl: deliverable.postUrl || deliverable.contentUrl,
          caption: deliverable.caption || "",
          publishedAt: new Date(),
        });

        if (collab.deliverablesCompleted >= (collab.deliverablesTotal || 1)) {
          collab.stage = "completed";
          collab.notes = "All deliverables completed and verified!";
        } else {
          collab.stage = "posting";
        }
      }
    }

    await deliverable.save();
    await collab.save();

    res.status(200).json({
      message:
        action === "approve"
          ? "Deliverable approved successfully."
          : "Revision request submitted to creator.",
      deliverable,
      collaboration: collab,
    });
  } catch (error) {
    console.error("Error reviewing deliverable:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};