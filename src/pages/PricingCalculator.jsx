// src/pages/PricingCalculator.jsx — Modern Influenza Engagement & Pricing Calculator
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Heart,
  MessageCircle,
  TrendingUp,
  Play,
  CheckCircle2,
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
import { calculateInfluRate, formatCompact } from "../utils/influRateCalculator";
import api from "../config/api";

const POPULAR_PROFILES = [
  { name: "Virat Kohli", handle: "virat.kohli" },
  { name: "Tech Burner", handle: "techburner" },
  { name: "Leo Messi", handle: "leomessi" },
  { name: "Will Smith", handle: "willsmith" },
  { name: "Zendaya", handle: "zendaya" },
  { name: "The Rock", handle: "therock" },
];

const FAQS = [
  {
    q: "How does Influenza calculate estimated pricing?",
    a: "Our algorithm blends real-time follower counts, median engagement rates, audience quality score (AQS), and recent Reel performance benchmarks tailored to the Indian and global creator market.",
  },
  {
    q: "Is the profile lookup live and accurate?",
    a: "Yes. When you enter a public handle, Influenza pulls live public Instagram engagement metrics and runs quality audits directly.",
  },
  {
    q: "How should creators use this rate card?",
    a: "Creators can quote these fair-market estimates to brands, ensuring they are not undercharging for high-retention content formats.",
  },
  {
    q: "Can brands use this to negotiate?",
    a: "Absolutely. Brands use our AQS (Audience Quality Score) and InfluRate benchmarks to ensure transparent ROI and fair creator compensation.",
  },
];

export default function PricingCalculator() {
  const [handleInput, setHandleInput] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [profile, setProfile] = useState(null);
  const [searching, setSearching] = useState(false);
  const [errorNotice, setErrorNotice] = useState("");

  const handleSearch = async (targetHandle) => {
    const rawHandle = (targetHandle || handleInput || "").trim().replace(/^@/, "").toLowerCase();
    if (!rawHandle) return;

    setSearching(true);
    setErrorNotice("");

    try {
      const response = await api.get("/public/instagram-lookup", { params: { handle: rawHandle } });
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
        setErrorNotice(data.message || `Could not find Instagram profile for @${rawHandle}.`);
      }
    } catch (err) {
      console.error("Instagram lookup error:", err);
      setErrorNotice(err.response?.data?.message || `Unable to retrieve live data for @${rawHandle}.`);
    } finally {
      setSearching(false);
    }
  };

  const calculated = profile
    ? calculateInfluRate({
        followers: profile.followers,
        avgLikes: profile.avgLikes,
        avgComments: profile.avgComments,
        verified: profile.verified,
        niche: "lifestyle",
      })
    : null;

  const toCurr = (val) => (currency === "USD" ? Math.round(val / 85) : Math.round(val));
  const currSymbol = currency === "USD" ? "$" : "₹";

  const basePrice = calculated?.rateCard.deliverables.reel.price || (profile?.followers ? profile.followers * 0.1 : 0);
  const minVal = toCurr(basePrice * 0.75);
  const maxVal = toCurr(basePrice * 1.35);

  const deliverables = calculated
    ? [
        {
          name: "1x Dedicated Instagram Reel",
          desc: "Full dedicated 30-60s Reel with audio overlay, caption CTA & profile tag",
          price: toCurr(calculated.rateCard.deliverables.reel.price),
          badge: "Most Popular",
          icon: <Video size={18} className="text-[#FF1475]" />,
        },
        {
          name: "1x In-Feed Photo Post / Carousel",
          desc: "High-resolution product showcase photo or carousel with brand tag",
          price: toCurr(calculated.rateCard.deliverables.post.price),
          icon: <Heart size={18} className="text-pink-500" />,
        },
        {
          name: "2x Instagram Stories with Link",
          desc: "2x 24hr sequential Stories with clickable Link sticker & swipe-up CTA",
          price: toCurr(calculated.rateCard.deliverables.story.price),
          icon: <Zap size={18} className="text-amber-500" />,
        },
        {
          name: "Full Campaign Power Bundle",
          desc: "1x Reel + 1x In-Feed Post + 2x Stories (15% integrated bundle savings)",
          price: toCurr(calculated.rateCard.deliverables.bundle.price),
          badge: "Best Value",
          icon: <Award size={18} className="text-purple-600" />,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col font-sans text-zinc-900">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-[#FF1475] text-xs font-bold mb-4">
            <Sparkles size={13} />
            <span>AI InfluRate Engine 2.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
            Instagram Engagement &{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF1475] via-purple-600 to-indigo-600">
              Pricing Calculator
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 max-w-xl mx-auto font-medium">
            Calculate accurate per-post earnings, fair Reel rates, and engagement quality scores instantly.
          </p>

          {/* Search Box */}
          <motion.form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto bg-white border border-zinc-200/90 rounded-2xl sm:rounded-full p-2 pl-5 shadow-lg shadow-zinc-200/50"
          >
            <div className="flex items-center flex-1 w-full px-2">
              <span className="text-zinc-400 font-bold text-base mr-1.5 flex-shrink-0">@</span>
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-[#FF1475] to-purple-600 hover:from-[#e00f65] hover:to-purple-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex-shrink-0 cursor-pointer"
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

          {/* Popular Profiles */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-5">
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
            <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-4 py-2.5 rounded-2xl text-left shadow-xs">
              <AlertCircle size={15} className="flex-shrink-0 text-red-600" />
              <span>{errorNotice}</span>
            </div>
          )}
        </div>

        {/* Dynamic Profile Results */}
        {profile && calculated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Currency Toggle */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Currency:</span>
              <div className="inline-flex rounded-full p-1 bg-white border border-zinc-200/90 text-xs font-bold shadow-xs">
                {["INR", "USD"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                      currency === c ? "bg-zinc-950 text-white shadow-xs" : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    {c === "INR" ? "₹ INR" : "$ USD"}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Profile Card */}
              <div className="col-span-2 sm:col-span-2 lg:col-span-1 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs flex items-center gap-3.5">
                <div className="relative flex-shrink-0">
                  <img
                    src={profile.avatar}
                    alt={profile.handle}
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${profile.handle}`;
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

              {/* Engagement Rate */}
              <div className="col-span-1 rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50/80 via-white to-purple-50/80 p-4 shadow-xs flex flex-col justify-between">
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

              {/* Avg Likes */}
              <div className="col-span-1 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500">Avg Likes</span>
                  <div className="h-6 w-6 rounded-lg bg-pink-50 text-[#FF1475] flex items-center justify-center flex-shrink-0">
                    <Heart size={13} className="fill-[#FF1475]" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black text-zinc-950 tracking-tight">{formatCompact(profile.avgLikes)}</span>
                  <span className="block text-[11px] text-zinc-400 font-medium mt-0.5">per post</span>
                </div>
              </div>

              {/* Avg Comments */}
              <div className="col-span-1 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500">Avg Comments</span>
                  <div className="h-6 w-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={13} className="fill-purple-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black text-zinc-950 tracking-tight">{formatCompact(profile.avgComments)}</span>
                  <span className="block text-[11px] text-zinc-400 font-medium mt-0.5">per post</span>
                </div>
              </div>

              {/* Avg Reel Plays */}
              <div className="col-span-1 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500">Avg Reel Plays</span>
                  <div className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Play size={13} className="fill-blue-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black text-zinc-950 tracking-tight">{formatCompact(profile.avgViews)}</span>
                  <span className="block text-[11px] text-zinc-400 font-medium mt-0.5">per Reel</span>
                </div>
              </div>
            </div>

            {/* Estimated Earnings Spotlight Banner */}
            <div className="rounded-3xl border border-pink-200/80 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-pink-200 block mb-1">
                  Estimated Post Valuation
                </span>
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                  {currSymbol}{minVal.toLocaleString()} — {currSymbol}{maxVal.toLocaleString()}
                </h3>
                <p className="text-xs sm:text-sm text-pink-100 font-medium mt-2 max-w-md">
                  Calculated based on {formatCompact(profile.followers)} followers, {calculated.metrics.engagementRate}% ER, and fair CPM benchmarks.
                </p>
              </div>
              <Link
                to={`/creator-discovery?q=${profile.handle}`}
                className="px-6 py-3 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs shadow-lg transition active:scale-95 flex-shrink-0"
              >
                Find Similar Creators
              </Link>
            </div>

            {/* Deliverable Rate Cards */}
            <div>
              <h2 className="text-lg font-black text-zinc-950 mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-[#FF1475]" />
                <span>Recommended Deliverable Rate Cards</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {deliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-zinc-300 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <h4 className="font-extrabold text-sm text-zinc-950">{item.name}</h4>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-100 text-[#FF1475]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-xs text-zinc-400 font-semibold">Suggested Rate</span>
                      <span className="text-xl font-black text-zinc-950">
                        {currSymbol}{item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* FAQ Accordion Section */}
        <div className="mt-16 border-t border-zinc-200/80 pt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-zinc-950 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs">
                <h4 className="font-bold text-sm text-zinc-900 mb-1.5 flex items-center gap-2">
                  <HelpCircle size={15} className="text-[#FF1475] flex-shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}