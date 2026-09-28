import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import InfluencerProfile from "../models/InfluencerProfile.js";
import BrandProfile from "../models/BrandProfile.js";
import Brand from "../models/Brand.js";
import Product from "../models/Product.js";
import Opportunity from "../models/Opportunity.js";
import TeamMember from "../models/TeamMember.js";
import SavedCreator from "../models/SavedCreator.js";
import Collaboration from "../models/Collaboration.js";
import Deliverable from "../models/Deliverable.js";
import GalleryContent from "../models/GalleryContent.js";
import RateCard from "../models/RateCard.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

async function verify() {
  await connectDB();
  console.log("Connected to MongoDB for Verification...\n");

  const accounts = [
    { email: "brand1@demo.com", role: "brand" },
    { email: "brand2@demo.com", role: "brand" },
    { email: "creator1@demo.com", role: "influencer" },
    { email: "creator2@demo.com", role: "influencer" },
  ];

  for (const acc of accounts) {
    const u = await User.findOne({ email: acc.email });
    if (!u) {
      console.error(`FAILED: User ${acc.email} not found!`);
      continue;
    }
    const match = await u.comparePassword("password123");
    console.log(`[USER] ${acc.email}`);
    console.log(`  Name: ${u.name}`);
    console.log(`  Role: ${u.role}`);
    console.log(`  Password Match (password123): ${match ? "SUCCESS (true)" : "FAILED (false)"}`);

    if (acc.role === "brand") {
      const bp = await BrandProfile.findOne({ user: u._id });
      const brands = await Brand.find({ user: u._id });
      const prods = await Product.find({ user: u._id });
      const opps = await Opportunity.find({ brand: u._id });
      const team = await TeamMember.find({ organizationUser: u._id });
      const saved = await SavedCreator.find({ user: u._id });
      const collabs = await Collaboration.find({ brand: u._id });

      console.log(`  BrandProfile Company: ${bp?.companyName || "N/A"} (${bp?.location || "N/A"})`);
      console.log(`  Brands Entities: ${brands.map((b) => b.name).join(", ")}`);
      console.log(`  Products (${prods.length}): ${prods.map((p) => p.productName).join(", ")}`);
      console.log(`  Campaigns (${opps.length}): ${opps.map((o) => o.title).join(", ")}`);
      console.log(`  Team Members (${team.length}): ${team.map((t) => `${t.name} (${t.access})`).join(", ")}`);
      console.log(`  Saved Creators: ${saved.length} creators`);
      console.log(`  Active Collaborations: ${collabs.length}`);
    } else {
      const ip = await InfluencerProfile.findOne({ user: u._id });
      const gallery = await GalleryContent.find({ influencer: u._id });
      const rate = await RateCard.findOne({ influencer: u._id });
      const collabs = await Collaboration.find({ influencer: u._id });

      console.log(`  Handle: ${ip?.handle || "N/A"}`);
      console.log(`  Full Name: ${ip?.personalInfo?.firstName} ${ip?.personalInfo?.lastName}`);
      console.log(`  Title: ${ip?.personalInfo?.title}`);
      console.log(`  City, Country: ${ip?.address?.city}, ${ip?.address?.country}`);
      console.log(`  Birthday: ${ip?.personalInfo?.birthday?.toISOString().split("T")[0]}`);
      console.log(`  Pet: ${ip?.personalInfo?.petOwner}`);
      console.log(`  Languages: ${ip?.personalInfo?.languages?.join(", ")}`);
      console.log(`  Instagram Followers: ${ip?.socialAccounts?.[0]?.followers?.toLocaleString()}`);
      console.log(`  Match Niches: ${ip?.matchProfile?.niche?.join(", ")} | Payment: ${ip?.matchProfile?.paymentType} ($${ip?.matchProfile?.minAskingPrice}-$${ip?.matchProfile?.maxAskingPrice})`);
      console.log(`  Packages (${ip?.packages?.length}): ${ip?.packages?.map((p) => `${p.title} ($${p.price})`).join(", ")}`);
      console.log(`  Bank Payout: ${ip?.payoutInfo?.bankName} (A/C: ${ip?.payoutInfo?.accountNumber}, IFSC: ${ip?.payoutInfo?.ifscOrRouting}, UPI: ${ip?.payoutInfo?.upiId})`);
      console.log(`  RateCard Document Synced: ${!!rate} (Post: $${rate?.rates?.post}, Reel: $${rate?.rates?.reel}, Story: $${rate?.rates?.story})`);
      console.log(`  Gallery Portfolio: ${gallery.length} items (${gallery.filter((g) => g.highlighted).length} highlighted)`);
      console.log(`  Collaborations: ${collabs.length} collabs`);
    }
    console.log("------------------------------------------------------------------\n");
  }

  process.exit(0);
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
