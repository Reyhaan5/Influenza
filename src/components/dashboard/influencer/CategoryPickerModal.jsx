import React, { useMemo, useState } from "react";
import { X, Search, Check } from "lucide-react";
import { CATEGORY_GROUPS } from "../../../constants/categoryTaxonomy";

const MAX_CATEGORIES = 3;

export default function CategoryPickerModal({ initialCategories = [], onClose, onSave, saving }) {
  const [selected, setSelected] = useState(initialCategories);
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORY_GROUPS;
    return CATEGORY_GROUPS.map((g) => ({
      ...g,
      categories: g.categories.filter((c) => c.toLowerCase().includes(q)),
    })).filter((g) => g.categories.length > 0);
  }, [query]);

  const toggle = (cat) => {
    setSelected((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : prev.length >= MAX_CATEGORIES ? prev : [...prev, cat]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-text)]/40 px-4">
      <div className="w-full max-w-lg bg-[var(--color-surface)] rounded-2xl p-6 shadow-xl relative max-h-[85vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--color-text)]/50 hover:text-[var(--color-text)] cursor-pointer"><X size={18} /></button>
        <h3 className="font-bold text-lg text-[var(--color-text)] mb-1">Your Categories</h3>
        <p className="text-xs text-[var(--color-text-light)] mb-4">Pick up to {MAX_CATEGORIES} niches that best describe your content. ({selected.length}/{MAX_CATEGORIES} selected)</p>

        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search categories..." className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm" />
        </div>

        <div className="overflow-y-auto flex-1 flex flex-col gap-6 pr-1">
          {filteredGroups.map((group) => (
            <div key={group.id}>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-light)] mb-2">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {group.categories.map((cat) => {
                  const isSel = selected.includes(cat);
                  const disabled = !isSel && selected.length >= MAX_CATEGORIES;
                  return (
                    <button
                      key={cat}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggle(cat)}
                      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        isSel ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : disabled ? "border-[var(--color-border)] text-[var(--color-text-light)]/50 cursor-not-allowed" : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
                      }`}
                    >
                      {isSel && <Check size={12} />} {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => onSave(selected)} disabled={saving} className="mt-5 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-60 cursor-pointer">
          {saving ? "Saving..." : "Save Categories"}
        </button>
      </div>
    </div>
  );
}
