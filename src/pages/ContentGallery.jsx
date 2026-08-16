import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Sparkles } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [activeGroup, setActiveGroup] = useState("all");
  const [activeItem, setActiveItem] = useState(null);

  // A niche group maps to a comma-list of individual categories the
  // backend can match against an influencer's profile.categories array.
  const groupCategoriesParam = useMemo(() => {
    if (activeGroup === "all") return "";
    const group = CATEGORY_GROUPS.find((g) => g.id === activeGroup);
    return group ? group.categories.join(",") : "";
  }, [activeGroup]);

  const fetchGallery = async (targetPage, replace) => {
    try {
      if (replace) setLoading(true);
      else setLoadingMore(true);

      const res = await axios.get(`${API_URL}/public/gallery`, {
        params: {
          page: targetPage,
          limit: 12,
          category: groupCategoriesParam || undefined,
        },
      });

      setItems((prev) => (replace ? res.data.items : [...prev, ...res.data.items]));
      setPages(res.data.pages);
      setPage(targetPage);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchGallery(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroup]);

  return (
    <>
      <Navbar />

      <Section className="pt-40">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
            <Sparkles size={14} /> Content Gallery
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-[var(--color-text)] md:text-5xl">
            Real content from real creators
          </h1>

          <p className="mt-4 text-lg text-[var(--color-text-light)]">
            Browse authentic content published by creators on Influenza — no account or login required.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-text-light)]">
              Popular Niches
            </p>

            <div className="flex flex-row flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-1">
              <button
                onClick={() => setActiveGroup("all")}
                className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  activeGroup === "all"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text)] hover:bg-[var(--color-background)]"
                }`}
              >
                <span
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md ${
                    activeGroup === "all"
                      ? "bg-white/20"
                      : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  }`}
                >
                  <Sparkles size={13} />
                </span>
                All Categories
              </button>

              {CATEGORY_GROUPS.map((group) => {
                const Icon = GROUP_META[group.id]?.icon || DEFAULT_GROUP_ICON;
                const active = activeGroup === group.id;
                return (
                  <button
                    key={group.id}
                    onClick={() => setActiveGroup(group.id)}
                    className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--color-text)] hover:bg-[var(--color-background)]"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md ${
                        active ? "bg-white/20" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      }`}
                    >
                      <Icon size={13} />
                    </span>
                    {group.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Grid */}
          <div>
            {loading ? (
              <p className="text-[var(--color-text-light)]">Loading content...</p>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--color-border)] py-20 text-center">
                <p className="text-[var(--color-text-light)]">
                  No content in this category yet — check back soon.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                  {items.map((item) => (
                    <GalleryCard key={item.id} item={item} onOpen={setActiveItem} />
                  ))}
                </div>

                {page < pages && (
                  <div className="mt-10 flex justify-center">
                    <button
                      onClick={() => fetchGallery(page + 1, false)}
                      disabled={loadingMore}
                      className="rounded-xl border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-background)] disabled:opacity-60"
                    >
                      {loadingMore ? "Loading..." : "Load more"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Section>

      <Footer />

      <GalleryLightbox item={activeItem} onClose={() => setActiveItem(null)} />
    </>
  );
}
