import React, { useEffect, useMemo, useState } from "react";
import { Flame, Star, Eye, ShieldCheck, RefreshCw, ChevronRight, X, Search } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/footer/Footer";
import GalleryCard from "../components/gallery/GalleryCard";
import GalleryLightbox from "../components/gallery/GalleryLightbox";
import GalleryToolbar from "../components/gallery/GalleryToolbar";
import { CATEGORY_GROUPS } from "../constants/categoryTaxonomy";
import api from "../config/api";

export default function ContentGallery() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ totalItems: 0, creatorsCount: 0, totalViews: 0, avgRating: "4.9" });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [activeGroup, setActiveGroup] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeFormat, setActiveFormat] = useState("all");
  const [activePlatform, setActivePlatform] = useState("all");
  const [activeSort, setActiveSort] = useState("trending");
  const [layoutMode, setLayoutMode] = useState("masonry");

  // Lightbox & Saved state
  const [activeItem, setActiveItem] = useState(null);
  const [savedItemIds, setSavedItemIds] = useState(new Set());

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const groupCategoriesParam = useMemo(() => {
    if (activeGroup === "all") return "";
    const group = CATEGORY_GROUPS.find((g) => g.id === activeGroup);
    return group ? group.categories.join(",") : "";
  }, [activeGroup]);

  const fetchGallery = async (targetPage, replace = false) => {
    try {
      if (replace) setLoading(true);
      else setLoadingMore(true);

      const res = await api.get("/public/gallery", {
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

      setItems((prev) => (replace ? res.data.items || [] : [...prev, ...(res.data.items || [])]));
      setPages(res.data.pages || 1);
      setPage(targetPage);
      setTotal(res.data.total || 0);
      if (res.data.stats) setStats(res.data.stats);
    } catch (error) {
      console.error("Error fetching content gallery:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchGallery(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroup, activePlatform, activeFormat, debouncedQuery, activeSort]);

  const handleToggleSave = (item) => {
    setSavedItemIds((prev) => {
      const next = new Set(prev);
      next.has(item.id) ? next.delete(item.id) : next.add(item.id);
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

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (activeGroup !== "all") {
      chips.push({ label: `Category: ${CATEGORY_GROUPS.find((g) => g.id === activeGroup)?.label}`, onClear: () => setActiveGroup("all") });
    }
    if (activeFormat !== "all") {
      chips.push({ label: `Format: ${activeFormat === "video" ? "Reels & Video" : "Photos"}`, onClear: () => setActiveFormat("all") });
    }
    if (activePlatform !== "all") {
      chips.push({ label: `Platform: ${activePlatform}`, onClear: () => setActivePlatform("all"), capitalize: true });
    }
    if (debouncedQuery) {
      chips.push({ label: `"${debouncedQuery}"`, onClear: () => setSearchQuery("") });
    }
    return chips;
  }, [activeGroup, activeFormat, activePlatform, debouncedQuery]);

  const metrics = [
    { icon: Flame, text: "Real Creator Deliverables", iconClass: "text-zinc-700" },
    { icon: Star, text: `${stats.avgRating} / 5.0 Rating`, iconClass: "text-amber-500 fill-amber-500" },
    { icon: ShieldCheck, text: "Verified Creators", iconClass: "text-zinc-700" },
    { icon: Eye, text: `${stats.totalViews >= 1000 ? `${(stats.totalViews / 1000).toFixed(0)}k+` : stats.totalViews} Views`, iconClass: "text-zinc-700" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-zinc-900">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-36 pb-12 bg-white border-b border-zinc-200">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 leading-[1.15]">
                Content by Real Creators
              </h1>
              <p className="mt-3.5 text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl">
                Browse verified UGC videos, Instagram reels, product unboxings,
                and high-resolution photography produced by creators on Influenza.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-700">
                {metrics.map(({ icon: Icon, text, iconClass }, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-50 px-3 py-1.5 border border-zinc-200">
                    <Icon size={14} className={iconClass} />
                    <span>{text}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TOOLBAR */}
        <GalleryToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFormat={activeFormat}
          setActiveFormat={setActiveFormat}
          activePlatform={activePlatform}
          setActivePlatform={setActivePlatform}
          activeSort={activeSort}
          setActiveSort={setActiveSort}
          layoutMode={layoutMode}
          setLayoutMode={setLayoutMode}
          activeGroup={activeGroup}
          setActiveGroup={setActiveGroup}
        />

        {/* CONTENT GRID */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-600">
              <span className="font-bold text-zinc-950">{total} {total === 1 ? "deliverable" : "deliverables"} found</span>
              {activeFilterChips.map((chip, i) => (
                <span key={i} className={`inline-flex items-center gap-1 rounded-md bg-zinc-200/80 px-2 py-0.5 text-zinc-800 ${chip.capitalize ? "capitalize" : ""}`}>
                  {chip.label}
                  <button type="button" onClick={chip.onClear} className="hover:text-black cursor-pointer"><X size={11} /></button>
                </span>
              ))}
            </div>

            {hasActiveFilters && (
              <button type="button" onClick={handleClearAllFilters} className="text-xs font-bold text-zinc-500 hover:text-black underline cursor-pointer">
                Clear all filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-xs animate-pulse space-y-3">
                  <div className="aspect-[4/5] w-full rounded-xl bg-zinc-200" />
                  <div className="h-4 bg-zinc-200 rounded w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-base font-extrabold text-zinc-950">No matching creator content found</h3>
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <GalleryCard key={item.id} item={item} onOpen={setActiveItem} isSaved={savedItemIds.has(item.id)} onToggleSave={handleToggleSave} />
                ))}
              </div>

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

      <GalleryLightbox item={activeItem} items={items} onClose={() => setActiveItem(null)} onSelectItem={setActiveItem} />
    </div>
  );
}
