import dotenv from "dotenv";
import { ApifyClient } from "apify-client";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

async function testProfileScraper(username) {
  try {
    console.log("Calling instagram-profile-scraper for:", username);
    const run = await client.actor("apify/instagram-profile-scraper").call({
      usernames: [username],
    });
    console.log("Run finished:", run.status);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    console.log("Items count:", items.length);
    if (items[0]) {
      console.log("Item keys:", Object.keys(items[0]));
      console.log("Full Name:", items[0].fullName);
      console.log("Followers:", items[0].followersCount);
      console.log("Bio:", items[0].biography);
      console.log("Profile Pic URL:", items[0].profilePicUrl || items[0].profilePicUrlHD);
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testProfileScraper("chrissutaria");
