import React from "react";
import Avatar from "../influencer/Avatar";

export default function TeamMembersList({ members }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)]">
      <h4 className="font-bold text-[var(--color-text)] mb-4">Team members</h4>
      <div className="flex flex-col gap-3">
        {members.map((m, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-background)]">
            <div className="flex items-center gap-3">
              <Avatar name={m.name} size={32} />
              <span className="text-sm font-semibold text-[var(--color-text)]">{m.name}</span>
            </div>
            <span className="text-xs font-semibold text-[var(--color-text-light)]">{m.role}</span>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-semibold text-[var(--color-primary-hover)] hover:bg-[var(--color-background)] transition-colors">
        + Invite team member
      </button>
    </div>
  );
}