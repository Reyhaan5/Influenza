// backend/controllers/instagramController.js

import { scrapeInstagram } from "../services/instagram/apifyService.js";

// GET /api/public/instagram-lookup?handle=someuser
export const lookupInstagramHandle = async (req, res) => {
    const rawHandle = (req.query.handle || "")
        .trim()
        .replace(/^@/, "");

    if (!rawHandle) {
        return res.status(400).json({
            found: false,
            message: "No handle provided.",
        });
    }

    try {
        console.log(`[Instagram Lookup] Fetching live Instagram data for @${rawHandle}`);

        const profile = await scrapeInstagram(rawHandle);

        if (!profile || (!profile.followersCount && !profile.username && !profile.fullName)) {
            return res.json({
                found: false,
                message: `Instagram profile @${rawHandle} not found. Please verify the handle.`,
            });
        }

        const followers =
            profile.followersCount ??
            profile.followers ??
            0;

        const latestPosts = profile.latestPosts ?? [];
        const posts = latestPosts.slice(0, 12);

        const avgLikes = posts.length
            ? Math.round(
                posts.reduce(
                    (sum, post) =>
                        sum +
                        (post.likesCount ??
                            post.likeCount ??
                            0),
                    0
                ) / posts.length
            )
            : 0;

        const avgComments = posts.length
            ? Math.round(
                posts.reduce(
                    (sum, post) =>
                        sum +
                        (post.commentsCount ??
                            post.commentCount ??
                            0),
                    0
                ) / posts.length
            )
            : 0;

        const avgViews = posts.length
            ? Math.round(
                posts.reduce(
                    (sum, post) =>
                        sum +
                        (post.videoViewCount ??
                            post.viewCount ??
                            post.playCount ??
                            (post.likesCount ? post.likesCount * 3 : 0)),
                    0
                ) / posts.length
            )
            : 0;

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

        const fullName = profile.fullName ?? profile.name ?? rawHandle;
        const rawPic = profile.profilePicUrlHD ?? profile.profilePicUrl ?? "";
        const profilePicUrl = rawPic
            ? `http://localhost:5000/api/public/proxy-image?url=${encodeURIComponent(rawPic)}`
            : "";
        const verified = Boolean(profile.verified ?? profile.isVerified);
        const biography = profile.biography ?? profile.bio ?? "";

        return res.json({
            found: true,
            handle: `@${rawHandle}`,
            fullName,
            profilePicUrl,
            rawProfilePicUrl: rawPic,
            biography,
            verified,
            followers,
            avgLikes,
            avgComments,
            avgViews,
            topPosts,
        });

    } catch (error) {
        console.error(
            "Instagram lookup failed:",
            error.message
        );

        return res.json({
            found: false,
            message: `Could not retrieve live Instagram profile for @${rawHandle}: ${error.message}`,
        });
    }
};

// GET /api/public/proxy-image?url=https://...
export const proxyInstagramImage = async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) {
        return res.status(400).send("No image URL provided.");
    }

    try {
        const response = await fetch(imageUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        });

        if (!response.ok) {
            return res.status(response.status).send("Failed to load image from Instagram CDN.");
        }

        const contentType = response.headers.get("content-type") || "image/jpeg";
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=86400");

        const arrayBuffer = await response.arrayBuffer();
        return res.send(Buffer.from(arrayBuffer));
    } catch (err) {
        console.error("Image proxy error:", err.message);
        return res.status(500).send("Image proxy failed.");
    }
};
