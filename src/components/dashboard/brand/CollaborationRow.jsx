import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ExternalLink, Sparkles } from "lucide-react";
import Avatar from "../influencer/Avatar";

const STAGES = [
  { key: "application", label: "Application" },
  { key: "content_creation", label: "Content Creation" },
  { key: "review", label: "In Review" },
  { key: "posting", label: "Ready to Post" },
  { key: "completed", label: "Completed" },
];

const PAYMENTS = [
  { key: "pending", label: "Pending Payment" },
  { key: "paid", label: "Paid" },
];

export default function CollaborationRow({ collab, onUpdate }) {
  const creatorName =
    collab.influencerProfile?.displayName ||
    collab.influencer?.name ||
    "Creator";
  const handle =
    collab.influencerProfile?.handle ||
    collab.influencer?.email?.split("@")[0] ||
    "creator";
  const avatarUrl = collab.influencerProfile?.avatar || "";

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Creator & Campaign info */}
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={creatorName}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <Avatar name={creatorName} size={40} />
        )}
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900 text-sm">{creatorName}</h4>
            <span className="text-xs text-gray-400 font-medium">@{handle.replace("@", "")}</span>
          </div>
          <p className="text-xs text-gray-600 font-medium mt-0.5">
            {collab.opportunity?.title || "Direct Collaboration"} ·{" "}
            <span className="capitalize text-gray-500 font-semibold">{collab.format}</span>
          </p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
            <span>
              Deliverables:{" "}
              <strong className="text-gray-700">
                {collab.deliverablesCompleted || 0}/{collab.deliverablesTotal || 1}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Controls & Stage updates */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Link
          to={`/brand-dashboard/chats?with=${collab.influencer?._id || collab.influencer}`}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
        >
          <MessageSquare size={13} />
          <span>Chat</span>
        </Link>

        <select
          value={collab.stage || "content_creation"}
          onChange={(e) => onUpdate(collab._id, { stage: e.target.value })}
          className="text-xs font-bold border border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50 text-gray-800 focus:outline-none focus:border-black cursor-pointer"
        >
          {STAGES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={collab.paymentStatus || "pending"}
          onChange={(e) => onUpdate(collab._id, { paymentStatus: e.target.value })}
          className={`text-xs font-bold border rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer ${
            collab.paymentStatus === "paid"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}
        >
          {PAYMENTS.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}