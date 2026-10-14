import dotenv from "dotenv";
import { ApifyClient } from "apify-client";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

async function testActor() {
  try {
    console.log("Searching actors for instagram...");
    const runs = await client.actors().list({ limit: 10 });
    console.log("Actors list:", runs.items.map(a => a.name));
  } catch (err) {
    console.error(err.message);
  }
}

testActor();
