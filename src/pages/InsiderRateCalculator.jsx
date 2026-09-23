import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Layers,
  Save,
  Info,
  Flame,
  Star,
  ShieldCheck,
  Building2,
  Video,
  Image as ImageIcon,
  Clock,
} from "lucide-react";
import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import Avatar from "../components/dashboard/influencer/Avatar";
import { API_URL } from "../config/api";

export default function InsiderRateCalculator() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [lastRefreshed, setLastRefreshed] = useState(null);

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
      setError("");
      const res = await axios.get(`${API_URL}/influencer/insider-rate`, authHeader());
      setData(res.data);
      setLastRefreshed(new Date());
    } catch (err) {
      setError(err.response?.data?.message || "Unable to compute market rate benchmark.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleRefreshStats = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setFeedback({ type: "", message: "" });
    try {
      const res = await axios.post(`${API_URL}/influencer/refresh-instagram-stats`, {}, authHeader());
      setData(res.data);
      setLastRefreshed(new Date());
      setFeedback({
        type: "success",
        message: "Live Instagram metrics and market rate benchmark successfully updated!",
      });
      setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Failed to refresh live Instagram stats.",
      });
      setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
    } finally {
      setRefreshing(false);
    }
  };

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
          description: "High-hook vertical UGC reel tailored for brand engagement and organic reach.",
        },
        {
          id: "pkg-post",
          title: "1x Feed Post / Carousel",
          contentType: "Post",
          count: 1,
          duration: 3,
          durationUnit: "Photos",
          price: recommended.post,
          description: "High-aesthetic staging and carousel product visuals for your feed.",
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
          description: "Multi-deliverable content bundle with cohesive hooks across 3 reels.",
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

      setFeedback({
        type: "success",
        message: "Market benchmark rates applied to your public profile packages successfully!",
      });
      setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
    } catch (err) {
      console.error(err);
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Failed to apply packages.",
      });
    } finally {
      setApplying(false);
    }
  };

  const rates = data?.recommendedRates || {
    post: 100,
    reel: 200,
    story: 100,
    bundleReels3: 500,
  };

  const cleanHandle = (data?.handle || "creator").replace(/^@+/, "").trim();

  return (
    <InfluencerDashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Market Rate Benchmark
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Live commercial pricing benchmark computed directly from your connected Instagram metrics, category demand, and deal track record.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefreshStats}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin text-purple-600" : "text-gray-500"} />
              <span>{refreshing ? "Syncing..." : "Sync Analytics"}</span>
            </button>

            <button
              type="button"
              onClick={handleApplyToPackages}
              disabled={applying || loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save size={13} />
              <span>{applying ? "Applying..." : "Apply Rates to Packages"}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback.message && (
          <div
            className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 shadow-xs ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-red-50 border-red-200 text-red-900"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === "success" ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <Info size={16} className="text-red-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback({ type: "", message: "" })}
              className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {loading ? (
          <div className="p-16 text-center rounded-2xl bg-white border border-gray-200">
            <div className="w-8 h-8 mx-auto mb-3 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
            <p className="text-xs font-bold text-gray-900">Computing market rate benchmark...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs">
            <p className="font-bold">Unable to compute rate benchmark</p>
            <p className="mt-1">{error}</p>
          </div>
        ) : (
          <>
            {/* Connected Account & Profile Intelligence Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <Avatar name={cleanHandle} size={48} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-base text-gray-900">
                        @{cleanHandle}
                      </h2>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 size={11} />
                        Connected Profile
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Last synced: {lastRefreshed ? lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recently"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://instagram.com/${cleanHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition"
                  >
                    <span>View on Instagram</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* 4 Stat Tiles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
                <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/80">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Followers
                  </p>
                  <p className="text-lg font-extrabold text-gray-900 mt-0.5">
                    {data.followers > 0 ? Number(data.followers).toLocaleString("en-IN") : "0"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/80">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Creator Tier
                  </p>
                  <p className="text-lg font-extrabold text-gray-900 mt-0.5">
                    {data.tier || "Nano Creator"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/80">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Category
                  </p>
                  <p className="text-lg font-extrabold text-gray-900 truncate mt-0.5">
                    {data.categories?.[0] || "General UGC"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/80">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Track Record Bonus
                  </p>
                  <p className="text-lg font-extrabold text-emerald-700 mt-0.5">
                    {Math.round((data.multiplier - 1) * 100) > 0
                      ? `+${Math.round((data.multiplier - 1) * 100)}%`
                      : "Baseline (1.0x)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Deliverables Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight">
                  Recommended Market Deliverables
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Suggested baseline pricing for single and bundled commercial deliverables.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Feed Post */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 transition">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Feed Post
                      </span>
                      <ImageIcon size={14} className="text-gray-400" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 mt-1">1x Feed Post</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      High-aesthetic staged photo or carousel on your feed with brand tags.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
                      ₹{rates.post.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Recommended single rate</p>
                  </div>
                </div>

                {/* 2. Instagram Reel */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 transition">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                        Top Demand
                      </span>
                      <Video size={14} className="text-purple-600" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 mt-1">1x Instagram Reel</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Vertical 30-60s UGC video with hook, demo, and brand call-to-action.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
                      ₹{rates.reel.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Recommended single rate</p>
                  </div>
                </div>

                {/* 3. Story */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 transition">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Story Frames
                      </span>
                      <Clock size={14} className="text-gray-400" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 mt-1">2x Story Frames</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Casual stories with swipe-up sticker and direct tag for conversions.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
                      ₹{rates.story.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Recommended 2 frames</p>
                  </div>
                </div>

                {/* 4. Bundle */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 transition">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                        Package Deal
                      </span>
                      <Layers size={14} className="text-pink-600" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 mt-1">3x Reels Bundle</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Campaign bundle with cohesive narrative across 3 vertical video assets.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
                      ₹{rates.bundleReels3.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Bundle package</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Methodology & Calculation Transparency Card */}
            <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-5 shadow-xs text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <ShieldCheck size={16} className="text-gray-700" />
                <span>Transparent Market Benchmark Methodology</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Rates scale continuously based on active followers, engagement, and verified collaboration completion. All displayed pricing represents direct creator compensation with zero assumed platform deductions.
              </p>
            </div>
          </>
        )}
      </div>
    </InfluencerDashboardLayout>
  );
}