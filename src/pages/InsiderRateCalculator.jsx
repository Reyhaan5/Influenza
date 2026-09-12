import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  Award,
  DollarSign,
  ExternalLink,
  Save,
  Clock,
  Star,
} from "lucide-react";
import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import { API_URL } from "../config/api";

export default function InsiderRateCalculator() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [appliedFeedback, setAppliedFeedback] = useState("");

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/influencer/insider-rate`, authHeader());
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong loading your rate calculation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleApplyToPackages = async () => {
    if (!data?.recommendedRates) return;
    setApplying(true);
    try {
      const recommended = data.recommendedRates;
      const updatedPackages = [
        {
          id: "pkg-reel",
          title: "1x Instagram Reel",
          contentType: "Reel",
          count: 1,
          duration: 30,
          durationUnit: "Seconds",
          price: recommended.reel,
          description: "High-hook vertical UGC reel tailored for brand engagement and reach.",
        },
        {
          id: "pkg-post",
          title: "1x Feed Post / Carousel",
          contentType: "Post",
          count: 1,
          duration: 3,
          durationUnit: "Photos",
          price: recommended.post,
          description: "High-aesthetic staging and carousel images for your grid and ads.",
        },
        {
          id: "pkg-story",
          title: "2x Instagram Story Frames",
          contentType: "Story",
          count: 2,
          duration: 30,
          durationUnit: "Seconds",
          price: recommended.story,
          description: "2x authentic casual story frames with swipe-up link sticker and brand tag.",
        },
        {
          id: "pkg-bundle",
          title: "3x Reels Campaign Bundle",
          contentType: "Reel",
          count: 3,
          duration: 30,
          durationUnit: "Seconds",
          price: recommended.bundleReels3,
          description: "Multi-deliverable content bundle with cohesive hooks and 15% package savings.",
        },
      ];

      await axios.put(
        `${API_URL}/influencer/profile`,
        { packages: updatedPackages },
        authHeader()
      );

      await axios.post(
        `${API_URL}/influencer/rate-cards`,
        {
          packages: updatedPackages,
          rates: {
            reel: recommended.reel,
            post: recommended.post,
            story: recommended.story,
          },
        },
        authHeader()
      );

      setAppliedFeedback("Recommended rates applied to your active pricing packages!");
      setTimeout(() => setAppliedFeedback(""), 4000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update packages.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <InfluencerDashboardLayout>
      <div className="max-w-4xl space-y-8 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-700 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles size={13} className="text-pink-600" />
              Real-Time Valuation Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text)] tracking-tight">
              What You Should Charge
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[var(--color-text-light)] max-w-2xl leading-relaxed">
              Calculated automatically using your connected Instagram audience, category benchmarks, and track record.
            </p>
          </div>

          <Link
            to="/influencer-dashboard"
            className="self-start sm:self-center px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-bold text-[var(--color-text)] hover:bg-[var(--color-background)] transition shadow-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {loading && (
          <div className="p-12 text-center text-sm font-semibold text-[var(--color-text-light)]">
            Analyzing your Instagram profile and calculating fair market rates...
          </div>
        )}

        {error && (
          <div className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 rounded-2xl p-4">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* Connected Instagram Profile Card */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-[var(--shadow-card)] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.79-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-[var(--color-text)]">
                      @{data.handle}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      Connected
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-light)] mt-0.5">
                    {data.followers > 0 ? data.followers.toLocaleString() : "Active"} Followers ·{" "}
                    <strong className="text-gray-900">{data.tier}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://instagram.com/${data.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800 transition shadow-sm"
                >
                  <span>Instagram Profile</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {appliedFeedback && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                <span>{appliedFeedback}</span>
              </div>
            )}

            {/* WHAT YOU SHOULD CHARGE: Core Pricing Grid */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[var(--color-text)] flex items-center gap-2">
                    <DollarSign size={20} className="text-emerald-600" />
                    Recommended Market Rates (What You Should Charge)
                  </h2>
                  <p className="text-xs text-[var(--color-text-light)] mt-1">
                    These rates match current brand budgets for your creator tier, engagement rate, and verified deliverables.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleApplyToPackages}
                  disabled={applying}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-black hover:bg-gray-800 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  <Save size={14} />
                  {applying ? "Applying..." : "Apply to My Pricing Packages"}
                </button>
              </div>

              {/* Deliverable Rate Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Instagram Reel */}
                <div className="p-5 rounded-2xl border border-pink-200 bg-pink-50/30 flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden">
                  <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                    Highest Demand
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900">1x Instagram Reel</h4>
                    <p className="text-xs text-gray-500 mt-0.5">30-60s vertical UGC format</p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-950">
                        ${data.recommendedRates.reel}
                      </span>
                      <span className="text-xs font-bold text-gray-500">/ Reel</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-pink-100 text-[11px] font-semibold text-gray-600 flex justify-between">
                    <span>You keep (85%):</span>
                    <strong className="text-emerald-700">
                      ${Math.round(data.recommendedRates.reel * 0.85)}
                    </strong>
                  </div>
                </div>

                {/* 2. Feed Post / Carousel */}
                <div className="p-5 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between gap-4 shadow-sm">
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900">1x Feed Post / Carousel</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Grid photo staging or carousel</p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-950">
                        ${data.recommendedRates.post}
                      </span>
                      <span className="text-xs font-bold text-gray-500">/ Post</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100 text-[11px] font-semibold text-gray-600 flex justify-between">
                    <span>You keep (85%):</span>
                    <strong className="text-emerald-700">
                      ${Math.round(data.recommendedRates.post * 0.85)}
                    </strong>
                  </div>
                </div>

                {/* 3. Instagram Story */}
                <div className="p-5 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between gap-4 shadow-sm">
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900">2x Story Frames</h4>
                    <p className="text-xs text-gray-500 mt-0.5">24h casual promo with link sticker</p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-950">
                        ${data.recommendedRates.story}
                      </span>
                      <span className="text-xs font-bold text-gray-500">/ Story</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100 text-[11px] font-semibold text-gray-600 flex justify-between">
                    <span>You keep (85%):</span>
                    <strong className="text-emerald-700">
                      ${Math.round(data.recommendedRates.story * 0.85)}
                    </strong>
                  </div>
                </div>

                {/* 4. 3-Reel Campaign Bundle */}
                <div className="p-5 rounded-2xl border border-purple-200 bg-purple-50/30 flex flex-col justify-between gap-4 shadow-sm">
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900">3x Reels Campaign Bundle</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Multi-video campaign with 15% discount</p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-950">
                        ${data.recommendedRates.bundleReels3}
                      </span>
                      <span className="text-xs font-bold text-gray-500">/ Bundle</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-purple-100 text-[11px] font-semibold text-gray-600 flex justify-between">
                    <span>You keep (85%):</span>
                    <strong className="text-emerald-700">
                      ${Math.round(data.recommendedRates.bundleReels3 * 0.85)}
                    </strong>
                  </div>
                </div>

                {/* 5. Monthly Brand Retainer */}
                <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 flex flex-col justify-between gap-4 shadow-sm lg:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">Monthly Brand Retainer</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        4 Reels + 8 Story Frames per month (Continuous brand sponsorship)
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-emerald-800">
                        ${data.recommendedRates.monthlyRetainer}
                      </span>
                      <span className="text-xs font-bold text-gray-500">/ Month</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-emerald-100 text-[11px] font-semibold text-gray-600 flex justify-between">
                    <span>Recurring monthly creator earning:</span>
                    <strong className="text-emerald-700">
                      ${Math.round(data.recommendedRates.monthlyRetainer * 0.85)}/mo
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* PERFORMANCE MULTIPLIER & TRACK RECORD */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-purple-600" />
                  <h3 className="font-extrabold text-base text-[var(--color-text)]">
                    Track Record &amp; Performance Multiplier
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800">
                  {Math.round((data.multiplier - 1) * 100) > 0
                    ? `+${Math.round((data.multiplier - 1) * 100)}% Premium Bonus`
                    : "Standard Market Baseline"}
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Completed Deals
                  </p>
                  <p className="text-xl font-black text-gray-900 mt-1">
                    {data.stats.collaborationsCompleted}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Client Rating
                  </p>
                  <p className="text-xl font-black text-gray-900 mt-1">
                    {data.stats.reviewsCount > 0 ? `${data.stats.rating}★` : "5.0★"}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Response Time
                  </p>
                  <p className="text-xl font-black text-gray-900 mt-1">
                    {data.stats.responseTimeHours}h
                  </p>
                </div>
              </div>

              {data.breakdown && data.breakdown.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold text-gray-700">What's driving your rate bonus:</p>
                  <div className="space-y-1.5">
                    {data.breakdown.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs p-3 rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <span className="font-semibold text-gray-800">{item.label}</span>
                        <span className="font-black text-purple-700">{item.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </InfluencerDashboardLayout>
  );
}