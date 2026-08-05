import Collaboration from "../models/Collaboration.js";

// ======================================
// GET ALL COLLABORATIONS FOR THIS BRAND
// ======================================
export const getMyCollaborations = async (req, res) => {
  try {
    const collaborations = await Collaboration.find({ brand: req.user._id })
      .populate("influencer", "name email")
      .populate("opportunity", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({ collaborations });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to fetch collaborations.",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE COLLABORATION (payment status / stage / deliverables)
// ======================================
export const updateCollaboration = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, stage, deliverablesCompleted } = req.body;

    const collab = await Collaboration.findOne({ _id: id, brand: req.user._id });

    if (!collab) {
      return res.status(404).json({ message: "Collaboration not found." });
    }

    if (paymentStatus !== undefined) collab.paymentStatus = paymentStatus;
    if (stage !== undefined) collab.stage = stage;
    if (deliverablesCompleted !== undefined) collab.deliverablesCompleted = deliverablesCompleted;

    await collab.save();

    res.status(200).json({
      message: "Collaboration updated successfully.",
      collaboration: collab,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to update collaboration.",
      error: error.message,
    });
  }
};