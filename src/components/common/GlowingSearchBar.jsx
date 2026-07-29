import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlowingSearchBar({ placeholder = "Search...", onSearch, onFilterClick }) {
  const [query, setQuery] = useState("");

  const handleClear = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  return (
    <div className="relative w-full max-w-md mx-auto group">
      {/* Rotating glow ring — brand colors */}
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

      <div className="relative flex items-center justify-between gap-3 bg-zinc-950/95 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-2xl">
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />

        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-white text-base placeholder:text-gray-500 focus:outline-none font-medium"
        />

        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={handleClear}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={onFilterClick}
          className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all duration-200 flex-shrink-0"
          style={{ "--tw-hover-bg": "var(--color-primary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--color-primary) 20%, transparent)";
            e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-primary) 50%, transparent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "";
            e.currentTarget.style.borderColor = "";
          }}
          aria-label="Filter"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}