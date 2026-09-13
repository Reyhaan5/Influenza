import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  ReachDoodle,
  ShortFormDoodle,
  StickyNoteDoodle,
  CommissionDoodle,
} from "./HeroDoodles";
import HeroSearchBar from "./HeroSearchBar";
import ArrowFillButton from "../common/ArrowFillButton";

export default function Hero() {
  return (
    <section className="relative z-30 pt-36 pb-28 md:pt-44 md:pb-36 bg-gradient-to-b from-[#FAFBFD] via-[#F8FAFC] to-[#F1F5F9]">
      {/* Subtle radial ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-12 left-1/4 -translate-x-1/2 w-[600px] h-[400px] bg-pink-200/25 blur-[120px] rounded-full" />
        <div className="absolute top-36 right-1/4 translate-x-1/2 w-[500px] h-[350px] bg-purple-200/25 blur-[120px] rounded-full" />
        <div className="absolute top-60 left-1/2 -translate-x-1/2 w-[450px] h-[300px] bg-pink-100/30 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-20">
        
        {/* Top Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-pink-200/80 shadow-xs mb-8 hover:border-pink-300 transition-colors"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF1475] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF1475]"></span>
          </span>
          
        </motion.div>

        {/* Main Headline Container with Handwritten Doodles */}
        <div className="relative max-w-4xl mx-auto">
          {/* Handwritten SVG Doodles */}
          <ReachDoodle />
          <ShortFormDoodle />
          <StickyNoteDoodle />
          <CommissionDoodle />

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-zinc-950 tracking-tight leading-[1.12] sm:leading-[1.15]"
          >
            <span>Hire </span>
            <span className="bg-gradient-to-r from-[#FF1475] via-purple-600 to-[#FF1475] bg-clip-text text-transparent">
              UGC Creators
            </span>
            <span> & </span>
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-600 to-[#FF1475] bg-clip-text text-transparent">
              Influencers
            </span>
            <span> for </span>
            <span className="relative inline-block mt-1 sm:mt-0">
              <span className="absolute -inset-x-2 sm:-inset-x-3 -inset-y-1 bg-gradient-to-r from-pink-100/60 via-purple-50/70 to-pink-100/60 rounded-2xl -rotate-1 -z-10 transform scale-105 border border-pink-200/50" />
              <span className="text-zinc-950 font-black">Your Brand</span>
            </span>
          </motion.h1>
        </div>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-7 max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 leading-relaxed font-normal"
        >
          Find top verified creators to produce authentic UGC videos and high-converting campaigns for your Brand or Agency. Run paid collaborations, product sampling, gifting, and seeding — all in one platform.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
        >
          <ArrowFillButton
            btnText="Discover Creators"
            to="/creator-discovery"
            bgColor="#FF1475"
            fillBgColor="#ffffff"
            fillTextColor="#FF1475"
            size="md"
            className="w-full sm:w-auto shadow-lg shadow-pink-500/25"
          />

          <Link
            to="/signup?role=brand"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95 text-center cursor-pointer"
          >
            <span>Start Hiring</span>
          </Link>

          <Link
            to="/signup?role=influencer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95 text-center cursor-pointer"
          >
            <span>Become a Creator</span>
          </Link>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <HeroSearchBar />
        </motion.div>

      </div>
    </section>
  );
}