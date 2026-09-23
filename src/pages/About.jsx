import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Users, Target, ShieldCheck, ArrowRight, Zap, Award, Globe } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/footer/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 sm:py-24">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-900 mb-6">
            <Sparkles size={14} className="text-[#FF1475]" />
            <span>About Influenza</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 leading-tight">
            Connecting Brands & Creators with Transparency
          </h1>

          <p className="mt-5 text-base sm:text-lg text-zinc-600 leading-relaxed font-medium">
            Influenza is the modern collaboration infrastructure built for brands and creators.
            We eliminate middleman friction, bring rate transparency in Indian Rupees (₹), and deliver direct workflow tools from discovery to project completion.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl border border-zinc-200/90 bg-zinc-50/50 flex flex-col gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-bold">
              <Target size={22} />
            </div>
            <h3 className="text-lg font-black text-zinc-950">Data-Driven Discovery</h3>
            <p className="text-sm text-zinc-600 leading-relaxed font-medium">
              Filter creators across 100+ categories, engagement metrics, platforms, and locations to find authentic brand fits in seconds.
            </p>
          </div>

          <div className="p-7 rounded-3xl border border-zinc-200/90 bg-zinc-50/50 flex flex-col gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-bold">
              <Zap size={22} />
            </div>
            <h3 className="text-lg font-black text-zinc-950">Fair Rate Intelligence</h3>
            <p className="text-sm text-zinc-600 leading-relaxed font-medium">
              Real-time pricing algorithms calculate fair market deliverable rates tailored for Indian creators, preventing underpricing and budget surprises.
            </p>
          </div>

          <div className="p-7 rounded-3xl border border-zinc-200/90 bg-zinc-50/50 flex flex-col gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-bold">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-lg font-black text-zinc-950">Direct Collaboration</h3>
            <p className="text-sm text-zinc-600 leading-relaxed font-medium">
              Built-in messaging, collaboration requests, rate cards, and delivery tracking keep both parties aligned with complete accountability.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-zinc-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-2xl font-black text-white">Ready to elevate your partnerships?</h3>
            <p className="text-sm text-zinc-400 mt-1">Join thousands of creators and brands collaborating on Influenza.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/creator-discovery"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <span>Explore Creators</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}