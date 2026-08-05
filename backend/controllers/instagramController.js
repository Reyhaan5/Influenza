// backend/controllers/instagramController.js
import axios from "axios";

const GRAPH_VERSION = "v19.0";

// GET /api/public/instagram-lookup?handle=someuser
// Uses Meta's Business Discovery — only works if the TARGET handle is a
// Business/Creator account. Personal accounts will always fall through
// to the manual entry flow on the frontend, by design.
export const lookupInstagramHandle = async (req, res) => {
  const rawHandle = (req.query.handle || "").trim().replace(/^@/, "");

  if (!rawHandle) {
    return res.status(400).json({ found: false, reason: "No handle provided." });
  }

  const { IG_BUSINESS_ACCOUNT_ID, FB_PAGE_ACCESS_TOKEN } = process.env;
  if (!IG_BUSINESS_ACCOUNT_ID || !FB_PAGE_ACCESS_TOKEN) {
    // Credentials not configured yet — fail soft, don't crash the demo.
    return res.json({ found: false, reason: "lookup_not_configured" });
  }

  try {
    const url = `https://graph.facebook.com/${GRAPH_VERSION}/${IG_BUSINESS_ACCOUNT_ID}`;
    const { data } = await axios.get(url, {
      params: {
        fields: `business_discovery.username(${rawHandle}){followers_count,media_count,media.limit(12){like_count,comments_count}}`,
        access_token: FB_PAGE_ACCESS_TOKEN,
      },
      timeout: 6000,
    });

    const discovery = data?.business_discovery;
    if (!discovery) {
      return res.json({ found: false, reason: "not_a_business_account" });
    }

    const media = discovery.media?.data || [];
    const avgLikes = media.length
      ? Math.round(media.reduce((sum, m) => sum + (m.like_count || 0), 0) / media.length)
      : 0;
    const avgComments = media.length
      ? Math.round(media.reduce((sum, m) => sum + (m.comments_count || 0), 0) / media.length)
      : 0;

    return res.json({
      found: true,
      handle: `@${rawHandle}`,
      followers: discovery.followers_count || 0,
      avgLikes,
      avgComments,
    });
  } catch (error) {
    // Covers: private/personal account, invalid handle, expired token, rate limit.
    // All of these should fall back to manual entry rather than error out.
    return res.json({ found: false, reason: "lookup_failed" });
  }
};