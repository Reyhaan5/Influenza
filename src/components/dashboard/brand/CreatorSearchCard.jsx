import React from "react";
import { Send, Check, Clock } from "lucide-react";
import Avatar from "../influencer/Avatar";

export default function CreatorSearchCard({ profile, requestStatus, sending, onSendRequest }) {
  const topAccount = (profile.socialAccounts || []).reduce(
    (max, acc) => (acc.followers > (max?.followers || 0) ? acc : max),
    null
  );

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)] flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar name={profile.handle?.replace("@", "") || profile.user?.name} size={44} />
        <div>
          <p className="font-bold text-[var(--color-text)]">{profile.handle}</p>
          <p className="text-xs text-[var(--color-text-light)]">{profile.user?.name}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(profile.socialAccounts || []).map((acc) => (
          <span
            key={acc.platform}
            className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-background)] text-[var(--color-text)]"
          >
            {acc.platform}: {acc.followers.toLocaleString()}
          </span>
        ))}
      </div>

      {topAccount && (
        <p className="text-xs text-[var(--color-text-light)]">
          Top platform: {topAccount.platform} ({topAccount.followers.toLocaleString()} followers)
        </p>
      )}

      {requestStatus ? (
        <span className="self-start flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-[var(--color-background)] text-[var(--color-text-light)]">
          {requestStatus === "pending" && <Clock size={14} />}
          {requestStatus === "accepted" && <Check size={14} className="text-[var(--color-success)]" />}
          {requestStatus === "pending" && "Request pending"}
          {requestStatus === "accepted" && "Collaborating"}
          {requestStatus === "rejected" && "Request declined"}
        </span>
      ) : (
        <button
          onClick={onSendRequest}
          disabled={sending}
          className="self-start flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition disabled:opacity-60"
        >
          <Send size={14} />
          {sending ? "Sending..." : "Send Request"}
        </button>
      )}
    </div>
  );
}
