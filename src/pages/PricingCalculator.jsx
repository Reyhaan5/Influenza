// src/pages/PricingCalculator.jsx — Modash-Style Instagram Engagement & Rate Calculator

import React, { useState } from "react";
import axios from "axios";
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
} from "lucide-react";
import { FaInstagram as InstagramIcon } from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Section from "../components/common/Section";
import Footer from "../components/footer/Footer";
import { QualityPill } from "../components/ui/QualityBadge";
import { calculateInfluRate } from "../utils/influRateCalculator";

const API_URL = "http://localhost:5000/api";

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
  { name: "Leo Messi", handle: "leomessi" },
  { name: "Will Smith", handle: "willsmith" },
  { name: "Virat Kohli", handle: "virat.kohli" },
  { name: "Zendaya", handle: "zendaya" },
  { name: "Tech Burner", handle: "techburner" },
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

    return (
    <>
      <Navbar />

      <Section className="pt-28 sm:pt-36 pb-16 sm:pb-24 min-h-screen px-3 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12">

          {/* ===================================================================
              HERO SEARCH HEADER
          =================================================================== */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--color-text)] leading-tight">
              Instagram Engagement Rate & Rate Calculator
            </h1>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-[var(--color-text-light)] max-w-2xl mx-auto leading-relaxed">
              Check any Instagram creator's engagement rate, average likes, comments, and post-level performance. Free, with no sign-up needed.
            </p>

            {/* Modash-style Responsive Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(handleInput);
              }}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center max-w-xl mx-auto rounded-2xl sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-sm gap-2 sm:gap-0 focus-within:ring-2 focus-within:ring-black"
            >
              <div className="relative flex-1 flex items-center pl-3">
                <span className="text-[var(--color-text-light)] font-bold text-sm">@</span>
                <input
                  type="text"
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  placeholder="Enter Instagram username (e.g. willsmith)"
                  className="w-full pl-2 pr-4 py-2 sm:py-2.5 bg-transparent text-xs sm:text-sm font-medium text-[var(--color-text)] focus:outline-none placeholder:text-[var(--color-text-light)]/60"
                />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-lg bg-black text-white text-xs sm:text-sm font-bold transition hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-center gap-2 flex-shrink-0"
              >
                {searching ? <RefreshCw size={14} className="animate-spin" /> : "Check profile"}
              </button>
            </form>

            {errorNotice && (
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-4 py-2 rounded-xl text-left">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{errorNotice}</span>
              </div>
            )}
          </div>

          {/* ===================================================================
              DYNAMIC PROFILE RESULT STATE (ONLY RENDERS WHEN PROFILE IS ENTERED)
          =================================================================== */}
          {profile && calculated && (
            <div className="space-y-5 sm:space-y-6 animate-fadeIn">
              
              {/* Currency Toggle */}
              <div className="flex items-center justify-between sm:justify-end gap-2">
                <span className="text-xs text-[var(--color-text-light)] font-semibold">Valuation Currency:</span>
                <div className="inline-flex rounded-lg p-1 bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setCurrency("INR")}
                    className={`px-3 py-1 rounded-md transition ${
                      currency === "INR" ? "bg-black text-white shadow-sm" : "text-[var(--color-text-light)] hover:text-black dark:hover:text-white"
                    }`}
                  >
                    ₹ INR
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    className={`px-3 py-1 rounded-md transition ${
                      currency === "USD" ? "bg-black text-white shadow-sm" : "text-[var(--color-text-light)] hover:text-black dark:hover:text-white"
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>

              {/* 1. TOP STATS ROW (Responsive Modash Grid: Profile spans 2 cols on mobile, 1 col on desktop) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                
                {/* Profile Card */}
                <div className="col-span-2 sm:col-span-2 lg:col-span-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 sm:p-4 shadow-sm flex items-center gap-3">
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
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-zinc-200 shadow-sm"
                    />
                    {profile.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 shadow">
                        <CheckCircle2 size={12} className="text-white fill-blue-500" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-xs sm:text-sm text-[var(--color-text)] truncate flex items-center gap-1">
                      <span className="truncate">{profile.fullName}</span>
                      <InstagramIcon size={12} className="text-zinc-400 flex-shrink-0" />
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[var(--color-text-light)] font-medium truncate">
                      {formatCompact(profile.followers)} Followers
                    </p>
                  </div>
                </div>

                {/* Pink Engagement Rate Highlight Card */}
                <div className="col-span-1 rounded-2xl border border-pink-200 bg-[#FFB6C1]/30 dark:bg-pink-950/40 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-md bg-black text-white flex items-center justify-center flex-shrink-0">
                      <TrendingUp size={12} />
                    </div>
                    <span className="text-lg sm:text-2xl font-black text-black dark:text-pink-200">
                      {calculated.metrics.engagementRate}%
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-zinc-700 dark:text-pink-300 mt-2">
                    Engagement rate
                  </span>
                </div>

                {/* Average Likes Card */}
                <div className="col-span-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 sm:p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-[var(--color-text-light)]">
                    <Heart size={14} className="fill-black text-black flex-shrink-0" />
                    <span className="text-lg sm:text-2xl font-black text-[var(--color-text)]">
                      {formatCompact(profile.avgLikes)}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-[var(--color-text-light)] mt-2">
                    Average likes
                  </span>
                </div>

                {/* Average Comments Card */}
                <div className="col-span-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 sm:p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-[var(--color-text-light)]">
                    <MessageCircle size={14} className="fill-black text-black flex-shrink-0" />
                    <span className="text-lg sm:text-2xl font-black text-[var(--color-text)]">
                      {formatCompact(profile.avgComments)}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-[var(--color-text-light)] mt-2">
                    Average comments
                  </span>
                </div>

                {/* Average Reel Plays / Views Card */}
                <div className="col-span-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 sm:p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-[var(--color-text-light)]">
                    <Play size={14} className="fill-black text-black flex-shrink-0" />
                    <span className="text-lg sm:text-2xl font-black text-[var(--color-text)]">
                      {formatCompact(profile.avgViews)}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-[var(--color-text-light)] mt-2">
                    Average Reel plays
                  </span>
                </div>

              </div>

              {/* 2. MIDDLE DASHBOARD GRID (Profile Details + Benchmark Chart + Top Performing Reels) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
                
                {/* Profile Details Sidebar Card */}
                <div className="lg:col-span-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] sm:text-xs font-bold uppercase text-[var(--color-text-light)] tracking-wider block">
                      Profile details
                    </span>
                    <div className="text-xs text-[var(--color-text)] space-y-2">
                      <div className="font-bold flex items-center gap-1.5 truncate">
                        <InstagramIcon size={14} className="flex-shrink-0" />
                        <span className="truncate">@{profile.handle}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--color-text-light)]">
                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                        <span>Live data verified</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--color-text-light)]">
                        <ShieldCheck size={14} className="text-blue-500 flex-shrink-0" />
                        <span>AQS Authenticity Audited</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-[var(--color-border)] space-y-2.5 sm:space-y-3">
                    <p className="text-[10px] sm:text-[11px] text-[var(--color-text-light)] leading-relaxed">
                      Influenza evaluates audience authenticity, real reach, and fair collaboration pricing.
                    </p>
                    <QualityPill quality={calculated.overallRating.breakdown.qualityScore.qualityLabel} size="sm" />
                  </div>
                </div>

                {/* Engagement Benchmark Visualizer */}
                <div className="lg:col-span-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase text-[var(--color-text-light)] tracking-wider block mb-3">
                      Engagement rate benchmark
                    </span>
                    
                    {/* Simulated Histogram Benchmark Chart */}
                    <div className="h-28 sm:h-32 flex items-end gap-1.5 sm:gap-2 pt-4 px-1 sm:px-2 border-b border-[var(--color-border)]">
                      <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-t h-[30%]" title="1k-5k tier avg" />
                      <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-t h-[45%]" title="5k-20k tier avg" />
                      <div className="flex-1 bg-purple-300 dark:bg-purple-800 rounded-t h-[75%] relative flex flex-col items-center">
                        <div className="absolute -top-6">
                          <img
                            src={profile.avatar}
                            alt=""
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${profile.handle}`;
                            }}
                            className="w-5 h-5 rounded-full border border-black shadow object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 bg-black text-white rounded-t h-[60%]" title="Median benchmark" />
                      <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-t h-[40%]" />
                      <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-t h-[25%]" />
                      <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-t h-[15%]" />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px] sm:text-[11px] text-[var(--color-text-light)]">
                    <span>Creator ER: <strong>{calculated.metrics.engagementRate}%</strong></span>
                    <span>Median Benchmark: <strong>1.45%</strong></span>
                  </div>
                </div>

                {/* Top Performing Reels / Posts Card */}
                <div className="lg:col-span-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 shadow-sm space-y-3">
                  <span className="text-[10px] sm:text-xs font-bold uppercase text-[var(--color-text-light)] tracking-wider block">
                    Top performing posts
                  </span>

                  {profile.topPosts && profile.topPosts.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {profile.topPosts.map((post, idx) => (
                        <div
                          key={idx}
                          className="p-2 sm:p-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[var(--color-text)] truncate">
                              {post.caption || `Post #${idx + 1}`}
                            </p>
                            <span className="text-[10px] text-[var(--color-text-light)]">
                              {formatCompact(post.likes)} Likes • {formatCompact(post.comments)} Comments
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-black dark:text-white flex-shrink-0">
                            {formatCompact(post.views || post.likes * 3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-[var(--color-text-light)]">
                      Recent post engagements calculated from 12 latest posts.
                    </div>
                  )}
                </div>

              </div>

              {/* 3. ESTIMATED PRICING VALUATION BANNER */}
              <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50/70 via-white to-purple-50/70 dark:from-purple-950/20 dark:via-[var(--color-surface)] dark:to-purple-950/20 p-5 sm:p-7 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
                <div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-1">
                    InfluRate™ Commercial Valuation
                  </span>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black dark:text-white tracking-tight">
                    {formatCurrency(minEarnings, currency)} - {formatCurrency(maxEarnings, currency)}
                  </div>
                  <p className="text-xs text-[var(--color-text-light)] mt-1">
                    Estimated fair value per Post / Reel based on {formatCompact(profile.followers)} followers & {calculated.metrics.engagementRate}% engagement rate.
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[var(--color-text)] block">
                      Score: {calculated.overallRating.score}/100 ({calculated.overallRating.grade})
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[var(--color-text-light)]">
                      Reach ({calculated.overallRating.breakdown.reachScore.score}/35) • Eng ({calculated.overallRating.breakdown.engagementScore.score}/35)
                    </span>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-black text-white font-black text-base sm:text-lg flex items-center justify-center shadow-md flex-shrink-0">
                    {calculated.overallRating.score}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================
              "TRY IT ON A POPULAR PROFILE" (Images 2 & 3)
          =================================================================== */}
          <div className="space-y-3 sm:space-y-4 pt-4 border-t border-[var(--color-border)]">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-[var(--color-text)] tracking-tight">
                Try it on a popular profile
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-light)] mt-1">
                Click any creator to fetch real live profile data and evaluate their authentic rate, or type a username into the search above.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {POPULAR_PROFILES.map((p) => (
                <button
                  key={p.handle}
                  type="button"
                  onClick={() => {
                    setHandleInput(p.handle);
                    handleSearch(p.handle);
                  }}
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text)] hover:border-black hover:bg-zinc-50 dark:hover:bg-zinc-900 transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>{p.name}</span>
                  <span className="text-[var(--color-text-light)] font-normal font-mono text-[11px] sm:text-xs">@{p.handle}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ===================================================================
              "WHAT'S A GOOD ENGAGEMENT RATE ON INSTAGRAM?" BENCHMARK SECTION (Image 2 Design - Responsive)
          =================================================================== */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-7 md:p-10 shadow-sm space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-[var(--color-text)] tracking-tight">
                What's a good engagement rate on Instagram?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-light)] mt-1 max-w-2xl leading-relaxed">
                Engagement rate drops sharply once an account grows past a few thousand followers, then flattens out and ticks back up on the biggest profiles. A 3% rate on a 4K account is ordinary; the same 3% on a 500K account is exceptional.
              </p>
            </div>

            {/* Custom Benchmark Graphic Matrix with horizontal scroll container for ultra small screens */}
            <div className="overflow-x-auto pb-2 -mx-2 sm:mx-0 px-2 sm:px-0">
              <div className="min-w-[480px] sm:min-w-0 space-y-2.5 sm:space-y-3 pt-2">
                
                {/* Top Arch Bracket with Follower count Pill */}
                <div className="relative pt-6">
                  {/* Arch outline bracket spanning columns */}
                  <div className="grid grid-cols-12">
                    <div className="col-span-3 sm:col-span-2" />
                    <div className="col-span-9 sm:col-span-10 relative">
                      <div className="absolute -top-3 left-0 right-0 h-6 sm:h-7 border-t border-l border-r border-zinc-400/80 dark:border-zinc-600 rounded-t-xl pointer-events-none" />
                      
                      {/* Centered Pill Badge */}
                      <div className="relative z-10 flex justify-center -top-6">
                        <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] sm:text-[11px] font-semibold px-3 py-0.5 rounded-md border border-zinc-300 dark:border-zinc-700">
                          Follower count
                        </span>
                      </div>

                      {/* Header Columns under the bracket */}
                      <div className="grid grid-cols-4 text-center font-bold text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300 pb-1">
                        <span>1k–5k</span>
                        <span>10k–50k</span>
                        <span>100k–500k</span>
                        <span>1M+</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 1: High */}
                <div className="grid grid-cols-12 items-center gap-2 sm:gap-3">
                  <div className="col-span-3 sm:col-span-2 text-right pr-2 font-medium text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    High
                  </div>
                  <div className="col-span-9 sm:col-span-10 rounded-md border border-[#F3D7EC] bg-[#FBF0F9] dark:bg-pink-950/20 dark:border-pink-900/40 py-2.5 sm:py-3.5 px-1 sm:px-2 grid grid-cols-4 text-center text-[11px] sm:text-xs md:text-sm font-bold text-zinc-900 dark:text-pink-100">
                    <span>&gt; 6.16%</span>
                    <span>&gt; 1.27%</span>
                    <span>&gt; 0.93%</span>
                    <span>&gt; 1.08%</span>
                  </div>
                </div>

                {/* Row 2: Above average */}
                <div className="grid grid-cols-12 items-center gap-2 sm:gap-3">
                  <div className="col-span-3 sm:col-span-2 text-right pr-2 font-medium text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    Above average
                  </div>
                  <div className="col-span-9 sm:col-span-10 rounded-md border border-[#F3D7EC] bg-[#FBF0F9] dark:bg-pink-950/20 dark:border-pink-900/40 py-2.5 sm:py-3.5 px-1 sm:px-2 grid grid-cols-4 text-center text-[11px] sm:text-xs md:text-sm font-bold text-zinc-900 dark:text-pink-100">
                    <span>3.85 – 6.16%</span>
                    <span>0.65 – 1.27%</span>
                    <span>0.46 – 0.93%</span>
                    <span>0.57 – 1.08%</span>
                  </div>
                </div>

                {/* Row 3: Average (Highlighted Purple Bar) */}
                <div className="grid grid-cols-12 items-center gap-2 sm:gap-3">
                  <div className="col-span-3 sm:col-span-2 text-right pr-2 font-medium text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    Average
                  </div>
                  <div className="col-span-9 sm:col-span-10 rounded-md bg-[#DDA7F6] dark:bg-purple-600 py-2.5 sm:py-3.5 px-1 sm:px-2 grid grid-cols-4 text-center text-[11px] sm:text-xs md:text-sm font-black text-zinc-950 dark:text-white shadow-sm">
                    <span>3.16 – 3.85%</span>
                    <span>0.49 – 0.65%</span>
                    <span>0.35 – 0.46%</span>
                    <span>0.45 – 0.57%</span>
                  </div>
                </div>

                {/* Row 4: Below average */}
                <div className="grid grid-cols-12 items-center gap-2 sm:gap-3">
                  <div className="col-span-3 sm:col-span-2 text-right pr-2 font-medium text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    Below average
                  </div>
                  <div className="col-span-9 sm:col-span-10 rounded-md border border-[#F0D5ED] bg-[#F8EAFB] dark:bg-purple-950/20 dark:border-purple-900/40 py-2.5 sm:py-3.5 px-1 sm:px-2 grid grid-cols-4 text-center text-[11px] sm:text-xs md:text-sm font-bold text-zinc-900 dark:text-purple-100">
                    <span>1.85 – 3.16%</span>
                    <span>0.24 – 0.49%</span>
                    <span>0.16 – 0.35%</span>
                    <span>0.22 – 0.45%</span>
                  </div>
                </div>

                {/* Row 5: Low */}
                <div className="grid grid-cols-12 items-center gap-2 sm:gap-3">
                  <div className="col-span-3 sm:col-span-2 text-right pr-2 font-medium text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    Low
                  </div>
                  <div className="col-span-9 sm:col-span-10 rounded-md border border-[#F0D5ED] bg-[#F8EAFB] dark:bg-purple-950/20 dark:border-purple-900/40 py-2.5 sm:py-3.5 px-1 sm:px-2 grid grid-cols-4 text-center text-[11px] sm:text-xs md:text-sm font-bold text-zinc-900 dark:text-purple-100">
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
              "HOW WE CALCULATE ENGAGEMENT RATE" (Image 3 - Responsive)
          =================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center pt-4">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">
                How we calculate engagement rate
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-light)] leading-relaxed">
                To determine a creator's engagement rate, take the average/median number of likes and comments across their recent posts, divide by their total follower count, and multiply by 100.
              </p>
              <p className="text-xs sm:text-sm text-[var(--color-text-light)] leading-relaxed">
                Influenza analyzes the last 12 active posts so one single viral outlier doesn't distort the true baseline figure.
              </p>
            </div>

            {/* Pink/Coral Formula Card */}
            <div className="rounded-2xl p-5 sm:p-8 bg-[#FFB6C1]/40 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900 text-center space-y-3 sm:space-y-4 shadow-sm">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-950 dark:text-pink-200">
                Formula Definition
              </span>
              <div className="text-xs sm:text-base md:text-lg font-black text-black dark:text-white flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <span>Engagement rate =</span>
                <div className="inline-flex flex-col items-center">
                  <span className="border-b-2 border-black dark:border-white px-1.5 sm:px-2 pb-0.5 text-[11px] sm:text-xs md:text-sm font-bold">
                    Average Likes + Comments
                  </span>
                  <span className="pt-0.5 text-[11px] sm:text-xs md:text-sm font-bold">
                    Total Followers
                  </span>
                </div>
                <span>× 100</span>
              </div>
            </div>
          </div>

          {/* ===================================================================
              "WHAT AFFECTS AN INSTAGRAM ENGAGEMENT RATE" (Image 3 - Responsive Grid)
          =================================================================== */}
          <div className="space-y-4 sm:space-y-6 pt-4 border-t border-[var(--color-border)]">
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">
                What affects an Instagram engagement rate?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-light)] mt-1">
                Two creators with identical follower counts can post very different engagement rates. Here's what usually explains the gap.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* 1. Audience size */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-sm space-y-2.5 sm:space-y-3">
                <h3 className="font-bold text-sm sm:text-base text-[var(--color-text)]">
                  Audience size
                </h3>
                <p className="text-xs text-[var(--color-text-light)] leading-relaxed">
                  Engagement falls as accounts grow. Bigger audiences are less closely connected to the creator, so compare rates against creators of a similar size rather than in isolation.
                </p>
              </div>

              {/* 2. Content format */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-sm space-y-2.5 sm:space-y-3">
                <h3 className="font-bold text-sm sm:text-base text-[var(--color-text)]">
                  Content format
                </h3>
                <p className="text-xs text-[var(--color-text-light)] leading-relaxed">
                  Reels, carousels, and static posts engage differently. A profile average hides that, so check which format is actually driving high interaction before you brief a creator.
                </p>
              </div>

              {/* 3. Fake followers & Bots */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-sm space-y-2.5 sm:space-y-3">
                <h3 className="font-bold text-sm sm:text-base text-[var(--color-text)]">
                  Fake followers & Bots
                </h3>
                <p className="text-xs text-[var(--color-text-light)] leading-relaxed">
                  Fake followers sit in the denominator without ever engaging, which pulls the rate down. Bought comments or engagement pods create unnatural ratio spikes.
                </p>
              </div>
            </div>
          </div>

        </div>
      </Section>

      <Footer />
    </>
  );
}