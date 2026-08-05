// src/components/common/GlowingSearchBar.jsx
import React, { useEffect, useRef, useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlowingSearchBar({ placeholder = "Search...", onSearch, onFilterClick }) {
  const [query, setQuery] = useState("");
  const debounceRef = useRef(null);

  const fireSearch = (value) => {
    if (onSearch) onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    clearTimeout(debounceRef.current);
    fireSearch("");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounced live-search — avoids firing a network call on every
    // keystroke. Enter/submit below bypasses this and fires instantly.
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fireSearch(value), 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    fireSearch(query);
  };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <div className="relative w-full max-w-md mx-auto group">
      {/* Rotating glow ring — brand colors, the one signature flourish */}
      <div className="absolute -inset-[2px] rounded-2xl overflow-hidden p-[2px]">
        <div
          className="absolute inset-[-200%] animate-[spin_4s_linear_infinite] blur-md"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0 300deg, var(--color-primary-light) 320deg, var(--color-primary) 340deg, var(--color-primary-hover) 360deg)",
          }}
        />
        <div
          className="absolute inset-[-200%] animate-[spin_4s_linear_infinite] opacity-80"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0 300deg, var(--color-primary-light) 320deg, var(--color-primary) 340deg, var(--color-primary-hover) 360deg)",
          }}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative flex items-center justify-between gap-3 bg-[var(--color-surface)] backdrop-blur-xl rounded-2xl px-4 py-3 shadow-[var(--shadow-card)] border border-[var(--color-border)]"
      >
        <Search className="w-5 h-5 text-[var(--color-text-light)] flex-shrink-0" />

        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-[var(--color-text)] text-base placeholder-[var(--color-text)]/40 focus:outline-none font-medium"
        />

        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={handleClear}
              className="p-1 rounded-full text-[var(--color-text-light)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            className="flex items-center justify-center p-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-light)] hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-all duration-200 flex-shrink-0"
            aria-label="Filter"
          >
            <Filter className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
}