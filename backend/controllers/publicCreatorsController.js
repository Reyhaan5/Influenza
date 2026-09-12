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
      approved: true,
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

    const filter = { approved: true };

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
          description: cp.description || `${cp.count || 1}x ${cp.contentType || "Reel"} tailored for brand engagement and conversions.`,
          fullDetails: cp.description || `Includes high-definition production, vertical format (9:16), 1 round of revisions, and full organic usage rights.`,
        };
      });
    } else {
      packages = [
        {
          id: "ugc-unboxing",
          name: "1 UGC Unboxing (45 Seconds)",
          price: basePost,
          type: "video",
          duration: "45 Seconds",
          description: "That perfect 'unboxing' video, but make it vibey! - 1x 30-45 second video featuring authentic unboxing reactions and product demonstration.",
          fullDetails: "Includes script ideation, high-definition recording, lighting, vertical formatting (9:16) for Instagram Reels, 1 round of revisions, and full organic usage rights.",
        },
        {
          id: "ugc-testimonial",
          name: "1 UGC Testimonial/Review (30 Seconds)",
          price: Math.round(basePost * 1.08),
          type: "video",
          duration: "30 Seconds",
          description: "Authentic, relatable testimonial video discussing real benefits, problem-solving, and direct hook that turns viewers into buyers.",
          fullDetails: "Includes authentic on-camera talking head, lifestyle B-roll, on-screen subtitles/captions, and call to action.",
        },
        {
          id: "ugc-product-video",
          name: "1 UGC Product Video (30 Seconds)",
          price: baseReel,
          type: "video",
          duration: "30 Seconds",
          description: "A video that will be the center of attention without begging! I've got you covered with dynamic lifestyle visuals.",
          fullDetails: "Dynamic lifestyle presentation showing the product in action, dynamic aesthetic cuts, voiceover narration, and trending audio integration.",
        },
        {
          id: "ugc-product-photos",
          name: "3 UGC Product Photos",
          price: Math.round(basePost * 1.18),
          type: "photo",
          duration: "3 Images",
          description: "The product photos that will ACTUALLY bring you sales! - High res, high-aesthetic staging.",
          fullDetails: "3 edited, high-resolution lifestyle images suitable for e-commerce, Instagram grid, and marketing collaterals.",
        },
        {
          id: "ugc-video-ad",
          name: "1 UGC Video Ad (30 Seconds)",
          price: Math.round(baseReel * 1.23),
          type: "ad",
          duration: "30 Seconds",
          description: "High-converting paid ad creative engineered with strong 3-second hook, pain points, and conversion-focused CTA.",
          fullDetails: "Includes hook variations, 30 days paid ads usage rights, vertical 9:16 export, and custom text overlays.",
        },
      ];
    }

    // Compute average rating
    const avgRating =
      reviews.length > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
        : 0;

    // Full display name & title
    const fullName = [profile.personalInfo?.firstName, profile.personalInfo?.lastName].filter(Boolean).join(" ");
    const displayName = fullName || profile.user?.name || profile.handle || "Creator";
    const primaryCategory = profile.categories?.[0] || profile.matchProfile?.niche?.[0] || "Content Creator";
    const headline = `${primaryCategory} UGC Content Creator`;

    // Location details
    const city = profile.address?.city || "";
    const state = profile.address?.state || "";
    const country = profile.address?.country || "";
    const locality = [city, state, country].filter(Boolean).join(", ") || "Global";

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
        bio: profile.matchProfile?.bio || profile.matchProfile?.passions || "Passionate content creator producing high-converting UGC and authentic stories for leading brands.",
        passions: profile.matchProfile?.passions || "",
        categories: profile.categories || [],
        niches: profile.matchProfile?.niche || [],
        topics: profile.matchProfile?.topics || [],
        collaborationFormats: profile.matchProfile?.collaborationFormats || ["Instagram Reels", "Instagram Posts"],
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
        responseTimeHours: stats.responseTime?.avgHours || 24,
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
