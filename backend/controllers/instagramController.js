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
            reason: "No handle provided.",
        });
    }

    try {
        console.log("Fetching Instagram profile for:", rawHandle);

        const profile = await scrapeInstagram(rawHandle);

        if (!profile) {
            return res.json({
                found: false,
                reason: "Profile not found",
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

        return res.json({
            found: true,
            handle: `@${rawHandle}`,
            followers,
            avgLikes,
            avgComments,
        });

    } catch (error) {
        console.error(
            "Instagram lookup failed:",
            error.message
        );

        return res.json({
            found: false,
            reason: "lookup_failed",
        });
    }
};