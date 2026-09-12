import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { DollarSign, TrendingUp, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Layers } from "lucide-react";
import Avatar from "./Avatar";
import { API_URL } from "../../../config/api";

function StatTile({ label, value, note }) {
  return (
    <div className="flex-1 min-w-[7rem] rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-3.5 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-light)]">
        {label}
      </p>
      <p className="mt-1 text-xl font-black text-[var(--color-text)]">
        ${value?.toLocaleString?.() ?? "—"}
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
    profile?.socialAccounts?.find((s) => s.platform?.toLowerCase() === "instagram") ||
    (profile?.handle
      ? {
          handle: profile.handle,
          followers: profile.followers || profile.stats?.followers || 0,
        }
      : null);

  const cleanHandle = (instagramAccount?.handle || rateData?.handle || profile?.handle || "creator")
    .replace(/^@+/, "")
    .trim();

  const followersCount =
    instagramAccount?.followers ||
    rateData?.followers ||
    profile?.followers ||
    0;

  const rates = rateData?.recommendedRates || {
    post: profile?.packages?.find((p) => p.contentType === "Post")?.price || 50,
    reel: profile?.packages?.find((p) => p.contentType === "Reel")?.price || 65,
    story: profile?.packages?.find((p) => p.contentType === "Story")?.price || 35,
    bundleReels3: 165,
    monthlyRetainer: 480,
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-6">
      {/* Header: Connected Handle & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Avatar name={cleanHandle} size={48} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-[var(--color-text)]">
                @{cleanHandle}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                Connected
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-light)] mt-0.5">
              {followersCount > 0 ? followersCount.toLocaleString() : "Active"} Followers ·{" "}
              <strong className="text-gray-900">{rateData?.tier || "Creator Tier"}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {rateData?.multiplier && rateData.multiplier > 1 && (
            <span className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800">
              <TrendingUp size={13} />
              +{Math.round((rateData.multiplier - 1) * 100)}% Track Record Bonus
            </span>
          )}
          <Link
            to="/insider-rate"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold transition shadow-sm"
          >
            <span>Full Valuation Breakdown</span>
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
            note={`Keep $${Math.round(rates.post * 0.85)}`}
          />
          <StatTile
            label="Instagram Reel"
            value={rates.reel}
            note={`Keep $${Math.round(rates.reel * 0.85)}`}
          />
          <StatTile
            label="Story (2 Frames)"
            value={rates.story}
            note={`Keep $${Math.round(rates.story * 0.85)}`}
          />
          <StatTile
            label="3x Reels Bundle"
            value={rates.bundleReels3}
            note={`Keep $${Math.round(rates.bundleReels3 * 0.85)}`}
          />
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between text-xs text-[var(--color-text-light)] gap-2">
        <span>
          Recommended commercial rates generated directly from your <strong>@{cleanHandle}</strong> Instagram analytics.
        </span>
        <Link
          to="/insider-rate"
          className="font-bold text-[var(--color-primary-hover)] hover:underline"
        >
          Manage &amp; Apply Rates →
        </Link>
      </div>
    </div>
  );
}