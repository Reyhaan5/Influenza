import dotenv from "dotenv";
import { ApifyClient } from "apify-client";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import fetch from "node-fetch";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const handles = [
  "chrissutaria",
  "mumbaifoodjunkie",
  "rhea_agrawal",
  "ruhaaneehiran",
  "yourdesiwanderlust",
];

async function fetchMicroInfluencers() {
  try {
    console.log("Scraping profiles for:", handles);
    const run = await client.actor("apify/instagram-profile-scraper").call({
      usernames: handles,
    });
    console.log("Actor run completed. Fetching results...");
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    console.log(`Retrieved ${items.length} items from Apify.`);

    const outputDir = path.resolve(__dirname, "../uploads/influencers");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const results = [];
    for (const item of items) {
      console.log(`\n---------------------------------`);
      console.log(`Username: @${item.username}`);
      console.log(`Full Name: ${item.fullName}`);
      console.log(`Followers: ${item.followersCount}`);
      console.log(`Bio: ${item.biography}`);
      console.log(`Verified: ${item.verified}`);
      console.log(`Pic: ${item.profilePicUrlHD || item.profilePicUrl}`);

      const picUrl = item.profilePicUrlHD || item.profilePicUrl;
      let localPicPath = null;
      if (picUrl) {
        try {
          const imgRes = await fetch(picUrl);
          if (imgRes.ok) {
            const buffer = await imgRes.buffer();
            const filename = `${item.username}.jpg`;
            fs.writeFileSync(path.join(outputDir, filename), buffer);
            localPicPath = `/uploads/influencers/${filename}`;
            console.log(`Downloaded authentic photo to: ${localPicPath} (${buffer.length} bytes)`);
          }
        } catch (imgErr) {
          console.warn(`Could not download image for @${item.username}:`, imgErr.message);
        }
      }

      results.push({
        username: item.username,
        fullName: item.fullName,
        followersCount: item.followersCount,
        biography: item.biography,
        verified: item.verified,
        picUrl,
        localPicPath,
        latestPosts: (item.latestPosts || []).slice(0, 4).map(p => ({
          id: p.id || p.shortCode,
          caption: p.caption,
          likesCount: p.likesCount,
          commentsCount: p.commentsCount,
          videoViewCount: p.videoViewCount,
          displayUrl: p.displayUrl,
          url: p.url,
          isVideo: p.isVideo,
        })),
      });
    }

    fs.writeFileSync(
      path.resolve(__dirname, "../fixtures/micro_influencers_scraped.json"),
      JSON.stringify(results, null, 2)
    );
    console.log("\nSaved scraped data to backend/fixtures/micro_influencers_scraped.json");
  } catch (err) {
    console.error("Batch scrape error:", err.message);
  }
}

fetchMicroInfluencers();
