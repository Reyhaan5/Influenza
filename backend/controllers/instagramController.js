// backend/controllers/instagramController.js
import { scrapeInstagram } from "../services/instagram/apifyService.js";
import InstagramCache from "../models/InstagramCache.js";
import { POPULAR_FALLBACKS } from "../fixtures/instagramFallbacks.js";

export { POPULAR_FALLBACKS };

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Format profile payload with dynamic image proxy
function formatProfileResponse(profile, req) {
  const rawPic = profile.rawProfilePicUrl || profile.profilePicUrlHD || profile.profilePicUrl || "";
  const host = req.get("host");
  const protocol = req.protocol;
  let profilePicUrl = "";
  if (rawPic) {
    if (rawPic.startsWith("/uploads")) {
      profilePicUrl = `${protocol}://${host}${rawPic}`;
    } else if (rawPic.startsWith("http") && !rawPic.includes("wikimedia") && !rawPic.includes("unsplash")) {
      profilePicUrl = `${protocol}://${host}/api/public/proxy-image?url=${encodeURIComponent(rawPic)}`;
    } else {
      profilePicUrl = rawPic;
    }
  }

  return {
    found: true,
    handle: profile.handle.startsWith("@") ? profile.handle : `@${profile.handle}`,
    fullName: profile.fullName || profile.handle,
    profilePicUrl,
    rawProfilePicUrl: rawPic,
    biography: profile.biography || "",
    verified: Boolean(profile.verified),
    followers: Number(profile.followers) || 0,
    avgLikes: Number(profile.avgLikes) || 0,
    avgComments: Number(profile.avgComments) || 0,
    avgViews: Number(profile.avgViews) || (profile.avgLikes ? profile.avgLikes * 3 : 0),
    topPosts: profile.topPosts || [],
    cached: Boolean(profile.cached),
  };
}

// GET /api/public/instagram-lookup?handle=someuser
export const lookupInstagramHandle = async (req, res) => {
  const rawHandle = (req.query.handle || "").trim().replace(/^@/, "").toLowerCase();
  if (!rawHandle) return res.status(400).json({ found: false, message: "No handle provided." });

  // 1. Check MongoDB Cache first
  let cachedDoc = null;
  try {
    cachedDoc = await InstagramCache.findOne({ handle: rawHandle });
    if (cachedDoc && Date.now() - new Date(cachedDoc.lastFetchedAt).getTime() < CACHE_TTL_MS) {
      return res.json(formatProfileResponse({ ...cachedDoc.toObject(), cached: true }, req));
    }
  } catch (cacheErr) {
    console.warn("[Instagram Lookup] Cache check error:", cacheErr.message);
  }

  // 2. Try scraping via Apify
  try {
    const profile = await scrapeInstagram(rawHandle);
    if (!profile || (!profile.followersCount && !profile.username && !profile.fullName)) {
      if (cachedDoc) return res.json(formatProfileResponse({ ...cachedDoc.toObject(), cached: true }, req));
      if (POPULAR_FALLBACKS[rawHandle]) return res.json(formatProfileResponse(POPULAR_FALLBACKS[rawHandle], req));
      return res.json({ found: false, message: `Instagram profile @${rawHandle} not found. Please verify the handle.` });
    }

    const followers = profile.followersCount ?? profile.followers ?? 0;
    const posts = (profile.latestPosts ?? []).slice(0, 12);
    const avgLikes = posts.length ? Math.round(posts.reduce((s, p) => s + (p.likesCount ?? p.likeCount ?? 0), 0) / posts.length) : 0;
    const avgComments = posts.length ? Math.round(posts.reduce((s, p) => s + (p.commentsCount ?? p.commentCount ?? 0), 0) / posts.length) : 0;
    const avgViews = posts.length ? Math.round(posts.reduce((s, p) => s + (p.videoViewCount ?? p.viewCount ?? p.playCount ?? (p.likesCount ? p.likesCount * 3 : 0)), 0) / posts.length) : 0;

    const topPosts = posts
      .map((p) => ({
        id: p.id || p.shortCode,
        caption: p.caption || "Instagram Post",
        likes: p.likesCount ?? p.likeCount ?? 0,
        comments: p.commentsCount ?? p.commentCount ?? 0,
        views: p.videoViewCount ?? p.viewCount ?? p.playCount ?? (p.likesCount ? p.likesCount * 3 : 0),
        url: p.url || `https://instagram.com/p/${p.shortCode || ""}`,
        displayUrl: p.displayUrl || "",
        isVideo: p.isVideo || p.type === "Video",
      }))
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);

    const profileData = {
      handle: rawHandle,
      fullName: profile.fullName ?? profile.name ?? rawHandle,
      rawProfilePicUrl: profile.profilePicUrlHD ?? profile.profilePicUrl ?? "",
      biography: profile.biography ?? profile.bio ?? "",
      verified: Boolean(profile.verified ?? profile.isVerified),
      followers,
      avgLikes,
      avgComments,
      avgViews,
      topPosts,
      lastFetchedAt: new Date(),
    };

    InstagramCache.findOneAndUpdate({ handle: rawHandle }, { $set: profileData }, { upsert: true, new: true }).catch(() => {});
    return res.json(formatProfileResponse(profileData, req));
  } catch (error) {
    if (cachedDoc) return res.json(formatProfileResponse({ ...cachedDoc.toObject(), cached: true }, req));
    if (POPULAR_FALLBACKS[rawHandle]) {
      const fallback = POPULAR_FALLBACKS[rawHandle];
      InstagramCache.findOneAndUpdate({ handle: rawHandle }, { $set: { ...fallback, handle: rawHandle, lastFetchedAt: new Date() } }, { upsert: true }).catch(() => {});
      return res.json(formatProfileResponse(fallback, req));
    }
    return res.json({ found: false, message: `Could not retrieve live Instagram profile for @${rawHandle}: ${error.message}` });
  }
};

// GET /api/public/proxy-image?url=https://...
export const proxyInstagramImage = async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).send("No image URL provided.");

  try {
    const response = await fetch(imageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
    });
    if (!response.ok) return res.status(response.status).send("Failed to load image from Instagram CDN.");

    res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    const arrayBuffer = await response.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("Image proxy error:", err.message);
    return res.status(500).send("Image proxy failed.");
  }
};
