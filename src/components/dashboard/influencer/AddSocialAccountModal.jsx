import React, { useState } from "react";
import { X, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";
import { InstagramIcon } from "./InfluencerShared";

export default function AddSocialAccountModal({ onClose, onSubmit }) {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handle.trim()) return;
    setLoading(true);
    try {
      await onSubmit({ platform: "Instagram", handle: handle.trim() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl relative">
        <button type="button" onClick={onClose} disabled={loading} className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer">
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-600 mb-1">
          <Sparkles size={14} /> Live Instagram Sync
        </div>
        <h3 className="font-bold text-xl text-gray-900 mb-2">Connect Instagram</h3>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Enter your Instagram handle. Your audience count, engagement, and verified metrics will be fetched automatically.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex items-center gap-2.5 p-3 bg-pink-50 border border-pink-200/60 rounded-2xl text-xs font-semibold text-gray-900">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <InstagramIcon className="w-3.5 h-3.5 fill-current" />
            </div>
            <span>Platform: Instagram (@handle)</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Instagram Username</label>
            <input
              required
              type="text"
              placeholder="@yourhandle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 rounded-2xl px-3.5 py-2.5 text-sm font-semibold bg-white text-gray-900 focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-[11px] text-gray-600 flex items-start gap-2">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
            <span>Follower metrics and rates will be calculated automatically upon connect.</span>
          </div>

          <button
            type="submit"
            disabled={loading || !handle.trim()}
            className="w-full mt-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading && <RefreshCw size={14} className="animate-spin" />}
            <span>{loading ? "Connecting & Syncing..." : "Connect Instagram Account"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
