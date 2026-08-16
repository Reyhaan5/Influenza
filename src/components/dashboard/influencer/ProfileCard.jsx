import React from "react";
import Avatar from "./Avatar";

// Map platforms to image paths located in your /public folder
const platformLogos = {
  Instagram: "/Instagram.svg",
  YouTube: "/Youtube.svg",
  Twitter: "/Twitter.svg",
};

export default function ProfileCard({
  handle,
  socialAccounts = [],
  categories = [],
  approved,
  onAddAccount,
  onRemoveAccount,
  onEditCategories,
}) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar name={handle.replace("@", "")} />
          {approved && (
            <span className="absolute -bottom-1 -right-1 bg-[var(--color-primary)] rounded-full p-1 border-2 border-[var(--color-surface)] flex items-center justify-center">
              <img
                src="/badge-check.svg"
                alt="Approved Badge"
                className="w-3.5 h-3.5"
              />
            </span>
          )}
        </div>
        <span className="font-bold text-[var(--color-text)] text-lg">
          {handle}
        </span>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--color-text)]">Categories</span>
          <button
            onClick={onEditCategories}
            className="text-xs font-semibold text-[var(--color-primary-hover)] hover:underline"
          >
            {categories.length > 0 ? "Edit" : "Add categories"}
          </button>
        </div>

        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <span
                key={cat}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary-hover)]"
              >
                {cat}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--color-text-light)]">
            Add up to 3 niches so brands (and the public category pages) can find you.
          </p>
        )}
      </div>

      {/* Connected social accounts */}
      <div className="flex flex-col gap-2">
        {socialAccounts.length === 0 && (
          <p className="text-sm text-[var(--color-text-light)]">
            No social accounts added yet.
          </p>
        )}

        {socialAccounts.map((acc) => {
          const logoSrc = platformLogos[acc.platform] || "/Instagram.svg";

          return (
            <div
              key={acc.platform}
              className="flex items-center justify-between bg-[var(--color-background)] rounded-xl px-4 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={logoSrc}
                  alt={`${acc.platform} logo`}
                  className="w-4 h-4 object-contain"
                />
                <span className="text-sm font-semibold text-[var(--color-text)]">
                  {acc.handle}
                </span>
                {acc.verified ? (
                  <span className="text-[10px] font-bold text-[var(--color-success)] bg-[var(--color-success)]/10 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-[var(--color-text-light)]">
                    Unverified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[var(--color-text)]">
                  {acc.followers.toLocaleString()} followers
                </span>
                <button
                  onClick={() => onRemoveAccount(acc.platform)}
                  className="opacity-40 hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${acc.platform}`}
                >
                  <img src="/x.svg" alt="Remove" className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Account Button */}
        <button
          onClick={onAddAccount}
          className="mt-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-[var(--color-border)] text-sm font-semibold text-[var(--color-primary-hover)] hover:bg-[var(--color-background)] transition-colors"
        >
          <img src="/plus.svg" alt="Add" className="w-4 h-4" />
          Add Social Account
        </button>
      </div>

      {/* Approval Banner */}
      {!approved && (
        <div className="text-sm text-[var(--color-warning)] bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 rounded-xl px-4 py-2.5">
          Your account has not been approved for collaborations yet.
        </div>
      )}
    </div>
  );
}
