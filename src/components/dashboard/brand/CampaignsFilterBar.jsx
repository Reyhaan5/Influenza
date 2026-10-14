import React from "react";
import { Search, ChevronDown } from "lucide-react";

export default function CampaignsFilterBar({
  searchQuery, setSearchQuery, selectedBrand, setSelectedBrand, brands = [],
  selectedType, setSelectedType, selectedHiredFilter, setSelectedHiredFilter,
  selectedStatusFilter, setSelectedStatusFilter, activeTab
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative flex-1 min-w-[240px] max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text" placeholder="Search campaign name" value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3.5 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 text-gray-800 placeholder-gray-400 transition"
        />
      </div>

      <div className="relative">
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="appearance-none bg-white border border-gray-300 rounded-xl pl-4 pr-9 py-2 text-xs font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition cursor-pointer">
          <option value="">Brands</option>
          {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative">
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="appearance-none bg-white border border-gray-300 rounded-xl pl-4 pr-9 py-2 text-xs font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition cursor-pointer">
          <option value="">Campaign type</option>
          {["User-Generated Content", "Influencer Posts", "Affiliate / Commission", "Product Review", "Brand Ambassador"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {activeTab === "active" && (
        <>
          <div className="relative">
            <select value={selectedHiredFilter} onChange={(e) => setSelectedHiredFilter(e.target.value)} className="appearance-none bg-white border border-gray-300 rounded-xl pl-4 pr-9 py-2 text-xs font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition cursor-pointer">
              <option value="">Hired/Goal</option>
              <option value="zero">0 Hired</option>
              <option value="in_progress">In Progress</option>
              <option value="reached">Goal Reached</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select value={selectedStatusFilter} onChange={(e) => setSelectedStatusFilter(e.target.value)} className="appearance-none bg-white border border-gray-300 rounded-xl pl-4 pr-9 py-2 text-xs font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition cursor-pointer">
              <option value="">Status</option>
              <option value="open">Active / Open</option>
              <option value="paused">Paused</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </>
      )}
    </div>
  );
}
