import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ShieldCheck, ExternalLink, Edit2, Plus, X } from "lucide-react";
import Avatar from "./Avatar";
import SegmentedProgressBar from "./SegmentedProgressBar";

const platformLogos = {
  Instagram: "/Instagram.svg",
};

export default function ProfileCard({
  profile,
  handle,
  socialAccounts = [],
  categories = [],
  approved,
  packages = [],
  galleryItems = [],
  onEditProfile,
  onAddAccount,
  onRemoveAccount,
  onEditCategories,
}) {
  const p = profile || {};
  const personalInfo = p.personalInfo || {};
  const address = p.address || {};
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(" ");
  const displayName = fullName || handle?.replace("@", "") || "Creator";
  const title = personalInfo.title || "UGC & Lifestyle Creator";
  const coverPhotos =
    Array.isArray(personalInfo.coverPhotos) && personalInfo.coverPhotos.length > 0
      ? personalInfo.coverPhotos
      : personalInfo.coverPhoto
      ? [personalInfo.coverPhoto]
      : [];
  const avatarUrl =
    personalInfo.avatar ||
    p.user?.avatar ||
    p.socialAccounts?.find((s) => s.platform?.toLowerCase() === "instagram")?.avatar;
  const locationStr = [address.city, address.state, address.country].filter(Boolean).join(", ");
  const bio = p.matchProfile?.bio || personalInfo.description;

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-[var(--shadow-card)] flex flex-col">
      {/* Top Cover Banner */}
      <div className="relative h-36 sm:h-44 w-full bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
        {coverPhotos.length > 0 ? (
          <div
            className={`grid h-full w-full gap-0.5 ${
              coverPhotos.length === 1
                ? "grid-cols-1"
                : coverPhotos.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {coverPhotos.slice(0, 3).map((photo, idx) => (
              <div key={idx} className="relative h-full w-full overflow-hidden bg-gray-900">
                <img
                  src={photo}
                  alt={`Cover Banner ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
            <span>Add 700x700 cover photos in profile setup</span>
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Link
            to={`/creators/${p.user?._id || p._id || ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black/70 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-sm transition flex items-center gap-1.5 shadow"
          >
            <ExternalLink size={12} /> Preview Public Profile
          </Link>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="px-6 sm:px-7 pb-6 pt-0 flex flex-col gap-6">
        {/* Creator Info Row with Overlapping Avatar */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            {/* ONLY the avatar floats over the cover banner */}
            <div className="-mt-12 sm:-mt-14 relative rounded-full ring-4 ring-white bg-white shadow-lg flex-shrink-0 z-10">
              <Avatar name={displayName} avatarUrl={avatarUrl} size={88} />
              {approved && (
                <span className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-white flex items-center justify-center shadow">
                  <ShieldCheck size={14} className="text-white fill-white" />
                </span>
              )}
            </div>

            {/* Typography stays safely on the white card surface */}
            <div className="pt-2 sm:pt-3">
              <h2 className="font-extrabold text-xl sm:text-2xl text-[var(--color-text)] flex items-center gap-2">
                {displayName}
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </h2>
              <p className="text-xs font-semibold text-[var(--color-text-light)] mt-0.5">{title}</p>
              {locationStr && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mt-1.5">
                  <MapPin size={13} className="text-red-500 flex-shrink-0" />
                  <span>{locationStr}</span>
                </div>
              )}
            </div>
          </div>

          {onEditProfile ? (
            <button
              type="button"
              onClick={onEditProfile}
              className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold transition shadow-sm"
            >
              <Edit2 size={13} /> Edit Profile &amp; Details
            </button>
          ) : (
            <Link
              to="/creator-onboarding"
              className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold transition shadow-sm"
            >
              <Edit2 size={13} /> Edit Profile &amp; Pricing
            </Link>
          )}
        </div>

        {/* Sleek Segmented Progress Bar (10 capsules, matching reference) */}
        <div className="p-4 rounded-2xl bg-gray-50/90 border border-gray-200/80">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-gray-800">Profile Completeness</span>
          </div>
          <SegmentedProgressBar
            profile={profile}
            packages={packages}
            galleryItems={galleryItems}
            socialAccounts={socialAccounts}
          />
        </div>

        {/* Bio Snippet */}
        {bio && (
          <div className="space-y-1">
            <span className="text-xs font-bold text-[var(--color-text)]">About</span>
            <p className="text-xs text-[var(--color-text-light)] leading-relaxed line-clamp-3">
              {bio}
            </p>
          </div>
        )}

        {/* Niches / Categories */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--color-text)]">Categories &amp; Niches</span>
            <button
              onClick={onEditCategories}
              className="text-xs font-bold text-[var(--color-primary-hover)] hover:underline"
            >
              {categories.length > 0 ? "Edit" : "+ Add categories"}
            </button>
          </div>

          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary-hover)]"
                >
                  {cat}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--color-text-light)]">
              Add your niches so brands can find you on Creator Discovery.
            </p>
          )}
        </div>

        {/* Connected Instagram Profile */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--color-text)]">Connected Social Profiles</span>
            <span className="text-[11px] font-bold text-gray-400">Apify Verified</span>
          </div>

          {socialAccounts.length === 0 && (
            <p className="text-xs text-[var(--color-text-light)]">
              No Instagram account connected yet.
            </p>
          )}

          {socialAccounts.map((acc) => {
            const logoSrc = platformLogos[acc.platform] || "/Instagram.svg";

            return (
              <div
                key={acc.platform}
                className="flex items-center justify-between bg-[var(--color-background)] rounded-2xl px-4 py-3 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={logoSrc}
                    alt={`${acc.platform} logo`}
                    className="w-5 h-5 object-contain"
                  />
                  <div>
                    <span className="text-xs font-bold text-[var(--color-text)] block">
                      {acc.handle}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-500">
                      {acc.platform}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-[var(--color-text)]">
                    {acc.followers.toLocaleString()} followers
                  </span>
                  <button
                    onClick={() => onRemoveAccount(acc.platform)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    aria-label={`Remove ${acc.platform}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          <button
            onClick={onAddAccount}
            className="mt-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-dashed border-[var(--color-border)] text-xs font-bold text-[var(--color-primary-hover)] hover:bg-[var(--color-background)] transition-colors"
          >
            <Plus size={14} />
            Connect Account
          </button>
        </div>
      </div>
    </div>
  );
}
