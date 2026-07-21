import React from "react";
import Avatar from "./Avatar";
import { BadgeCheck } from "lucide-react";

export default function ProfileCard({ handle, posts, followers, following, approved }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] flex flex-col gap-5 h-full">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar name={handle.replace("@", "")} />
          <span className="absolute -bottom-1 -right-1 bg-[var(--color-primary)] rounded-full p-0.5 border-2 border-[var(--color-surface)]">
            <BadgeCheck size={14} className="text-white" />
          </span>
        </div>
        <span className="font-bold text-[var(--color-text)] text-lg">{handle}</span>
      </div>

      <div className="flex items-center justify-around text-center">
        <div>
          <div className="font-bold text-[var(--color-text)]">{posts}</div>
          <div className="text-xs text-[var(--color-text-light)]">posts</div>
        </div>
        <div className="w-px h-8 bg-[var(--color-border)]" />
        <div>
          <div className="font-bold text-[var(--color-text)]">{followers}</div>
          <div className="text-xs text-[var(--color-text-light)]">followers</div>
        </div>
        <div className="w-px h-8 bg-[var(--color-border)]" />
        <div>
          <div className="font-bold text-[var(--color-text)]">{following}</div>
          <div className="text-xs text-[var(--color-text-light)]">following</div>
        </div>
      </div>

      {!approved && (
        <div className="text-sm text-[var(--color-warning)] bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 rounded-xl px-4 py-2.5">
          Your account has not been approved for Instagram collaborations.
        </div>
      )}
    </div>
  );
}