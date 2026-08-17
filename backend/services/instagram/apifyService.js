import { ApifyClient } from "apify-client";

export async function scrapeInstagram(username) {
    try {
        console.log("TOKEN INSIDE FUNCTION:", process.env.APIFY_TOKEN);

        const client = new ApifyClient({
            token: process.env.APIFY_TOKEN,
        });

        console.log("Fetching profile for:", username);

        const run = await client.actor("apify/instagram-profile-scraper").call({
            usernames: [username],
        });

        console.log("Actor finished.");

        const { items } = await client
            .dataset(run.defaultDatasetId)
            .listItems();

        return items[0];

    } catch (err) {
        console.error("===== APIFY ERROR =====");
        console.error(err);
        throw err;
    }
}