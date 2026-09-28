import mongoose from "mongoose";
import InfluencerProfile from "../models/InfluencerProfile.js";
import RateCard from "../models/RateCard.js";
import GalleryContent from "../models/GalleryContent.js";
import Collaboration from "../models/Collaboration.js";
import Review from "../models/Review.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { DEMO_CREATORS } from "../fixtures/demoData.js";
export { DEMO_CREATORS } from "../fixtures/demoData.js";

function guessMediaType(url = "") {
  return /\.(mp4|mov|webm|m4v)$/i.test(url) ? "video" : "image";
}

function mapProfileToCreatorCard(p, reviewsMap, collabsMap, galleryMap, rateCardMap) {
  const uId = String(p.user?._id || p._id);
  const userReviews = reviewsMap.get(uId) || [];
  const avgRating = userReviews.length > 0
    ? Number((userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1))
    : 0;

  const jobsCompleted = collabsMap.get(uId) || 0;
  const userGallery = galleryMap.get(uId) || [];
  const pitchVideo = userGallery.find((g) => g.mediaType === "video" || guessMediaType(g.mediaUrl) === "video");
  const rc = rateCardMap.get(uId);
  const basePrice = rc?.rates?.post || p.matchProfile?.minAskingPrice || 119;

  const fullName = [p.personalInfo?.firstName, p.personalInfo?.lastName].filter(Boolean).join(" ");
  const displayName = fullName || p.user?.name || p.handle || "Creator";
  const cityStr = p.address?.city || "";
  const stateStr = p.address?.state || "";
  const countryStr = p.address?.country || "";
  const locality = [cityStr, stateStr].filter(Boolean).join(", ") || countryStr || "Global";

  const niches = [...(p.categories || []), ...(p.matchProfile?.niche || []), ...(p.matchProfile?.topics || [])].filter(Boolean);

  return {
    id: p.user?._id || p._id,
    profileId: p._id,
    handle: p.handle,
    displayName,
    avatar: p.personalInfo?.avatar || "",
    coverImage: p.personalInfo?.avatar || userGallery[0]?.mediaUrl || "",
    city: cityStr,
    state: stateStr,
    country: countryStr,
    locality,
    niches: [...new Set(niches)].slice(0, 4),
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
}

// ============================================================================
// GET /api/public/creators-by-category?category=Skincare
// ============================================================================
export const getCreatorsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.query;
  if (!category) return res.status(400).json({ message: "category query param is required." });

  const creators = await InfluencerProfile.find({ approved: { $ne: false }, categories: category })
    .populate("user", "name email")
    .select("handle socialAccounts categories user personalInfo address matchProfile")
    .sort({ updatedAt: -1 })
    .lean();

  res.json({ category, creators });
});

// ============================================================================
// GET /api/public/creator-discovery
// ============================================================================
export const getCreatorDiscovery = asyncHandler(async (req, res) => {
  const {
    platform, category, q, contentType, followers, minFollowers, maxFollowers,
    location, state, city, price, minPrice, maxPrice, gender, age, ethnicity, language,
  } = req.query;

  const filter = { approved: { $ne: false } };
  const locQuery = (location || "").trim();

  if (locQuery) {
    const locRegex = new RegExp(locQuery, "i");
    filter.$or = [{ "address.city": locRegex }, { "address.state": locRegex }, { "address.country": locRegex }];
  } else {
    if (state?.trim()) filter["address.state"] = { $regex: new RegExp(state.trim(), "i") };
    if (city?.trim()) filter["address.city"] = { $regex: new RegExp(city.trim(), "i") };
  }

  if (gender?.trim() && gender.toLowerCase() !== "any") {
    filter["personalInfo.gender"] = { $regex: new RegExp(`^${gender.trim()}$`, "i") };
  }
  if (ethnicity?.trim() && ethnicity.toLowerCase() !== "any") {
    filter["personalInfo.ethnicity"] = { $regex: new RegExp(ethnicity.trim(), "i") };
  }

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

  let profiles = await InfluencerProfile.find(filter).populate("user", "name email").sort({ updatedAt: -1 }).lean();

  if (platform?.trim() && !platform.toLowerCase().includes("any")) {
    const pLower = platform.trim().toLowerCase();
    profiles = profiles.filter((p) => (p.socialAccounts || []).some((acc) => acc.platform?.toLowerCase().includes(pLower)));
  }

  // Follower range parsing
  let minF = Number(minFollowers) || 0;
  let maxF = Number(maxFollowers) || Infinity;
  if (followers === "1k-10k") { minF = 1000; maxF = 10000; }
  else if (followers === "10k-50k") { minF = 10000; maxF = 50000; }
  else if (followers === "50k-100k") { minF = 50000; maxF = 100000; }
  else if (followers === "100k+") { minF = 100000; maxF = Infinity; }

  if (minF > 0 || maxF < Infinity) {
    profiles = profiles.filter((p) => {
      const totalF = Math.max(0, ...(p.socialAccounts || []).map((acc) => acc.followers || 0));
      return totalF >= minF && totalF <= maxF;
    });
  }

  if (contentType?.trim() && contentType.toLowerCase() !== "any") {
    const ctLower = contentType.trim().toLowerCase();
    profiles = profiles.filter((p) => {
      const formats = (p.matchProfile?.collaborationFormats || []).map((f) => f.toLowerCase());
      const categories = (p.categories || []).map((c) => c.toLowerCase());
      return formats.some((f) => f.includes(ctLower)) || categories.some((c) => c.includes(ctLower)) || p.matchProfile?.bio?.toLowerCase().includes(ctLower);
    });
  }

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
  completedCollabs.forEach((c) => collabsMap.set(String(c.influencer), (collabsMap.get(String(c.influencer)) || 0) + 1));

  const galleryMap = new Map();
  galleryItems.forEach((g) => {
    const id = String(g.influencer);
    if (!galleryMap.has(id)) galleryMap.set(id, []);
    galleryMap.get(id).push(g);
  });

  const rateCardMap = new Map();
  rateCards.forEach((rc) => rateCardMap.set(String(rc.influencer), rc));

  let minP = Number(minPrice) || 0;
  let maxP = Number(maxPrice) || Infinity;
  if (price === "under-100") { minP = 0; maxP = 100; }
  else if (price === "100-250") { minP = 100; maxP = 250; }
  else if (price === "250-500") { minP = 250; maxP = 500; }
  else if (price === "500+") { minP = 500; maxP = Infinity; }

  let creators = profiles.map((p) => mapProfileToCreatorCard(p, reviewsMap, collabsMap, galleryMap, rateCardMap));
  if (minP > 0 || maxP < Infinity) creators = creators.filter((c) => c.basePrice >= minP && c.basePrice <= maxP);

  // Fallback demo creators
  if (creators.length === 0) {
    let fallback = [...DEMO_CREATORS];
    if (category || q) {
      const term = (category || q).toLowerCase();
      fallback = fallback.filter((c) => c.displayName.toLowerCase().includes(term) || c.handle.toLowerCase().includes(term) || c.niches.some((n) => n.toLowerCase().includes(term)));
    }
    if (gender && gender.toLowerCase() !== "any") fallback = fallback.filter((c) => c.gender.toLowerCase() === gender.toLowerCase());
    if (minP > 0 || maxP < Infinity) fallback = fallback.filter((c) => c.basePrice >= minP && c.basePrice <= maxP);
    creators = fallback;
  }

  res.json({
    creators,
    total: creators.length,
    filter: { platform, category, q, contentType, followers, location, price, gender, age, ethnicity, language },
  });
});

// ============================================================================
// GET /api/public/creators/:id
// ============================================================================
export const getPublicCreatorProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let profile = null;

  if (mongoose.Types.ObjectId.isValid(id)) {
    profile = await InfluencerProfile.findOne({ $or: [{ user: id }, { _id: id }] }).populate("user", "name email").lean();
  }
  if (!profile) {
    const cleanHandle = id.startsWith("@") ? id : `@${id}`;
    profile = await InfluencerProfile.findOne({ $or: [{ handle: id }, { handle: cleanHandle }] }).populate("user", "name email").lean();
  }

  if (!profile) {
    const demo = DEMO_CREATORS.find((c) => c.id === id || c.profileId === id || c.handle.toLowerCase() === id.toLowerCase() || `@${c.handle.toLowerCase()}` === id.toLowerCase());
    if (demo) {
      return res.json({
        creator: {
          id: demo.id,
          profileId: demo.profileId,
          handle: `@${demo.handle.replace("@", "")}`,
          displayName: demo.displayName,
          headline: `${demo.niches[0] || "UGC"} Content Creator`,
          avatar: demo.avatar,
          coverPhotos: [demo.coverImage],
          locality: demo.locality,
          bio: demo.bio,
          categories: demo.niches,
          verified: demo.verified,
          socialAccounts: demo.socialAccounts,
        },
        packages: [
          { id: "ugc-reel", name: "1x High-Converting UGC Reel", price: demo.basePrice, description: "Full rights UGC short-form video edited with captions & sound." },
          { id: "ugc-bundle", name: "3x UGC Video Hook Variations", price: Math.round(demo.basePrice * 2.2), description: "1 main video with 3 alternative high-converting opening hooks." },
        ],
        portfolio: demo.hasPitchVideo && demo.pitchVideoUrl ? [{ id: "pitch", mediaUrl: demo.pitchVideoUrl, mediaType: "video", caption: "Creator Pitch Reel" }] : [],
        reviews: [],
        stats: { rating: demo.rating, reviewsCount: demo.reviewsCount, completedCollaborations: demo.jobsCompleted },
      });
    }
    return res.status(404).json({ message: "Creator profile not found." });
  }

  const userId = profile.user?._id;
  const [rateCard, galleryItems, reviews, completedCollabs] = await Promise.all([
    RateCard.findOne({ influencer: userId }).lean(),
    GalleryContent.find({ influencer: userId }).sort({ highlighted: -1, createdAt: -1 }).lean(),
    Review.find({ influencer: userId }).populate("brand", "name").lean(),
    Collaboration.countDocuments({ influencer: userId, stage: "completed" }),
  ]);

  const fullName = [profile.personalInfo?.firstName, profile.personalInfo?.lastName].filter(Boolean).join(" ");
  const coverPhotos = galleryItems.filter((g) => g.mediaType !== "video").slice(0, 3).map((g) => g.mediaUrl);
  if (coverPhotos.length === 0 && profile.personalInfo?.avatar) coverPhotos.push(profile.personalInfo.avatar);

  const packages = [];
  if (rateCard?.rates) {
    if (rateCard.rates.reel) packages.push({ id: "reel", name: "1x Dedicated Instagram Reel", price: rateCard.rates.reel, description: "Full 30-60s Reel" });
    if (rateCard.rates.post) packages.push({ id: "post", name: "1x In-Feed Photo Post", price: rateCard.rates.post, description: "Static photo or carousel" });
    if (rateCard.rates.story) packages.push({ id: "story", name: "2x Instagram Stories", price: rateCard.rates.story, description: "24-hour Story with link sticker" });
    if (rateCard.rates.ugcVideo) packages.push({ id: "ugc", name: "1x UGC Ad Video Asset", price: rateCard.rates.ugcVideo, description: "Raw + edited UGC video ad" });
  }

  res.json({
    creator: {
      id: profile.user?._id || profile._id,
      profileId: profile._id,
      handle: profile.handle,
      displayName: fullName || profile.user?.name || profile.handle,
      avatar: profile.personalInfo?.avatar || "",
      coverPhotos,
      locality: [profile.address?.city, profile.address?.state].filter(Boolean).join(", ") || profile.address?.country || "Global",
      bio: profile.matchProfile?.bio || "",
      passions: profile.matchProfile?.passions || "",
      categories: profile.categories || [],
      verified: profile.approved !== false,
      socialAccounts: profile.socialAccounts || [],
    },
    packages,
    portfolio: galleryItems.map((g) => ({ id: g._id, mediaUrl: g.mediaUrl, mediaType: g.mediaType || guessMediaType(g.mediaUrl), caption: g.caption })),
    reviews: reviews.map((r) => ({ id: r._id, brandName: r.brand?.name || "Verified Brand", rating: r.rating, comment: r.comment, createdAt: r.createdAt })),
    stats: {
      rating: reviews.length > 0 ? Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)) : 0,
      reviewsCount: reviews.length,
      completedCollaborations: completedCollabs,
    },
  });
});
