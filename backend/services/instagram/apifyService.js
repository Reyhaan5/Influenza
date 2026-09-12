import { ApifyClient } from "apify-client";

export async function scrapeInstagram(username) {
    try {
        const client = new ApifyClient({
            token: process.env.APIFY_TOKEN,
        });

        const cleanUsername = username.trim().replace(/^@/, "");
        console.log(`[Apify Scraper] Scraping live Instagram profile for: ${cleanUsername}`);

        const run = await client.actor("apify/instagram-scraper").call({
            directUrls: [`https://www.instagram.com/${cleanUsername}/`],
            resultsType: "details",
            resultsLimit: 1,
        });

        console.log("[Apify Scraper] Actor finished successfully. Fetching dataset items...");

        const { items } = await client
            .dataset(run.defaultDatasetId)
            .listItems();

        if (!items || items.length === 0 || !items[0]) {
            console.log(`[Apify Scraper] No profile data found for @${cleanUsername}`);
            return null;
        }

        return items[0];

    } catch (err) {
        console.error("===== APIFY SCRAPER ERROR =====");
        console.error(err.message);
        throw err;
    }
}