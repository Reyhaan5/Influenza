import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../dashboard/influencer/Avatar";

export default function PublicCreatorCard({ profile }) {
  const topAccount = (profile.socialAccounts || []).reduce(
    (max, acc) => (acc.followers > (max?.followers || 0) ? acc : max),
    null
  );

  const cleanHandle = (profile.handle || profile.user?.name || "creator").replace(/^@+/, "");

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-zinc-300 transition flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <Link
          to={`/creators/${profile.user?._id || profile._id || profile.handle}`}
          className="flex items-center gap-3 group transition"
        >
          <Avatar name={cleanHandle} size={44} />
          <div className="min-w-0 flex-1">
            <span className="font-bold text-gray-900 group-hover:text-black transition block truncate text-sm">
              @{cleanHandle}
            </span>
            {profile.user?.name && (
              <p className="text-xs text-gray-500 truncate">{profile.user.name}</p>
            )}
          </div>
        </Link>

        {profile.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200/60"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {topAccount && (
          <p className="text-xs text-gray-500 font-medium">
            {topAccount.platform}:{" "}
            <strong className="text-gray-900">
              {Number(topAccount.followers).toLocaleString("en-IN")}
            </strong>{" "}
            followers
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <Link
          to={`/creators/${profile.user?._id || profile._id || profile.handle}`}
          className="flex-1 text-center text-xs font-bold px-3 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-xs transition cursor-pointer"
        >
          View Profile
        </Link>
        <Link
          to={`/creators/${profile.user?._id || profile._id || profile.handle}?invite=true`}
          className="text-center text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-800 shadow-xs transition cursor-pointer"
        >
          Invite
        </Link>
      </div>
    </div>
  );
}
