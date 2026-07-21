import React from "react";
import { ChevronRight } from "lucide-react";
import Avatar from "../influencer/Avatar";

export default function RecentSearchItem({ name, role }) {
  return (
    <div className="flex items-center justify-between py-2.5 cursor-pointer group">
      <div className="flex items-center gap-3">
        <Avatar name={name} size={36} />
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">{name}</p>
          <p className="text-xs text-[var(--color-text-light)]">{role}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-[var(--color-text)]/40 group-hover:text-[var(--color-primary)] transition-colors" />
    </div>
  );
}