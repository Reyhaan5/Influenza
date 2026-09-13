import GalleryContent from "../models/GalleryContent.js";
import ContentPost from "../models/ContentPost.js";
import Collaboration from "../models/Collaboration.js";
import InfluencerProfile from "../models/InfluencerProfile.js";
import Review from "../models/Review.js";
import { DEMO_CREATORS } from "./publicCreatorsController.js";

const MAX_HIGHLIGHTED = 10;

// Best-effort guess when a doc doesn't have an explicit mediaType field
function guessMediaType(url = "") {
  return /\.(mp4|mov|webm|m4v)$/i.test(url) ? "video" : "image";
}

// Curated rich creator showcase data mapped to demo & real creators
export const CURATED_SHOWCASE_ITEMS = [
  {
    id: "showcase-sarah-1",
    influencerId: "660000000000000000000001",
    influencerName: "Sarah Jenkins",
    handle: "sarahj_ugc",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    locality: "Los Angeles, CA",
    verified: true,
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-1232-large.mp4",
    mediaType: "video",
    caption: "High-converting UGC Reel: Glow Essentials Vitamin C brightening serum texture test and 7-day before/after.",
    platform: "Instagram",
    highlighted: true,
    rating: 4.9,
    reviewsCount: 28,
    followers: 85000,
    likes: 4820,
    views: 64200,
    engagementRate: "5.7%",
    aspectRatio: "vertical",
    duration: "0:30",
    tags: ["Beauty & Skincare", "UGC Videos", "Vitamin C", "Paid Ad"],
    categories: ["Beauty & Skincare", "UGC Videos", "Lifestyle"],
    basePrice: 150,
    createdAt: new Date("2026-09-08T14:30:00Z"),
  },
  {
    id: "showcase-elena-1",
    influencerId: "660000000000000000000003",
    influencerName: "Elena Rostova",
    handle: "elena_aesthetic",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    locality: "New York, NY",
    verified: true,
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-posing-for-the-camera-40538-large.mp4",
    mediaType: "video",
    caption: "Autumn Velvet Editorial Lookbook — Cinematic transition reel featuring luxury layered minimalist apparel.",
    platform: "Instagram",
    highlighted: true,
    rating: 5.0,
    reviewsCount: 42,
    followers: 195000,
    likes: 12400,
    views: 148000,
    engagementRate: "6.4%",
    aspectRatio: "vertical",
    duration: "0:45",
    tags: ["Fashion & Style", "Luxury Lifestyle", "Lookbook", "Instagram Reels"],
    categories: ["Fashion & Style", "Fashion", "Luxury Lifestyle", "Instagram Reels"],
    basePrice: 280,
    createdAt: new Date("2026-09-09T18:10:00Z"),
  },
  {
    id: "showcase-alex-1",
    influencerId: "660000000000000000000004",
    influencerName: "Alex Rivera",
    handle: "alex_techugc",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    locality: "Austin, TX",
    verified: true,
    mediaUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80",
    mediaType: "image",
    caption: "Minimalist Cyberpunk Desk Setup: Custom mechanical keyboard with RGB ambient backlighting and ultra-wide monitor mount.",
    platform: "YouTube",
    highlighted: true,
    rating: 4.9,
    reviewsCount: 31,
    followers: 92000,
    likes: 3890,
    views: 42100,
    engagementRate: "4.2%",
    aspectRatio: "portrait",
    duration: null,
    tags: ["Technology & Gadgets", "Desk Setup", "Consumer Electronics", "Unboxing"],
    categories: ["Technology & Gadgets", "Consumer Electronics", "Unboxing", "Technology"],
    basePrice: 190,
    createdAt: new Date("2026-09-07T11:20:00Z"),
  },
  {
    id: "showcase-david-1",
    influencerId: "660000000000000000000002",
    influencerName: "David Miller",
    handle: "david_fitlife",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    locality: "Miami, FL",
    verified: true,
    mediaUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1000&auto=format&fit=crop&q=80",
    mediaType: "image",
    caption: "Apex Nutrition HydraWhey Protein: Post-workout recovery smoothie routine and breakdown of essential amino acids.",
    platform: "Instagram",
    highlighted: false,
    rating: 4.8,
    reviewsCount: 19,
    followers: 120000,
    likes: 5670,
    views: 73000,
    engagementRate: "4.9%",
    aspectRatio: "portrait",
    duration: null,
    tags: ["Fitness & Gym", "Health & Wellness", "Nutrition", "Product Review"],
    categories: ["Fitness & Gym", "Health & Wellness", "Fitness", "Nutrition"],
    basePrice: 220,
    createdAt: new Date("2026-09-06T09:40:00Z"),
  },
  {
    id: "showcase-chloe-1",
    influencerId: "660000000000000000000005",
    influencerName: "Chloe Dubois",
    handle: "chloedubois_paris",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80",
    locality: "San Francisco, CA",
    verified: true,
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-on-a-rock-looking-at-the-ocean-40679-large.mp4",
    mediaType: "video",
    caption: "Coastal Haven Resort & Spa: Serene oceanfront getaway and artisan brunch guide.",
    platform: "Instagram",
    highlighted: true,
    rating: 4.7,
    reviewsCount: 15,
    followers: 64000,
    likes: 4120,
    views: 52300,
    engagementRate: "5.1%",
    aspectRatio: "vertical",
    duration: "0:25",
    tags: ["Travel & Leisure", "Food & Beverage", "Hospitality", "Reel"],
    categories: ["Travel & Leisure", "Food & Beverage", "Travel", "Cafes & Dining"],
    basePrice: 160,
    createdAt: new Date("2026-09-10T16:15:00Z"),
  },
  {
    id: "showcase-maya-1",
    influencerId: "660000000000000000000006",
    influencerName: "Maya Patel",
    handle: "mayapatel_wellness",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
    locality: "Chicago, IL",
    verified: true,
    mediaUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80",
    mediaType: "image",
    caption: "Mindful Morning Sanctuary: Non-toxic ceramic diffusers, matcha tea ceremony, and grounding morning reflection.",
    platform: "Instagram",
    highlighted: false,
    rating: 4.9,
    reviewsCount: 22,
    followers: 48000,
    likes: 2950,
    views: 31200,
    engagementRate: "6.1%",
    aspectRatio: "portrait",
    duration: null,
    tags: ["Home & Decor", "Organic Living", "Mindfulness", "Self Care"],
    categories: ["Home & Decor", "Organic Living", "Lifestyle", "Self Care"],
    basePrice: 130,
    createdAt: new Date("2026-09-05T12:00:00Z"),
  },
  {
    id: "showcase-sarah-2",
    influencerId: "660000000000000000000001",
    influencerName: "Sarah Jenkins",
    handle: "sarahj_ugc",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    locality: "Los Angeles, CA",
    verified: true,
    mediaUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&auto=format&fit=crop&q=80",
    mediaType: "image",
    caption: "Flawless Base Hydrating Tint & Lip Gloss Staging for Sunlit Summer Campaigns.",
    platform: "Instagram",
    highlighted: true,
    rating: 4.9,
    reviewsCount: 28,
    followers: 85000,
    likes: 3100,
    views: 39400,
    engagementRate: "4.8%",
    aspectRatio: "portrait",
    duration: null,
    tags: ["Beauty & Skincare", "Makeup", "UGC Photos", "Product Staging"],
    categories: ["Beauty & Skincare", "Fashion & Style", "UGC Videos"],
    basePrice: 150,
    createdAt: new Date("2026-09-04T15:00:00Z"),
  },
  {
    id: "showcase-alex-2",
    influencerId: "660000000000000000000004",
    influencerName: "Alex Rivera",
    handle: "alex_techugc",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    locality: "Austin, TX",
    verified: true,
    mediaUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1000&auto=format&fit=crop&q=80",
    mediaType: "image",
    caption: "MagSafe 3-in-1 Fast Charging Station: Unboxing, cable management, and high-load thermal testing.",
    platform: "Instagram",
    highlighted: false,
    rating: 4.9,
    reviewsCount: 31,
    followers: 92000,
    likes: 2840,
    views: 36500,
    engagementRate: "4.0%",
    aspectRatio: "portrait",
    duration: null,
    tags: ["Technology & Gadgets", "Unboxing", "MagSafe", "Hardware"],
    categories: ["Technology & Gadgets", "Consumer Electronics", "Tutorials"],
    basePrice: 190,
    createdAt: new Date("2026-09-03T10:45:00Z"),
  },
  {
    id: "showcase-chloe-2",
    influencerId: "660000000000000000000005",
    influencerName: "Chloe Dubois",
    handle: "chloedubois_paris",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80",
    locality: "San Francisco, CA",
    verified: true,
    mediaUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80",
    mediaType: "image",
    caption: "Artisan Specialty Coffee & Fresh Almond Croissants — Cafe review and aesthetic morning b-roll.",
    platform: "Instagram",
    highlighted: false,
    rating: 4.7,
    reviewsCount: 15,
    followers: 64000,
    likes: 3290,
    views: 41000,
    engagementRate: "5.3%",
    aspectRatio: "portrait",
    duration: null,
    tags: ["Food & Beverage", "Cafes & Dining", "Coffee", "Lifestyle"],
    categories: ["Food & Beverage", "Travel & Leisure", "Cafes & Dining"],
    basePrice: 160,
    createdAt: new Date("2026-09-02T08:30:00Z"),
  },
  {
    id: "showcase-elena-2",
    influencerId: "660000000000000000000003",
    influencerName: "Elena Rostova",
    handle: "elena_aesthetic",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    locality: "New York, NY",
    verified: true,
    mediaUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80",
    mediaType: "image",
    caption: "Monochrome Haute Couture: Minimalist wool trench coat styled with tailored trousers for Manhattan winter.",
    platform: "Instagram",
    highlighted: false,
    rating: 5.0,
    reviewsCount: 42,
    followers: 195000,
    likes: 8920,
    views: 112000,
    engagementRate: "5.8%",
    aspectRatio: "portrait",
    duration: null,
    tags: ["Fashion & Style", "Luxury Lifestyle", "Editorial", "Winter Fashion"],
    categories: ["Fashion & Style", "Fashion", "Luxury Lifestyle"],
    basePrice: 280,
    createdAt: new Date("2026-09-01T14:20:00Z"),
  },
  {
    id: "showcase-david-2",
    influencerId: "660000000000000000000002",
    influencerName: "David Miller",
    handle: "david_fitlife",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    locality: "Miami, FL",
    verified: true,
    mediaUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=80",
    mediaType: "image",
    caption: "Functional HIIT Strength Circuit: 20-minute bodyweight and kettlebell conditioning guide.",
    platform: "Instagram",
    highlighted: false,
    rating: 4.8,
    reviewsCount: 19,
    followers: 120000,
    likes: 6450,
    views: 89000,
    engagementRate: "5.4%",
    aspectRatio: "portrait",
    duration: null,
    tags: ["Fitness & Gym", "HIIT", "Strength", "Workout"],
    categories: ["Fitness & Gym", "Health & Wellness", "Fitness"],
    basePrice: 220,
    createdAt: new Date("2026-08-30T17:15:00Z"),
  },
  {
    id: "showcase-maya-2",
    influencerId: "660000000000000000000006",
    influencerName: "Maya Patel",
    handle: "mayapatel_wellness",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
    locality: "Chicago, IL",
    verified: true,
    mediaUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1000&auto=format&fit=crop&q=80",
    mediaType: "image",
    caption: "Aesthetic botanical bath routine with lavender epsom crystals and eco-friendly bamboo accessories.",
    platform: "Instagram",
    highlighted: false,
    rating: 4.9,
    reviewsCount: 22,
    followers: 48000,
    likes: 3120,
    views: 34500,
    engagementRate: "6.5%",
    aspectRatio: "portrait",
    duration: null,
    tags: ["Home & Decor", "Self Care", "Eco Friendly", "Organic Living"],
    categories: ["Home & Decor", "Organic Living", "Self Care"],
    basePrice: 130,
    createdAt: new Date("2026-08-28T19:00:00Z"),
  },
];

// ======================================
// GET /api/public/gallery
// Public, no auth. Merges:
//   1) GalleryContent  — showcase content influencers add directly
//   2) ContentPost     — content tied to a COMPLETED collaboration only
//   3) Curated creator showcase items covering all system categories
// Query params: category, platform, mediaType, q (search), sort, page, limit.
// ======================================
export const getPublicGallery = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error in getPublicGallery:", error);
    res.status(500).json({ message: "Unable to load content gallery.", error: error.message });
  }
};

// ======================================
// POST /api/influencer/gallery  (protected, influencer)
// ======================================
export const uploadGalleryItem = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error uploading gallery item:", error);
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
// PATCH /api/influencer/gallery/:id/highlight  (protected, influencer)
// Toggles the "star" on a portfolio item. Capped at MAX_HIGHLIGHTED.
// ======================================
export const toggleHighlight = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: "Unable to update item.", error: error.message });
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