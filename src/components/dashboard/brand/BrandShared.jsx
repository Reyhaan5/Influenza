import React from "react";
import { Inbox, Video, FileCheck, Send, CheckCircle2 } from "lucide-react";

export const STAGES = [
  { key: "application", label: "Application", title: "Application", icon: Inbox, badgeColor: "bg-blue-50 text-blue-700 border-blue-200/60", dotColor: "bg-blue-500", description: "Invites & Creator Applications" },
  { key: "content_creation", label: "Content Creation", title: "Content Creation", icon: Video, badgeColor: "bg-purple-50 text-purple-700 border-purple-200/60", dotColor: "bg-purple-500", description: "Scripting, Filming & Production" },
  { key: "review", label: "In Review", title: "In Review", icon: FileCheck, badgeColor: "bg-amber-50 text-amber-700 border-amber-200/60", dotColor: "bg-amber-500", description: "Drafts submitted for brand feedback" },
  { key: "posting", label: "Ready to Post", title: "Ready to Post", icon: Send, badgeColor: "bg-sky-50 text-sky-700 border-sky-200/60", dotColor: "bg-sky-500", description: "Approved & Scheduled for Live Post" },
  { key: "completed", label: "Completed", title: "Completed", icon: CheckCircle2, badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60", dotColor: "bg-emerald-500", description: "Live verified & Payout released" },
];

export const STAGE_STYLES = {
  application: { bg: "bg-[#FEF9C3]", border: "border-black", tagBg: "bg-amber-100 text-amber-900 border-amber-300", progressBg: "bg-amber-500", pill: "Application" },
  content_creation: { bg: "bg-[#FCE7F3]", border: "border-black", tagBg: "bg-pink-100 text-pink-900 border-pink-300", progressBg: "bg-pink-500", pill: "In Creation" },
  review: { bg: "bg-[#F3E8FF]", border: "border-black", tagBg: "bg-purple-100 text-purple-900 border-purple-300", progressBg: "bg-purple-600", pill: "In Review" },
  posting: { bg: "bg-[#E0F2FE]", border: "border-black", tagBg: "bg-sky-100 text-sky-900 border-sky-300", progressBg: "bg-sky-500", pill: "Ready to Post" },
  completed: { bg: "bg-[#DCFCE7]", border: "border-black", tagBg: "bg-emerald-100 text-emerald-900 border-emerald-300", progressBg: "bg-emerald-500", pill: "Completed" },
};

export const RATING_LABELS = {
  5: "⭐⭐⭐⭐⭐ Outstanding / Exceeded Expectations",
  4: "⭐⭐⭐⭐ Great / Very Professional",
  3: "⭐⭐⭐ Good / Met Requirements",
  2: "⭐⭐ Fair / Minor Issues",
  1: "⭐ Poor / Did Not Meet Standards",
};

export function BrandInput({ label, value, onChange, placeholder, readOnly = false, type = "text", className = "" }) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-2xl border border-zinc-200 px-4 py-3 text-xs font-semibold focus:outline-none focus:border-zinc-950 ${
          readOnly ? "bg-zinc-100 text-zinc-500 cursor-not-allowed" : "bg-zinc-50/60 text-zinc-950 focus:bg-white"
        }`}
      />
    </div>
  );
}

export function SpiralRings({ count = 8 }) {
  return (
    <div className="absolute -top-3.5 left-0 right-0 flex justify-between px-3 pointer-events-none z-20">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-2.5 h-4.5 rounded-full border-[2.2px] border-black bg-white/70 shadow-sm" />
          <div className="w-1.5 h-1.5 rounded-full bg-black -mt-1" />
        </div>
      ))}
    </div>
  );
}
