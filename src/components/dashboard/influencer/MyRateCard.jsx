import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { DollarSign, TrendingUp, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Layers } from "lucide-react";
import Avatar from "./Avatar";
import { API_URL } from "../../../config/api";

function StatTile({ label, value, note }) {
  return (
    <div className="flex-1 min-w-[7rem] rounded-2xl bg-zinc-50 border border-zinc-200 px-4 py-3.5 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-black text-zinc-950">
        {value ? `₹${Number(value).toLocaleString("en-IN")}` : "—"}
      </p>
      {note && (
        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">{note}</p>
      )}
    </div>
  );
}

export default function MyRateCard({ profile }) {
  const [rateData, setRateData] = useState(null);
  const [loading, setLoading] = useState(true);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchRateData = async () => {
    try {
      const res = await axios.get(`${API_URL}/influencer/insider-rate`, authHeader());
      setRateData(res.data);
    } catch (err) {
      console.error("Couldn't load insider rate card:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRateData();
  }, []);

  const instagramAccount =
    profile?.socialAccounts?.find((s) => s.platform?.toLowerCase() === "instagram" && s.handle?.trim()) || null;

  const cleanHandle = (instagramAccount?.handle || rateData?.handle || "creator")
    .replace(/^@+/, "")
    .trim();

  const followersCount =
    instagramAccount?.followers ||
    rateData?.followers ||
    0;

  const rates = rateData?.recommendedRates || {
    post: profile?.packages?.find((p) => p.contentType === "Post")?.price || 5600,
    reel: profile?.packages?.find((p) => p.contentType === "Reel")?.price || 7500,
    story: profile?.packages?.find((p) => p.contentType === "Story")?.price || 3000,
    bundleReels3: 19000,
    monthlyRetainer: 44000,
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
      {/* Header: Connected Handle & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Avatar name={cleanHandle} size={48} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-zinc-950">
                @{cleanHandle}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                Connected
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {followersCount > 0 ? followersCount.toLocaleString() : "Active"} Followers ·{" "}
              <strong className="text-zinc-950">{rateData?.tier || "Creator Tier"}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {rateData?.multiplier && rateData.multiplier > 1 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900">
              <TrendingUp size={13} />
              +{Math.round((rateData.multiplier - 1) * 100)}% Track Record Bonus
            </span>
          )}
          <Link
            to="/rate-benchmark"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <span>Open Rate Benchmark</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Deliverable Stat Tiles */}
      <div className="pt-1">
        <div className="flex flex-wrap gap-3">
          <StatTile
            label="Feed Post"
            value={rates.post}
          />
          <StatTile
            label="Instagram Reel"
            value={rates.reel}
          />
          <StatTile
            label="Story (2 Frames)"
            value={rates.story}
          />
          <StatTile
            label="3x Reels Bundle"
            value={rates.bundleReels3}
          />
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between text-xs text-zinc-500 gap-2">
        <span>
          Market benchmark rates computed directly from your connected <strong>@{cleanHandle}</strong> audience metrics.
        </span>
        <Link
          to="/rate-benchmark"
          className="font-bold text-zinc-950 hover:underline"
        >
          Manage &amp; Apply Rates →
        </Link>
      </div>
    </div>
  );
}