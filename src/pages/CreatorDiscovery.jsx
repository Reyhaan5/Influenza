import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, MapPin, X } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/footer/Footer";
import FilterDropdown from "../components/discovery/FilterDropdown";
import CreatorDiscoveryCard from "../components/discovery/CreatorDiscoveryCard";
import { POPULAR_NICHES, GENDERS, ETHNICITIES } from "../constants/creatorMeta";
import { DEFAULT_CREATORS } from "../fixtures/creatorsMock";
import api from "../config/api";

const CONTENT_TYPES = [
  { label: "Content Type", value: "" },
  { label: "UGC Video", value: "video" },
  { label: "UGC Photos", value: "photo" },
  { label: "Instagram Reels", value: "reel" },
  { label: "Instagram Stories", value: "story" },
  { label: "Product Review", value: "review" },
];

const FOLLOWER_RANGES = [
  { label: "Followers", value: "" },
  { label: "1k - 10k", value: "1k-10k" },
  { label: "10k - 50k", value: "10k-50k" },
  { label: "50k - 100k", value: "50k-100k" },
  { label: "100k+", value: "100k+" },
];

const PRICE_RANGES = [
  { label: "Price", value: "" },
  { label: "Under $100", value: "under-100" },
  { label: "$100 - $250", value: "100-250" },
  { label: "$250 - $500", value: "250-500" },
  { label: "$500+", value: "500+" },
];

const GENDER_OPTIONS = [{ label: "Gender", value: "" }, ...GENDERS.map((g) => ({ label: g, value: g }))];
const AGE_RANGES = [
  { label: "Age", value: "" },
  { label: "18 - 24", value: "18-24" },
  { label: "25 - 34", value: "25-34" },
  { label: "35 - 44", value: "35-44" },
  { label: "45+", value: "45+" },
];
const ETHNICITY_OPTIONS = [{ label: "Ethnicity", value: "" }, ...ETHNICITIES.map((e) => ({ label: e, value: e }))];
const LANGUAGES = [
  { label: "Language", value: "" },
  { label: "English", value: "English" },
  { label: "Spanish", value: "Spanish" },
  { label: "Hindi", value: "Hindi" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
];

export default function CreatorDiscovery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const categoryPopupRef = useRef(null);

  // Read current active filters from URL
  const filters = {
    platform: searchParams.get("platform") || "Instagram",
    category: searchParams.get("category") || searchParams.get("q") || "",
    contentType: searchParams.get("contentType") || "",
    followers: searchParams.get("followers") || "",
    location: searchParams.get("location") || searchParams.get("city") || searchParams.get("state") || "",
    price: searchParams.get("price") || "",
    gender: searchParams.get("gender") || "",
    age: searchParams.get("age") || "",
    ethnicity: searchParams.get("ethnicity") || "",
    language: searchParams.get("language") || "",
  };

  const [categoryInput, setCategoryInput] = useState(filters.category);
  const [locationInput, setLocationInput] = useState(filters.location);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedIds, setSavedIds] = useState(new Set());

  // Close popup on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (categoryPopupRef.current && !categoryPopupRef.current.contains(e.target)) {
        setShowCategoryPopup(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Saved IDs sync
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api.get("/brand/saved-creators/ids")
      .then((res) => setSavedIds(new Set(res.data.savedIds || [])))
      .catch(() => {});
  }, []);

  // Update query params helper
  const updateFilters = (newParams) => {
    const updated = { ...filters, ...newParams };
    const nextParams = {};
    Object.entries(updated).forEach(([k, v]) => {
      if (v && v !== "Any platform" && v !== "Any") nextParams[k] = v;
    });
    setSearchParams(nextParams);
  };

  const fetchCreators = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/public/creator-discovery", { params: filters });
      if (res.data.creators?.length > 0) {
        setCreators(res.data.creators);
      } else {
        let filtered = [...DEFAULT_CREATORS];
        if (filters.category) {
          const q = filters.category.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.displayName.toLowerCase().includes(q) ||
              c.handle.toLowerCase().includes(q) ||
              c.niches.some((n) => n.toLowerCase().includes(q))
          );
        }
        setCreators(filtered);
      }
    } catch (err) {
      setCreators(DEFAULT_CREATORS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCategoryInput(filters.category);
    setLocationInput(filters.location);
    fetchCreators();
  }, [searchParams.toString()]);

  const handleToggleFavorite = async (creatorId, e) => {
    if (e) e.preventDefault();
    if (!localStorage.getItem("token")) return alert("Please log in to save creators to your lists.");

    try {
      const isCurrentlySaved = savedIds.has(String(creatorId));
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlySaved) next.delete(String(creatorId));
        else next.add(String(creatorId));
        return next;
      });
      await api.post(`/brand/saved-creators/${creatorId}`, {});
    } catch (err) {
      console.error("Error saving creator:", err);
    }
  };

  const handleClearAll = () => {
    setCategoryInput("");
    setLocationInput("");
    setSearchParams({});
  };

  const hasAnyActiveFilters = Object.values(filters).some((v) => v && v !== "Instagram");

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Main Search Bar & Filters */}
        <div className="max-w-5xl mx-auto mb-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateFilters({ category: categoryInput.trim() });
            }}
            className="bg-white border border-gray-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.06)] rounded-full p-2 pl-6 sm:pl-8 flex items-center justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)] transition-all duration-300"
          >
            {/* Platform */}
            <div className="flex-shrink-0 w-36 sm:w-44 pr-4 border-r border-gray-100">
              <label className="block text-[11px] font-bold text-gray-800 tracking-tight">Platform</label>
              <select
                value={filters.platform}
                onChange={(e) => updateFilters({ platform: e.target.value })}
                className="w-full text-xs sm:text-sm font-semibold text-gray-700 focus:outline-none bg-transparent cursor-pointer"
              >
                <option value="Instagram">Instagram</option>
              </select>
            </div>

            {/* Category search */}
            <div className="flex-1 px-4 sm:px-6 relative">
              <label className="block text-[11px] font-bold text-gray-800 tracking-tight">Category</label>
              <input
                type="text"
                value={categoryInput}
                onFocus={() => setShowCategoryPopup(true)}
                onChange={(e) => {
                  setCategoryInput(e.target.value);
                  setShowCategoryPopup(true);
                }}
                placeholder="Enter keywords, niches or categories"
                className="w-full text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
              />

              {showCategoryPopup && (
                <div
                  ref={categoryPopupRef}
                  className="absolute left-0 top-full mt-3 w-[calc(100vw-3rem)] sm:w-[580px] max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-2xl z-50 p-5 animate-fadeIn"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Popular</p>
                    <button type="button" onClick={() => setShowCategoryPopup(false)} className="text-gray-400 hover:text-black text-xs cursor-pointer">
                      <X size={15} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                    {POPULAR_NICHES.map((niche) => {
                      const isSelected = categoryInput.toLowerCase() === niche.toLowerCase();
                      return (
                        <button
                          key={niche}
                          type="button"
                          onClick={() => {
                            setCategoryInput(niche);
                            updateFilters({ category: niche });
                            setShowCategoryPopup(false);
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                            isSelected ? "bg-black text-white font-bold" : "bg-gray-100/90 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {niche}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-[#18181B] hover:bg-black text-white shadow-md transition-transform active:scale-95 cursor-pointer"
              aria-label="Search"
            >
              <Search size={19} strokeWidth={2.4} />
            </button>
          </form>

          {/* Filter Pills Row */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-1 overflow-x-visible">
            <FilterDropdown
              label="Content Type"
              value={filters.contentType}
              options={CONTENT_TYPES}
              onChange={(val) => updateFilters({ contentType: val })}
            />
            <FilterDropdown
              label="Followers"
              value={filters.followers}
              options={FOLLOWER_RANGES}
              onChange={(val) => updateFilters({ followers: val })}
            />
            <FilterDropdown
              label={locationInput ? `Location: ${locationInput}` : "Location"}
              value={locationInput}
              customRender={(close) => (
                <div className="p-3 w-56 space-y-2">
                  <p className="text-[11px] font-bold text-gray-700">Filter by Location</p>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="e.g. London, Mumbai, NY"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setLocationInput("");
                        updateFilters({ location: "" });
                        close();
                      }}
                      className="px-2.5 py-1 text-[11px] text-gray-500 hover:text-black cursor-pointer"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateFilters({ location: locationInput });
                        close();
                      }}
                      className="px-3 py-1 bg-black text-white text-[11px] font-bold rounded-lg cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            />
            <FilterDropdown
              label="Price"
              value={filters.price}
              options={PRICE_RANGES}
              onChange={(val) => updateFilters({ price: val })}
            />
            <FilterDropdown
              label="Gender"
              value={filters.gender}
              options={GENDER_OPTIONS}
              onChange={(val) => updateFilters({ gender: val })}
            />
            <FilterDropdown
              label="Age"
              value={filters.age}
              options={AGE_RANGES}
              isPremium
              onChange={(val) => updateFilters({ age: val })}
            />
            <FilterDropdown
              label="Ethnicity"
              value={filters.ethnicity}
              options={ETHNICITY_OPTIONS}
              isPremium
              onChange={(val) => updateFilters({ ethnicity: val })}
            />
            <FilterDropdown
              label="Language"
              value={filters.language}
              options={LANGUAGES}
              isPremium
              onChange={(val) => updateFilters({ language: val })}
            />

            {hasAnyActiveFilters && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-semibold text-gray-600 hover:text-black underline ml-2 transition cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
              Browse UGC Creators {filters.location ? `in ${filters.location}` : ""}
            </h2>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              {creators.length} {creators.length === 1 ? "Creator" : "Creators"} Found
            </span>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 animate-pulse">
                  <div className="h-56 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
                </div>
              ))}
            </div>
          ) : creators.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-3xl p-8 max-w-lg mx-auto">
              <MapPin size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-bold text-gray-900">No creators found</h3>
              <p className="mt-1 text-sm text-gray-500">
                We couldn't find any creators matching your filter criteria. Try clearing or broadening your search filters.
              </p>
              <button
                onClick={handleClearAll}
                className="mt-5 px-5 py-2.5 bg-black hover:bg-black/90 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {creators.map((creator) => (
                <CreatorDiscoveryCard
                  key={creator.id}
                  creator={creator}
                  isSaved={savedIds.has(String(creator.id))}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
