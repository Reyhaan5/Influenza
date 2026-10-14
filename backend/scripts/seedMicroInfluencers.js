// backend/scripts/seedMicroInfluencers.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import connectDB from "../config/db.js";

import User from "../models/User.js";
import InfluencerProfile from "../models/InfluencerProfile.js";
import RateCard from "../models/RateCard.js";
import InstagramCache from "../models/InstagramCache.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const scrapedData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../fixtures/micro_influencers_scraped.json"), "utf-8")
);

const METADATA_MAP = {
  chrissutaria: {
    name: "Chris Sutaria",
    email: "chrissutaria@influenza.io",
    gender: "Male",
    ethnicity: "South Asian / Indian",
    languages: ["English", "Hindi"],
    locality: "Bandra, Mumbai",
    line1: "Hill Road, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postcode: "400050",
    phoneNumber: "+91 98211 44551",
    category: "Fashion & Style",
    categories: ["Fashion & Style", "Men Grooming", "Lifestyle", "Streetwear"],
    rates: { post: 8000, reel: 12000, story: 5000 },
    basePrice: 150,
    coverPhoto: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80",
    niche: "Men's Fashion & Grooming",
    passions: "Urban streetwear, everyday men's grooming routines, aesthetic lookbooks",
  },
  yourdesiwanderlust: {
    name: "Bhavana Choudhary",
    email: "bhavana.choudhary@influenza.io",
    gender: "Female",
    ethnicity: "South Asian / Indian",
    languages: ["Hindi", "English"],
    locality: "Vashi, Navi Mumbai",
    line1: "Palm Beach Road, Navi Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postcode: "400703",
    phoneNumber: "+91 98211 44552",
    category: "Travel & Lifestyle",
    categories: ["Travel & Adventure", "Food & Beverage", "Lifestyle", "Local Cafes"],
    rates: { post: 10000, reel: 15000, story: 6000 },
    basePrice: 180,
    coverPhoto: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1000&auto=format&fit=crop&q=80",
    niche: "Budget Travel & Local Food",
    passions: "Everyday stories, cozy neighborhood cafes, offbeat staycations",
  },
  angels_world_diaries: {
    name: "Jagruti Poriya",
    email: "jagruti.poriya@influenza.io",
    gender: "Female",
    ethnicity: "South Asian / Indian",
    languages: ["Gujarati", "Hindi", "English"],
    locality: "Ghatkopar, Mumbai",
    line1: "R-City Mall Lane, Ghatkopar West",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postcode: "400086",
    phoneNumber: "+91 98211 44553",
    category: "Family & Lifestyle",
    categories: ["Lifestyle", "Parenting & Kids", "Food & Beverage", "Beauty"],
    rates: { post: 5000, reel: 8000, story: 3500 },
    basePrice: 100,
    coverPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&auto=format&fit=crop&q=80",
    niche: "Mom Lifestyle & Family Wellbeing",
    passions: "Wholesome parenting tips, family friendly recipes, accessible beauty",
  },
  shreyakainth: {
    name: "Shreya Kainth",
    email: "shreya.kainth@influenza.io",
    gender: "Female",
    ethnicity: "South Asian / Indian",
    languages: ["English", "Hindi"],
    locality: "Andheri West, Mumbai",
    line1: "Oshiwara, Andheri West",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postcode: "400053",
    phoneNumber: "+91 98211 44554",
    category: "Fashion & Style",
    categories: ["Fashion & Style", "Aesthetic", "Lifestyle", "Reels"],
    rates: { post: 18000, reel: 25000, story: 10000 },
    basePrice: 300,
    coverPhoto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&auto=format&fit=crop&q=80",
    niche: "Aesthetic Vintage Fashion",
    passions: "Pinterest moodboards, thrift flips, pastel aesthetics, curated outfits",
  },
  mumbaifoodjunkie: {
    name: "Swarali Kulkarni Pendurkar",
    email: "swarali.kulkarni@influenza.io",
    gender: "Female",
    ethnicity: "South Asian / Indian",
    languages: ["Marathi", "Hindi", "English"],
    locality: "Dadar, Mumbai",
    line1: "Shivaji Park, Dadar West",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postcode: "400028",
    phoneNumber: "+91 98211 44555",
    category: "Food & Beverage",
    categories: ["Food & Beverage", "Culinary Arts", "Travel & Adventure", "Street Food"],
    rates: { post: 25000, reel: 35000, story: 15000 },
    basePrice: 420,
    coverPhoto: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80",
    niche: "Mumbai Food & Culture",
    passions: "Hidden street food gallis, iconic culinary heritage, food anthropology",
  },
  ruhaaneehiran: {
    name: "Ruhaanee Hiran",
    email: "ruhaanee.hiran@influenza.io",
    gender: "Female",
    ethnicity: "South Asian / Indian",
    languages: ["English", "Hindi"],
    locality: "Juhu, Mumbai",
    line1: "Gulmohar Road, Juhu",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postcode: "400049",
    phoneNumber: "+91 98211 44556",
    category: "Lifestyle",
    categories: ["Lifestyle", "Fashion & Style", "Travel & Adventure", "Visual Storytelling"],
    rates: { post: 26000, reel: 38000, story: 16000 },
    basePrice: 450,
    coverPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80",
    niche: "Cinematic Lifestyle & Solo Travel",
    passions: "Slow living, solo travel itineraries, capsule wardrobe styling",
  },
  "anmol.duaaa": {
    name: "Anmol Dua",
    email: "anmol.dua@influenza.io",
    gender: "Male",
    ethnicity: "South Asian / Indian",
    languages: ["Punjabi", "Hindi", "English"],
    locality: "Santacruz, Mumbai",
    line1: "Linking Road Extension, Santacruz West",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postcode: "400054",
    phoneNumber: "+91 98211 44557",
    category: "Fashion & Style",
    categories: ["Fashion & Style", "Men Grooming", "Fitness", "Acting"],
    rates: { post: 28000, reel: 40000, story: 18000 },
    basePrice: 480,
    coverPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000&auto=format&fit=crop&q=80",
    niche: "Men's Luxury & High-Street Fashion",
    passions: "Editorial modeling, fitness conditioning, luxury men's fragrance & accessories",
  },
  spoonsofmumbai: {
    name: "Ronak Rathod",
    email: "ronak.rathod@influenza.io",
    gender: "Male",
    ethnicity: "South Asian / Indian",
    languages: ["Gujarati", "Hindi", "English"],
    locality: "Borivali West, Mumbai",
    line1: "Chandavarkar Road, Borivali West",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postcode: "400092",
    phoneNumber: "+91 98211 44558",
    category: "Food & Beverage",
    categories: ["Food & Beverage", "Vegetarian Food", "Street Food", "Travel"],
    rates: { post: 30000, reel: 45000, story: 20000 },
    basePrice: 540,
    coverPhoto: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&auto=format&fit=crop&q=80",
    niche: "Pure Vegetarian & Jain Delicacies",
    passions: "Pure vegetarian food tours, midnight Mumbai eats, festive sweet specials",
  },
  rhea_agrawal: {
    name: "Riya Agrawal",
    email: "riya.agrawal@influenza.io",
    gender: "Female",
    ethnicity: "South Asian / Indian",
    languages: ["English", "Hindi"],
    locality: "Bandra West, Mumbai",
    line1: "Pali Naka, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postcode: "400050",
    phoneNumber: "+91 98211 44559",
    category: "Beauty & Skincare",
    categories: ["Beauty & Skincare", "Fashion & Style", "Skin Positivity", "Lifestyle"],
    rates: { post: 35000, reel: 50000, story: 22000 },
    basePrice: 600,
    coverPhoto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000&auto=format&fit=crop&q=80",
    niche: "Skin Positivity & Inclusive Beauty",
    passions: "Vitiligo advocacy, real skin texture representation, football fanaticism, beauty reviews",
  },
};

export async function seedMicroInfluencers() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await connectDB();
    const hashedPassword = await bcrypt.hash("password123", 10);

    console.log(`Processing ${scrapedData.length} scraped micro-influencer profiles...`);

    for (const scraped of scrapedData) {
      const meta = METADATA_MAP[scraped.username] || {
        name: scraped.fullName || scraped.username,
        email: `${scraped.username.replace(/[^a-zA-Z0-9]/g, "")}@influenza.io`,
        gender: "Female",
        ethnicity: "South Asian / Indian",
        languages: ["English", "Hindi"],
        locality: "Mumbai, Maharashtra",
        line1: "Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        postcode: "400050",
        phoneNumber: "+91 98200 99999",
        category: "Lifestyle",
        categories: ["Lifestyle", "Fashion & Style"],
        rates: { post: 15000, reel: 25000, story: 8000 },
        basePrice: 250,
        coverPhoto: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1000&auto=format&fit=crop&q=80",
        niche: "Digital Content",
        passions: "Storytelling & authentic lifestyle creation",
      };

      // 1. User
      let user = await User.findOne({ email: meta.email });
      if (!user) {
        user = await User.create({
          name: meta.name,
          email: meta.email,
          password: hashedPassword,
          role: "influencer",
        });
        console.log(`[Created Micro User] ${meta.name} (${meta.email})`);
      } else {
        user.name = meta.name;
        await user.save();
      }

      // Calculate avg likes/comments from real posts
      const posts = scraped.latestPosts || [];
      const avgLikes = posts.length
        ? Math.round(posts.reduce((s, p) => s + (p.likesCount || 0), 0) / posts.length)
        : Math.round(scraped.followersCount * 0.045);
      const avgComments = posts.length
        ? Math.round(posts.reduce((s, p) => s + (p.commentsCount || 0), 0) / posts.length)
        : Math.round(avgLikes * 0.02);
      const avgViews = posts.length
        ? Math.round(posts.reduce((s, p) => s + (p.videoViewCount || (p.likesCount ? p.likesCount * 3 : 0)), 0) / posts.length)
        : avgLikes * 3;

      const avatarUrl = scraped.localPicPath || scraped.picUrl;

      // 2. Profile
      const profileData = {
        user: user._id,
        handle: `@${scraped.username}`,
        approved: true,
        categories: meta.categories,
        personalInfo: {
          firstName: meta.name.split(" ")[0],
          lastName: meta.name.split(" ").slice(1).join(" "),
          title: `${meta.niche} Creator`,
          avatar: avatarUrl,
          coverPhoto: meta.coverPhoto,
          coverPhotos: [meta.coverPhoto],
          gender: meta.gender,
          ethnicity: meta.ethnicity,
          languages: meta.languages,
          petOwner: "Yes",
          bio: scraped.biography || meta.passions,
        },
        address: {
          line1: meta.line1,
          city: meta.city,
          county: "Mumbai Suburban",
          state: meta.state,
          postcode: meta.postcode,
          country: meta.country,
          phoneNumber: meta.phoneNumber,
        },
        matchProfile: {
          campaignActive: true,
          invitationsActive: true,
          collaborationFormats: [
            "Instagram Reels",
            "Instagram Stories",
            "Instagram Post",
            "UGC Ad Assets",
          ],
          paymentType: "paid",
          minAskingPrice: meta.rates.post,
          maxAskingPrice: meta.rates.reel * 2,
          bio: scraped.biography || meta.passions,
          passions: meta.passions,
          topics: [meta.niche, "Local Mumbai Spots", "Authentic Recommendations"],
          niche: [meta.niche, "Mumbai Micro Creators", "High Engagement"],
          leadTimeDays: 4,
          preferredCompanies: ["Local Cafes", "D2C Brands", "Sustainable Fashion", "Zomato", "Swiggy"],
          interestedBrands: ["Nykaa", "Snitch", "Bombay Shaving Co", "Plum Goodness", "Subko Coffee"],
          audienceGender: meta.gender === "Female" ? "68% Female, 32% Male" : "48% Female, 52% Male",
          audienceAgeRange: "18-29",
          audience: ["Mumbai College Students", "Young Working Professionals", "Gen Z"],
          followersLocations: ["IN", "Mumbai", "Pune", "Thane", "Navi Mumbai"],
        },
        socialAccounts: [
          {
            platform: "Instagram",
            handle: `@${scraped.username}`,
            followers: scraped.followersCount,
            verified: Boolean(scraped.verified),
            connected: true,
            engagementRate: Number(((avgLikes / (scraped.followersCount || 1)) * 100).toFixed(2)),
            avgLikes,
            avgComments,
          },
        ],
        payoutInfo: {
          method: "upi",
          accountHolderName: meta.name,
          bankName: "HDFC Bank",
          accountNumber: "50100876123498",
          ifscOrRouting: "HDFC0000240",
          upiId: `${scraped.username.replace(/[^a-zA-Z0-9]/g, "")}@okhdfcbank`,
          currency: "INR",
          isConfigured: true,
        },
        packages: [
          {
            id: `pkg_${scraped.username}_1`,
            title: "1x High-Converting Instagram Reel",
            contentType: "Reel",
            count: 1,
            duration: 1,
            durationUnit: "Minutes",
            price: meta.rates.reel,
            description: "Authentic, relatable short-form Reel with candid voiceover, aesthetic B-roll, and brand tag.",
          },
          {
            id: `pkg_${scraped.username}_2`,
            title: "2x Interactive Stories with Link Sticker",
            contentType: "Story",
            count: 2,
            duration: 15,
            durationUnit: "Seconds",
            price: meta.rates.story,
            description: "2 sequence stories with swipe up / link sticker, unboxing reaction, and direct discount code.",
          },
          {
            id: `pkg_${scraped.username}_3`,
            title: "1x Carousel Photo Post",
            contentType: "Post",
            count: 1,
            duration: 1,
            durationUnit: "Posts",
            price: meta.rates.post,
            description: "Candid lifestyle photo carousel showcasing your product naturally in a Mumbai setting.",
          },
        ],
        isProfileComplete: true,
      };

      await InfluencerProfile.findOneAndUpdate(
        { user: user._id },
        profileData,
        { upsert: true, new: true }
      );
      console.log(`[Synced Micro Profile] ${meta.name} (@${scraped.username}) -> ${scraped.followersCount} followers [Photo: ${avatarUrl}]`);

      // 3. Rate Card
      await RateCard.findOneAndUpdate(
        { influencer: user._id },
        {
          influencer: user._id,
          followers: scraped.followersCount,
          avgLikes,
          avgComments,
          nicheId: meta.niche,
          marketId: "Mumbai, India",
          rates: meta.rates,
          packages: profileData.packages,
        },
        { upsert: true, new: true }
      );

      // 4. InstagramCache
      await InstagramCache.findOneAndUpdate(
        { handle: scraped.username.toLowerCase() },
        {
          handle: scraped.username.toLowerCase(),
          fullName: meta.name,
          profilePicUrl: avatarUrl,
          rawProfilePicUrl: scraped.picUrl || avatarUrl,
          biography: scraped.biography,
          verified: Boolean(scraped.verified),
          followers: scraped.followersCount,
          avgLikes,
          avgComments,
          avgViews,
          topPosts: (scraped.latestPosts || []).map((p, idx) => ({
            id: p.id || `post_${idx}`,
            caption: p.caption || "Instagram Post",
            likes: p.likesCount || avgLikes,
            comments: p.commentsCount || avgComments,
            views: p.videoViewCount || avgViews,
            url: p.url || `https://instagram.com/${scraped.username}`,
            displayUrl: p.displayUrl || "",
            isVideo: Boolean(p.isVideo),
          })),
          lastFetchedAt: new Date(),
        },
        { upsert: true, new: true }
      );
    }

    console.log(`\n✅ All ${scrapedData.length} Mumbai micro-influencers successfully seeded with authentic photos!`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedMicroInfluencers();
