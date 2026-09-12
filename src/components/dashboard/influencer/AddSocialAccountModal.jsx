import React, { useState } from "react";
import { X } from "lucide-react";

export default function AddSocialAccountModal({ onClose, onSubmit }) {
  const [handle, setHandle] = useState("");
  const [followers, setFollowers] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ platform: "Instagram", handle, followers: Number(followers) || 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-text)]/40 px-4">
      <div className="w-full max-w-sm bg-[var(--color-surface)] rounded-2xl p-6 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--color-text)]/50 hover:text-[var(--color-text)]">
          <X size={18} />
        </button>

        <h3 className="font-bold text-lg text-[var(--color-text)] mb-4">Add Instagram Account</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800">
            <img src="/Instagram.svg" alt="Instagram" className="w-4 h-4 object-contain" />
            <span>Platform: Instagram</span>
          </div>

          <input
            required
            placeholder="@yourhandle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm"
          />

          <input
            required
            type="number"
            min="0"
            placeholder="Follower count"
            value={followers}
            onChange={(e) => setFollowers(e.target.value)}
            className="border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm"
          />

          <button
            type="submit"
            className="mt-2 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Add Account
          </button>
        </form>
      </div>
    </div>
  );
}
