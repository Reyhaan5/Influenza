import React, { useState } from "react";
import { X, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";

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
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-600 mb-1">
          <Sparkles size={14} />
          Live Instagram Sync
        </div>
        <h3 className="font-bold text-xl text-gray-900 mb-2">
          Connect Instagram
        </h3>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Enter your Instagram handle. Your audience count, engagement, and verified metrics will be fetched automatically.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex items-center gap-2.5 p-3 bg-pink-50 border border-pink-200/60 rounded-2xl text-xs font-semibold text-gray-900">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.79-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <span>Platform: Instagram (@handle)</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Instagram Username
            </label>
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

