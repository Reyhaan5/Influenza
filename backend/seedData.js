import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding...");

    // 1. Create or Find Demo Brand User
    let brandUser = await User.findOne({ email: "brand@demo.com" });
    if (!brandUser) {
      brandUser = await User.create({
        name: "Luxe Beauty Collective",
        email: "brand@demo.com",
        password: "password123",
        role: "brand",
      });
      console.log("Created demo brand user: brand@demo.com");
    }

    // Ensure Brand Profile
    await BrandProfile.findOneAndUpdate(
      { user: brandUser._id },
      {
        user: brandUser._id,
        companyName: "Luxe Beauty Collective",
        website: "https://luxebeauty.example.com",
        bio: "Premium skincare and wellness essentials crafted for modern creators.",
      },
      { upsert: true, new: true }
    );

    // Create Brand Entity
    let brandEntity = await Brand.findOne({ user: brandUser._id, name: "Glow & Co." });
    if (!brandEntity) {
      brandEntity = await Brand.create({
        user: brandUser._id,
        name: "Glow & Co.",
        category: "Beauty & Skincare",
        website: "https://glowandco.example.com",
        description: "Organic, cruelty-free serums and moisturizers.",
      });
    }

    // Create Product
    let product = await Product.findOne({ brand: brandEntity._id });
    if (!product) {
      product = await Product.create({
        user: brandUser._id,
        brand: brandEntity._id,
        productName: "Vitamin C Radiance Elixir",
        productCategory: "Skincare",
        productPrice: 1499,
        productDescription: "20% Vitamin C serum with hyaluronic acid for an instant radiant glow.",
      });
    }

    // Create Campaign (Opportunity)
    let opportunity = await Opportunity.findOne({ brand: brandUser._id, title: "Summer Radiance Campaign" });
    if (!opportunity) {
      opportunity = await Opportunity.create({
        brand: brandUser._id,
        brandEntity: brandEntity._id,
        product: product._id,
        title: "Summer Radiance Campaign",
        format: "money",
        rewardValue: "₹25,000",
        deliverablesRequired: 1,
        deliverables: [
          {
            mediaType: "Video",
            placement: "Reels",
            format: "9:16 Vertical",
            videoMinLength: 15,
            videoMaxLength: 60,
            contentType: "Morning Routine Showcase",
            brandTag: "@glowandco",
            hashtags: "#GlowUp #SkinRoutine #Ad",
          },
        ],
        description: "Showcase your morning skincare routine featuring our Vitamin C Radiance Elixir.",
        status: "open",
      });
    }

    // 2. Create or Find Demo Influencer Users
    const creatorsData = [
      {
        name: "Aarav Sharma",
        email: "creator@demo.com",
        handle: "@aarav_creates",
        categories: ["Beauty & Skincare", "Lifestyle", "Fashion"],
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Ananya Roy",
        email: "ananya@demo.com",
        handle: "@ananyaroy_vlogs",
        categories: ["Health & Fitness", "Lifestyle", "Beauty & Skincare"],
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Rohit Verma",
        email: "rohit@demo.com",
        handle: "@rohit_fitness",
        categories: ["Health & Fitness", "Tech & Gadgets"],
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Pooja Hegde",
        email: "pooja@demo.com",
        handle: "@pooja_glam",
        categories: ["Beauty & Skincare", "Travel & Adventure"],
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400",
      },
    ];

    const influencerUsers = [];

    for (const c of creatorsData) {
      let u = await User.findOne({ email: c.email });
      if (!u) {
        u = await User.create({
          name: c.name,
          email: c.email,
          password: "password123",
          role: "influencer",
        });
        console.log(`Created demo creator: ${c.email}`);
      }

      await InfluencerProfile.findOneAndUpdate(
        { user: u._id },
        {
          user: u._id,
          handle: c.handle,
          categories: c.categories,
          approved: true,
          personalInfo: {
            firstName: c.name.split(" ")[0],
            lastName: c.name.split(" ")[1] || "",
            avatar: c.avatar,
            bio: "Content creator passionate about aesthetic visuals, beauty reviews, and lifestyle storytelling.",
            city: "Mumbai",
            country: "India",
          },
          socialAccounts: [
            {
              platform: "Instagram",
              handle: c.handle.replace("@", ""),
              followers: 125000,
              engagementRate: 4.8,
              connected: true,
            },
          ],
        },
        { upsert: true, new: true }
      );

      influencerUsers.push(u);
    }

    // 3. Create Sample Collaborations with Deliverables across all Stages

    // COLLABORATION 1: STAGE = "review" (Draft Submitted, Brand needs to review!)
    const creator1 = influencerUsers[0]; // Aarav Sharma
    let req1 = await CollaborationRequest.findOneAndUpdate(
      { brand: brandUser._id, influencer: creator1._id },
      {
        brand: brandUser._id,
        influencer: creator1._id,
        brandEntity: brandEntity._id,
        opportunity: opportunity._id,
        status: "accepted",
        format: "money",
        respondedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    let collab1 = await Collaboration.findOneAndUpdate(
      { request: req1._id },
      {
        request: req1._id,
        opportunity: opportunity._id,
        brand: brandUser._id,
        influencer: creator1._id,
        brandEntity: brandEntity._id,
        format: "money",
        deliverablesTotal: 1,
        deliverablesCompleted: 0,
        paymentStatus: "pending",
        stage: "review", // IN REVIEW!
        notes: "Draft submitted by creator. Ready for brand approval.",
      },
      { upsert: true, new: true }
    );

    await Deliverable.findOneAndUpdate(
      { collaboration: collab1._id },
      {
        collaboration: collab1._id,
        influencer: creator1._id,
        brand: brandUser._id,
        type: "draft",
        title: "Summer Radiance Reel - 1st Cut",
        platform: "Instagram",
        contentUrl: "https://drive.google.com/file/d/1A2B3C4D5E_sample_reel_preview/view",
        caption: "My morning secret for glowy, radiant skin ✨ Featuring @glowandco Vitamin C Elixir. #GlowUp #SkinRoutine #Ad",
        notes: "Here is the 1st cut! I used the high-energy hook in the first 3 seconds. Let me know if brand tags look good!",
        status: "submitted",
        submittedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // COLLABORATION 2: STAGE = "content_creation" (Revision Requested!)
    const creator2 = influencerUsers[1]; // Ananya Roy
    let req2 = await CollaborationRequest.findOneAndUpdate(
      { brand: brandUser._id, influencer: creator2._id },
      {
        brand: brandUser._id,
        influencer: creator2._id,
        brandEntity: brandEntity._id,
        opportunity: opportunity._id,
        status: "accepted",
        format: "money",
        respondedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    let collab2 = await Collaboration.findOneAndUpdate(
      { request: req2._id },
      {
        request: req2._id,
        opportunity: opportunity._id,
        brand: brandUser._id,
        influencer: creator2._id,
        brandEntity: brandEntity._id,
        format: "money",
        deliverablesTotal: 1,
        deliverablesCompleted: 0,
        paymentStatus: "pending",
        stage: "content_creation",
        notes: "Revision requested: Please make sure the bottle label is clearly shown in the first 5 seconds.",
      },
      { upsert: true, new: true }
    );

    await Deliverable.findOneAndUpdate(
      { collaboration: collab2._id },
      {
        collaboration: collab2._id,
        influencer: creator2._id,
        brand: brandUser._id,
        type: "draft",
        title: "Skincare Transformation Reel",
        platform: "Instagram",
        contentUrl: "https://drive.google.com/file/d/sample_ananya_draft/view",
        caption: "Transforming my skin with this elixir 🌟 @glowandco",
        notes: "Initial test draft.",
        status: "revision_requested",
        feedback: "Great lighting! Please make sure the product bottle label faces the camera directly during the application step.",
        submittedAt: new Date(Date.now() - 86400000),
        reviewedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // COLLABORATION 3: STAGE = "posting" (Draft Approved -> Creator ready to post live!)
    const creator3 = influencerUsers[2]; // Rohit Verma
    let req3 = await CollaborationRequest.findOneAndUpdate(
      { brand: brandUser._id, influencer: creator3._id },
      {
        brand: brandUser._id,
        influencer: creator3._id,
        brandEntity: brandEntity._id,
        opportunity: opportunity._id,
        status: "accepted",
        format: "barter",
        respondedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    let collab3 = await Collaboration.findOneAndUpdate(
      { request: req3._id },
      {
        request: req3._id,
        opportunity: opportunity._id,
        brand: brandUser._id,
        influencer: creator3._id,
        brandEntity: brandEntity._id,
        format: "barter",
        deliverablesTotal: 1,
        deliverablesCompleted: 0,
        paymentStatus: "pending",
        stage: "posting",
        notes: "Draft approved! Creator is authorized to post live.",
      },
      { upsert: true, new: true }
    );

    await Deliverable.findOneAndUpdate(
      { collaboration: collab3._id },
      {
        collaboration: collab3._id,
        influencer: creator3._id,
        brand: brandUser._id,
        type: "draft",
        title: "Post-Workout Recovery & Skincare",
        platform: "Instagram",
        contentUrl: "https://youtu.be/unlisted_sample_preview",
        caption: "Hydration isn't just for workouts! Loving the new @glowandco serum.",
        notes: "Short & punchy 20s clip.",
        status: "approved",
        feedback: "Approved! Love the transition at 0:10. You can go live tomorrow at 6 PM.",
        submittedAt: new Date(Date.now() - 172800000),
        reviewedAt: new Date(Date.now() - 86400000),
      },
      { upsert: true, new: true }
    );

    // COLLABORATION 4: STAGE = "completed" (Live Post Verified + 5-Star Review!)
    const creator4 = influencerUsers[3]; // Pooja Hegde
    let req4 = await CollaborationRequest.findOneAndUpdate(
      { brand: brandUser._id, influencer: creator4._id },
      {
        brand: brandUser._id,
        influencer: creator4._id,
        brandEntity: brandEntity._id,
        opportunity: opportunity._id,
        status: "accepted",
        format: "money",
        respondedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    let collab4 = await Collaboration.findOneAndUpdate(
      { request: req4._id },
      {
        request: req4._id,
        opportunity: opportunity._id,
        brand: brandUser._id,
        influencer: creator4._id,
        brandEntity: brandEntity._id,
        format: "money",
        deliverablesTotal: 1,
        deliverablesCompleted: 1,
        paymentStatus: "paid",
        stage: "completed",
        notes: "All deliverables completed and verified!",
      },
      { upsert: true, new: true }
    );

    await Deliverable.findOneAndUpdate(
      { collaboration: collab4._id },
      {
        collaboration: collab4._id,
        influencer: creator4._id,
        brand: brandUser._id,
        type: "live_post",
        title: "Live Glow Tutorial",
        platform: "Instagram",
        postUrl: "https://www.instagram.com/reel/C8xyz123GlowSample/",
        caption: "Obsessed with this texture and glow! @glowandco #ad #skincaretips",
        notes: "Video went live yesterday, already crossed 50k views!",
        status: "approved",
        submittedAt: new Date(Date.now() - 259200000),
        reviewedAt: new Date(Date.now() - 172800000),
      },
      { upsert: true, new: true }
    );

    // Create Review for completed Collab
    await Review.findOneAndUpdate(
      { collaboration: collab4._id },
      {
        collaboration: collab4._id,
        brand: brandUser._id,
        influencer: creator4._id,
        rating: 5,
        comment: "Outstanding creator! Delivered high-converting visuals ahead of the deadline with amazing engagement.",
      },
      { upsert: true, new: true }
    );

    console.log("\n=========================================");
    console.log(" SAMPLE DATA SUCCESSFULLY SEEDED! ");
    console.log("=========================================");
    console.log("Demo Credentials:");
    console.log("  🏢 Brand Account:     brand@demo.com    / password123");
    console.log("  🧑‍🎨 Creator Account 1: creator@demo.com  / password123 (Has pending draft in Review)");
    console.log("  🧑‍🎨 Creator Account 2: ananya@demo.com   / password123 (Has revision requested)");
    console.log("  🧑‍🎨 Creator Account 3: rohit@demo.com    / password123 (Approved -> Ready to Post)");
    console.log("  🧑‍🎨 Creator Account 4: pooja@demo.com    / password123 (Completed with 5-Star Review)");
    console.log("=========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seed();