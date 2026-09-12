import React from "react";
import { ArrowUpRight, CheckCircle2, ExternalLink, Sparkles, TrendingUp, RefreshCw } from "lucide-react";

export default function ConnectBanner({ profile, onConnect, onEditProfile }) {
  const instagramAccount =
    profile?.socialAccounts?.find(
      (s) => s.platform?.toLowerCase() === "instagram"
    ) ||
    (profile?.handle
      ? {
          platform: "Instagram",
          handle: profile.handle,
          followers: profile.followers || profile.stats?.followers || 0,
        }
      : null);

  const cleanHandle = (instagramAccount?.handle || profile?.handle || "")
    .replace(/^@+/, "")
    .trim();

  const isConnected = Boolean(cleanHandle);
  const followersCount =
    instagramAccount?.followers ||
    profile?.followers ||
    profile?.stats?.followers ||
    0;

  const baseRate =
    profile?.packages?.[0]?.price ||
    profile?.pricing?.packages?.[0]?.price ||
    profile?.startingPrice ||
    50;

  if (isConnected) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-[var(--shadow-card)] h-full flex flex-col justify-between relative overflow-hidden group">
        {/* Background Subtle Gradient Glow */}
        <div className="absolute -right-10 -top-10 w-36 h-36 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-orange-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-4">
          {/* Header Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.79-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-gray-900 block">
                  Instagram
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Synced & Active
                </span>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Connected
            </span>
          </div>

          {/* Account Details & Live Link */}
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-gray-500">Connected Handle</p>
              <h4 className="text-sm font-extrabold text-gray-900 truncate">
                @{cleanHandle}
              </h4>
            </div>
            <a
              href={`https://instagram.com/${cleanHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-bold shadow-sm transition-colors flex-shrink-0"
              title="View on Instagram"
            >
              <span>View Profile</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Live Performance & Readiness Metric */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                <TrendingUp size={12} className="text-pink-500" />
                Audience
              </div>
              <p className="text-sm font-black text-gray-900 mt-1">
                {followersCount > 0 ? followersCount.toLocaleString() : "Active"}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles size={12} className="text-amber-500" />
                Starting Rate
              </div>
              <p className="text-sm font-black text-emerald-600 mt-1">
                ${baseRate}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-500">
            Brand Discovery: <strong className="text-emerald-700">Enabled</strong>
          </span>
          <button
            type="button"
            onClick={onConnect || onEditProfile}
            className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-gray-900 transition-colors"
          >
            <RefreshCw size={12} />
            <span>Switch Handle</span>
          </button>
        </div>
      </div>
    );
  }

  // Not Connected State
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-[var(--shadow-card)] h-full flex flex-col justify-between relative overflow-hidden">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.79-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-gray-900">Connect Instagram</h4>
            <p className="text-xs text-gray-500">Unlock brand deals & verified rate cards</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-600 leading-relaxed">
          Connect your Instagram account to automatically display live stats, calculate instant rates, and get directly discovered by verified brands.
        </p>
      </div>

      <button
        type="button"
        onClick={onConnect}
        className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-extrabold shadow-sm transition"
      >
        <span>Connect Account</span>
        <ArrowUpRight size={15} />
      </button>
    </div>
  );
}