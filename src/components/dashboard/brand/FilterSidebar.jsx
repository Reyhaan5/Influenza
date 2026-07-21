import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

function Select({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-white/70 uppercase tracking-wide">{label}</label>
      <select
        readOnly
        value={value}
        className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white outline-none appearance-none"
      >
        <option className="text-black">{value}</option>
      </select>
    </div>
  );
}

export default function FilterSidebar() {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0 bg-[var(--color-primary-hover)] rounded-2xl p-6 flex flex-col gap-6">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
        <input
          placeholder="Try #Fashion or #foodie"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder-white/50 outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-white/70 uppercase tracking-wide">Gender</label>
        {["Male", "Female", "Both"].map((g) => (
          <label key={g} className="flex items-center gap-2 text-sm text-white/90">
            <input type="radio" readOnly checked={g === "Both"} className="accent-white" />
            {g}
          </label>
        ))}
      </div>

      <Select label="By age" value="19-25" />
      <Select label="By ethnicity" value="Asian" />
      <Select label="By education" value="Higher secondary" />

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-white/70 uppercase tracking-wide">Household income</label>
        <input type="range" readOnly className="w-full accent-white" />
        <div className="flex justify-between text-xs text-white/60">
          <span>5K</span>
          <span>20,000K</span>
        </div>
      </div>

      <Select label="By location" value="London, UK" />

      <button className="mt-2 flex items-center justify-center gap-2 py-2.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
        <SlidersHorizontal size={16} />
        Premium filters
      </button>
    </aside>
  );
}