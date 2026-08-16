import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../dashboard/influencer/Avatar";

export default function PublicCreatorCard({ profile }) {
  const topAccount = (profile.socialAccounts || []).reduce(
    (max, acc) => (acc.followers > (max?.followers || 0) ? acc : max),
    null
  );

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)] flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar name={(profile.handle || profile.user?.name || "?").replace("@", "")} size={44} />
        <div>
          <p className="font-bold text-[var(--color-text)]">{profile.handle}</p>
          {profile.user?.name && (
            <p className="text-xs text-[var(--color-text-light)]">{profile.user.name}</p>
          )}
        </div>
      </div>

      {profile.categories?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {profile.categories.map((cat) => (
            <span
              key={cat}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary-hover)]"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {topAccount && (
        <p className="text-xs text-[var(--color-text-light)]">
          Top platform: {topAccount.platform} ({topAccount.followers.toLocaleString()} followers)
        </p>
      )}

      <Link
        to="/signup"
        className="mt-1 text-center text-xs font-semibold px-3 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition"
      >
        Sign up to collaborate
      </Link>
    </div>
  );
}
