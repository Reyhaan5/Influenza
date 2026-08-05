import React, { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCcw, Clock } from "lucide-react";
import Avatar from "./Avatar";
import ReceiptPrinter from "../../pricing/ReceiptPrinter";

const API_URL = "http://localhost:5000/api";

function StatTile({ label, value, symbol }) {
  return (
    <div className="flex-1 min-w-[6rem] rounded-xl bg-[var(--color-background)] px-4 py-3 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-light)]">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-[var(--color-text)]">
        {symbol}
        {value?.toLocaleString?.() ?? "—"}
      </p>
    </div>
  );
}

function timeAgo(dateStr) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export default function MyRateCard({ profile }) {
  const [latestCard, setLatestCard] = useState(null);
  const [loadingCard, setLoadingCard] = useState(true);
  const [showEditor, setShowEditor] = useState(false);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchLatestCard = async () => {
    try {
      const res = await axios.get(`${API_URL}/influencer/rate-cards`, authHeader());
      setLatestCard(res.data?.[0] || null);
    } catch (err) {
      console.error("Couldn't load rate card history:", err);
    } finally {
      setLoadingCard(false);
    }
  };

  useEffect(() => {
    fetchLatestCard();
  }, []);

  const primaryAccount = profile.socialAccounts?.[0];
  const symbol = latestCard?.marketId === "global" ? "$" : "₹";

  const initialAnswers = primaryAccount
    ? {
        handle: primaryAccount.handle,
        followers: String(primaryAccount.followers),
        avgLikes: "",
        avgComments: "",
        nicheId: "",
        marketId: "",
      }
    : undefined;

  const handleComplete = async (finalAnswers) => {
    try {
      await axios.post(`${API_URL}/influencer/rate-cards`, finalAnswers, authHeader());
      await fetchLatestCard();
      setShowEditor(false);
    } catch (err) {
      console.error("Couldn't save rate card:", err);
    }
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={(profile.handle || "?").replace("@", "")} size={48} />
          <div>
            <p className="font-bold text-[var(--color-text)]">
              {profile.handle}
            </p>
            <p className="text-xs text-[var(--color-text-light)]">Rate card</p>
          </div>
        </div>

        {latestCard && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-light)]">
            <Clock size={13} />
            Updated {timeAgo(latestCard.createdAt)}
          </span>
        )}
      </div>

      {/* Stat row / empty state */}
      <div className="mt-5">
        {loadingCard ? (
          <p className="text-sm text-[var(--color-text-light)]">Loading your rate card...</p>
        ) : latestCard ? (
          <div className="flex gap-3">
            <StatTile label="Post" value={latestCard.rates?.post} symbol={symbol} />
            <StatTile label="Reel" value={latestCard.rates?.reel} symbol={symbol} />
            <StatTile label="Story" value={latestCard.rates?.story} symbol={symbol} />
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-light)]">
            You haven't printed a rate card yet. Fill in your numbers below to get one.
          </p>
        )}
      </div>

      {/* Toggle editor */}
      {latestCard && !showEditor && (
        <button
          onClick={() => setShowEditor(true)}
          className="mt-5 flex items-center gap-1.5 text-sm font-bold text-[var(--color-primary-hover)] hover:underline"
        >
          <RefreshCcw size={14} />
          Reprint with new numbers
        </button>
      )}

      {(showEditor || !latestCard) && !loadingCard && (
        <div className="mt-6">
          <ReceiptPrinter initialAnswers={initialAnswers} onComplete={handleComplete} />
        </div>
      )}
    </div>
  );
}