import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CONTENT_TYPES = [
  "All",
  "UGC Videos",
  "Short-Form Reels",
  "Product Reviews",
  "Product Unboxing",
  "Product Photography",
  "Testimonials & Demos",
];

const CATEGORIES = [
  "Any",
  "Beauty & Skincare",
  "Fashion & Apparel",
  "Tech & Electronics",
  "Fitness & Health",
  "Food & Beverage",
  "Home & Lifestyle",
  "Gaming & Apps",
];

export default function HeroSearchBar() {
  const [contentType, setContentType] = useState("All");
  const [category, setCategory] = useState("Any");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchMode, setSearchMode] = useState("content"); // 'content' | 'location'
  const searchBarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setIsTypeOpen(false);
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    navigate(`/creators?type=${encodeURIComponent(contentType)}&category=${encodeURIComponent(category)}&mode=${searchMode}`);
  };

  return (
    <div ref={searchBarRef} className="w-full max-w-3xl mx-auto mt-10 flex flex-col items-center relative z-40">
      {/* Search Input Container */}
      <div className="w-full bg-white/95 backdrop-blur-md rounded-full border border-zinc-200/90 shadow-xl shadow-pink-500/5 p-2 sm:p-2.5 flex items-center justify-between gap-2 relative z-30 transition-all hover:border-pink-300">
        
        {/* Content Type Selector */}
        <div className="relative flex-1 pl-4 sm:pl-6 text-left border-r border-zinc-200">
          <button
            type="button"
            onClick={() => {
              setIsTypeOpen(!isTypeOpen);
              setIsCategoryOpen(false);
            }}
            className="w-full flex flex-col items-start focus:outline-hidden group cursor-pointer"
          >
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {searchMode === "content" ? "Content Type" : "Location / Region"}
            </span>
            <div className="flex items-center justify-between w-full pr-3 mt-0.5">
              <span className="text-sm sm:text-base font-bold text-zinc-800 truncate">
                {contentType}
              </span>
              <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isTypeOpen ? "rotate-180 text-[#FF1475]" : ""}`} />
            </div>
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isTypeOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-zinc-200 p-2 z-50 max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-pink-300 [&::-webkit-scrollbar-track]:bg-transparent"
              >
                {CONTENT_TYPES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setContentType(item);
                      setIsTypeOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                      contentType === item
                        ? "bg-pink-50 text-[#FF1475] font-bold"
                        : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                    }`}
                  >
                    <span>{item}</span>
                    {contentType === item && <Check size={16} className="text-[#FF1475]" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Selector */}
        <div className="relative flex-1 pl-3 sm:pl-4 text-left">
          <button
            type="button"
            onClick={() => {
              setIsCategoryOpen(!isCategoryOpen);
              setIsTypeOpen(false);
            }}
            className="w-full flex flex-col items-start focus:outline-hidden group cursor-pointer"
          >
            <span className="text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Category
            </span>
            <div className="flex items-center justify-between w-full pr-2 sm:pr-4 mt-0.5">
              <span className="text-sm sm:text-base font-bold text-zinc-800 truncate">
                {category}
              </span>
              <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isCategoryOpen ? "rotate-180 text-[#FF1475]" : ""}`} />
            </div>
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isCategoryOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-zinc-200 p-2 z-50 max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-pink-300 [&::-webkit-scrollbar-track]:bg-transparent"
              >
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setCategory(item);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                      category === item
                        ? "bg-pink-50 text-[#FF1475] font-bold"
                        : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                    }`}
                  >
                    <span>{item}</span>
                    {category === item && <Check size={16} className="text-[#FF1475]" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pink Search Button */}
        <button
          type="button"
          onClick={handleSearch}
          aria-label="Search Creators"
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-[#FF006E] to-[#FF2A85] text-white flex items-center justify-center shadow-lg shadow-pink-500/35 hover:scale-105 active:scale-95 transition-transform flex-shrink-0 cursor-pointer"
        >
          <Search size={20} className="sm:size-5.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Toggle By Content / By Location */}
      <div className="mt-5 flex items-center gap-3 text-sm font-semibold select-none">
        <span
          onClick={() => setSearchMode("content")}
          className={`cursor-pointer transition-colors ${
            searchMode === "content" ? "text-gray-900 font-bold" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          By Content
        </span>

        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => setSearchMode(searchMode === "content" ? "location" : "content")}
          className="w-12 h-6.5 bg-gray-200 rounded-full p-0.5 flex items-center cursor-pointer transition-colors relative"
          aria-label="Toggle search mode"
        >
          <motion.div
            className="w-5.5 h-5.5 bg-white rounded-full shadow-md"
            animate={{ x: searchMode === "location" ? 22 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>

        <span
          onClick={() => setSearchMode("location")}
          className={`cursor-pointer transition-colors ${
            searchMode === "location" ? "text-gray-900 font-bold" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          By Location
        </span>
      </div>
    </div>
  );
}
