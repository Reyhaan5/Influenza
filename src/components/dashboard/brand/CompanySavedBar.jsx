import React from "react";
import { CheckCircle2, Pencil } from "lucide-react";

export default function CompanySavedBar({ companyName, onEdit }) {
  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 rounded-2xl bg-zinc-100/90 border border-zinc-200/80 text-zinc-900 flex items-center justify-center">
          <CheckCircle2 size={18} className="text-zinc-900" />
        </div>
        <div>
          <p className="font-black text-sm text-zinc-950">
            {companyName || "Company"} info saved
          </p>
          <p className="text-xs text-zinc-500 font-medium">
            Company details are up to date and active on your brand profile.
          </p>
        </div>
      </div>

      <button
        onClick={onEdit}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer flex-shrink-0"
      >
        <Pencil size={13} />
        <span>Edit</span>
      </button>
    </div>
  );
}