import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ExternalLink, CheckCircle, Clock, DollarSign, Package, Sparkles, MoreVertical } from "lucide-react";
import Avatar from "../influencer/Avatar";
import { STAGES, STAGE_STYLES, SpiralRings } from "./BrandShared";

const FORMAT_ICONS = {
  money: <DollarSign size={12} className="text-emerald-800" />,
  product: <Package size={12} className="text-purple-800" />,
  barter: <Sparkles size={12} className="text-blue-800" />,
};

export default function KanbanCard({
  collab, onDragStart, onDragEnd, onStageChange, onOpenWorkflow, onOpenReview, isDragging
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const stageKey = collab.stage || "content_creation";
  const style = STAGE_STYLES[stageKey] || STAGE_STYLES.content_creation;

  const creatorName = collab.influencerProfile?.displayName || collab.influencer?.name || "Creator";
  const handle = collab.influencerProfile?.handle || collab.influencer?.email?.split("@")[0] || "creator";
  const avatarUrl = collab.influencerProfile?.avatar || "";
  const campaignTitle = collab.opportunity?.title || "Direct Collaboration";
  const brandName = collab.brandEntity?.name || collab.opportunity?.brandEntity?.name || collab.brand?.company || "Brand";
  const brandLogo = collab.brandEntity?.logo || collab.opportunity?.brandEntity?.logo || "";

  const totalDeliv = collab.deliverablesTotal || 1;
  const completedDeliv = collab.deliverablesCompleted || 0;
  const progressPercent = Math.min(100, Math.round((completedDeliv / totalDeliv) * 100));

  return (
    <div className="pt-3 pb-1">
      <div
        draggable
        onDragStart={(e) => onDragStart(e, collab)}
        onDragEnd={onDragEnd}
        className={`group relative ${style.bg} rounded-2xl border-[2.5px] border-black p-4 pt-3.5 shadow-[3px_3px_0px_rgba(0,0,0,0.95)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
          isDragging ? "opacity-30 scale-95 border-dashed" : ""
        }`}
      >
        <SpiralRings />

        {/* Top Header: Brand & Menu */}
        <div className="flex items-center justify-between gap-2 mt-1 mb-2.5">
          <div className="flex items-center gap-1.5 min-w-0">
            {brandLogo ? (
              <img src={brandLogo} alt={brandName} className="w-4 h-4 rounded-full object-cover border border-black/30 shrink-0" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-black text-white text-[9px] font-black flex items-center justify-center shrink-0">
                {brandName[0]?.toUpperCase()}
              </span>
            )}
            <span className="text-[11px] font-extrabold text-black uppercase tracking-tight truncate">{brandName}</span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className="p-1 rounded-lg text-black hover:bg-black/10 transition cursor-pointer"
            >
              <MoreVertical size={14} />
            </button>
            {menuOpen && (
              <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-full mt-1 w-44 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] z-40 py-1 text-xs animate-fadeIn">
                <div className="px-3 py-1 text-[10px] font-black uppercase text-gray-500">Move to Stage</div>
                {STAGES.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => { onStageChange(collab._id, s.key); setMenuOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between font-bold transition cursor-pointer ${
                      collab.stage === s.key ? "bg-black text-white" : "text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span>{s.label}</span>
                    {collab.stage === s.key && <CheckCircle size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <h4 className="text-xs font-black text-gray-950 line-clamp-2 mb-2.5 leading-snug">{campaignTitle}</h4>

        {/* Creator Snippet */}
        <div className="flex items-center gap-2.5 p-2 bg-white/80 rounded-xl mb-3 border-[1.5px] border-black/40 shadow-xs">
          {avatarUrl ? (
            <img src={avatarUrl} alt={creatorName} className="w-8 h-8 rounded-full object-cover border border-black/20 shrink-0" />
          ) : (
            <Avatar name={creatorName} size={32} />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-gray-950 truncate">{creatorName}</p>
            <p className="text-[10px] font-bold text-gray-600 truncate">@{handle.replace("@", "")}</p>
          </div>
        </div>

        {/* Deliverables Progress */}
        <div className="mb-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-800">
            <span>Deliverables</span>
            <span className="font-extrabold text-black">{completedDeliv}/{totalDeliv}</span>
          </div>
          <div className="w-full h-2 bg-white/90 border border-black/40 rounded-full overflow-hidden">
            <div className="h-full transition-all duration-300 rounded-full bg-black" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Badges & Status */}
        <div className="flex items-center justify-between gap-1 pt-1 border-t border-black/20 text-[10px]">
          <div className="flex items-center gap-1 bg-white/90 border border-black/30 px-2 py-0.5 rounded-md font-bold text-gray-900 capitalize">
            {FORMAT_ICONS[collab.format] || <Sparkles size={11} />}
            <span>{collab.format || "deal"}</span>
          </div>
          <span className={`flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md border ${
            collab.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-900 border-emerald-400" : "bg-amber-100 text-amber-900 border-amber-400"
          }`}>
            {collab.paymentStatus === "paid" ? <CheckCircle size={10} /> : <Clock size={10} />}
            <span>{collab.paymentStatus === "paid" ? "Paid" : "Pending"}</span>
          </span>
        </div>

        {/* Actions */}
        <div className="mt-2.5 pt-2 border-t border-black/10 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onOpenWorkflow?.(collab); }}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer ${
                stageKey === "review" ? "bg-amber-500 hover:bg-amber-600 text-white animate-pulse" : "bg-white hover:bg-black hover:text-white text-black border border-black/30"
              }`}
            >
              <Sparkles size={11} /><span>{stageKey === "review" ? "Review Submission" : "Deliverables"}</span>
            </button>
            {stageKey === "completed" && onOpenReview && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onOpenReview(collab); }}
                className="py-1.5 px-2.5 rounded-lg bg-black hover:bg-gray-800 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                title="Rate & Review Creator"
              >
                <span>⭐ Rate</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 text-[10px]">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-black/60">{style.pill}</span>
            <div className="flex items-center gap-2">
              <Link to={`/brand-dashboard/chats?with=${collab.influencer?._id || collab.influencer}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[11px] font-black text-black hover:opacity-75 p-0.5 rounded transition" title="Chat with creator">
                <MessageSquare size={12} /><span>Chat</span>
              </Link>
              <Link to={`/creators/${collab.influencer?._id || collab.influencer}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-0.5 text-[11px] font-black text-black/60 hover:text-black p-0.5 rounded transition" title="View profile">
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
