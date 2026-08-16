import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Section from "../components/common/Section";
import CategoryPill from "../components/categories/CategoryPill";
import { CATEGORY_GROUPS } from "../constants/categoryTaxonomy";

export default function BrowseCategories() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORY_GROUPS;

    return CATEGORY_GROUPS.map((group) => ({
      ...group,
      categories: group.categories.filter((c) => c.toLowerCase().includes(q)),
    })).filter((group) => group.categories.length > 0);
  }, [query]);

  const handleSelect = (category) => {
    navigate(`/categories/${encodeURIComponent(category)}`);
  };

  return (
    <>
      <Navbar />
      <Section className="pt-32">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex rounded-full bg-[var(--color-primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
            Explore Creators
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-[var(--color-text)] leading-tight">
            Browse by Category
          </h1>
          <p className="mt-4 text-lg text-[var(--color-text-light)]">
            Pick a niche to see the creators building an audience there.
          </p>
        </div>

        <div className="mt-10 max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-11 pr-4 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
          />
        </div>

        <div className="mt-14 flex flex-col gap-12">
          {filteredGroups.length === 0 && (
            <p className="text-center text-[var(--color-text-light)]">
              No categories match "{query}".
            </p>
          )}

          {filteredGroups.map((group) => (
            <div key={group.id}>
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">{group.label}</h2>
              <div className="flex flex-wrap gap-2.5">
                {group.categories.map((category) => (
                  <CategoryPill
                    key={category}
                    label={category}
                    onClick={() => handleSelect(category)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}