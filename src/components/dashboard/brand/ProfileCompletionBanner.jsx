import React from "react";
import { ShieldCheck, ArrowUpRight, ImageOff } from "lucide-react";

export default function ProfileCompletionBanner({ pct = 70, productImage }) {
  const scrollToForm = () => {
    document.getElementById("company-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-sm h-full flex flex-col justify-between gap-5">
      <div className="flex items-start gap-3.5">
        <div className="p-3 rounded-2xl bg-zinc-100/90 border border-zinc-200/80 text-zinc-900 flex-shrink-0 flex items-center justify-center">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Profile Status</p>
          <p className="text-sm font-bold text-zinc-950 mt-0.5 leading-snug">
            Your profile is <span className="text-zinc-950 underline decoration-zinc-400">{pct}% complete</span>.
          </p>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            Finish your company details to increase credibility with creators.
          </p>
        </div>
      </div>

      {productImage ? (
        <img
          src={productImage}
          alt="Selected product"
          className="w-full h-44 object-cover rounded-2xl border border-zinc-200"
        />
      ) : (
        <div className="w-full h-44 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 flex flex-col items-center justify-center gap-2 text-zinc-400">
          <ImageOff size={22} className="text-zinc-400" />
          <p className="text-xs font-medium">No product image uploaded yet.</p>
        </div>
      )}

      <button
        onClick={scrollToForm}
        className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
      >
        <span>Complete Profile</span>
        <ArrowUpRight size={14} />
      </button>
    </div>
  );
}