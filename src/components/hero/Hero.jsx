import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ReachDoodle,
  ShortFormDoodle,
  StickyNoteDoodle,
  CommissionDoodle,
} from "./HeroDoodles";
import HeroSearchBar from "./HeroSearchBar";

export default function Hero() {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-b from-[#FAFBFD] via-[#F8FAFC] to-[#F1F5F9]">
      {/* Subtle radial ambient glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-pink-200/25 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-[400px] h-[350px] bg-blue-100/30 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-60 left-10 w-[350px] h-[300px] bg-yellow-100/30 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative">
        
        {/* Top Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200/80 shadow-xs mb-8 hover:border-pink-200 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF1475] animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-gray-700 tracking-wide">
            Trusted by 100,000+ brands
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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.12] sm:leading-[1.15]"
          >
            <span>Hire </span>
            <span className="text-[#FF1475]">UGC Creators</span>
            <span>, </span>
            <br className="hidden sm:inline" />
            <span className="text-[#FF1475]">Influencers</span>
            <span> and </span>
            <span className="text-[#FF1475]">TikTok Shop</span>
            <br className="hidden sm:inline" />
            <span className="text-[#FF1475]">Affiliates</span>
            <span> for </span>
            <span className="relative inline-block mt-1 sm:mt-0">
              <span className="absolute -inset-x-2 sm:-inset-x-3 -inset-y-1 bg-[#DCE4FF] rounded-2xl -rotate-1 -z-10 transform scale-105" />
              <span className="text-gray-950 font-black">Your Brand</span>
            </span>
          </motion.h1>
        </div>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-7 max-w-2xl mx-auto text-base sm:text-lg text-gray-600 leading-relaxed font-normal"
        >
          Find top TikTok, Instagram, YouTube, and Amazon content creators to
          produce authentic UGC videos for your Brand or Agency. Run paid
          collaborations, product sampling, gifting, and seeding - all in one
          platform.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/signup?role=influencer"
            className="w-full sm:w-auto px-9 py-3.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-base font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 text-center"
          >
            Become a Creator
          </Link>

          <Link
            to="/signup?role=brand"
            className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-[#FF1475] hover:bg-[#E01065] text-white text-base font-semibold shadow-lg shadow-pink-500/25 transition-all hover:scale-105 active:scale-95 text-center"
          >
            Start Hiring
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