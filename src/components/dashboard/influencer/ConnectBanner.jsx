import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ExternalLink, Sparkles, TrendingUp, RefreshCw } from "lucide-react";
import { InstagramIcon } from "./InfluencerShared";

export default function ConnectBanner({ profile }) {
  const instagramAccount = profile?.socialAccounts?.find((s) => s.platform?.toLowerCase() === "instagram" && s.handle?.trim()) || null;
  const cleanHandle = (instagramAccount?.handle || "").replace(/^@+/, "").trim();
  const followersCount = instagramAccount?.followers || 0;
  const baseRate = profile?.packages?.[0]?.price || profile?.pricing?.packages?.[0]?.price || profile?.startingPrice || 50;

  if (cleanHandle) {
    return (
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-sm h-full flex flex-col justify-between relative overflow-hidden group">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-950 flex items-center justify-center text-white shadow-sm shrink-0">
                <InstagramIcon className="w-4 h-4 fill-current" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-zinc-950 block">Instagram</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Synced &amp; Active
                </span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">Connected</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-zinc-500">Connected Handle</p>
              <h4 className="text-sm font-extrabold text-zinc-950 truncate">@{cleanHandle}</h4>
            </div>
            <a
              href={`https://instagram.com/${cleanHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-bold shadow-sm transition-colors shrink-0"
            >
              <span>View Profile</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-1 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                <TrendingUp size={12} className="text-zinc-900" /> Audience
              </div>
              <p className="text-base font-black text-zinc-950 mt-1">{followersCount > 0 ? followersCount.toLocaleString() : "Active"}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-1 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles size={12} className="text-zinc-900" /> Starting Rate
              </div>
              <p className="text-base font-black text-emerald-600 mt-1">₹{baseRate}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-500">Discovery: <strong className="text-emerald-700">Enabled</strong></span>
          <Link to="/account?tab=account-settings" className="inline-flex items-center gap-1 text-xs font-bold text-zinc-900 hover:underline transition-colors">
            <RefreshCw size={12} /> <span>Manage in Settings</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-sm h-full flex flex-col justify-between relative overflow-hidden">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shadow-sm shrink-0">
            <InstagramIcon className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-zinc-950">Connect Instagram</h4>
            <p className="text-xs text-zinc-500">Unlock brand deals &amp; verified rate cards</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-zinc-600 leading-relaxed">
          Connect your Instagram account to automatically display live stats, calculate instant rates, and get directly discovered by verified brands.
        </p>
      </div>
      <Link
        to="/account?tab=account-settings"
        className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
      >
        <span>Connect in Account Settings</span>
        <ArrowUpRight size={15} />
      </Link>
    </div>
  );
}