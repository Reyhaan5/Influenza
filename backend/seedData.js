import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import connectDB from "./config/db.js";
import User from "./models/User.js";
import InfluencerProfile from "./models/InfluencerProfile.js";
import BrandProfile from "./models/BrandProfile.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";
import Opportunity from "./models/Opportunity.js";
import CollaborationRequest from "./models/CollaborationRequest.js";
import Collaboration from "./models/Collaboration.js";
import Deliverable from "./models/Deliverable.js";
import ContentPost from "./models/ContentPost.js";
import Review from "./models/Review.js";
import RateCard from "./models/RateCard.js";
import GalleryContent from "./models/GalleryContent.js";
import TeamMember from "./models/TeamMember.js";
import SavedCreator from "./models/SavedCreator.js";

// Helper to upsert a user and ensure password is password123
async function upsertUser(name, email, role, plainPassword = "password123") {
  let user = await User.findOne({ email });

  if (!user) {
    user = new User({
      name,
      email,
      role,
      password: plainPassword,
    });
    await user.save();
    console.log(`Created user: ${email} (${role})`);
  } else {
    user.name = name;
    user.role = role;
    user.password = plainPassword;
    await user.save();
    console.log(`Updated user credentials: ${email} (${role})`);
  }
  return user;
}

const seed = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for complete demo seeding...\n");

    // =========================================================================
    // 1. BRAND ACCOUNT 1: Luxe Beauty Collective (Glow & Co.)
    // =========================================================================
    const brand1User = await upsertUser("Luxe Beauty Collective", "brand1@demo.com", "brand", "password123");
    // Also sync legacy brand@demo.com as alias
    const brandLegacyUser = await upsertUser("Luxe Beauty Collective", "brand@demo.com", "brand", "password123");

    // Brand Profile for Brand 1
    const brand1ProfileData = {
      companyName: "Luxe Beauty Collective",
      industry: "Beauty & Skincare",
      website: "https://luxebeauty.example.com",
      email: "brand1@demo.com",
      location: "Mumbai, Maharashtra, India",
      productName: "Vitamin C Radiance Elixir",
      productCategory: "Skincare",
      productDescription: "20% pure Vitamin C serum with hyaluronic acid and niacinamide for radiant, glowing skin.",
      targetAudience: "Women & Men aged 18-35 seeking clinical clean skincare",
      productPrice: 1499,
      productImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
    };

    await BrandProfile.findOneAndUpdate(
      { user: brand1User._id },
      { user: brand1User._id, ...brand1ProfileData },
      { upsert: true, new: true }
    );
    await BrandProfile.findOneAndUpdate(
      { user: brandLegacyUser._id },
      { user: brandLegacyUser._id, ...brand1ProfileData, email: "brand@demo.com" },
      { upsert: true, new: true }
    );

    // Brand Entity for Brand 1
    const brandEntity1Data = {
      name: "Glow & Co.",
      logo: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=200",
      websiteOrSocialLink: "https://glowandco.example.com",
      category: "Beauty & Skincare",
      description: "Organic, cruelty-free serums, facial mists, and active botanicals crafted for natural radiance.",
      status: "active",
    };

    const brandEntity1 = await Brand.findOneAndUpdate(
      { user: brand1User._id, name: "Glow & Co." },
      { user: brand1User._id, ...brandEntity1Data },
      { upsert: true, new: true }
    );
    await Brand.findOneAndUpdate(
      { user: brandLegacyUser._id, name: "Glow & Co." },
      { user: brandLegacyUser._id, ...brandEntity1Data },
      { upsert: true, new: true }
    );

    // Products for Brand 1 (3 Products)
    const p1_1 = await Product.findOneAndUpdate(
      { brand: brandEntity1._id, productName: "Vitamin C Radiance Elixir" },
      {
        user: brand1User._id,
        brand: brandEntity1._id,
        productName: "Vitamin C Radiance Elixir",
        productLink: "https://glowandco.example.com/products/vitamin-c-elixir",
        productCategory: "Skincare",
        productDescription: "20% Vitamin C serum with hyaluronic acid for an instant radiant glow.\nFades dark spots and boosts collagen production in 14 days.\nLightweight, fast-absorbing texture suitable for all skin types.",
        productType: "Physical product",
        productPrice: 1499,
        productImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
        productImages: [
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1608248597359-54313f8d38e2?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800",
        ],
        idealCreatorProfile: "Aesthetic skincare reviewers, morning routine vloggers, and dermatology educators.",
        targetGender: "All",
        targetAgeGroup: "18-24",
      },
      { upsert: true, new: true }
    );

    const p1_2 = await Product.findOneAndUpdate(
      { brand: brandEntity1._id, productName: "Rosewater Deep Hydration Mist" },
      {
        user: brand1User._id,
        brand: brandEntity1._id,
        productName: "Rosewater Deep Hydration Mist",
        productLink: "https://glowandco.example.com/products/rosewater-mist",
        productCategory: "Skincare",
        productDescription: "Steam-distilled Damask rosewater with aloe vera juice.\nRefreshes, soothes redness, and primes skin before makeup.\n100% natural, alcohol-free formula.",
        productType: "Physical product",
        productPrice: 899,
        productImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800",
        productImages: [
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=800",
        ],
        idealCreatorProfile: "Beauty creators focused on clean cosmetics and dewy looks.",
        targetGender: "Female",
        targetAgeGroup: "18-24",
      },
      { upsert: true, new: true }
    );

    const p1_3 = await Product.findOneAndUpdate(
      { brand: brandEntity1._id, productName: "Peptide Renewal Night Cream" },
      {
        user: brand1User._id,
        brand: brandEntity1._id,
        productName: "Peptide Renewal Night Cream",
        productLink: "https://glowandco.example.com/products/peptide-cream",
        productCategory: "Skincare",
        productDescription: "Multi-peptide complex infused with squalane and ceramides.\nDeep overnight moisture repair for supple, plump morning skin.\nNon-comedogenic, fragrance-free luxury formula.",
        productType: "Physical product",
        productPrice: 1899,
        productImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=800",
        productImages: [
          "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800",
        ],
        idealCreatorProfile: "Nighttime routine creators, anti-aging and skin health advocates.",
        targetGender: "All",
        targetAgeGroup: "25-34",
      },
      { upsert: true, new: true }
    );

    // Opportunities for Brand 1
    const opp1_1 = await Opportunity.findOneAndUpdate(
      { brand: brand1User._id, title: "Summer Radiance Campaign" },
      {
        brand: brand1User._id,
        brandEntity: brandEntity1._id,
        product: p1_1._id,
        title: "Summer Radiance Campaign",
        description: "Showcase your morning skincare routine featuring our bestselling Vitamin C Radiance Elixir in natural morning light.",
        campaignGoal: "Awareness & Reach",
        platform: "Meta",
        campaignType: "User-Generated Content",
        boostWithPartnershipAds: true,
        campaignVisibility: "Visible to matched creators",
        productDelivery: "I'll ship the product",
        creatorsCountTier: "5-10",
        targetCreatorsCount: 5,
        format: "money",
        rewardValue: "₹25,000",
        minFeePerCreator: 15000,
        maxFeePerCreator: 30000,
        salesCommissionsEnabled: true,
        commissionRate: 12,
        deliverablesRequired: 1,
        deliverables: [
          {
            mediaType: "Video",
            postingType: "Posting",
            placement: "Reels",
            format: "9:16 Vertical",
            videoMinLength: 15,
            videoMaxLength: 45,
            rawOrReady: "Ready to use Ad",
            contentType: "Morning Routine Showcase",
            creatorGuide: "Showcase the application step in natural morning light. Emphasize instant absorption and non-sticky dewy glow.",
            brandTag: "@glowandco",
            hashtags: "#GlowUp #SkinRoutine #RadiantSkin #Ad",
            whatShouldAvoid: "Do not apply over heavy makeup; demonstrate on clean, bare skin.",
            musicRequirement: "Music required",
          },
        ],
        status: "open",
      },
      { upsert: true, new: true }
    );

    const opp1_2 = await Opportunity.findOneAndUpdate(
      { brand: brand1User._id, title: "Hydration Glow Challenge" },
      {
        brand: brand1User._id,
        brandEntity: brandEntity1._id,
        product: p1_2._id,
        title: "Hydration Glow Challenge",
        description: "3-day skin hydration transformation review featuring Rosewater Mist and Vitamin C Serum.",
        campaignGoal: "Multi-Channel UGC",
        platform: "Meta",
        campaignType: "User-Generated Content",
        boostWithPartnershipAds: false,
        campaignVisibility: "Visible to matched creators",
        productDelivery: "I'll ship the product",
        creatorsCountTier: "<5",
        targetCreatorsCount: 3,
        format: "barter",
        rewardValue: "₹10,000",
        deliverablesRequired: 1,
        deliverables: [
          {
            mediaType: "Video",
            postingType: "Posting",
            placement: "Reels",
            format: "9:16 Vertical",
            videoMinLength: 20,
            videoMaxLength: 60,
            rawOrReady: "Ready to use Ad",
            contentType: "3-Day Hydration Testimonial",
            creatorGuide: "Demonstrate before & after hydration test using Rosewater Mist and Vitamin C Serum.",
            brandTag: "@glowandco",
            hashtags: "#HydrationGlow #CleanBeauty #Ad",
          },
        ],
        status: "open",
      },
      { upsert: true, new: true }
    );

    // Team Members for Brand 1
    await TeamMember.deleteMany({ organizationUser: brand1User._id });
    await TeamMember.insertMany([
      {
        organizationUser: brand1User._id,
        name: "Luxe Beauty Collective",
        email: "brand1@demo.com",
        role: "Owner",
        access: "Full Access",
        isOwner: true,
        status: "active",
      },
      {
        organizationUser: brand1User._id,
        name: "Natasha Rao",
        email: "natasha.marketing@luxebeauty.example.com",
        role: "Marketing Director",
        access: "Campaign Manager",
        isOwner: false,
        status: "active",
      },
      {
        organizationUser: brand1User._id,
        name: "Siddharth Mehta",
        email: "siddharth.ugc@luxebeauty.example.com",
        role: "Creative Reviewer",
        access: "Reviewer",
        isOwner: false,
        status: "active",
      },
    ]);

    // =========================================================================
    // 2. BRAND ACCOUNT 2: Apex Gear & Audio (Apex Sound Labs)
    // =========================================================================
    const brand2User = await upsertUser("Apex Gear & Audio", "brand2@demo.com", "brand", "password123");

    // Brand Profile for Brand 2
    const brand2ProfileData = {
      companyName: "Apex Gear & Audio",
      industry: "Consumer Electronics & Tech Gear",
      website: "https://apexgear.example.com",
      email: "brand2@demo.com",
      location: "Bengaluru, Karnataka, India",
      productName: "Apex Pro ANC Wireless Earbuds",
      productCategory: "Consumer Electronics",
      productDescription: "Audiophile-grade wireless earbuds with 42dB Hybrid Active Noise Cancellation, spatial audio, and 38-hour battery.",
      targetAudience: "Tech enthusiasts, gym-goers, remote professionals, and audiophiles",
      productPrice: 4999,
      productImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800",
    };

    await BrandProfile.findOneAndUpdate(
      { user: brand2User._id },
      { user: brand2User._id, ...brand2ProfileData },
      { upsert: true, new: true }
    );

    // Brand Entity for Brand 2
    const brandEntity2Data = {
      name: "Apex Sound Labs",
      logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200",
      websiteOrSocialLink: "https://apexsoundlabs.example.com",
      category: "Tech & Audio",
      description: "Next-generation audio gear designed for uncompromising acoustic fidelity, hybrid noise cancellation, and all-day comfort.",
      status: "active",
    };

    const brandEntity2 = await Brand.findOneAndUpdate(
      { user: brand2User._id, name: "Apex Sound Labs" },
      { user: brand2User._id, ...brandEntity2Data },
      { upsert: true, new: true }
    );

    // Products for Brand 2 (3 Products)
    const p2_1 = await Product.findOneAndUpdate(
      { brand: brandEntity2._id, productName: "Apex Pro ANC Wireless Earbuds" },
      {
        user: brand2User._id,
        brand: brandEntity2._id,
        productName: "Apex Pro ANC Wireless Earbuds",
        productLink: "https://apexsoundlabs.example.com/products/pro-anc-earbuds",
        productCategory: "Consumer Electronics",
        productDescription: "Industry-leading 42dB Hybrid Active Noise Cancellation.\nSpatial Audio with dynamic head tracking and custom 11mm beryllium drivers.\n38-hour total playback with Qi wireless charging case.",
        productType: "Physical product",
        productPrice: 4999,
        productImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800",
        productImages: [
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800",
        ],
        idealCreatorProfile: "Tech reviewers, desk setup vloggers, daily commuters, and fitness creators.",
        targetGender: "All",
        targetAgeGroup: "18-34",
      },
      { upsert: true, new: true }
    );

    const p2_2 = await Product.findOneAndUpdate(
      { brand: brandEntity2._id, productName: "Pulse Ultra Magnetic PowerBank 10000mAh" },
      {
        user: brand2User._id,
        brand: brandEntity2._id,
        productName: "Pulse Ultra Magnetic PowerBank 10000mAh",
        productLink: "https://apexsoundlabs.example.com/products/pulse-powerbank",
        productCategory: "Consumer Electronics",
        productDescription: "Ultra-slim 15W MagSafe-compatible wireless portable charger with kickstand.\nAircraft-grade aluminum chassis with pass-through USB-C fast charging.\nCompact pocket design engineered for creators on the move.",
        productType: "Physical product",
        productPrice: 2499,
        productImage: "https://images.unsplash.com/photo-1609592807908-111158d63a8d?auto=format&fit=crop&q=80&w=800",
        productImages: [
          "https://images.unsplash.com/photo-1609592807908-111158d63a8d?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800",
        ],
        idealCreatorProfile: "EDC gear reviewers, travel vloggers, mobile filmmakers.",
        targetGender: "All",
        targetAgeGroup: "18-34",
      },
      { upsert: true, new: true }
    );

    const p2_3 = await Product.findOneAndUpdate(
      { brand: brandEntity2._id, productName: "Titanium SoundCore Studio Headphones" },
      {
        user: brand2User._id,
        brand: brandEntity2._id,
        productName: "Titanium SoundCore Studio Headphones",
        productLink: "https://apexsoundlabs.example.com/products/soundcore-studio",
        productCategory: "Consumer Electronics",
        productDescription: "Over-ear lossless wireless headphones with planar magnetic transducers.\nUltra-plush memory foam earcups with breathable protein leather.\n60-hour ultra-extended battery life and detachable audiophile cable.",
        productType: "Physical product",
        productPrice: 8999,
        productImage: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800",
        productImages: [
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800",
        ],
        idealCreatorProfile: "Music producers, audiophiles, desk setup creators.",
        targetGender: "All",
        targetAgeGroup: "25-34",
      },
      { upsert: true, new: true }
    );

    // Opportunities for Brand 2
    const opp2_1 = await Opportunity.findOneAndUpdate(
      { brand: brand2User._id, title: "Unbox The Sound: Apex Pro ANC Launch" },
      {
        brand: brand2User._id,
        brandEntity: brandEntity2._id,
        product: p2_1._id,
        title: "Unbox The Sound: Apex Pro ANC Launch",
        description: "Showcase the seamless unboxing, instant noise-cancellation test in a busy environment, and mic audio test in 9:16 vertical 4K.",
        campaignGoal: "Conversions & Sales",
        platform: "Meta",
        campaignType: "User-Generated Content",
        boostWithPartnershipAds: true,
        campaignVisibility: "Visible to matched creators",
        productDelivery: "I'll ship the product",
        creatorsCountTier: "5-10",
        targetCreatorsCount: 4,
        format: "money",
        rewardValue: "₹35,000",
        minFeePerCreator: 20000,
        maxFeePerCreator: 45000,
        salesCommissionsEnabled: true,
        commissionRate: 15,
        deliverablesRequired: 1,
        deliverables: [
          {
            mediaType: "Video",
            postingType: "Posting",
            placement: "Reels",
            format: "9:16 Vertical",
            videoMinLength: 30,
            videoMaxLength: 60,
            rawOrReady: "Ready to use Ad",
            contentType: "ANC Commute & Sound Test",
            creatorGuide: "Perform an authentic noise-cancellation cut in a busy environment (cafe or transit). Highlight instant silence transition and microphone call clarity.",
            brandTag: "@apexsoundlabs",
            hashtags: "#ApexAudio #SilenceTheNoise #TechReview #Ad",
            whatShouldAvoid: "Avoid low-bitrate audio recording; use external wireless mic.",
            musicRequirement: "Music required",
          },
        ],
        status: "open",
      },
      { upsert: true, new: true }
    );

    const opp2_2 = await Opportunity.findOneAndUpdate(
      { brand: brand2User._id, title: "Minimalist Desk Setup & Audio" },
      {
        brand: brand2User._id,
        brandEntity: brandEntity2._id,
        product: p2_1._id,
        title: "Minimalist Desk Setup & Audio",
        description: "Feature the Apex Pro Earbuds and Titanium Headphones in an ultra-clean workspace aesthetic.",
        campaignGoal: "Multi-Channel UGC",
        platform: "Meta",
        campaignType: "User-Generated Content",
        boostWithPartnershipAds: false,
        campaignVisibility: "Visible to matched creators",
        productDelivery: "I'll ship the product",
        creatorsCountTier: "<5",
        targetCreatorsCount: 3,
        format: "money",
        rewardValue: "₹20,000",
        minFeePerCreator: 15000,
        maxFeePerCreator: 25000,
        deliverablesRequired: 1,
        deliverables: [
          {
            mediaType: "Video",
            postingType: "Posting",
            placement: "Reels",
            format: "9:16 Vertical",
            videoMinLength: 20,
            videoMaxLength: 45,
            rawOrReady: "Ready to use Ad",
            contentType: "Desk Setup Integration",
            creatorGuide: "Feature the Apex Pro Earbuds and Titanium Headphones in an ultra-clean workspace aesthetic.",
            brandTag: "@apexsoundlabs",
            hashtags: "#DeskSetup #ApexAudio #WorkFromHome #Ad",
          },
        ],
        status: "open",
      },
      { upsert: true, new: true }
    );

    // Team Members for Brand 2
    await TeamMember.deleteMany({ organizationUser: brand2User._id });
    await TeamMember.insertMany([
      {
        organizationUser: brand2User._id,
        name: "Apex Gear & Audio",
        email: "brand2@demo.com",
        role: "Owner",
        access: "Full Access",
        isOwner: true,
        status: "active",
      },
      {
        organizationUser: brand2User._id,
        name: "Vikram Singhania",
        email: "vikram@apexgear.example.com",
        role: "Head of Influencer Marketing",
        access: "Campaign Manager",
        isOwner: false,
        status: "active",
      },
      {
        organizationUser: brand2User._id,
        name: "Aditi Sharma",
        email: "aditi@apexgear.example.com",
        role: "Partnerships Specialist",
        access: "Reviewer",
        isOwner: false,
        status: "active",
      },
    ]);

    // =========================================================================
    // 3. CREATOR ACCOUNT 1: Aarav Sharma (@aarav_creates)
    // =========================================================================
    const creator1User = await upsertUser("Aarav Sharma", "creator1@demo.com", "influencer", "password123");
    // Also sync legacy creator@demo.com as alias
    const creatorLegacyUser = await upsertUser("Aarav Sharma", "creator@demo.com", "influencer", "password123");

    const creator1ProfileData = {
      handle: "@aarav_creates",
      approved: true,
      isProfileComplete: true,
      categories: ["Beauty & Skincare", "Lifestyle", "Fashion", "Art & Photography"],
      personalInfo: {
        firstName: "Aarav",
        lastName: "Sharma",
        title: "Aesthetic UGC Video Creator & Skincare Specialist",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
        coverPhoto: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=1200",
        coverPhotos: [
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=1200",
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200",
        ],
        birthday: new Date("1998-05-14"),
        gender: "Male",
        ethnicity: "Asian",
        languages: ["English", "Hindi"],
        petOwner: "I have a dog",
      },
      address: {
        line1: "Flat 402, Sea Breeze Residency",
        line2: "Perry Cross Road, Bandra West",
        city: "Mumbai",
        county: "Mumbai Suburban",
        state: "Maharashtra",
        postcode: "400050",
        country: "India 🇮🇳",
        phoneNumber: "+91 98201 54321",
      },
      notifications: {
        dailyDigest: true,
        marketing: true,
        unreadMessages: true,
        contractAgreements: true,
        automaticFollowups: true,
      },
      matchProfile: {
        campaignActive: true,
        invitationsActive: true,
        collaborationFormats: ["Instagram Reels", "Instagram Stories", "Instagram Post"],
        paymentType: "paid",
        minAskingPrice: 150,
        maxAskingPrice: 500,
        bio: "Full-time digital creator crafting cinematic, high-converting UGC for forward-thinking beauty and wellness brands. Combining clean morning aesthetics, dermatological education, and genuine reviews.",
        passions: "Morning wellness rituals, natural lighting, botanical skincare ingredients, and Sony FX3 cinematography.",
        topics: ["Morning Routine", "Skincare Science", "Clean Beauty", "Product Unboxing", "Aesthetic Cinematography"],
        niche: ["Beauty & Skincare", "Lifestyle"],
        leadTimeDays: 3,
        preferredCompanies: ["Services", "Software", "Ecommerce"],
        interestedBrands: ["Glow & Co.", "Forest Essentials", "Minimalist", "Kiehl's"],
        audienceGender: "68% Female / 32% Male",
        audienceAgeRange: "18-34",
        audience: ["Beauty Lovers", "Skincare Enthusiasts", "Aesthetic Living Advocates"],
        followersLocations: ["India", "United States", "United Kingdom", "Canada"],
      },
      socialAccounts: [
        {
          platform: "Instagram",
          handle: "aarav_creates",
          followers: 148500,
          verified: true,
        },
        {
          platform: "YouTube",
          handle: "aaravsharma_ugc",
          followers: 42000,
          verified: true,
        },
      ],
      packages: [
        {
          id: "pkg-reel",
          title: "1x Instagram Reel",
          contentType: "Reel",
          count: 1,
          duration: 30,
          durationUnit: "Seconds",
          price: 75,
          description: "High-converting UGC video formatted in 9:16 vertical 4K with dynamic hook, organic product integration, voiceover, and brand tags.",
        },
        {
          id: "pkg-post",
          title: "1x Carousel Post",
          contentType: "Post",
          count: 1,
          duration: 4,
          durationUnit: "Photos",
          price: 50,
          description: "4x professionally retouched high-res aesthetic product photos for Instagram feed showcase.",
        },
        {
          id: "pkg-story",
          title: "3x Story Sequence",
          contentType: "Story",
          count: 3,
          duration: 15,
          durationUnit: "Seconds",
          price: 35,
          description: "3x interactive story slides featuring unboxing, application, swipe-up link sticker, and brand mention.",
        },
        {
          id: "pkg-ad",
          title: "Full Dedicated UGC Ad Package",
          contentType: "Video Ad",
          count: 1,
          duration: 60,
          durationUnit: "Seconds",
          price: 150,
          description: "Complete commercial video ad with 3 hook variations, raw B-roll cuts, and 30-day digital advertising usage rights.",
        },
      ],
      payoutInfo: {
        method: "bank",
        accountHolderName: "Aarav Sharma",
        bankName: "HDFC Bank",
        accountNumber: "50100482910482",
        ifscOrRouting: "HDFC0001234",
        upiId: "aarav@okhdfcbank",
        paypalEmail: "aarav.creates@gmail.com",
        currency: "INR",
        isConfigured: true,
      },
    };

    const creator1Profile = await InfluencerProfile.findOneAndUpdate(
      { user: creator1User._id },
      { user: creator1User._id, ...creator1ProfileData },
      { upsert: true, new: true }
    );
    await InfluencerProfile.findOneAndUpdate(
      { user: creatorLegacyUser._id },
      { user: creatorLegacyUser._id, ...creator1ProfileData },
      { upsert: true, new: true }
    );

    // Rate Card for Creator 1
    await RateCard.findOneAndUpdate(
      { influencer: creator1User._id },
      {
        influencer: creator1User._id,
        followers: 148500,
        avgLikes: 7800,
        avgComments: 340,
        rates: { post: 50, reel: 75, story: 35 },
        packages: creator1ProfileData.packages,
      },
      { upsert: true, new: true }
    );

    // Gallery Content for Creator 1 (6 items, 5 highlighted)
    await GalleryContent.deleteMany({ influencer: creator1User._id });
    await GalleryContent.insertMany([
      {
        influencer: creator1User._id,
        mediaUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800",
        mediaType: "image",
        caption: "Golden hour hydration routine with natural morning light ✨ Glow that lasts all day.",
        platform: "Instagram",
        highlighted: true,
      },
      {
        influencer: creator1User._id,
        mediaUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
        mediaType: "image",
        caption: "Vitamin C test: Dropper texture demonstration and immediate absorption review.",
        platform: "Instagram",
        highlighted: true,
      },
      {
        influencer: creator1User._id,
        mediaUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800",
        mediaType: "image",
        caption: "Organic facial mist refresh after a long studio shoot. Pure botanical serenity.",
        platform: "Instagram",
        highlighted: true,
      },
      {
        influencer: creator1User._id,
        mediaUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800",
        mediaType: "image",
        caption: "Minimalist shelfie: clean, active ingredients that actually transform the skin barrier.",
        platform: "Instagram",
        highlighted: true,
      },
      {
        influencer: creator1User._id,
        mediaUrl: "https://images.unsplash.com/photo-1608248597359-54313f8d38e2?auto=format&fit=crop&q=80&w=800",
        mediaType: "image",
        caption: "Evening unboxing & packaging review for high-end skincare launch.",
        platform: "Instagram",
        highlighted: true,
      },
      {
        influencer: creator1User._id,
        mediaUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
        mediaType: "image",
        caption: "Behind the lens: setting up macro lighting for skincare product textures.",
        platform: "Instagram",
        highlighted: false,
      },
    ]);

    // =========================================================================
    // 4. CREATOR ACCOUNT 2: Priya Patel (@priya_techvibes)
    // =========================================================================
    const creator2User = await upsertUser("Priya Patel", "creator2@demo.com", "influencer", "password123");

    const creator2ProfileData = {
      handle: "@priya_techvibes",
      approved: true,
      isProfileComplete: true,
      categories: ["Technology", "Health & Fitness", "Lifestyle", "Adventure & Outdoors"],
      personalInfo: {
        firstName: "Priya",
        lastName: "Patel",
        title: "Tech Reviewer & Desk Productivity Creator",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
        coverPhoto: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1200",
        coverPhotos: [
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1200",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200",
        ],
        birthday: new Date("1999-09-22"),
        gender: "Female",
        ethnicity: "Asian",
        languages: ["English", "Hindi", "Gujarati"],
        petOwner: "I have a cat",
      },
      address: {
        line1: "Tower 3, Penthouse 12B, Horizon Terraces",
        line2: "80 Feet Road, Koramangala 4th Block",
        city: "Bengaluru",
        county: "Bengaluru Urban",
        state: "Karnataka",
        postcode: "560034",
        country: "India 🇮🇳",
        phoneNumber: "+91 98450 12345",
      },
      notifications: {
        dailyDigest: true,
        marketing: true,
        unreadMessages: true,
        contractAgreements: true,
        automaticFollowups: true,
      },
      matchProfile: {
        campaignActive: true,
        invitationsActive: true,
        collaborationFormats: ["Instagram Reels", "Instagram Stories", "Instagram Post"],
        paymentType: "paid",
        minAskingPrice: 200,
        maxAskingPrice: 750,
        bio: "Tech reviewer, coder, and minimalist productivity enthusiast. I translate complex specs into everyday benefits: battery runtimes, audio clarity in noisy cafes, and clean desk setups.",
        passions: "Mechanical keyboards, noise-cancelling audio engineering, ergonomic furniture, and 4K 60fps macro video cinematography.",
        topics: ["Tech Reviews", "Audio Gear", "Desk Setup", "Productivity Apps", "Smart Home"],
        niche: ["Technology", "Health & Fitness"],
        leadTimeDays: 4,
        preferredCompanies: ["Software", "Hardware", "Consumer Electronics", "Ecommerce"],
        interestedBrands: ["Apex Audio", "Sony", "Apple", "Logitech", "Keychron"],
        audienceGender: "56% Male / 44% Female",
        audienceAgeRange: "20-35",
        audience: ["Tech Enthusiasts", "Software Engineers", "Remote Workers", "Audiophiles"],
        followersLocations: ["India", "United States", "Singapore", "United Kingdom"],
      },
      socialAccounts: [
        {
          platform: "Instagram",
          handle: "priya_techvibes",
          followers: 215000,
          verified: true,
        },
        {
          platform: "YouTube",
          handle: "priyapatel_tech",
          followers: 89000,
          verified: true,
        },
      ],
      packages: [
        {
          id: "pkg-reel",
          title: "1x Dedicated Tech Reel",
          contentType: "Reel",
          count: 1,
          duration: 60,
          durationUnit: "Seconds",
          price: 120,
          description: "Detailed 60s product showcase featuring macro b-roll, hands-on battery & ANC testing, voiceover, and custom link sticker.",
        },
        {
          id: "pkg-carousel",
          title: "1x Carousel Breakdown",
          contentType: "Post",
          count: 1,
          duration: 5,
          durationUnit: "Photos",
          price: 90,
          description: "5-slide aesthetic carousel breaking down pros & cons, build quality, and real-world specs.",
        },
        {
          id: "pkg-story",
          title: "3x Story Demonstration",
          contentType: "Story",
          count: 3,
          duration: 15,
          durationUnit: "Seconds",
          price: 60,
          description: "Day-in-the-life desk demo with direct purchase discount link and engagement poll.",
        },
        {
          id: "pkg-ad",
          title: "Commercial Video Ad & Whitelisting",
          contentType: "Video Ad",
          count: 1,
          duration: 90,
          durationUnit: "Seconds",
          price: 250,
          description: "Complete commercial ad deliverable with paid advertising whitelisting rights for 60 days.",
        },
      ],
      payoutInfo: {
        method: "bank",
        accountHolderName: "Priya Patel",
        bankName: "ICICI Bank",
        accountNumber: "001205018932",
        ifscOrRouting: "ICIC0000012",
        upiId: "priyapatel@okicici",
        paypalEmail: "priya.tech@gmail.com",
        currency: "INR",
        isConfigured: true,
      },
    };

    const creator2Profile = await InfluencerProfile.findOneAndUpdate(
      { user: creator2User._id },
      { user: creator2User._id, ...creator2ProfileData },
      { upsert: true, new: true }
    );

    // Rate Card for Creator 2
    await RateCard.findOneAndUpdate(
      { influencer: creator2User._id },
      {
        influencer: creator2User._id,
        followers: 215000,
        avgLikes: 12400,
        avgComments: 620,
        rates: { post: 90, reel: 120, story: 60 },
        packages: creator2ProfileData.packages,
      },
      { upsert: true, new: true }
    );

    // Gallery Content for Creator 2 (6 items, 5 highlighted)
    await GalleryContent.deleteMany({ influencer: creator2User._id });
    await GalleryContent.insertMany([
      {
        influencer: creator2User._id,
        mediaUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800",
        mediaType: "image",
        caption: "Testing 42dB Hybrid ANC in Bengaluru peak metro traffic. Total sonic isolation 🎧",
        platform: "Instagram",
        highlighted: true,
      },
      {
        influencer: creator2User._id,
        mediaUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800",
        mediaType: "image",
        caption: "Nordic Minimalist Desk Setup 2026: Cable management, walnut riser, and studio acoustics.",
        platform: "Instagram",
        highlighted: true,
      },
      {
        influencer: creator2User._id,
        mediaUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800",
        mediaType: "image",
        caption: "Planar magnetic driver breakdown: Why high-res audio feels like a live concert.",
        platform: "Instagram",
        highlighted: true,
      },
      {
        influencer: creator2User._id,
        mediaUrl: "https://images.unsplash.com/photo-1609592807908-111158d63a8d?auto=format&fit=crop&q=80&w=800",
        mediaType: "image",
        caption: "Everyday Carry (EDC) Tech: Ultra-compact power solutions for coding on the go.",
        platform: "Instagram",
        highlighted: true,
      },
      {
        influencer: creator2User._id,
        mediaUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
        mediaType: "image",
        caption: "Macro studio shot: matte black finishes and tactile industrial buttons.",
        platform: "Instagram",
        highlighted: true,
      },
      {
        influencer: creator2User._id,
        mediaUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800",
        mediaType: "image",
        caption: "Setting up dual 4K monitors and high-speed thunderbolt docks.",
        platform: "Instagram",
        highlighted: false,
      },
    ]);

    // =========================================================================
    // 5. SAVED CREATORS (For both Brands)
    // =========================================================================
    await SavedCreator.deleteMany({ user: { $in: [brand1User._id, brand2User._id] } });
    await SavedCreator.insertMany([
      {
        user: brand1User._id,
        creator: creator1Profile._id,
        listName: "VIP Skincare Ambassadors",
        notes: "Top performing engagement, ultra-fast 48hr delivery.",
      },
      {
        user: brand1User._id,
        creator: creator2Profile._id,
        listName: "Aesthetic Creators",
        notes: "Crisp 4K macro video production and high retention.",
      },
      {
        user: brand2User._id,
        creator: creator2Profile._id,
        listName: "Core Tech Reviewers",
        notes: "Deep technical breakdown with superb audio testing rigs.",
      },
      {
        user: brand2User._id,
        creator: creator1Profile._id,
        listName: "Fitness Lifestyle Creators",
        notes: "Great energy and natural workout lifestyle integration.",
      },
    ]);

    // =========================================================================
    // 6. CROSS-COLLABORATIONS ACROSS ALL WORKFLOW STAGES
    // =========================================================================

    // COLLABORATION 1: Brand 1 + Creator 1 -> STAGE: "review" (Draft submitted!)
    const req1 = await CollaborationRequest.findOneAndUpdate(
      { brand: brand1User._id, influencer: creator1User._id, opportunity: opp1_1._id },
      {
        brand: brand1User._id,
        influencer: creator1User._id,
        brandEntity: brandEntity1._id,
        opportunity: opp1_1._id,
        status: "accepted",
        format: "money",
        respondedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    const collab1 = await Collaboration.findOneAndUpdate(
      { request: req1._id },
      {
        request: req1._id,
        opportunity: opp1_1._id,
        brand: brand1User._id,
        influencer: creator1User._id,
        brandEntity: brandEntity1._id,
        format: "money",
        deliverablesTotal: 1,
        deliverablesCompleted: 0,
        paymentStatus: "pending",
        stage: "review",
        notes: "Draft submitted by creator. Ready for brand review and feedback.",
      },
      { upsert: true, new: true }
    );

    await Deliverable.findOneAndUpdate(
      { collaboration: collab1._id },
      {
        collaboration: collab1._id,
        influencer: creator1User._id,
        brand: brand1User._id,
        type: "draft",
        title: "Summer Radiance Reel - 1st Cut",
        platform: "Instagram",
        contentUrl: "https://drive.google.com/file/d/1A2B3C4D5E_sample_reel_preview/view",
        caption: "My morning secret for glowy, radiant skin ✨ Featuring @glowandco Vitamin C Elixir. #GlowUp #SkinRoutine #Ad",
        notes: "Here is the 1st cut! I used the high-energy hook in the first 3 seconds with golden hour natural lighting. Let me know if brand tags look good!",
        status: "submitted",
        submittedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // COLLABORATION 2: Brand 1 + Creator 2 -> STAGE: "completed" (5-star review!)
    const req2 = await CollaborationRequest.findOneAndUpdate(
      { brand: brand1User._id, influencer: creator2User._id, opportunity: opp1_2._id },
      {
        brand: brand1User._id,
        influencer: creator2User._id,
        brandEntity: brandEntity1._id,
        opportunity: opp1_2._id,
        status: "accepted",
        format: "barter",
        respondedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    const collab2 = await Collaboration.findOneAndUpdate(
      { request: req2._id },
      {
        request: req2._id,
        opportunity: opp1_2._id,
        brand: brand1User._id,
        influencer: creator2User._id,
        brandEntity: brandEntity1._id,
        format: "barter",
        deliverablesTotal: 1,
        deliverablesCompleted: 1,
        paymentStatus: "paid",
        stage: "completed",
        notes: "All deliverables verified and published live with viral reach!",
      },
      { upsert: true, new: true }
    );

    await Deliverable.findOneAndUpdate(
      { collaboration: collab2._id },
      {
        collaboration: collab2._id,
        influencer: creator2User._id,
        brand: brand1User._id,
        type: "live_post",
        title: "Hydration Desk Routine & Glow Testimonial",
        platform: "Instagram",
        postUrl: "https://www.instagram.com/reel/C8xyz123GlowSample/",
        caption: "Working long hours at the desk requires continuous hydration! Loved adding @glowandco Rosewater Mist to my daily flow. #HydrationGlow #Ad",
        notes: "Reel went live 3 days ago, already surpassed 84,000 organic views!",
        status: "approved",
        submittedAt: new Date(Date.now() - 259200000),
        reviewedAt: new Date(Date.now() - 172800000),
      },
      { upsert: true, new: true }
    );

    await Review.findOneAndUpdate(
      { collaboration: collab2._id },
      {
        collaboration: collab2._id,
        brand: brand1User._id,
        influencer: creator2User._id,
        rating: 5,
        comment: "Priya delivered extraordinary visuals and crisp pacing. Her desk routine integration was natural, authentic, and drove real customer comments!",
      },
      { upsert: true, new: true }
    );

    // COLLABORATION 3: Brand 2 + Creator 2 -> STAGE: "content_creation" (Revision requested)
    const req3 = await CollaborationRequest.findOneAndUpdate(
      { brand: brand2User._id, influencer: creator2User._id, opportunity: opp2_1._id },
      {
        brand: brand2User._id,
        influencer: creator2User._id,
        brandEntity: brandEntity2._id,
        opportunity: opp2_1._id,
        status: "accepted",
        format: "money",
        respondedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    const collab3 = await Collaboration.findOneAndUpdate(
      { request: req3._id },
      {
        request: req3._id,
        opportunity: opp2_1._id,
        brand: brand2User._id,
        influencer: creator2User._id,
        brandEntity: brandEntity2._id,
        format: "money",
        deliverablesTotal: 1,
        deliverablesCompleted: 0,
        paymentStatus: "pending",
        stage: "content_creation",
        notes: "Revision requested: Please ensure the noise-cancellation toggle click is audibly demonstrated.",
      },
      { upsert: true, new: true }
    );

    await Deliverable.findOneAndUpdate(
      { collaboration: collab3._id },
      {
        collaboration: collab3._id,
        influencer: creator2User._id,
        brand: brand2User._id,
        type: "draft",
        title: "ANC Subway Test - Rough Cut",
        platform: "Instagram",
        contentUrl: "https://drive.google.com/file/d/sample_priya_anc_draft/view",
        caption: "Silence the city chaos with @apexsoundlabs Apex Pro ANC. #ApexAudio #SilenceTheNoise #Ad",
        notes: "Rough cut testing ambient train noise.",
        status: "revision_requested",
        feedback: "Superb video quality! Please add a 2-second close up of tapping the earbud stem to demonstrate touch controls.",
        submittedAt: new Date(Date.now() - 86400000),
        reviewedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // COLLABORATION 4: Brand 2 + Creator 1 -> STAGE: "posting" (Draft approved -> Ready to post!)
    const req4 = await CollaborationRequest.findOneAndUpdate(
      { brand: brand2User._id, influencer: creator1User._id, opportunity: opp2_2._id },
      {
        brand: brand2User._id,
        influencer: creator1User._id,
        brandEntity: brandEntity2._id,
        opportunity: opp2_2._id,
        status: "accepted",
        format: "money",
        respondedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    const collab4 = await Collaboration.findOneAndUpdate(
      { request: req4._id },
      {
        request: req4._id,
        opportunity: opp2_2._id,
        brand: brand2User._id,
        influencer: creator1User._id,
        brandEntity: brandEntity2._id,
        format: "money",
        deliverablesTotal: 1,
        deliverablesCompleted: 0,
        paymentStatus: "pending",
        stage: "posting",
        notes: "Draft approved! Creator is authorized to publish live on Instagram.",
      },
      { upsert: true, new: true }
    );

    await Deliverable.findOneAndUpdate(
      { collaboration: collab4._id },
      {
        collaboration: collab4._id,
        influencer: creator1User._id,
        brand: brand2User._id,
        type: "draft",
        title: "Minimalist Audio & Desk Showcase",
        platform: "Instagram",
        contentUrl: "https://youtu.be/unlisted_sample_preview_apex",
        caption: "Soundtrack your daily flow with @apexsoundlabs Titanium Studio headphones. Crisp highs, deep bass. #DeskSetup #ApexAudio #Ad",
        notes: "Final high-res export with cinematic grade.",
        status: "approved",
        feedback: "Approved! Love the transition at 0:08 and the lighting. You are clear to publish on Friday at 6:00 PM.",
        submittedAt: new Date(Date.now() - 172800000),
        reviewedAt: new Date(Date.now() - 86400000),
      },
      { upsert: true, new: true }
    );

    console.log("\n=========================================================================");
    console.log("            ALL DEMO ACCOUNTS SUCCESSFULLY SEEDED!            ");
    console.log("=========================================================================");
    console.log("Uniform Password for ALL accounts: password123\n");
    console.log("🏢 BRAND ACCOUNTS:");
    console.log("  1. Luxe Beauty Collective (Glow & Co.)");
    console.log("     Email:    brand1@demo.com  (Alias: brand@demo.com)");
    console.log("     Industry: Beauty & Skincare (Mumbai)");
    console.log("     Products: 3 items | Campaigns: 2 active | Team: 3 members\n");
    console.log("  2. Apex Gear & Audio (Apex Sound Labs)");
    console.log("     Email:    brand2@demo.com");
    console.log("     Industry: Consumer Electronics & Pro Audio (Bengaluru)");
    console.log("     Products: 3 items | Campaigns: 2 active | Team: 3 members\n");
    console.log("🧑‍🎨 CREATOR ACCOUNTS:");
    console.log("  1. Aarav Sharma (@aarav_creates)");
    console.log("     Email:    creator1@demo.com  (Alias: creator@demo.com)");
    console.log("     Niche:    Beauty & Skincare, Lifestyle (148.5k IG Verified)");
    console.log("     Packages: 4 tiers | Payout: HDFC Bank & UPI | Portfolio: 6 items\n");
    console.log("  2. Priya Patel (@priya_techvibes)");
    console.log("     Email:    creator2@demo.com");
    console.log("     Niche:    Technology, Health & Fitness (215k IG Verified)");
    console.log("     Packages: 4 tiers | Payout: ICICI Bank & UPI | Portfolio: 6 items");
    console.log("=========================================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seed();