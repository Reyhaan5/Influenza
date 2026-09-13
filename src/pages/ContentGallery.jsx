import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Sparkles,
  Search,
  X,
  SlidersHorizontal,
  Film,
  Image as ImageIcon,
  LayoutGrid,
  Columns,
  Flame,
  Star,
  Eye,
  Users,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  Clock,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/footer/Footer";
import Section from "../components/common/Section";
import GalleryCard from "../components/gallery/GalleryCard";
import GalleryLightbox from "../components/gallery/GalleryLightbox";
import { GROUP_META, DEFAULT_GROUP_ICON } from "../constants/categoryGroupMeta";
import { CATEGORY_GROUPS } from "../constants/categoryTaxonomy";
import { API_URL } from "../config/api";

export default function ContentGallery() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    creatorsCount: 0,
    totalViews: 0,
    avgRating: "4.9",
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [activeGroup, setActiveGroup] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeFormat, setActiveFormat] = useState("all"); // "all" | "video" | "image"
  const [activePlatform, setActivePlatform] = useState("all"); // "all" | "instagram" | "tiktok" | "youtube"
  const [activeSort, setActiveSort] = useState("trending"); // "trending" | "rating" | "views" | "newest"
  const [layoutMode, setLayoutMode] = useState("masonry"); // "masonry" | "grid"

  // Lightbox & Saved state
  const [activeItem, setActiveItem] = useState(null);
  const [savedItemIds, setSavedItemIds] = useState(new Set());

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Map active category group to backend query parameter
  const groupCategoriesParam = useMemo(() => {
    if (activeGroup === "all") return "";
    const group = CATEGORY_GROUPS.find((g) => g.id === activeGroup);
    return group ? group.categories.join(",") : "";
  }, [activeGroup]);

  const fetchGallery = async (targetPage, replace = false) => {
    try {
      if (replace) setLoading(true);
      else setLoadingMore(true);

      const res = await axios.get(`${API_URL}/public/gallery`, {
        params: {
          page: targetPage,
          limit: 16,
          category: groupCategoriesParam || undefined,
          platform: activePlatform !== "all" ? activePlatform : undefined,
          mediaType: activeFormat !== "all" ? activeFormat : undefined,
          q: debouncedQuery || undefined,
          sort: activeSort,
        },
      });

      if (replace) {
        setItems(res.data.items || []);
      } else {
        setItems((prev) => [...prev, ...(res.data.items || [])]);
      }

      setPages(res.data.pages || 1);
      setPage(targetPage);
      setTotal(res.data.total || 0);
      if (res.data.stats) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error("Error fetching content gallery:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Re-fetch when any filter changes
  useEffect(() => {
    fetchGallery(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroup, activePlatform, activeFormat, debouncedQuery, activeSort]);

  const handleToggleSave = (item) => {
    setSavedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });
  };

  const handleClearAllFilters = () => {
    setActiveGroup("all");
    setSearchQuery("");
    setActiveFormat("all");
    setActivePlatform("all");
    setActiveSort("trending");
  };

  const hasActiveFilters =
    activeGroup !== "all" ||
    activePlatform !== "all" ||
    activeFormat !== "all" ||
    searchQuery.trim() !== "" ||
    activeSort !== "trending";

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-zinc-900">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION - CLEAN SOLID STYLING */}
        <section className="relative pt-36 pb-12 bg-white border-b border-zinc-200">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-zinc-100 px-3.5 py-1.5 text-xs font-semibold text-zinc-800">
                <Sparkles size={13} className="text-zinc-700" />
                <span>Creator Content Showcase</span>
              </div>

              {/* Headline */}
              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 leading-[1.15]">
                Content by Real Creators
              </h1>

              {/* Subtitle */}
              <p className="mt-3.5 text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl">
                Browse verified UGC videos, Instagram reels, product unboxings,
                and high-resolution photography produced by creators on Influenza.
              </p>

              {/* Metric Highlights Pill Strip */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-700">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-50 px-3 py-1.5 border border-zinc-200">
                  <Flame size={14} className="text-zinc-700" />
                  <span>Real Creator Deliverables</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-50 px-3 py-1.5 border border-zinc-200">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span>{stats.avgRating} / 5.0 Rating</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-50 px-3 py-1.5 border border-zinc-200">
                  <ShieldCheck size={14} className="text-zinc-700" />
                  <span>Verified Creators</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-50 px-3 py-1.5 border border-zinc-200">
                  <Eye size={14} className="text-zinc-700" />
                  <span>
                    {stats.totalViews >= 1000
                      ? `${(stats.totalViews / 1000).toFixed(0)}k+`
                      : stats.totalViews}{" "}
                    Views
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* DISCOVERY & FILTER TOOLBAR */}
        <section className="sticky top-[68px] z-30 bg-white border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                />
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

              {/* Format, Platform & Sort Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Media Format Filter Pills */}
                <div className="flex items-center rounded-xl bg-zinc-100 p-1 border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setActiveFormat("all")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                      activeFormat === "all"
                        ? "bg-white text-zinc-950 shadow-xs"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    <LayoutGrid size={13} />
                    <span>All</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFormat("video")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                      activeFormat === "video"
                        ? "bg-white text-zinc-950 shadow-xs"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    <Film size={13} />
                    <span>Reels & Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFormat("image")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                      activeFormat === "image"
                        ? "bg-white text-zinc-950 shadow-xs"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    <ImageIcon size={13} />
                    <span>Photos</span>
                  </button>
                </div>

                {/* Platform Filter */}
                <select
                  value={activePlatform}
                  onChange={(e) => setActivePlatform(e.target.value)}
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer shadow-xs"
                >
                  <option value="all">All Platforms</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                </select>

                {/* Sort Selector */}
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

                {/* Layout Mode Switcher */}
                <div className="hidden sm:flex items-center rounded-xl bg-zinc-100 p-1 border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setLayoutMode("masonry")}
                    className={`p-1 rounded-lg transition cursor-pointer ${
                      layoutMode === "masonry"
                        ? "bg-white text-zinc-950 shadow-xs"
                        : "text-zinc-500 hover:text-zinc-900"
                    }`}
                    title="Masonry Layout"
                  >
                    <Columns size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayoutMode("grid")}
                    className={`p-1 rounded-lg transition cursor-pointer ${
                      layoutMode === "grid"
                        ? "bg-white text-zinc-950 shadow-xs"
                        : "text-zinc-500 hover:text-zinc-900"
                    }`}
                    title="Grid Layout"
                  >
                    <LayoutGrid size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* HORIZONTAL CATEGORY PILL CAROUSEL */}
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
              <button
                type="button"
                onClick={() => setActiveGroup("all")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  activeGroup === "all"
                    ? "bg-zinc-950 text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
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
                      active
                        ? "bg-zinc-950 text-white shadow-xs"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
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

        {/* CONTENT SHOWCASE GRID */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Active Filter Chips & Results Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-600">
              <span className="font-bold text-zinc-950">
                {total} {total === 1 ? "deliverable" : "deliverables"} found
              </span>

              {activeGroup !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-200/80 px-2 py-0.5 text-zinc-800">
                  Category: {CATEGORY_GROUPS.find((g) => g.id === activeGroup)?.label}
                  <button
                    type="button"
                    onClick={() => setActiveGroup("all")}
                    className="hover:text-black"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}

              {activeFormat !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-200/80 px-2 py-0.5 text-zinc-800">
                  Format: {activeFormat === "video" ? "Reels & Video" : "Photos"}
                  <button
                    type="button"
                    onClick={() => setActiveFormat("all")}
                    className="hover:text-black"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}

              {activePlatform !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-200/80 px-2 py-0.5 text-zinc-800 capitalize">
                  {activePlatform}
                  <button
                    type="button"
                    onClick={() => setActivePlatform("all")}
                    className="hover:text-black"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}

              {debouncedQuery && (
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-200/80 px-2 py-0.5 text-zinc-800">
                  "{debouncedQuery}"
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="hover:text-black"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="text-xs font-bold text-zinc-500 hover:text-black underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-xs animate-pulse space-y-3"
                >
                  <div className="aspect-[4/5] w-full rounded-xl bg-zinc-200" />
                  <div className="h-4 bg-zinc-200 rounded w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-base font-extrabold text-zinc-950">
                No matching creator content found
              </h3>
              <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                We couldn't find any showcase items matching your current filters. Try resetting your search or selecting a different category.
              </p>
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-black transition cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            /* Gallery Cards Grid */
            <>
              <div
                className={`
                  grid gap-6
                  ${
                    layoutMode === "masonry"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  }
                `}
              >
                {items.map((item) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    onOpen={setActiveItem}
                    isSaved={savedItemIds.has(item.id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {page < pages && (
                <div className="mt-12 flex justify-center">
                  <button
                    type="button"
                    onClick={() => fetchGallery(page + 1, false)}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-8 py-3 text-xs font-extrabold text-zinc-900 shadow-sm transition hover:bg-zinc-50 hover:border-zinc-400 disabled:opacity-60 cursor-pointer"
                  >
                    {loadingMore ? (
                      <>
                        <RefreshCw size={14} className="animate-spin text-zinc-600" />
                        <span>Loading more content...</span>
                      </>
                    ) : (
                      <>
                        <span>Load more content ({total - items.length} remaining)</span>
                        <ChevronRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* LIGHTBOX THEATER MODAL */}
      <GalleryLightbox
        item={activeItem}
        items={items}
        onClose={() => setActiveItem(null)}
        onSelectItem={setActiveItem}
      />
    </div>
  );
}

