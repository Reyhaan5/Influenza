import GalleryContent from "../models/GalleryContent.js";
import ContentPost from "../models/ContentPost.js";
import Collaboration from "../models/Collaboration.js";
import InfluencerProfile from "../models/InfluencerProfile.js";
import Review from "../models/Review.js";
import { DEMO_CREATORS } from "./publicCreatorsController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const MAX_HIGHLIGHTED = 10;

// Best-effort guess when a doc doesn't have an explicit mediaType field
function guessMediaType(url = "") {
  return /\.(mp4|mov|webm|m4v)$/i.test(url) ? "video" : "image";
}

export { CURATED_SHOWCASE_ITEMS } from "../fixtures/demoData.js";
import { CURATED_SHOWCASE_ITEMS } from "../fixtures/demoData.js";


// ======================================
// GET /api/public/gallery
// Public, no auth. Merges:
//   1) GalleryContent  — showcase content influencers add directly
//   2) ContentPost     — content tied to a COMPLETED collaboration only
//   3) Curated creator showcase items covering all system categories
// Query params: category, platform, mediaType, q (search), sort, page, limit.
// ======================================
export const getPublicGallery = asyncHandler(async (req, res) => {
    const { category, platform, mediaType, q, sort = "trending", page = 1, limit = 16 } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(48, Math.max(1, Number(limit) || 16));

    // Fetch MongoDB gallery items
    const showcaseDocs = await GalleryContent.find({})
      .populate("influencer", "name")
      .sort({ createdAt: -1 })
      .lean();

    const completedCollabIds = await Collaboration.find({ stage: "completed" }).distinct("_id");
    const collabDocs = await ContentPost.find({ collaboration: { $in: completedCollabIds } })
      .populate("influencer", "name")
      .sort({ publishedAt: -1 })
      .lean();

    let dbItems = [
      ...showcaseDocs.map((d) => ({
        id: String(d._id),
        influencerId: d.influencer?._id,
        influencerName: d.influencer?.name,
        mediaUrl: d.mediaUrl,
        mediaType: d.mediaType || guessMediaType(d.mediaUrl),
        caption: d.caption || "Showcase content",
        platform: d.platform || "Instagram",
        highlighted: !!d.highlighted,
        source: "showcase",
        createdAt: d.createdAt,
      })),
      ...collabDocs.map((d) => ({
        id: String(d._id),
        influencerId: d.influencer?._id,
        influencerName: d.influencer?.name,
        mediaUrl: d.mediaUrl,
        mediaType: guessMediaType(d.mediaUrl),
        caption: d.caption || "Collaboration deliverable",
        platform: d.platform || "Instagram",
        highlighted: false,
        source: "collaboration",
        createdAt: d.publishedAt || d.createdAt,
      })),
    ];

    // Attach handle, niches, avatar, and rating from each influencer's profile
    const influencerIds = [...new Set(dbItems.map((i) => String(i.influencerId)).filter(Boolean))];

    const profiles = await InfluencerProfile.find({ user: { $in: influencerIds } }).lean();
    const profileByUser = new Map(profiles.map((p) => [String(p.user), p]));

    const reviews = await Review.find({ influencer: { $in: influencerIds } }).lean();
    const ratingByInfluencer = new Map();
    const reviewsCountByInfluencer = new Map();
    influencerIds.forEach((id) => {
      const mine = reviews.filter((r) => String(r.influencer) === id);
      const avg = mine.length ? mine.reduce((sum, r) => sum + r.rating, 0) / mine.length : null;
      ratingByInfluencer.set(id, avg ? Math.round(avg * 10) / 10 : null);
      reviewsCountByInfluencer.set(id, mine.length);
    });

    const populatedDbItems = dbItems
      .filter((i) => i.influencerId)
      .map((i, index) => {
        const profile = profileByUser.get(String(i.influencerId));
        const categories = profile?.categories?.length ? profile.categories : (profile?.matchProfile?.niche || ["Lifestyle"]);
        const followers = profile?.socialAccounts?.[0]?.followers || 15000;
        const locality = [profile?.address?.city, profile?.address?.state].filter(Boolean).join(", ") || profile?.address?.country || "Global";
        const basePrice = profile?.matchProfile?.minAskingPrice || 120;

        return {
          id: i.id,
          influencerId: i.influencerId,
          influencerName: [profile?.personalInfo?.firstName, profile?.personalInfo?.lastName].filter(Boolean).join(" ") || profile?.handle || i.influencerName || "Creator",
          handle: (profile?.handle || i.influencerName || "creator").replace(/^@/, ""),
          avatar: profile?.personalInfo?.avatar || "",
          locality,
          verified: profile?.approved !== false,
          mediaUrl: i.mediaUrl,
          mediaType: i.mediaType,
          caption: i.caption,
          platform: i.platform,
          highlighted: i.highlighted,
          rating: ratingByInfluencer.get(String(i.influencerId)) || 4.9,
          reviewsCount: reviewsCountByInfluencer.get(String(i.influencerId)) || 5,
          followers,
          likes: Math.floor(followers * 0.045) + (index * 137 % 500) + 120,
          views: Math.floor(followers * 0.65) + (index * 730 % 5000) + 1500,
          engagementRate: `${(4.2 + ((index * 3) % 20) / 10).toFixed(1)}%`,
          aspectRatio: i.mediaType === "video" ? "vertical" : "portrait",
          duration: i.mediaType === "video" ? "0:30" : null,
          tags: [...categories, i.platform, "UGC"],
          categories,
          basePrice,
          createdAt: i.createdAt,
        };
      });

    // Merge DB items with curated showcase items
    let allItems = [...populatedDbItems, ...CURATED_SHOWCASE_ITEMS];

    // Filter by Category / Niche
    if (category && category !== "all") {
      const wantedList = String(category)
        .toLowerCase()
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      allItems = allItems.filter((item) => {
        const itemCats = (item.categories || []).map((c) => c.toLowerCase());
        const itemTags = (item.tags || []).map((t) => t.toLowerCase());
        const itemCaption = (item.caption || "").toLowerCase();

        return wantedList.some(
          (w) =>
            itemCats.some((c) => c.includes(w) || w.includes(c)) ||
            itemTags.some((t) => t.includes(w) || w.includes(t)) ||
            itemCaption.includes(w)
        );
      });
    }

    // Filter by Platform (Instagram, TikTok, YouTube)
    if (platform && platform.toLowerCase() !== "all") {
      const pLower = platform.trim().toLowerCase();
      allItems = allItems.filter((i) => (i.platform || "").toLowerCase() === pLower);
    }

    // Filter by Media Type (video / image)
    if (mediaType && mediaType.toLowerCase() !== "all") {
      const mtLower = mediaType.trim().toLowerCase();
      if (mtLower === "video" || mtLower === "reels" || mtLower === "reel") {
        allItems = allItems.filter((i) => i.mediaType === "video");
      } else if (mtLower === "image" || mtLower === "photo" || mtLower === "photos") {
        allItems = allItems.filter((i) => i.mediaType === "image");
      }
    }

    // Keyword Search (creator name, handle, caption, tag)
    if (q && q.trim()) {
      const qLower = q.trim().toLowerCase();
      allItems = allItems.filter(
        (i) =>
          (i.handle || "").toLowerCase().includes(qLower) ||
          (i.influencerName || "").toLowerCase().includes(qLower) ||
          (i.caption || "").toLowerCase().includes(qLower) ||
          (i.locality || "").toLowerCase().includes(qLower) ||
          (i.tags || []).some((t) => t.toLowerCase().includes(qLower)) ||
          (i.categories || []).some((c) => c.toLowerCase().includes(qLower))
      );
    }

    // Sorting
    if (sort === "rating") {
      allItems.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === "views") {
      allItems.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sort === "newest") {
      allItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Default: Trending (highlighted first, then high engagement rate and views)
      allItems.sort((a, b) => {
        if (a.highlighted !== b.highlighted) return a.highlighted ? -1 : 1;
        return (b.views || 0) - (a.views || 0);
      });
    }

    const total = allItems.length;
    const start = (pageNum - 1) * limitNum;
    const pageItems = allItems.slice(start, start + limitNum);

    // Summary statistics for gallery header
    const stats = {
      totalItems: total,
      creatorsCount: new Set(allItems.map((i) => i.handle)).size,
      totalViews: allItems.reduce((acc, curr) => acc + (curr.views || 0), 0),
      avgRating: (
        allItems.reduce((acc, curr) => acc + (curr.rating || 4.9), 0) / Math.max(1, allItems.length)
      ).toFixed(1),
    };

    res.json({
      items: pageItems,
      total,
      stats,
      page: pageNum,
      pages: Math.max(1, Math.ceil(total / limitNum)),
    });
});

// ======================================
// POST /api/influencer/gallery  (protected, influencer)
// ======================================
export const uploadGalleryItem = asyncHandler(async (req, res) => {
  const { caption, platform = "Instagram" } = req.body;

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
});

// ======================================
// GET /api/influencer/gallery  (protected, influencer)
// ======================================
export const getMyGalleryItems = asyncHandler(async (req, res) => {
  const items = await GalleryContent.find({ influencer: req.user._id }).sort({ createdAt: -1 });
  res.json({ items });
});

// ======================================
// PATCH /api/influencer/gallery/:id/highlight  (protected, influencer)
// Toggles the "star" on a portfolio item. Capped at MAX_HIGHLIGHTED.
// ======================================
export const toggleHighlight = asyncHandler(async (req, res) => {
  const item = await GalleryContent.findOne({ _id: req.params.id, influencer: req.user._id });

  if (!item) {
    return res.status(404).json({ message: "Item not found." });
  }

  if (!item.highlighted) {
    const highlightedCount = await GalleryContent.countDocuments({
      influencer: req.user._id,
      highlighted: true,
    });
    if (highlightedCount >= MAX_HIGHLIGHTED) {
      return res.status(400).json({ message: `You can highlight up to ${MAX_HIGHLIGHTED} items.` });
    }
  }

  item.highlighted = !item.highlighted;
  await item.save();

  res.json({ item });
});

// ======================================
// DELETE /api/influencer/gallery/:id  (protected, influencer)
// ======================================
export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await GalleryContent.findOneAndDelete({
    _id: req.params.id,
    influencer: req.user._id,
  });

  if (!item) {
    return res.status(404).json({ message: "Item not found." });
  }

  res.json({ message: "Removed.", id: req.params.id });
});