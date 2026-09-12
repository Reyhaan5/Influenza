import React, { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCcw, Clock } from "lucide-react";
import Avatar from "./Avatar";
import ReceiptPrinter from "../../pricing/ReceiptPrinter";
import GlowingSearchBar from "../../common/GlowingSearchBar";
import InfluRateCard from "./InfluRateCard";

import { API_URL } from "../../../config/api";

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

  // Instagram lookup state — the ONLY source of handle/followers/avgLikes/
  // avgComments now. No "connect your account" step required.
  const [prefill, setPrefill] = useState(undefined);
  const [searching, setSearching] = useState(false);
  const [notice, setNotice] = useState("");
  const [printerKey, setPrinterKey] = useState(0);

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

  const symbol = latestCard?.marketId === "global" ? "$" : "₹";

  // The header always reflects whatever handle was last searched,
  // falling back to the account's own handle if nothing's been searched yet.
  const displayHandle = prefill?.handle || profile.handle;

  const handleSearch = async (query) => {
    const handle = query.trim();
    if (!handle) return;

    setSearching(true);
    setNotice("");

    try {
      const res = await axios.get(`${API_URL}/public/instagram-lookup`, {
        params: { handle },
      });
      const data = res.data;

      if (data.found) {
        setPrefill({
          handle: data.handle,
          followers: String(data.followers),
          avgLikes: String(data.avgLikes),
          avgComments: String(data.avgComments),
        });
        setNotice(`Pulled live stats for ${data.handle}.`);
      } else {
        const formattedHandle = handle.startsWith("@") ? handle : `@${handle}`;
        setPrefill({ handle: formattedHandle });
        setNotice("Couldn't fetch this Instagram account. You can enter the remaining details manually.");
      }
    } catch (err) {
      console.error("Instagram lookup error:", err);
      const formattedHandle = handle.startsWith("@") ? handle : `@${handle}`;
      setPrefill({ handle: formattedHandle });
      setNotice("Instagram lookup failed. You can enter your stats manually.");
    } finally {
      setSearching(false);
      // Remount ReceiptPrinter so it recomputes which step to start on
      // now that handle/followers/avgLikes/avgComments are filled in.
      setPrinterKey((k) => k + 1);
    }
  };

  const handleComplete = async (finalAnswers) => {
    try {
      await axios.post(`${API_URL}/influencer/rate-cards`, finalAnswers, authHeader());
      await fetchLatestCard();
      setShowEditor(false);
      setPrefill(undefined);
      setNotice("");
    } catch (err) {
      console.error("Couldn't save rate card:", err);
    }
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={(displayHandle || "?").replace("@", "")} size={48} />
          <div>
            <p className="font-bold text-[var(--color-text)]">
              {displayHandle}
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
            Search your Instagram handle below to generate your rate card.
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
        <div className="mt-6 flex flex-col gap-5">
          <GlowingSearchBar
            placeholder="Search @yourhandle..."
            onSearch={handleSearch}
          />

          {searching && (
            <p className="text-center text-sm text-[var(--color-text-light)]">
              Fetching Instagram data...
            </p>
          )}

          {notice && !searching && (
            <p className="text-center text-sm text-[var(--color-text-light)]">
              {notice}
            </p>
          )}

          {/* Shows Overall Rating + Rate Card as soon as a search resolves
              with real stats (not just a bare handle fallback). */}
          {prefill?.followers && (
            <InfluRateCard
              handle={prefill.handle}
              followers={Number(prefill.followers)}
              avgLikes={Number(prefill.avgLikes)}
              avgComments={Number(prefill.avgComments)}
            />
          )}

          <ReceiptPrinter
            key={printerKey}
            initialAnswers={prefill}
            onComplete={handleComplete}
          />
        </div>
      )}
    </div>
  );
}