import React from "react";
import { MapPin } from "lucide-react";
import Avatar from "../influencer/Avatar";

export default function PopularProfileCard({
  name,
  role,
  location,
  reach,
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-[var(--shadow-card)]">
      <div className="bg-[var(--color-primary-hover)] px-5 pt-6 pb-10 flex justify-center">
        <Avatar name={name} size={72} />
      </div>

      <div className="bg-[var(--color-surface)] px-5 pt-4 pb-5 -mt-6 rounded-t-2xl text-center">
        <p className="font-bold text-[var(--color-text)]">{name}</p>
        <p className="text-xs text-[var(--color-text-light)]">{role}</p>

        <p className="mt-1 flex items-center justify-center gap-1 text-xs text-[var(--color-text-light)]">
          <MapPin size={12} /> {location}
        </p>

        <button className="mt-4 w-full py-2.5 rounded-xl bg-[var(--color-danger)]/90 text-white text-sm font-semibold flex items-center justify-center gap-4">
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
        </button>
      </div>
    </div>
  );
}