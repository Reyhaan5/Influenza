import mongoose from "mongoose";
import InfluencerProfile from "../models/InfluencerProfile.js";
import User from "../models/User.js";
import RateCard from "../models/RateCard.js";
import GalleryContent from "../models/GalleryContent.js";
import ContentPost from "../models/ContentPost.js";
import Collaboration from "../models/Collaboration.js";
import Review from "../models/Review.js";
import { computeInfluencerStats } from "../services/statsService.js";

// Helper to guess media type from URL
function guessMediaType(url = "") {
  return /\.(mp4|mov|webm|m4v)$/i.test(url) ? "video" : "image";
}

export const DEMO_CREATORS = [
  {
    id: "660000000000000000000001",
    profileId: "660000000000000000000001",
    handle: "sarahj_ugc",
    displayName: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    city: "Los Angeles",
    state: "California",
    country: "United States",
    locality: "Los Angeles, CA",
    niches: ["Beauty & Skincare", "Fashion & Style", "Lifestyle", "UGC Videos"],
    bio: "Passionate UGC creator specializing in authentic aesthetic product reviews, unboxings, and high-converting TikTok/Reels videos.",
    gender: "Female",
    ethnicity: "Caucasian",
    basePrice: 150,
    verified: true,
    rating: 4.9,
    reviewsCount: 28,
    jobsCompleted: 35,
    hasPitchVideo: true,
    pitchVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-1232-large.mp4",
    socialAccounts: [{ platform: "Instagram", followers: 85000, handle: "@sarahj_ugc" }],
    galleryCount: 12,
  },
  {
    id: "660000000000000000000002",
    profileId: "660000000000000000000002",
    handle: "david_fitlife",
    displayName: "David Miller",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    city: "Miami",
    state: "Florida",
    country: "United States",
    locality: "Miami, FL",
    niches: ["Fitness & Gym", "Health & Wellness", "Nutrition", "Product Review"],
    bio: "Certified personal trainer and fitness influencer creating engaging high-energy workout routines and supplement reviews.",
    gender: "Male",
    ethnicity: "Caucasian",
    basePrice: 220,
    verified: true,
    rating: 4.8,
    reviewsCount: 19,
    jobsCompleted: 24,
    hasPitchVideo: false,
    pitchVideoUrl: null,
    socialAccounts: [{ platform: "Instagram", followers: 120000, handle: "@david_fitlife" }],
    galleryCount: 8,
  },
  {
    id: "660000000000000000000003",
    profileId: "660000000000000000000003",
    handle: "elena_aesthetic",
    displayName: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
    city: "New York",
    state: "New York",
    country: "United States",
    locality: "New York, NY",
    niches: ["Fashion", "Luxury Lifestyle", "UGC Photos", "Instagram Reels"],
    bio: "Editorial fashion creator and digital storyteller bringing luxury and boutique brand narratives to life with cinema-grade UGC.",
    gender: "Female",
    ethnicity: "Caucasian",
    basePrice: 280,
    verified: true,
    rating: 5.0,
    reviewsCount: 42,
    jobsCompleted: 50,
    hasPitchVideo: true,
    pitchVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-posing-for-the-camera-40538-large.mp4",
    socialAccounts: [{ platform: "Instagram", followers: 195000, handle: "@elena_aesthetic" }],
    galleryCount: 16,
  },
  {
    id: "660000000000000000000004",
    profileId: "660000000000000000000004",
    handle: "alex_techugc",
    displayName: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",
    city: "Austin",
    state: "Texas",
    country: "United States",
    locality: "Austin, TX",
    niches: ["Technology & Gadgets", "Consumer Electronics", "Unboxing", "Tutorials"],
    bio: "Tech enthusiast building sleek, crisp 4K unboxings, gadget teardowns, and actionable desk setup guides.",
    gender: "Male",
    ethnicity: "Hispanic/Latino",
    basePrice: 190,
    verified: true,
    rating: 4.9,
    reviewsCount: 31,
    jobsCompleted: 40,
    hasPitchVideo: false,
    pitchVideoUrl: null,
    socialAccounts: [{ platform: "Instagram", followers: 92000, handle: "@alex_techugc" }],
    galleryCount: 10,
  },
  {
    id: "660000000000000000000005",
    profileId: "660000000000000000000005",
    handle: "chloedubois_paris",
    displayName: "Chloe Dubois",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80",
    city: "San Francisco",
    state: "California",
    country: "United States",
    locality: "San Francisco, CA",
    niches: ["Travel & Leisure", "Food & Beverage", "Cafes & Dining", "Hospitality"],
    bio: "Travel and culinary UGC creator exploring hidden gems, local cafes, boutique stays, and sustainable hospitality.",
    gender: "Female",
    ethnicity: "Caucasian",
    basePrice: 160,
    verified: true,
    rating: 4.7,
    reviewsCount: 15,
    jobsCompleted: 18,
    hasPitchVideo: true,
    pitchVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-on-a-rock-looking-at-the-ocean-40679-large.mp4",
    socialAccounts: [{ platform: "Instagram", followers: 64000, handle: "@chloedubois_paris" }],
    galleryCount: 14,
  },
  {
    id: "660000000000000000000006",
    profileId: "660000000000000000000006",
    handle: "mayapatel_wellness",
    displayName: "Maya Patel",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
    city: "Chicago",
    state: "Illinois",
    country: "United States",
    locality: "Chicago, IL",
    niches: ["Home & Decor", "Organic Living", "Mindfulness", "Self Care"],
    bio: "Holistic wellness advocate showcasing mindful morning routines, non-toxic home essentials, and eco-friendly brands.",
    gender: "Female",
    ethnicity: "South Asian",
    basePrice: 130,
    verified: true,
    rating: 4.9,
    reviewsCount: 22,
    jobsCompleted: 27,
    hasPitchVideo: false,
    pitchVideoUrl: null,
    socialAccounts: [{ platform: "Instagram", followers: 48000, handle: "@mayapatel_wellness" }],
    galleryCount: 9,
  },
];

// ============================================================================
// GET /api/public/creators-by-category?category=Skincare
// ============================================================================
export const getCreatorsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "category query param is required." });
    }

    const creators = await InfluencerProfile.find({
      approved: { $ne: false },
      categories: category,
    })
      .populate("user", "name email")
      .select("handle socialAccounts categories user personalInfo address matchProfile")
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ category, creators });
  } catch (error) {
    console.error("Error in getCreatorsByCategory:", error);
    res.status(500).json({
      message: "Unable to fetch creators for this category.",
      error: error.message,
    });
  }
};

// ============================================================================
// GET /api/public/creator-discovery
// Query params: platform, category, q, contentType, followers, location, state, city,
//               price, gender, age, ethnicity, language
// ============================================================================
export const getCreatorDiscovery = async (req, res) => {
  try {
    const {
      platform,
      category,
      q,
      contentType,
      followers,
      minFollowers,
      maxFollowers,
      location,
      state,
      city,
      price,
      minPrice,
      maxPrice,
      gender,
      age,
      ethnicity,
      language,
    } = req.query;

    const filter = { approved: { $ne: false } };

    // Location search (combining generic location with specific state/city)
    const locQuery = (location || "").trim();
    if (locQuery) {
      const locRegex = new RegExp(locQuery, "i");
      filter.$or = [
        { "address.city": locRegex },
        { "address.state": locRegex },
        { "address.country": locRegex },
      ];
    } else {
      if (state && state.trim()) {
        filter["address.state"] = { $regex: new RegExp(state.trim(), "i") };
      }
      if (city && city.trim()) {
        filter["address.city"] = { $regex: new RegExp(city.trim(), "i") };
      }
    }

    // Gender filter
    if (gender && gender.trim() && gender.toLowerCase() !== "any") {
      filter["personalInfo.gender"] = { $regex: new RegExp(`^${gender.trim()}$`, "i") };
    }

    // Ethnicity filter
    if (ethnicity && ethnicity.trim() && ethnicity.toLowerCase() !== "any") {
      filter["personalInfo.ethnicity"] = { $regex: new RegExp(ethnicity.trim(), "i") };
    }

    // Category / Keyword Search
    const searchTerms = [category, q].filter(Boolean).map((s) => s.trim()).filter(Boolean);
    if (searchTerms.length > 0) {
      const regexConditions = searchTerms.map((term) => {
        const regex = new RegExp(term, "i");
        return {
          $or: [
            { handle: regex },
            { "personalInfo.firstName": regex },
            { "personalInfo.lastName": regex },
            { "matchProfile.bio": regex },
            { "matchProfile.niche": regex },
            { "matchProfile.topics": regex },
            { categories: regex },
          ],
        };
      });

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, ...regexConditions];
        delete filter.$or;
      } else {
        filter.$and = regexConditions;
      }
    }

    let profiles = await InfluencerProfile.find(filter)
      .populate("user", "name email")
      .sort({ updatedAt: -1 })
      .lean();

    // 1. Platform Filter
    if (platform && platform.trim() && platform.toLowerCase() !== "any" && platform.toLowerCase() !== "any platform") {
      const pLower = platform.trim().toLowerCase();
      profiles = profiles.filter((p) =>
        (p.socialAccounts || []).some(
          (acc) => acc.platform && acc.platform.toLowerCase().includes(pLower)
        )
      );
    }

    // 2. Followers Range Filter
    let minF = Number(minFollowers) || 0;
    let maxF = Number(maxFollowers) || Infinity;
    if (followers) {
      if (followers === "1k-10k") { minF = 1000; maxF = 10000; }
      else if (followers === "10k-50k") { minF = 10000; maxF = 50000; }
      else if (followers === "50k-100k") { minF = 50000; maxF = 100000; }
      else if (followers === "100k+") { minF = 100000; maxF = Infinity; }
    }

    if (minF > 0 || maxF < Infinity) {
      profiles = profiles.filter((p) => {
        const totalOrMaxFollowers = Math.max(
          0,
          ...(p.socialAccounts || []).map((acc) => acc.followers || 0)
        );
        return totalOrMaxFollowers >= minF && totalOrMaxFollowers <= maxF;
      });
    }

    // 3. Content Type / Format Filter
    if (contentType && contentType.trim() && contentType.toLowerCase() !== "any") {
      const ctLower = contentType.trim().toLowerCase();
      profiles = profiles.filter((p) => {
        const formats = (p.matchProfile?.collaborationFormats || []).map((f) => f.toLowerCase());
        const categories = (p.categories || []).map((c) => c.toLowerCase());
        return (
          formats.some((f) => f.includes(ctLower)) ||
          categories.some((c) => c.includes(ctLower)) ||
          p.matchProfile?.bio?.toLowerCase().includes(ctLower)
        );
      });
    }

    // 4. Age Range Filter
    if (age && age.trim() && age.toLowerCase() !== "any") {
      const now = new Date();
      profiles = profiles.filter((p) => {
        if (!p.personalInfo?.birthday) return true; // keep if unspecified
        const birthDate = new Date(p.personalInfo.birthday);
        let userAge = now.getFullYear() - birthDate.getFullYear();
        if (age === "18-24") return userAge >= 18 && userAge <= 24;
        if (age === "25-34") return userAge >= 25 && userAge <= 34;
        if (age === "35-44") return userAge >= 35 && userAge <= 44;
        if (age === "45+") return userAge >= 45;
        return true;
      });
    }

    // 5. Language / Audience Filter
    if (language && language.trim() && language.toLowerCase() !== "any") {
      const langLower = language.trim().toLowerCase();
      profiles = profiles.filter((p) =>
        (p.matchProfile?.audience || []).some((a) => a.toLowerCase().includes(langLower)) ||
        (p.matchProfile?.followersLocations || []).some((loc) => loc.toLowerCase().includes(langLower)) ||
        (p.address?.country || "").toLowerCase().includes(langLower)
      );
    }

    // Collect user IDs for batch loading of stats, reviews, gallery, and rate cards
    const userIds = profiles.map((p) => p.user?._id).filter(Boolean);

    const [reviews, galleryItems, completedCollabs, rateCards] = await Promise.all([
      Review.find({ influencer: { $in: userIds } }).lean(),
      GalleryContent.find({ influencer: { $in: userIds } }).sort({ highlighted: -1, createdAt: -1 }).lean(),
      Collaboration.find({ influencer: { $in: userIds }, stage: "completed" }).lean(),
      RateCard.find({ influencer: { $in: userIds } }).lean(),
    ]);

    const reviewsMap = new Map();
    reviews.forEach((r) => {
      const id = String(r.influencer);
      if (!reviewsMap.has(id)) reviewsMap.set(id, []);
      reviewsMap.get(id).push(r);
    });

    const collabsMap = new Map();
    completedCollabs.forEach((c) => {
      const id = String(c.influencer);
      collabsMap.set(id, (collabsMap.get(id) || 0) + 1);
    });

    const galleryMap = new Map();
    galleryItems.forEach((g) => {
      const id = String(g.influencer);
      if (!galleryMap.has(id)) galleryMap.set(id, []);
      galleryMap.get(id).push(g);
    });

    const rateCardMap = new Map();
    rateCards.forEach((rc) => {
      rateCardMap.set(String(rc.influencer), rc);
    });

    // 6. Price Range Filter
    let minP = Number(minPrice) || 0;
    let maxP = Number(maxPrice) || Infinity;
    if (price) {
      if (price === "under-100") { minP = 0; maxP = 100; }
      else if (price === "100-250") { minP = 100; maxP = 250; }
      else if (price === "250-500") { minP = 250; maxP = 500; }
      else if (price === "500+") { minP = 500; maxP = Infinity; }
    }

    // Build creators list
    let creators = profiles.map((p) => {
      const uId = String(p.user?._id || p._id);
      const userReviews = reviewsMap.get(uId) || [];
      const avgRating =
        userReviews.length > 0
          ? Number((userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1))
          : 0;

      const jobsCompleted = collabsMap.get(uId) || 0;
      const userGallery = galleryMap.get(uId) || [];
      const pitchVideo = userGallery.find((g) => g.mediaType === "video" || guessMediaType(g.mediaUrl) === "video");

      const rc = rateCardMap.get(uId);
      const basePrice = rc?.rates?.post || p.matchProfile?.minAskingPrice || 119;

      // Full display name
      const fullName = [p.personalInfo?.firstName, p.personalInfo?.lastName].filter(Boolean).join(" ");
      const displayName = fullName || p.user?.name || p.handle || "Creator";

      // Locality string
      const cityStr = p.address?.city || "";
      const stateStr = p.address?.state || "";
      const countryStr = p.address?.country || "";
      const locality = [cityStr, stateStr].filter(Boolean).join(", ") || countryStr || "Global";

      // Niches
      const niches = [
        ...(p.categories || []),
        ...(p.matchProfile?.niche || []),
        ...(p.matchProfile?.topics || []),
      ].filter(Boolean);
      const uniqueNiches = [...new Set(niches)];

      // Cover image
      const coverImage = p.personalInfo?.avatar || userGallery[0]?.mediaUrl || "";

      return {
        id: p.user?._id || p._id,
        profileId: p._id,
        handle: p.handle,
        displayName,
        avatar: p.personalInfo?.avatar || "",
        coverImage,
        city: cityStr,
        state: stateStr,
        country: countryStr,
        locality,
        niches: uniqueNiches.slice(0, 4),
        bio: p.matchProfile?.bio || p.matchProfile?.passions || "",
        gender: p.personalInfo?.gender || "",
        ethnicity: p.personalInfo?.ethnicity || "",
        basePrice,
        verified: p.approved !== false,
        rating: avgRating,
        reviewsCount: userReviews.length,
        jobsCompleted,
        hasPitchVideo: !!pitchVideo,
        pitchVideoUrl: pitchVideo?.mediaUrl || null,
        socialAccounts: p.socialAccounts || [],
        galleryCount: userGallery.length,
      };
    });

    if (minP > 0 || maxP < Infinity) {
      creators = creators.filter((c) => c.basePrice >= minP && c.basePrice <= maxP);
    }

    // If no creators in database, provide high-quality fallback demo creators
    if (creators.length === 0) {
      let fallback = [...DEMO_CREATORS];

      if (category || q) {
        const term = (category || q).toLowerCase();
        fallback = fallback.filter(
          (c) =>
            c.displayName.toLowerCase().includes(term) ||
            c.handle.toLowerCase().includes(term) ||
            c.niches.some((n) => n.toLowerCase().includes(term)) ||
            c.bio.toLowerCase().includes(term)
        );
      }

      if (location) {
        const loc = location.toLowerCase();
        fallback = fallback.filter(
          (c) =>
            c.locality.toLowerCase().includes(loc) ||
            c.city.toLowerCase().includes(loc) ||
            c.state.toLowerCase().includes(loc)
        );
      }

      if (gender && gender.toLowerCase() !== "any") {
        fallback = fallback.filter((c) => c.gender.toLowerCase() === gender.toLowerCase());
      }

      if (followers) {
        let minF = 0;
        let maxF = Infinity;
        if (followers === "1k-10k") {
          minF = 1000;
          maxF = 10000;
        } else if (followers === "10k-50k") {
          minF = 10000;
          maxF = 50000;
        } else if (followers === "50k-100k") {
          minF = 50000;
          maxF = 100000;
        } else if (followers === "100k+") {
          minF = 100000;
          maxF = Infinity;
        }
        fallback = fallback.filter((c) => {
          const count = c.socialAccounts?.[0]?.followers || 0;
          return count >= minF && count <= maxF;
        });
      }

      if (minP > 0 || maxP < Infinity) {
        fallback = fallback.filter((c) => c.basePrice >= minP && c.basePrice <= maxP);
      }

      creators = fallback;
    }

    res.json({
      creators,
      total: creators.length,
      filter: {
        platform: platform || "Any platform",
        category: category || "",
        q: q || "",
        contentType: contentType || "",
        followers: followers || "",
        location: location || "",
        price: price || "",
        gender: gender || "",
        age: age || "",
        ethnicity: ethnicity || "",
        language: language || "",
      },
    });
  } catch (error) {
    console.error("Error in getCreatorDiscovery:", error);
    res.status(500).json({
      message: "Unable to search creators.",
      error: error.message,
    });
  }
};

// ============================================================================
// GET /api/public/creators/:id
// Fetches full public profile, rate cards, portfolio media, and reviews
// ============================================================================
export const getPublicCreatorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    let profile = null;

    // Search by User ObjectId, Profile ObjectId, or Handle
    if (mongoose.Types.ObjectId.isValid(id)) {
      profile = await InfluencerProfile.findOne({
        $or: [{ user: id }, { _id: id }],
      })
        .populate("user", "name email")
        .lean();
    }

    if (!profile) {
      const cleanHandle = id.startsWith("@") ? id : `@${id}`;
      profile = await InfluencerProfile.findOne({
        $or: [{ handle: id }, { handle: cleanHandle }],
      })
        .populate("user", "name email")
        .lean();
    }

    if (!profile) {
      const demo = DEMO_CREATORS.find(
        (c) =>
          c.id === id ||
          c.profileId === id ||
          c.handle.toLowerCase() === id.toLowerCase() ||
          `@${c.handle.toLowerCase()}` === id.toLowerCase() ||
          c.displayName.toLowerCase().replace(/\s+/g, "-") === id.toLowerCase()
      );

      if (demo) {
        return res.json({
          creator: {
            id: demo.id,
            profileId: demo.profileId,
            handle: `@${demo.handle.replace("@", "")}`,
            displayName: demo.displayName,
            headline: `${demo.niches[0] || "UGC"} Content Creator`,
            avatar: demo.avatar,
            coverPhoto: demo.coverImage,
            coverPhotos: [demo.coverImage],
            gender: demo.gender,
            ethnicity: demo.ethnicity,
            city: demo.city,
            state: demo.state,
            country: demo.country,
            locality: demo.locality,
            address: { city: demo.city, state: demo.state, country: demo.country },
            bio: demo.bio,
            passions: "Lifestyle, Creative UGC, Aesthetic Storytelling, Brand Partnerships",
            categories: demo.niches,
            niches: demo.niches,
            topics: demo.niches,
            collaborationFormats: ["Instagram Reels", "Instagram Posts", "UGC Video", "Product Photos"],
            socialAccounts: demo.socialAccounts,
            verified: true,
          },
          packages: [
            {
              id: "ugc-unboxing",
              name: "1 UGC Unboxing / Review Video",
              price: demo.basePrice,
              type: "video",
              duration: "30-60s",
              description: "A dynamic and engaging unboxing & product review video tailored for social media feeds.",
              fullDetails: "Complete unboxing flow highlighting key packaging, physical texture, first impressions, and authentic reactions.",
            },
            {
              id: "ugc-product-photos",
              name: "3 High-Resolution UGC Photos",
              price: Math.round(demo.basePrice * 1.15),
              type: "photo",
              duration: "3 Images",
              description: "3 professionally styled lifestyle & product staging photos ready for social ads.",
              fullDetails: "3 edited, high-resolution lifestyle images suitable for e-commerce, Instagram grid, and marketing collaterals.",
            },
            {
              id: "ugc-video-ad",
              name: "1 High-Converting UGC Paid Video Ad",
              price: Math.round(demo.basePrice * 1.3),
              type: "ad",
              duration: "30s",
              description: "Hook-focused paid ad creative optimized for conversions on Meta and TikTok.",
              fullDetails: "Includes hook variations, 30 days paid ads usage rights, vertical 9:16 export, and custom text overlays.",
            },
          ],
          portfolio: [
            {
              id: "demo-port-1",
              mediaUrl: demo.coverImage,
              mediaType: "image",
              caption: "Aesthetic Product Showcase",
              platform: "Instagram",
              highlighted: true,
              source: "showcase",
            },
            ...(demo.pitchVideoUrl
              ? [
                  {
                    id: "demo-port-2",
                    mediaUrl: demo.pitchVideoUrl,
                    mediaType: "video",
                    caption: "Pitch & Video Portfolio",
                    platform: "Instagram",
                    highlighted: true,
                    source: "showcase",
                  },
                ]
              : []),
          ],
          reviews: [
            {
              id: "demo-rev-1",
              rating: 5,
              comment: "Exceptional content quality! Delivered ahead of schedule with great communication.",
              brandName: "Glow & Co.",
              createdAt: new Date().toISOString(),
            },
            {
              id: "demo-rev-2",
              rating: 5,
              comment: "High conversion on our paid ads campaign with this creator's video.",
              brandName: "Aura Essentials",
              createdAt: new Date().toISOString(),
            },
          ],
          stats: {
            rating: demo.rating,
            reviewsCount: demo.reviewsCount,
            collaborationsCompleted: demo.jobsCompleted,
            responseTimeHours: 4,
          },
          rateCard: null,
        });
      }

      return res.status(404).json({ message: "Creator profile not found." });
    }

    const userId = profile.user?._id;

    // Fetch related data in parallel
    const [rateCard, galleryDocs, collabDocs, reviews, stats] = await Promise.all([
      RateCard.findOne({ influencer: userId }).lean(),
      GalleryContent.find({ influencer: userId }).sort({ highlighted: -1, createdAt: -1 }).lean(),
      Collaboration.find({ influencer: userId, stage: "completed" }).distinct("_id").then((cIds) =>
        ContentPost.find({ collaboration: { $in: cIds } }).sort({ publishedAt: -1 }).lean()
      ),
      Review.find({ influencer: userId })
        .populate("brand", "name email")
        .sort({ createdAt: -1 })
        .lean(),
      computeInfluencerStats(userId),
    ]);

    // Build portfolio items
    const portfolio = [
      ...galleryDocs.map((d) => ({
        id: String(d._id),
        mediaUrl: d.mediaUrl,
        mediaType: d.mediaType || guessMediaType(d.mediaUrl),
        caption: d.caption,
        platform: d.platform,
        highlighted: !!d.highlighted,
        source: "showcase",
        createdAt: d.createdAt,
      })),
      ...collabDocs.map((d) => ({
        id: String(d._id),
        mediaUrl: d.mediaUrl,
        mediaType: guessMediaType(d.mediaUrl),
        caption: d.caption,
        platform: d.platform,
        highlighted: false,
        source: "collaboration",
        createdAt: d.publishedAt || d.createdAt,
      })),
    ];

    // Build pricing packages based on custom configured packages, RateCard or matchProfile
    const customPkgs = rateCard?.packages?.length > 0 ? rateCard.packages : (profile.packages?.length > 0 ? profile.packages : null);

    // Sanitize base prices so they don't produce astronomical multi-million figures if raw INR was stored
    let basePost = Number(rateCard?.rates?.post || profile.matchProfile?.minAskingPrice || 119);
    if (basePost > 5000) {
      basePost = Math.min(2500, Math.max(45, Math.round(basePost / 85)));
    }
    let baseReel = Number(rateCard?.rates?.reel || Math.round(basePost * 1.2) || 130);
    if (baseReel > 5000) {
      baseReel = Math.min(3000, Math.max(55, Math.round(baseReel / 85)));
    }

    let packages = [];
    if (customPkgs && customPkgs.length > 0) {
      packages = customPkgs.map((cp, idx) => {
        let pkgPrice = Number(cp.price) || baseReel;
        if (pkgPrice > 5000) {
          pkgPrice = Math.min(3000, Math.max(45, Math.round(pkgPrice / 85)));
        }
        return {
          id: cp.id || `custom-pkg-${idx}`,
          name: cp.title || `${cp.count || 1} ${cp.contentType || "Reel"} (${cp.duration || 30} ${cp.durationUnit || "Seconds"})`,
          price: pkgPrice,
          type: String(cp.contentType || "video").toLowerCase(),
          duration: `${cp.duration || 30} ${cp.durationUnit || "Seconds"}`,
          description: cp.description || "",
          fullDetails: cp.description || `Includes high-definition production, vertical format (9:16), 1 round of revisions, and full organic usage rights.`,
        };
      });
    }

    // Compute average rating
    const avgRating =
      reviews.length > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
        : 0;

    // Full display name & title
    const fullName = [profile.personalInfo?.firstName, profile.personalInfo?.lastName].filter(Boolean).join(" ");
    const displayName = fullName || profile.user?.name || profile.handle || "Creator";
    const primaryCategory = profile.categories?.[0] || profile.matchProfile?.niche?.[0] || "";
    const headline = profile.personalInfo?.title || (primaryCategory ? `${primaryCategory} Creator` : "");

    // Location details
    const city = profile.address?.city || "";
    const state = profile.address?.state || "";
    const country = profile.address?.country || "";
    const locality = [city, state, country].filter(Boolean).join(", ");

    const realBio = profile.matchProfile?.bio || profile.personalInfo?.description || profile.matchProfile?.passions || "";

    res.json({
      creator: {
        id: profile.user?._id || profile._id,
        profileId: profile._id,
        handle: profile.handle,
        displayName,
        headline,
        avatar: profile.personalInfo?.avatar || "",
        coverPhoto: profile.personalInfo?.coverPhoto || "",
        coverPhotos: profile.personalInfo?.coverPhotos?.length > 0
          ? profile.personalInfo.coverPhotos
          : (profile.personalInfo?.coverPhoto ? [profile.personalInfo.coverPhoto] : []),
        gender: profile.personalInfo?.gender || "",
        ethnicity: profile.personalInfo?.ethnicity || "",
        city,
        state,
        country,
        locality,
        address: profile.address || {},
        bio: realBio,
        passions: profile.matchProfile?.passions || "",
        categories: profile.categories || [],
        niches: profile.matchProfile?.niche || [],
        topics: profile.matchProfile?.topics || [],
        collaborationFormats: profile.matchProfile?.collaborationFormats || [],
        socialAccounts: profile.socialAccounts || [],
        verified: profile.approved !== false,
      },
      packages,
      portfolio,
      reviews: reviews.map((r) => ({
        id: r._id,
        rating: r.rating,
        comment: r.comment || "Great collaboration, delivered high quality content on time!",
        brandName: r.brand?.name || "Brand Partner",
        createdAt: r.createdAt,
      })),
      stats: {
        rating: avgRating,
        reviewsCount: reviews.length,
        collaborationsCompleted: stats.collaborationsCompleted || 0,
        responseTimeHours: stats.responseTime?.avgHours || null,
      },
      rateCard: rateCard || null,
    });
  } catch (error) {
    console.error("Error in getPublicCreatorProfile:", error);
    res.status(500).json({
      message: "Unable to load creator profile.",
      error: error.message,
    });
  }
};
