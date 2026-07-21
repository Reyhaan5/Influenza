import React from "react";
import Avatar from "../influencer/Avatar";

export default function InfluencerCard({
  name,
  role,
  blurb,
  tags,
  reach,
}) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3">
        <Avatar name={name} size={44} />
        <div>
          <p className="font-bold text-[var(--color-text)]">{name}</p>
          <p className="text-xs text-[var(--color-text-light)]">{role}</p>
        </div>
      </div>

      <p className="mt-3 text-sm text-[var(--color-text-light)] line-clamp-2">
        {blurb}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-background)] text-[var(--color-text)]"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-[var(--color-text-light)]">
        <span className="flex items-center gap-1">
          <img
            src="Youtube.svg"
            alt="YouTube"
            className="w-4 h-4"
          />
          {reach}
        </span>

        <span className="flex items-center gap-1">
          <img
            src="Instagram.svg"
            alt="Instagram"
            className="w-4 h-4"
          />
          {reach}
        </span>

        <span className="flex items-center gap-1">
          <img
            src="Twitter.svg"
            alt="Twitter"
            className="w-4 h-4"
          />
          {reach}
        </span>
      </div>
    </div>
  );
}