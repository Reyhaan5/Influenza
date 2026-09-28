import React from "react";
import { Search, X, Film, Image as ImageIcon, LayoutGrid, Columns, Sparkles } from "lucide-react";
import { GROUP_META, DEFAULT_GROUP_ICON } from "../../constants/categoryGroupMeta";
import { CATEGORY_GROUPS } from "../../constants/categoryTaxonomy";

const FORMAT_OPTIONS = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "video", label: "Reels & Video", icon: Film },
  { id: "image", label: "Photos", icon: ImageIcon },
];

export default function GalleryToolbar({
  searchQuery, setSearchQuery,
  activeFormat, setActiveFormat,
  activePlatform, setActivePlatform,
  activeSort, setActiveSort,
  layoutMode, setLayoutMode,
  activeGroup, setActiveGroup,
}) {
  return (
    <section className="sticky top-[68px] z-30 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators, handles, keywords, niches..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-9 py-2 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-xl bg-zinc-100 p-1 border border-zinc-200">
              {FORMAT_OPTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveFormat(id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                    activeFormat === id ? "bg-white text-zinc-950 shadow-xs" : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  <Icon size={13} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <select
              value={activePlatform}
              onChange={(e) => setActivePlatform(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer shadow-xs"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
            </select>

            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer shadow-xs"
            >
              <option value="trending">Trending</option>
              <option value="rating">Highest Rated</option>
              <option value="views">Most Viewed</option>
              <option value="newest">Newest</option>
            </select>

            <div className="hidden sm:flex items-center rounded-xl bg-zinc-100 p-1 border border-zinc-200">
              {[
                { mode: "masonry", icon: Columns, title: "Masonry Layout" },
                { mode: "grid", icon: LayoutGrid, title: "Grid Layout" },
              ].map(({ mode, icon: Icon, title }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setLayoutMode(mode)}
                  className={`p-1 rounded-lg transition cursor-pointer ${
                    layoutMode === mode ? "bg-white text-zinc-950 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                  title={title}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
          <button
            type="button"
            onClick={() => setActiveGroup("all")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeGroup === "all" ? "bg-zinc-950 text-white shadow-xs" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <Sparkles size={12} />
            <span>All Categories</span>
          </button>
          {CATEGORY_GROUPS.map((group) => {
            const Icon = GROUP_META[group.id]?.icon || DEFAULT_GROUP_ICON;
            const active = activeGroup === group.id;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveGroup(group.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  active ? "bg-zinc-950 text-white shadow-xs" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                <Icon size={12} />
                <span>{group.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
