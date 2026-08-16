import GalleryContent from "../models/GalleryContent.js";
import ContentPost from "../models/ContentPost.js";
import Collaboration from "../models/Collaboration.js";
import InfluencerProfile from "../models/InfluencerProfile.js";
import Review from "../models/Review.js";

// Best-effort guess when a doc doesn't have an explicit mediaType field
// (ContentPost doesn't store one — it just has a mediaUrl).
function guessMediaType(url = "") {
  return /\.(mp4|mov|webm|m4v)$/i.test(url) ? "video" : "image";
}

// ======================================
// GET /api/public/gallery
// Public, no auth. Merges:
//   1) GalleryContent  — showcase content influencers add directly
//   2) ContentPost     — content tied to a COMPLETED collaboration only
// Query params: category (comma-separated list of niches to match),
// platform, page, limit.
// ======================================
export const getPublicGallery = async (req, res) => {
  try {
    const { category, platform, page = 1, limit = 12 } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(48, Math.max(1, Number(limit) || 12));

    const showcaseDocs = await GalleryContent.find({})
      .populate("influencer", "name")
      .sort({ createdAt: -1 })
      .lean();

    const completedCollabIds = await Collaboration.find({ stage: "completed" }).distinct("_id");
    const collabDocs = await ContentPost.find({ collaboration: { $in: completedCollabIds } })
      .populate("influencer", "name")
      .sort({ publishedAt: -1 })
      .lean();

    let items = [
      ...showcaseDocs.map((d) => ({
        id: String(d._id),
        influencerId: d.influencer?._id,
        influencerName: d.influencer?.name,
        mediaUrl: d.mediaUrl,
        mediaType: d.mediaType || guessMediaType(d.mediaUrl),
        caption: d.caption,
        platform: d.platform,
        source: "showcase",
        createdAt: d.createdAt,
      })),
      ...collabDocs.map((d) => ({
        id: String(d._id),
        influencerId: d.influencer?._id,
        influencerName: d.influencer?.name,
        mediaUrl: d.mediaUrl,
        mediaType: guessMediaType(d.mediaUrl),
        caption: d.caption,
        platform: d.platform,
        source: "collaboration",
        createdAt: d.publishedAt || d.createdAt,
      })),
    ];

    // Attach handle, niches, and average rating from each influencer's profile
    const influencerIds = [...new Set(items.map((i) => String(i.influencerId)).filter(Boolean))];

    const profiles = await InfluencerProfile.find({ user: { $in: influencerIds } }).lean();
    const profileByUser = new Map(profiles.map((p) => [String(p.user), p]));

    const reviews = await Review.find({ influencer: { $in: influencerIds } }).lean();
    const ratingByInfluencer = new Map();
    influencerIds.forEach((id) => {
      const mine = reviews.filter((r) => String(r.influencer) === id);
      const avg = mine.length ? mine.reduce((sum, r) => sum + r.rating, 0) / mine.length : null;
      ratingByInfluencer.set(id, avg ? Math.round(avg * 10) / 10 : null);
    });

    items = items
      .filter((i) => i.influencerId) // guard against orphaned docs
      .map((i) => {
        const profile = profileByUser.get(String(i.influencerId));
        return {
          ...i,
          handle: profile?.handle || i.influencerName,
          categories: profile?.categories || [],
          rating: ratingByInfluencer.get(String(i.influencerId)),
        };
      });

    if (category) {
      const wanted = String(category)
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      if (wanted.length > 0) {
        items = items.filter((i) => i.categories.some((c) => wanted.includes(c)));
      }
    }

    if (platform) {
      items = items.filter((i) => (i.platform || "").toLowerCase() === platform.toLowerCase());
    }

    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = items.length;
    const start = (pageNum - 1) * limitNum;
    const pageItems = items.slice(start, start + limitNum);

    res.json({
      items: pageItems,
      total,
      page: pageNum,
      pages: Math.max(1, Math.ceil(total / limitNum)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load content gallery.", error: error.message });
  }
};

// ======================================
// POST /api/influencer/gallery  (protected, influencer)
// ======================================
export const uploadGalleryItem = async (req, res) => {
  try {
    const { caption, platform } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "A media file is required." });
    }

    const mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";

    const item = await GalleryContent.create({
      influencer: req.user._id,
      mediaUrl: `/uploads/${req.file.filename}`,
      mediaType,
      caption,
      platform,
    });

    res.status(201).json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to upload content.", error: error.message });
  }
};

// ======================================
// GET /api/influencer/gallery  (protected, influencer)
// ======================================
export const getMyGalleryItems = async (req, res) => {
  try {
    const items = await GalleryContent.find({ influencer: req.user._id }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch your gallery items.", error: error.message });
  }
};

// ======================================
// DELETE /api/influencer/gallery/:id  (protected, influencer)
// ======================================
export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await GalleryContent.findOneAndDelete({
      _id: req.params.id,
      influencer: req.user._id,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    res.json({ message: "Removed.", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Unable to remove item.", error: error.message });
  }
};
