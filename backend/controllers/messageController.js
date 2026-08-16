import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getOrCreateConversation = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    if (!otherUserId) return res.status(400).json({ message: "otherUserId is required." });

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, otherUserId], $size: 2 },
    });

    if (!conversation) {
      conversation = await Conversation.create({ participants: [req.user._id, otherUserId] });
    }

    const populated = await conversation.populate("participants", "name email role");
    res.status(200).json({ conversation: populated });
  } catch (error) {
    res.status(500).json({ message: "Unable to start conversation.", error: error.message });
  }
};

export const getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate("participants", "name email role")
      .sort({ lastMessageAt: -1 });
    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch conversations.", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findById(id);
    if (!conversation) return res.status(404).json({ message: "Conversation not found." });
    if (!conversation.participants.some((p) => String(p) === String(req.user._id))) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;

    const messages = await Message.find({ conversation: id })
      .populate("sender", "name email role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch messages.", error: error.message });
  }
};