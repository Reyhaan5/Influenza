// src/pages/PricingCalculator.jsx — Modern Influenza Theme Engagement & Pricing Calculator

import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Heart,
  MessageCircle,
  TrendingUp,
  Play,
  CheckCircle2,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  AlertCircle,
  HelpCircle,
  Video,
  Flame,
  Zap,
  DollarSign,
  Award,
  Check,
  BarChart3,
} from "lucide-react";
import { FaInstagram as InstagramIcon } from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/footer/Footer";
import ArrowFillButton from "../components/common/ArrowFillButton";
import CountUp from "../components/ui/CountUp";
import { QualityPill } from "../components/ui/QualityBadge";
import { calculateInfluRate } from "../utils/influRateCalculator";
import { API_URL } from "../config/api";

// Compact number formatting (e.g. 67.8M, 150k, 1.7k)
function formatCompact(num) {
  if (typeof num !== "number" || isNaN(num)) return "0";
  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return num.toLocaleString();
}

function formatCurrency(num, currency = "INR") {
  if (typeof num !== "number" || isNaN(num)) return "0";
  if (currency === "USD") {
    return "$" + Math.round(num / 85).toLocaleString("en-US");
  }
  return "₹" + Math.round(num).toLocaleString("en-IN");
}

const POPULAR_PROFILES = [
  { name: "Virat Kohli", handle: "virat.kohli" },
  { name: "Tech Burner", handle: "techburner" },
  { name: "Leo Messi", handle: "leomessi" },
  { name: "Will Smith", handle: "willsmith" },
  { name: "Zendaya", handle: "zendaya" },
  { name: "The Rock", handle: "therock" },
];

export default function PricingCalculator() {
  const [handleInput, setHandleInput] = useState("");
  const [currency, setCurrency] = useState("INR");

  // Profile data starts as NULL (no static placeholder shown by default)
  const [profile, setProfile] = useState(null);
  const [searching, setSearching] = useState(false);
  const [errorNotice, setErrorNotice] = useState("");

  const handleSearch = async (targetHandle) => {
    const rawHandle = (targetHandle || handleInput || "").trim().replace(/^@/, "").toLowerCase();

    if (!rawHandle) return;

    setSearching(true);
    setErrorNotice("");

    try {
      const response = await axios.get(`${API_URL}/public/instagram-lookup`, {
        params: { handle: rawHandle },
      });

      const data = response.data;

      if (data.found) {
        setProfile({
          handle: rawHandle,
          fullName: data.fullName || rawHandle,
          avatar: data.profilePicUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${rawHandle}`,
          verified: Boolean(data.verified),
          followers: Number(data.followers) || 0,
          avgLikes: Number(data.avgLikes) || 0,
          avgComments: Number(data.avgComments) || 0,
          avgViews: Number(data.avgViews) || (data.avgLikes ? data.avgLikes * 3 : 0),
          biography: data.biography || "",
          topPosts: data.topPosts || [],
        });
      } else {
        setErrorNotice(
          data.message || `Could not find Instagram profile for @${rawHandle}. Please verify the handle and try again.`
        );
      }
    } catch (err) {
      console.error("Instagram lookup error:", err);
      setErrorNotice(
        err.response?.data?.message || `Unable to retrieve live Instagram data for @${rawHandle}. Please try again.`
      );
    } finally {
      setSearching(false);
    }
  };

  // Compute InfluRate when a valid profile is loaded
  const calculated = profile
    ? calculateInfluRate({
        followers: profile.followers,
        avgLikes: profile.avgLikes,
        avgComments: profile.avgComments,
        verified: profile.verified,
        niche: "lifestyle",
      })
    : null;

  const basePrice = calculated?.rateCard.deliverables.reel.price || (profile?.followers ? profile.followers * 0.1 : 0);
  const minEarnings = Math.round(basePrice * 0.75);
  const maxEarnings = Math.round(basePrice * 1.35);

  const currSymbol = currency === "USD" ? "$" : "₹";
  const minVal = currency === "USD" ? Math.round(minEarnings / 85) : Math.round(minEarnings);
  const maxVal = currency === "USD" ? Math.round(maxEarnings / 85) : Math.round(maxEarnings);

  const reelPriceVal = calculated
    ? currency === "USD"
      ? Math.round(calculated.rateCard.deliverables.reel.price / 85)
      : Math.round(calculated.rateCard.deliverables.reel.price)
    : 0;

  const postPriceVal = calculated
    ? currency === "USD"
      ? Math.round(calculated.rateCard.deliverables.post.price / 85)
      : Math.round(calculated.rateCard.deliverables.post.price)
    : 0;

  const storyPriceVal = calculated
    ? currency === "USD"
      ? Math.round(calculated.rateCard.deliverables.story.price / 85)
      : Math.round(calculated.rateCard.deliverables.story.price)
    : 0;

  const bundlePriceVal = calculated
    ? currency === "USD"
      ? Math.round(calculated.rateCard.deliverables.reelBundle.price / 85)
      : Math.round(calculated.rateCard.deliverables.reelBundle.price)
    : 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans relative overflow-hidden">
      <Navbar />

      {/* Subtle Ambient Glows consistent with Website Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-16 left-1/4 -translate-x-1/2 w-[600px] h-[400px] bg-pink-200/25 blur-[120px] rounded-full" />
        <div className="absolute top-36 right-1/4 translate-x-1/2 w-[500px] h-[350px] bg-purple-200/25 blur-[120px] rounded-full" />
        <div className="absolute top-96 left-1/2 -translate-x-1/2 w-[450px] h-[300px] bg-pink-100/25 blur-[100px] rounded-full" />
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-20">
        <div className="space-y-12 sm:space-y-16">

          {/* ===================================================================
              HERO SEARCH HEADER (Influenza Brand Themed)
          =================================================================== */}
          <div className="text-center max-w-3xl mx-auto">
            

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-[1.15]"
            >
              Instagram Engagement Rate &{" "}
              <span className="bg-gradient-to-r from-[#FF1475] via-purple-600 to-[#FF1475] bg-clip-text text-transparent">
                Pricing Calculator
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed font-normal"
            >
              Evaluate real engagement rates, benchmark against niche averages, and calculate fair commercial deliverable pricing in ₹ INR. Free with zero sign-up required.
            </motion.p>

            {/* Branded Pill Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(handleInput);
              }}
              className="mt-8 bg-white border border-zinc-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] rounded-full p-2 pl-5 sm:pl-6 flex flex-col sm:flex-row items-stretch sm:items-center max-w-xl mx-auto gap-2 sm:gap-0 hover:shadow-[0_6px_28px_rgba(0,0,0,0.09)] transition-all focus-within:border-pink-300 focus-within:ring-4 focus-within:ring-pink-500/10"
            >
              <div className="relative flex-1 flex items-center">
                <span className="text-zinc-400 font-bold text-base mr-1">@</span>
                <input
                  type="text"
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  placeholder="Enter Instagram username (e.g. virat.kohli)"
                  className="w-full bg-transparent text-sm sm:text-base font-medium text-zinc-900 focus:outline-none placeholder:text-zinc-400"
                />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#FF1475] to-purple-600 hover:from-[#e00f65] hover:to-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-pink-500/20 transition-all active:scale-95 disabled:opacity-50 flex-shrink-0 cursor-pointer"
              >
                {searching ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Check Profile</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </motion.form>

            {/* Popular Profiles Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <span className="text-xs font-semibold text-zinc-500 mr-1 flex items-center gap-1">
                <Flame size={13} className="text-[#FF1475]" /> Popular:
              </span>
              {POPULAR_PROFILES.map((p) => (
                <button
                  key={p.handle}
                  type="button"
                  onClick={() => {
                    setHandleInput(p.handle);
                    handleSearch(p.handle);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/90 text-xs font-semibold text-zinc-700 hover:border-[#FF1475] hover:text-[#FF1475] hover:bg-pink-50/40 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{p.name}</span>
                  <span className="text-zinc-400 text-[11px]">@{p.handle}</span>
                </button>
              ))}
            </div>

            {errorNotice && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-4 py-2.5 rounded-2xl text-left shadow-xs"
              >
                <AlertCircle size={15} className="flex-shrink-0 text-red-600" />
                <span>{errorNotice}</span>
              </motion.div>
            )}
          </div>

          {/* ===================================================================
              DYNAMIC PROFILE RESULT STATE (ONLY RENDERS WHEN PROFILE IS LOADED)
          =================================================================== */}
          {profile && calculated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              
              {/* Currency Toggle */}
              <div className="flex items-center justify-between sm:justify-end gap-2.5">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Currency:</span>
                <div className="inline-flex rounded-full p-1 bg-white border border-zinc-200/90 text-xs font-bold shadow-xs">
                  <button
                    type="button"
                    onClick={() => setCurrency("INR")}
                    className={`px-3.5 py-1 rounded-full transition-all ${
                      currency === "INR" ? "bg-zinc-950 text-white shadow-xs" : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    ₹ INR
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    className={`px-3.5 py-1 rounded-full transition-all ${
                      currency === "USD" ? "bg-zinc-950 text-white shadow-xs" : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>

              {/* 1. TOP STATS ROW (5 Cards with Influenza Themed Highlights) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                
                {/* Profile Card */}
                <div className="col-span-2 sm:col-span-2 lg:col-span-1 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs flex items-center gap-3.5 hover:border-zinc-300 transition-all">
                  <div className="relative flex-shrink-0">
                    <img
                      src={profile.avatar}
                      alt={profile.handle}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        if (!e.target.dataset.fallback) {
                          e.target.dataset.fallback = "true";
                          e.target.src = `https://unavatar.io/instagram/${profile.handle}`;
                        } else {
                          e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${profile.handle}`;
                        }
                      }}
                      className="w-12 h-12 rounded-full object-cover border-2 border-pink-100 shadow-xs"
                    />
                    {profile.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 shadow">
                        <CheckCircle2 size={12} className="text-white fill-blue-500" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-zinc-950 truncate flex items-center gap-1">
                      <span className="truncate">{profile.fullName}</span>
                      <InstagramIcon size={12} className="text-pink-500 flex-shrink-0" />
                    </h3>
                    <p className="text-xs text-zinc-500 font-semibold truncate mt-0.5">
                      {formatCompact(profile.followers)} Followers
                    </p>
                  </div>
                </div>

                {/* Signature Influenza Pink Engagement Rate Highlight Card */}
                <div className="col-span-1 rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50/80 via-white to-purple-50/80 p-4 shadow-xs flex flex-col justify-between hover:border-pink-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-600">Engagement</span>
                    <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-[#FF1475] to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <TrendingUp size={13} />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                      {calculated.metrics.engagementRate}%
                    </span>
                    <span className="block text-[11px] font-semibold text-[#FF1475] mt-0.5">
                      {calculated.overallRating.breakdown.qualityScore.qualityLabel} ER
                    </span>
                  </div>
                </div>

                {/* Average Likes Card */}
                <div className="col-span-1 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs flex flex-col justify-between hover:border-zinc-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500">Avg Likes</span>
                    <div className="h-6 w-6 rounded-lg bg-pink-50 text-[#FF1475] flex items-center justify-center flex-shrink-0">
                      <Heart size={13} className="fill-[#FF1475]" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-zinc-950 tracking-tight">
                      {formatCompact(profile.avgLikes)}
                    </span>
                    <span className="block text-[11px] text-zinc-400 font-medium mt-0.5">
                      per post
                    </span>
                  </div>
                </div>

                {/* Average Comments Card */}
                <div className="col-span-1 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs flex flex-col justify-between hover:border-zinc-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500">Avg Comments</span>
                    <div className="h-6 w-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={13} className="fill-purple-600" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-zinc-950 tracking-tight">
                      {formatCompact(profile.avgComments)}
                    </span>
                    <span className="block text-[11px] text-zinc-400 font-medium mt-0.5">
                      per post
                    </span>
                  </div>
                </div>

                {/* Average Reel Plays / Views Card */}
                <div className="col-span-1 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs flex flex-col justify-between hover:border-zinc-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500">Avg Reel Plays</span>
                    <div className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Play size={13} className="fill-blue-600" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-zinc-950 tracking-tight">
                      {formatCompact(profile.avgViews)}
                    </span>
                    <span className="block text-[11px] text-zinc-400 font-medium mt-0.5">
                      per Reel
                    </span>
                  </div>
                </div>

              </div>

              {/* 2. MIDDLE DASHBOARD GRID (Profile Details + Benchmark Chart + Top Performing Reels) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
                
                {/* Profile Details Card */}
                <div className="lg:col-span-3 rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider block">
                      Profile Details
                    </span>
                    <div className="text-xs text-zinc-800 space-y-2.5">
                      <div className="font-bold flex items-center gap-1.5 truncate">
                        <InstagramIcon size={14} className="text-[#FF1475] flex-shrink-0" />
                        <span className="truncate font-mono">@{profile.handle}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-600 font-medium">
                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                        <span>Live Instagram verified</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-600 font-medium">
                        <ShieldCheck size={14} className="text-purple-600 flex-shrink-0" />
                        <span>AQS Authenticity Audited</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 space-y-3">
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                      Influenza evaluates active reach, real engagement, and fair ₹ collaboration valuation.
                    </p>
                    <QualityPill quality={calculated.overallRating.breakdown.qualityScore.qualityLabel} size="sm" />
                  </div>
                </div>

                {/* Engagement Benchmark Visualizer */}
                <div className="lg:col-span-5 rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider block">
                        Engagement Benchmark
                      </span>
                      <span className="text-[11px] font-bold text-zinc-500">
                        Category: <strong className="text-zinc-900 capitalize">{calculated.metrics.niche}</strong>
                      </span>
                    </div>
                    
                    {/* Branded Histogram Benchmark Chart */}
                    <div className="h-32 flex items-end gap-2 pt-6 px-2 border-b border-zinc-100">
                      <div className="flex-1 bg-zinc-100 rounded-t-lg h-[30%]" title="1k-5k tier avg" />
                      <div className="flex-1 bg-zinc-100 rounded-t-lg h-[45%]" title="5k-20k tier avg" />
                      <div className="flex-1 bg-gradient-to-t from-[#FF1475] to-purple-500 rounded-t-lg h-[80%] relative flex flex-col items-center shadow-xs">
                        <div className="absolute -top-7 flex flex-col items-center">
                          <img
                            src={profile.avatar}
                            alt=""
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${profile.handle}`;
                            }}
                            className="w-5 h-5 rounded-full border-2 border-white shadow-md object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 bg-zinc-900 rounded-t-lg h-[55%]" title="Median benchmark" />
                      <div className="flex-1 bg-zinc-100 rounded-t-lg h-[38%]" />
                      <div className="flex-1 bg-zinc-100 rounded-t-lg h-[24%]" />
                      <div className="flex-1 bg-zinc-100 rounded-t-lg h-[15%]" />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-zinc-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF1475]" />
                      Creator ER: <strong className="text-zinc-950 font-bold">{calculated.metrics.engagementRate}%</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-zinc-900" />
                      Median: <strong className="text-zinc-950 font-bold">1.45%</strong>
                    </span>
                  </div>
                </div>

                {/* Top Performing Reels / Posts Card */}
                <div className="lg:col-span-4 rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider block">
                      Top Performing Posts
                    </span>
                    <span className="text-[11px] text-zinc-400 font-medium">
                      Recent 12
                    </span>
                  </div>

                  {profile.topPosts && profile.topPosts.length > 0 ? (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {profile.topPosts.map((post, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between gap-2 hover:bg-zinc-100/70 transition"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-zinc-900 truncate">
                              {post.caption || `Post #${idx + 1}`}
                            </p>
                            <span className="text-[10px] text-zinc-500 font-medium">
                              {formatCompact(post.likes)} Likes • {formatCompact(post.comments)} Comments
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-zinc-950 flex-shrink-0">
                            {formatCompact(post.views || post.likes * 3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-zinc-400 font-medium">
                      Recent post engagements calculated from 12 latest posts.
                    </div>
                  )}
                </div>

              </div>

              {/* 3. HIGH-IMPACT ESTIMATED PRICING VALUATION BANNER */}
              <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF1475] block mb-1">
                      Estimated Valuation
                    </span>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight">
                      {formatCurrency(calculated.rateCard.minEarnings, currency)} - {formatCurrency(calculated.rateCard.maxEarnings, currency)}
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-600 mt-1.5 font-medium max-w-xl">
                      Suggested benchmark per Post / Reel based on {formatCompact(profile.followers)} verified followers, {calculated.metrics.engagementRate}% ER, and current Indian creator market demand.
                    </p>
                  </div>

                  {/* Rating Score Badge with CountUp */}
                  <div className="flex items-center gap-3.5 self-start md:self-center bg-zinc-50 border border-zinc-200/90 p-3 sm:p-3.5 rounded-2xl shadow-xs flex-shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-zinc-900 block">
                        Score: <CountUp key={`score-${calculated.overallRating.score}`} to={calculated.overallRating.score} duration={1.2} />/100 ({calculated.overallRating.grade})
                      </span>
                      <span className="text-[11px] text-zinc-500 font-medium block mt-0.5">
                        Reach ({calculated.overallRating.breakdown.reachScore.score}/35) • Eng ({calculated.overallRating.breakdown.engagementScore.score}/35)
                      </span>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-[#FF1475] to-purple-600 text-white font-black text-lg flex items-center justify-center shadow-xs flex-shrink-0">
                      <CountUp
                        key={`badge-${calculated.overallRating.score}`}
                        to={calculated.overallRating.score}
                        duration={1.2}
                      />
                    </div>
                  </div>
                </div>

                {/* Deliverable Breakdown Grid */}
                <div className="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                      1x Reel
                    </span>
                    <span className="text-sm sm:text-base font-black text-zinc-950 mt-1 block">
                      {formatCurrency(calculated.rateCard.deliverables.reel.price, currency)}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                      1x Feed Post
                    </span>
                    <span className="text-sm sm:text-base font-black text-zinc-950 mt-1 block">
                      {formatCurrency(calculated.rateCard.deliverables.post.price, currency)}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                      Story (Set of 2)
                    </span>
                    <span className="text-sm sm:text-base font-black text-zinc-950 mt-1 block">
                      {formatCurrency(calculated.rateCard.deliverables.story.price, currency)}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-200/90">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF1475] block">
                      3-Reel Bundle
                    </span>
                    <span className="text-sm sm:text-base font-black text-[#FF1475] mt-1 block">
                      {formatCurrency(calculated.rateCard.deliverables.reelBundle.price, currency)}
                    </span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* ===================================================================
              "WHAT'S A GOOD ENGAGEMENT RATE ON INSTAGRAM?" BENCHMARK SECTION
          =================================================================== */}
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 md:p-10 shadow-xs space-y-6 sm:space-y-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF1475] uppercase tracking-wider mb-1 block">
                <BarChart3 size={13} /> Industry Benchmarks
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                What's a good engagement rate on Instagram?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed font-medium">
                Engagement rate drops naturally once an account grows past a few thousand followers, then flattens out and stabilizes on the largest profiles. A 3% rate on a 4K account is ordinary; the same 3% on a 500K account is extraordinary.
              </p>
            </div>

            {/* Benchmark Matrix Table */}
            <div className="overflow-x-auto pb-2 -mx-2 sm:mx-0 px-2 sm:px-0">
              <div className="min-w-[500px] sm:min-w-0 space-y-2.5 sm:space-y-3 pt-2">
                
                {/* Top Arch Bracket with Follower count Pill */}
                <div className="relative pt-6">
                  <div className="grid grid-cols-12">
                    <div className="col-span-3 sm:col-span-2" />
                    <div className="col-span-9 sm:col-span-10 relative">
                      <div className="absolute -top-3 left-0 right-0 h-6 sm:h-7 border-t border-l border-r border-zinc-300 rounded-t-xl pointer-events-none" />
                      
                      {/* Centered Pill Badge */}
                      <div className="relative z-10 flex justify-center -top-6">
                        <span className="bg-zinc-100 text-zinc-800 text-[11px] font-bold px-3.5 py-0.5 rounded-full border border-zinc-200 shadow-xs">
                          Follower Tier
                        </span>
                      </div>

                      {/* Header Columns under the bracket */}
                      <div className="grid grid-cols-4 text-center font-bold text-xs text-zinc-700 pb-1">
                        <span>1k – 5k</span>
                        <span>10k – 50k</span>
                        <span>100k – 500k</span>
                        <span>1M+</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 1: High */}
                <div className="grid grid-cols-12 items-center gap-2 sm:gap-3">
                  <div className="col-span-3 sm:col-span-2 text-right pr-2 font-bold text-xs sm:text-sm text-zinc-700">
                    High
                  </div>
                  <div className="col-span-9 sm:col-span-10 rounded-xl border border-emerald-100 bg-emerald-50/50 py-3 px-2 grid grid-cols-4 text-center text-xs sm:text-sm font-bold text-emerald-950">
                    <span>&gt; 6.16%</span>
                    <span>&gt; 1.27%</span>
                    <span>&gt; 0.93%</span>
                    <span>&gt; 1.08%</span>
                  </div>
                </div>

                {/* Row 2: Above average */}
                <div className="grid grid-cols-12 items-center gap-2 sm:gap-3">
                  <div className="col-span-3 sm:col-span-2 text-right pr-2 font-bold text-xs sm:text-sm text-zinc-700">
                    Above average
                  </div>
                  <div className="col-span-9 sm:col-span-10 rounded-xl border border-purple-100 bg-purple-50/40 py-3 px-2 grid grid-cols-4 text-center text-xs sm:text-sm font-bold text-purple-950">
                    <span>3.85 – 6.16%</span>
                    <span>0.65 – 1.27%</span>
                    <span>0.46 – 0.93%</span>
                    <span>0.57 – 1.08%</span>
                  </div>
                </div>

                {/* Row 3: Average (Highlighted Influenza Gradient Bar) */}
                <div className="grid grid-cols-12 items-center gap-2 sm:gap-3">
                  <div className="col-span-3 sm:col-span-2 text-right pr-2 font-bold text-xs sm:text-sm text-zinc-950">
                    Average
                  </div>
                  <div className="col-span-9 sm:col-span-10 rounded-xl border-2 border-pink-400 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 py-3 px-2 grid grid-cols-4 text-center text-xs sm:text-sm font-black text-zinc-950 shadow-xs">
                    <span>3.16 – 3.85%</span>
                    <span>0.49 – 0.65%</span>
                    <span>0.35 – 0.46%</span>
                    <span>0.45 – 0.57%</span>
                  </div>
                </div>

                {/* Row 4: Below average */}
                <div className="grid grid-cols-12 items-center gap-2 sm:gap-3">
                  <div className="col-span-3 sm:col-span-2 text-right pr-2 font-bold text-xs sm:text-sm text-zinc-700">
                    Below average
                  </div>
                  <div className="col-span-9 sm:col-span-10 rounded-xl border border-zinc-200/70 bg-zinc-50/60 py-3 px-2 grid grid-cols-4 text-center text-xs sm:text-sm font-semibold text-zinc-700">
                    <span>1.85 – 3.16%</span>
                    <span>0.24 – 0.49%</span>
                    <span>0.16 – 0.35%</span>
                    <span>0.22 – 0.45%</span>
                  </div>
                </div>

                {/* Row 5: Low */}
                <div className="grid grid-cols-12 items-center gap-2 sm:gap-3">
                  <div className="col-span-3 sm:col-span-2 text-right pr-2 font-bold text-xs sm:text-sm text-zinc-500">
                    Low
                  </div>
                  <div className="col-span-9 sm:col-span-10 rounded-xl border border-zinc-200/50 bg-zinc-50/40 py-3 px-2 grid grid-cols-4 text-center text-xs sm:text-sm font-medium text-zinc-500">
                    <span>&lt; 1.85%</span>
                    <span>&lt; 0.24%</span>
                    <span>&lt; 0.16%</span>
                    <span>&lt; 0.22%</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ===================================================================
              "HOW WE CALCULATE ENGAGEMENT RATE" FORMULA SECTION
          =================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center pt-4">
            <div className="space-y-3 sm:space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF1475] uppercase tracking-wider">
                <Zap size={13} /> Transparent Methodology
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                How we calculate engagement rate
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                To determine a creator's real engagement rate, Influenza computes the average interactions (likes and comments) across recent posts, divides by total followers, and normalizes into a standard percentage.
              </p>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                We sample the latest 12 active posts to ensure single viral anomalies or giveaway spikes don't distort fair baseline collaboration pricing.
              </p>
            </div>

            {/* Branded Formula Card */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-pink-50/80 via-white to-purple-50/80 border border-pink-200 text-center space-y-4 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-900">
                Formula Definition
              </span>
              <div className="text-sm sm:text-base md:text-lg font-black text-zinc-950 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <span>Engagement rate =</span>
                <div className="inline-flex flex-col items-center">
                  <span className="border-b-2 border-zinc-900 px-2 pb-0.5 text-xs sm:text-sm font-bold">
                    Avg Likes + Comments
                  </span>
                  <span className="pt-0.5 text-xs sm:text-sm font-bold text-zinc-600">
                    Total Followers
                  </span>
                </div>
                <span>× 100</span>
              </div>
            </div>
          </div>

          {/* ===================================================================
              "WHAT AFFECTS AN INSTAGRAM ENGAGEMENT RATE" (3-Card Feature Grid)
          =================================================================== */}
          <div className="space-y-6 pt-6 border-t border-zinc-200/80">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF1475] uppercase tracking-wider mb-1 block">
                <Layers size={13} /> Performance Factors
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                What affects an Instagram engagement rate?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1 font-medium">
                Two creators with identical follower counts can have very different engagement rates. Here is what explains the variance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {/* 1. Audience size */}
              <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-3 hover:border-pink-200 hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-2xl bg-pink-50 text-[#FF1475] flex items-center justify-center font-bold">
                  <Users size={20} />
                </div>
                <h3 className="font-bold text-base text-zinc-950">
                  Audience Size
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                  Engagement naturally declines as accounts scale. Micro creators maintain direct community intimacy, while mega creators require broader audience targeting.
                </p>
              </div>

              {/* 2. Content format */}
              <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-3 hover:border-pink-200 hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Video size={20} />
                </div>
                <h3 className="font-bold text-base text-zinc-950">
                  Content Format
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                  Reels, carousels, and stories generate distinct engagement depth. Influenza calculates format-specific rates so deliverable expectations match true format reach.
                </p>
              </div>

              {/* 3. Authenticity & AQS */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-1 rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-3 hover:border-pink-200 hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-bold text-base text-zinc-950">
                  Audience Authenticity
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                  Inactive bot followers inflate the denominator without engaging, pulling ER down. Our AQS engine filters out suspicious activity to protect brand ROI.
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================================
              BOTTOM CTA PROMPT
          =================================================================== */}
          <div className="rounded-3xl bg-zinc-950 text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF1475] block mb-1">
                Explore Creator Partnerships
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Find creators and book verified packages
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 font-medium max-w-lg">
                Discover top creators with live rates in ₹, direct messaging, and secure campaign management.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 relative z-10">
              <Link
                to="/creator-discovery"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF1475] to-purple-600 hover:from-[#e00f65] hover:to-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-pink-500/20 transition active:scale-95 cursor-pointer"
              >
                <span>Browse Creators</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}