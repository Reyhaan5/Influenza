import { ApifyClient } from "apify-client";

// Module-level pointer to track the current active token
let currentTokenIndex = 0;

/**
 * Collects and deduplicates all valid Apify tokens from environment variables.
 * Supports:
 * - APIFY_TOKENS (comma-separated list)
 * - APIFY_TOKEN_1, APIFY_TOKEN_2, APIFY_TOKEN_3, APIFY_TOKEN_4, APIFY_TOKEN_5
 * - Legacy APIFY_TOKEN
 */
export function getApifyTokens() {
    const rawTokens = [];

    // 1. Check comma-separated APIFY_TOKENS
    if (process.env.APIFY_TOKENS) {
        process.env.APIFY_TOKENS.split(",").forEach((t) => rawTokens.push(t.trim()));
    }

    // 2. Check individual indexed tokens (APIFY_TOKEN_1 .. APIFY_TOKEN_10)
    for (let i = 1; i <= 10; i++) {
        const token = process.env[`APIFY_TOKEN_${i}`];
        if (token) rawTokens.push(token.trim());
    }

    // 3. Fallback to legacy single APIFY_TOKEN
    if (process.env.APIFY_TOKEN) {
        rawTokens.push(process.env.APIFY_TOKEN.trim());
    }

    // Deduplicate and filter out empty / obvious placeholder strings
    const uniqueTokens = Array.from(new Set(rawTokens)).filter((t) => {
        if (!t) return false;
        const lower = t.toLowerCase();
        if (lower.startsWith("your_") || lower.includes("replace_this")) return false;
        return true;
    });

    return uniqueTokens;
}

/**
 * Checks whether an error is likely due to rate limits, quota limits,
 * credit exhaustion, or authentication issues.
 */
function isFailoverError(err) {
    const status = err.statusCode || err.status || (err.response && err.response.status);
    if ([401, 402, 403, 429].includes(status)) {
        return true;
    }

    const message = (err.message || "").toLowerCase();
    const limitKeywords = [
        "credit",
        "usage limit",
        "monthly usage",
        "rate limit",
        "rate-limit",
        "exceeded",
        "payment required",
        "insufficient",
        "quota",
        "out of memory",
        "token is invalid",
        "unauthorized",
        "forbidden"
    ];

    return limitKeywords.some((keyword) => message.includes(keyword));
}

function maskToken(token) {
    if (!token || token.length <= 12) return "***";
    return `${token.slice(0, 10)}...${token.slice(-4)}`;
}

export async function scrapeInstagram(username) {
    const tokens = getApifyTokens();

    if (!tokens || tokens.length === 0) {
        throw new Error(
            "No valid Apify API token configured. Please set APIFY_TOKENS or APIFY_TOKEN_1 in backend/.env or your environment variables on Render."
        );
    }

    const cleanUsername = username.trim().replace(/^@/, "");
    const totalTokens = tokens.length;
    const startIndex = currentTokenIndex;
    let attempts = 0;
    let lastError = null;

    console.log(`[Apify Scraper] Found ${totalTokens} configured Apify account token(s). Starting scrape for @${cleanUsername}...`);

    while (attempts < totalTokens) {
        const activeIndex = (startIndex + attempts) % totalTokens;
        const activeToken = tokens[activeIndex];
        const masked = maskToken(activeToken);

        try {
            console.log(
                `[Apify Scraper] [Account #${activeIndex + 1}/${totalTokens} (${masked})] Scraping profile @${cleanUsername}...`
            );

            const client = new ApifyClient({
                token: activeToken,
            });

            const run = await client.actor("apify/instagram-scraper").call({
                directUrls: [`https://www.instagram.com/${cleanUsername}/`],
                resultsType: "details",
                resultsLimit: 1,
            });

            console.log(
                `[Apify Scraper] [Account #${activeIndex + 1}] Actor completed successfully. Fetching dataset items...`
            );

            const { items } = await client
                .dataset(run.defaultDatasetId)
                .listItems();

            if (!items || items.length === 0 || !items[0]) {
                console.log(`[Apify Scraper] No profile data found for @${cleanUsername}`);
                return null;
            }

            // Permanently shift pointer to this functioning token for subsequent requests
            currentTokenIndex = activeIndex;
            console.log(`[Apify Scraper] [Account #${activeIndex + 1}] Scrape successful for @${cleanUsername}.`);
            return items[0];

        } catch (err) {
            lastError = err;
            console.error(
                `[Apify Scraper] [Account #${activeIndex + 1}/${totalTokens} (${masked})] Failed: ${err.message}`
            );

            const canFailover = isFailoverError(err) || attempts < totalTokens - 1;

            if (canFailover && attempts < totalTokens - 1) {
                const nextIndex = (startIndex + attempts + 1) % totalTokens;
                console.warn(
                    `[Apify Scraper] ⚠️ Account #${activeIndex + 1} credit/limit/error triggered. Automatically shifting to Account #${nextIndex + 1}...`
                );
                attempts++;
                // Update module pointer to next token
                currentTokenIndex = nextIndex;
                continue;
            } else {
                throw err;
            }
        }
    }

    console.error("===== ALL APIFY ACCOUNTS EXHAUSTED / FAILED =====");
    throw new Error(
        `All ${totalTokens} configured Apify account(s) failed or ran out of credits. Please update your APIFY_TOKENS in Render or backend/.env. Last error: ${lastError?.message || "Unknown error"}`
    );
}