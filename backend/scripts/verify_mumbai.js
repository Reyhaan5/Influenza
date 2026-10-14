import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import InfluencerProfile from "../models/InfluencerProfile.js";
import InstagramCache from "../models/InstagramCache.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function verify() {
  await connectDB();
  const mumbaiCreators = await InfluencerProfile.find({ "address.city": "Mumbai" }).populate("user", "name email");
  console.log(`\n=== Total Mumbai Creators in Database: ${mumbaiCreators.length} ===\n`);
  
  for (const c of mumbaiCreators) {
    const ig = c.socialAccounts?.find(s => s.platform.toLowerCase() === "instagram");
    console.log(`✓ ${c.user?.name || c.personalInfo?.firstName}`);
    console.log(`   Handle: ${c.handle}`);
    console.log(`   Email: ${c.user?.email}`);
    console.log(`   Location: ${c.address?.line1 ? c.address.line1 + ", " : ""}${c.address?.city}, ${c.address?.state}`);
    console.log(`   Instagram Followers: ${ig?.followers?.toLocaleString() || 0} (${ig?.verified ? "Verified ✓" : "Unverified"})`);
    console.log(`   Instagram Status: ${ig?.connected ? "Connected 🟢" : "Not connected"}`);
    console.log(`   Categories: ${c.categories?.join(", ")}`);
    console.log(`   Packages: ${c.packages?.map(p => `${p.contentType} ₹${p.price?.toLocaleString()}`).join(" | ")}`);
    console.log("---------------------------------------------------------------------------------");
  }

  const cached = await InstagramCache.find({
    handle: { $in: ["viraj_ghelani", "mostlysane", "beerbiceps", "sanjyotkeer", "aashnashroff"] }
  });
  console.log(`\n=== Verified Cached Instagram Profiles: ${cached.length} verified ===`);
  for (const doc of cached) {
    console.log(`@${doc.handle} -> ${doc.followers.toLocaleString()} followers | Verified: ${doc.verified} | Top posts: ${doc.topPosts?.length}`);
  }

  process.exit(0);
}

verify().catch(e => {
  console.error("Verification error:", e);
  process.exit(1);
});
