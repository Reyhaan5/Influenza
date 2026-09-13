import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Play,
  CheckCircle2,
  ChevronRight,
  Star,
  MapPin,
  ChevronDown,
  X,
  Sparkles,
  Heart,
} from "lucide-react";
import axios from "axios";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/footer/Footer";
import { API_URL } from "../config/api";

const PLATFORMS = [
  "Instagram",
];

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

const GENDERS = [
  { label: "Gender", value: "" },
  { label: "Female", value: "Female" },
  { label: "Male", value: "Male" },
  { label: "Non-binary", value: "Non-binary" },
];

const AGE_RANGES = [
  { label: "Age", value: "" },
  { label: "18 - 24", value: "18-24" },
  { label: "25 - 34", value: "25-34" },
  { label: "35 - 44", value: "35-44" },
  { label: "45+", value: "45+" },
];

const ETHNICITIES = [
  { label: "Ethnicity", value: "" },
  { label: "Asian", value: "Asian" },
  { label: "Black / African", value: "Black" },
  { label: "Hispanic / Latino", value: "Hispanic" },
  { label: "White / Caucasian", value: "White" },
  { label: "Mixed / Other", value: "Mixed" },
];

const LANGUAGES = [
  { label: "Language", value: "" },
  { label: "English", value: "English" },
  { label: "Spanish", value: "Spanish" },
  { label: "Hindi", value: "Hindi" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
];

export const DEFAULT_CREATORS = [
  {
    id: "660000000000000000000001",
    profileId: "660000000000000000000001",
    handle: "sarahj_ugc",
    displayName: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    city: "Los Angeles",
    state: "California",
    country: "United States",
    locality: "Los Angeles, CA",
    niches: ["Beauty & Skincare", "Fashion & Style", "Lifestyle", "UGC Videos"],
    bio: "Passionate UGC creator specializing in authentic aesthetic product reviews, unboxings, and high-converting TikTok/Reels videos.",
    gender: "Female",
    ethnicity: "Caucasian",
    basePrice: 150,
    verified: true,
    rating: 4.9,
    reviewsCount: 28,
    jobsCompleted: 35,
    hasPitchVideo: true,
    pitchVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-1232-large.mp4",
    socialAccounts: [{ platform: "Instagram", followers: 85000, handle: "@sarahj_ugc" }],
    galleryCount: 12,
  },
  {
    id: "660000000000000000000002",
    profileId: "660000000000000000000002",
    handle: "david_fitlife",
    displayName: "David Miller",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    city: "Miami",
    state: "Florida",
    country: "United States",
    locality: "Miami, FL",
    niches: ["Fitness & Gym", "Health & Wellness", "Nutrition", "Product Review"],
    bio: "Certified personal trainer and fitness influencer creating engaging high-energy workout routines and supplement reviews.",
    gender: "Male",
    ethnicity: "Caucasian",
    basePrice: 220,
    verified: true,
    rating: 4.8,
    reviewsCount: 19,
    jobsCompleted: 24,
    hasPitchVideo: false,
    pitchVideoUrl: null,
    socialAccounts: [{ platform: "Instagram", followers: 120000, handle: "@david_fitlife" }],
    galleryCount: 8,
  },
  {
    id: "660000000000000000000003",
    profileId: "660000000000000000000003",
    handle: "elena_aesthetic",
    displayName: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
    city: "New York",
    state: "New York",
    country: "United States",
    locality: "New York, NY",
    niches: ["Fashion", "Luxury Lifestyle", "UGC Photos", "Instagram Reels"],
    bio: "Editorial fashion creator and digital storyteller bringing luxury and boutique brand narratives to life with cinema-grade UGC.",
    gender: "Female",
    ethnicity: "Caucasian",
    basePrice: 280,
    verified: true,
    rating: 5.0,
    reviewsCount: 42,
    jobsCompleted: 50,
    hasPitchVideo: true,
    pitchVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-posing-for-the-camera-40538-large.mp4",
    socialAccounts: [{ platform: "Instagram", followers: 195000, handle: "@elena_aesthetic" }],
    galleryCount: 16,
  },
  {
    id: "660000000000000000000004",
    profileId: "660000000000000000000004",
    handle: "alex_techugc",
    displayName: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",
    city: "Austin",
    state: "Texas",
    country: "United States",
    locality: "Austin, TX",
    niches: ["Technology & Gadgets", "Consumer Electronics", "Unboxing", "Tutorials"],
    bio: "Tech enthusiast building sleek, crisp 4K unboxings, gadget teardowns, and actionable desk setup guides.",
    gender: "Male",
    ethnicity: "Hispanic/Latino",
    basePrice: 190,
    verified: true,
    rating: 4.9,
    reviewsCount: 31,
    jobsCompleted: 40,
    hasPitchVideo: false,
    pitchVideoUrl: null,
    socialAccounts: [{ platform: "Instagram", followers: 92000, handle: "@alex_techugc" }],
    galleryCount: 10,
  },
  {
    id: "660000000000000000000005",
    profileId: "660000000000000000000005",
    handle: "chloedubois_paris",
    displayName: "Chloe Dubois",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80",
    city: "San Francisco",
    state: "California",
    country: "United States",
    locality: "San Francisco, CA",
    niches: ["Travel & Leisure", "Food & Beverage", "Cafes & Dining", "Hospitality"],
    bio: "Travel and culinary UGC creator exploring hidden gems, local cafes, boutique stays, and sustainable hospitality.",
    gender: "Female",
    ethnicity: "Caucasian",
    basePrice: 160,
    verified: true,
    rating: 4.7,
    reviewsCount: 15,
    jobsCompleted: 18,
    hasPitchVideo: true,
    pitchVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-on-a-rock-looking-at-the-ocean-40679-large.mp4",
    socialAccounts: [{ platform: "Instagram", followers: 64000, handle: "@chloedubois_paris" }],
    galleryCount: 14,
  },
  {
    id: "660000000000000000000006",
    profileId: "660000000000000000000006",
    handle: "mayapatel_wellness",
    displayName: "Maya Patel",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
    city: "Chicago",
    state: "Illinois",
    country: "United States",
    locality: "Chicago, IL",
    niches: ["Home & Decor", "Organic Living", "Mindfulness", "Self Care"],
    bio: "Holistic wellness advocate showcasing mindful morning routines, non-toxic home essentials, and eco-friendly brands.",
    gender: "Female",
    ethnicity: "South Asian",
    basePrice: 130,
    verified: true,
    rating: 4.9,
    reviewsCount: 22,
    jobsCompleted: 27,
    hasPitchVideo: false,
    pitchVideoUrl: null,
    socialAccounts: [{ platform: "Instagram", followers: 48000, handle: "@mayapatel_wellness" }],
    galleryCount: 9,
  },
];

function FilterDropdown({
  label,
  value,
  options,
  onChange,
  isPremium,
  customRender,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options?.find((o) => o.value === value);
  const displayLabel = selectedOption?.value ? selectedOption.label : label;
  const hasActiveValue = !!value;

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
          hasActiveValue
            ? "border-black bg-black text-white font-semibold shadow-sm"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        {isPremium && (
          <span className="absolute -top-2.5 right-2 px-1.5 py-0.2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-[9px] font-extrabold rounded-full shadow-sm uppercase tracking-tight">
            Premium
          </span>
        )}
        <span>{displayLabel}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          } ${hasActiveValue ? "text-white" : "text-gray-400"}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 min-w-[170px] bg-white border border-gray-200 rounded-2xl shadow-xl z-40 py-1.5 overflow-hidden animate-fadeIn">
          {customRender ? (
            customRender(() => setOpen(false))
          ) : (
            options?.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs transition flex items-center justify-between ${
                  value === opt.value
                    ? "bg-gray-100 font-bold text-black"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <CheckCircle2 size={13} className="text-black" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function CreatorDiscovery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State from URL Search Params
  const platformParam = searchParams.get("platform") || "Any platform";
  const categoryParam = searchParams.get("category") || searchParams.get("q") || "";
  const contentTypeParam = searchParams.get("contentType") || "";
  const followersParam = searchParams.get("followers") || "";
  const locationParam = searchParams.get("location") || searchParams.get("city") || searchParams.get("state") || "";
  const priceParam = searchParams.get("price") || "";
  const genderParam = searchParams.get("gender") || "";
  const ageParam = searchParams.get("age") || "";
  const ethnicityParam = searchParams.get("ethnicity") || "";
  const languageParam = searchParams.get("language") || "";

  // Local inputs
  const [platform, setPlatform] = useState(platformParam);
  const [categoryInput, setCategoryInput] = useState(categoryParam);
  const [contentType, setContentType] = useState(contentTypeParam);
  const [followers, setFollowers] = useState(followersParam);
  const [locationInput, setLocationInput] = useState(locationParam);
  const [price, setPrice] = useState(priceParam);
  const [gender, setGender] = useState(genderParam);
  const [age, setAge] = useState(ageParam);
  const [ethnicity, setEthnicity] = useState(ethnicityParam);
  const [language, setLanguage] = useState(languageParam);

  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const categoryPopupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryPopupRef.current && !categoryPopupRef.current.contains(e.target)) {
        setShowCategoryPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedIds, setSavedIds] = useState(new Set());

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_URL}/brand/saved-creators/ids`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSavedIds(new Set(res.data.savedIds || []));
      })
      .catch((err) => console.error("Error fetching saved creator IDs:", err));
  }, [token]);

  const handleToggleFavorite = async (creatorId, e) => {
    if (e) e.preventDefault();
    if (!token) {
      alert("Please log in to save creators to your lists.");
      return;
    }

    try {
      const isCurrentlySaved = savedIds.has(String(creatorId));
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlySaved) next.delete(String(creatorId));
        else next.add(String(creatorId));
        return next;
      });

      await axios.post(
        `${API_URL}/brand/saved-creators/${creatorId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error toggling creator save:", err);
    }
  };

  const fetchCreators = async (params) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/public/creator-discovery`, {
        params: {
          platform: params.platform && params.platform !== "Any platform" ? params.platform : undefined,
          category: params.category || undefined,
          q: params.category || undefined,
          contentType: params.contentType || undefined,
          followers: params.followers || undefined,
          location: params.location || undefined,
          price: params.price || undefined,
          gender: params.gender || undefined,
          age: params.age || undefined,
          ethnicity: params.ethnicity || undefined,
          language: params.language || undefined,
        },
      });
      if (res.data.creators && res.data.creators.length > 0) {
        setCreators(res.data.creators);
      } else {
        // Fallback filter on DEFAULT_CREATORS
        let filtered = [...DEFAULT_CREATORS];
        if (params.category) {
          const q = params.category.toLowerCase();
          filtered = filtered.filter((c) =>
            c.displayName.toLowerCase().includes(q) ||
            c.handle.toLowerCase().includes(q) ||
            c.niches.some((n) => n.toLowerCase().includes(q))
          );
        }
        setCreators(filtered);
      }
    } catch (err) {
      console.error(err);
      setCreators(DEFAULT_CREATORS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPlatform(platformParam);
    setCategoryInput(categoryParam);
    setContentType(contentTypeParam);
    setFollowers(followersParam);
    setLocationInput(locationParam);
    setPrice(priceParam);
    setGender(genderParam);
    setAge(ageParam);
    setEthnicity(ethnicityParam);
    setLanguage(languageParam);

    fetchCreators({
      platform: platformParam,
      category: categoryParam,
      contentType: contentTypeParam,
      followers: followersParam,
      location: locationParam,
      price: priceParam,
      gender: genderParam,
      age: ageParam,
      ethnicity: ethnicityParam,
      language: languageParam,
    });
  }, [
    platformParam,
    categoryParam,
    contentTypeParam,
    followersParam,
    locationParam,
    priceParam,
    genderParam,
    ageParam,
    ethnicityParam,
    languageParam,
  ]);

  const updateFilters = (newFilters) => {
    const combined = {
      platform: platformParam,
      category: categoryParam,
      contentType: contentTypeParam,
      followers: followersParam,
      location: locationParam,
      price: priceParam,
      gender: genderParam,
      age: ageParam,
      ethnicity: ethnicityParam,
      language: languageParam,
      ...newFilters,
    };

    const nextParams = {};
    Object.entries(combined).forEach(([key, val]) => {
      if (val && val !== "Any platform" && val !== "Any") {
        nextParams[key] = val;
      }
    });

    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    updateFilters({
      platform,
      category: categoryInput.trim(),
    });
  };

  const handleClearAll = () => {
    setPlatform("Any platform");
    setCategoryInput("");
    setContentType("");
    setFollowers("");
    setLocationInput("");
    setPrice("");
    setGender("");
    setAge("");
    setEthnicity("");
    setLanguage("");
    setSearchParams({});
  };

  const hasAnyActiveFilters =
    (platform && platform !== "Any platform") ||
    !!categoryInput ||
    !!contentType ||
    !!followers ||
    !!locationInput ||
    !!price ||
    !!gender ||
    !!age ||
    !!ethnicity ||
    !!language;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Main Search Bar & Filter Bar matching User Design */}
        <div className="max-w-5xl mx-auto mb-10">
          {/* Top Pill Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white border border-gray-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.06)] rounded-full p-2 pl-6 sm:pl-8 flex items-center justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)] transition-all duration-300"
          >
            {/* Left: Platform selector */}
            <div className="flex-shrink-0 w-36 sm:w-44 pr-4 border-r border-gray-100">
              <label className="block text-[11px] font-bold text-gray-800 tracking-tight">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => {
                  setPlatform(e.target.value);
                  updateFilters({ platform: e.target.value });
                }}
                className="w-full text-xs sm:text-sm font-semibold text-gray-700 focus:outline-none bg-transparent cursor-pointer"
              >
                <option value="Instagram">Instagram</option>
              </select>
            </div>

            {/* Middle: Category & Niches keyword input with Popular Dropdown */}
            <div className="flex-1 px-4 sm:px-6 relative">
              <label className="block text-[11px] font-bold text-gray-800 tracking-tight">
                Category
              </label>
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

              {/* Popular Categories Popup (Matching Image 2) */}
              {showCategoryPopup && (
                <div
                  ref={categoryPopupRef}
                  className="absolute left-0 top-full mt-3 w-[calc(100vw-3rem)] sm:w-[580px] max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-2xl z-50 p-5 animate-fadeIn"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                      Popular
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowCategoryPopup(false)}
                      className="text-gray-400 hover:text-black text-xs"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                    {[
                      "Lifestyle",
                      "Beauty",
                      "Fashion",
                      "Travel",
                      "Health & Fitness",
                      "Family & Children",
                      "Food & Drink",
                      "Comedy & Entertainment",
                      "Animals & Pets",
                      "Education",
                      "Art & Photography",
                      "Music & Dance",
                      "Entrepreneur & Business",
                      "Model",
                      "Adventure & Outdoors",
                      "Technology",
                      "Athlete & Sports",
                      "Gaming",
                      "Healthcare",
                      "Celebrity & Public Figure",
                      "Automotive",
                      "Actor",
                      "LGBTQ2+",
                      "Skilled Trades",
                      "Vegan",
                      "Cannabis",
                    ].map((niche) => {
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
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                            isSelected
                              ? "bg-black text-white font-bold"
                              : "bg-gray-100/90 text-gray-800 hover:bg-gray-200"
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

            {/* Right: Round Search Button */}
            <button
              type="submit"
              className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-[#18181B] hover:bg-black text-white shadow-md transition-transform active:scale-95"
              aria-label="Search"
            >
              <Search size={19} strokeWidth={2.4} />
            </button>
          </form>

          {/* Bottom Filter Pills Row */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-1 overflow-x-visible">
            {/* Content Type Filter */}
            <FilterDropdown
              label="Content Type"
              value={contentType}
              options={CONTENT_TYPES}
              onChange={(val) => {
                setContentType(val);
                updateFilters({ contentType: val });
              }}
            />

            {/* Followers Filter */}
            <FilterDropdown
              label="Followers"
              value={followers}
              options={FOLLOWER_RANGES}
              onChange={(val) => {
                setFollowers(val);
                updateFilters({ followers: val });
              }}
            />

            {/* Location Filter */}
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
                    placeholder="e.g. Keyser, London, India"
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
                      className="px-2.5 py-1 text-[11px] text-gray-500 hover:text-black"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateFilters({ location: locationInput });
                        close();
                      }}
                      className="px-3 py-1 bg-black text-white text-[11px] font-bold rounded-lg"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            />

            {/* Price Filter */}
            <FilterDropdown
              label="Price"
              value={price}
              options={PRICE_RANGES}
              onChange={(val) => {
                setPrice(val);
                updateFilters({ price: val });
              }}
            />

            {/* Gender Filter */}
            <FilterDropdown
              label="Gender"
              value={gender}
              options={GENDERS}
              onChange={(val) => {
                setGender(val);
                updateFilters({ gender: val });
              }}
            />

            {/* Age Filter (Premium) */}
            <FilterDropdown
              label="Age"
              value={age}
              options={AGE_RANGES}
              isPremium={true}
              onChange={(val) => {
                setAge(val);
                updateFilters({ age: val });
              }}
            />

            {/* Ethnicity Filter (Premium) */}
            <FilterDropdown
              label="Ethnicity"
              value={ethnicity}
              options={ETHNICITIES}
              isPremium={true}
              onChange={(val) => {
                setEthnicity(val);
                updateFilters({ ethnicity: val });
              }}
            />

            {/* Language Filter (Premium) */}
            <FilterDropdown
              label="Language"
              value={language}
              options={LANGUAGES}
              isPremium={true}
              onChange={(val) => {
                setLanguage(val);
                updateFilters({ language: val });
              }}
            />

            {/* Clear All Action */}
            {hasAnyActiveFilters && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-semibold text-gray-600 hover:text-black underline ml-2 transition"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
              Browse UGC Creators {locationParam ? `in ${locationParam}` : ""}
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
                  <div className="h-10 bg-gray-100 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
              <p className="text-red-500 font-semibold">{error}</p>
              <button
                onClick={() =>
                  fetchCreators({
                    platform,
                    category: categoryInput,
                    contentType,
                    followers,
                    location: locationInput,
                    price,
                    gender,
                    age,
                    ethnicity,
                    language,
                  })
                }
                className="mt-4 px-4 py-2 bg-black text-white text-xs font-semibold rounded-xl"
              >
                Retry
              </button>
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
                className="mt-5 px-5 py-2.5 bg-black hover:bg-black/90 text-white text-xs font-semibold rounded-xl transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {creators.map((creator) => (
                <Link
                  key={creator.id}
                  to={`/creators/${creator.id}`}
                  className="group bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col overflow-hidden text-left"
                >
                  {/* Creator Photo / Cover */}
                  <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                    {creator.coverImage || creator.avatar ? (
                      <img
                        src={creator.coverImage || creator.avatar}
                        alt={creator.displayName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 text-gray-700 font-bold text-3xl">
                        {creator.displayName?.[0]?.toUpperCase() || "C"}
                      </div>
                    )}

                    {/* Pitch Video Badge */}
                    {creator.hasPitchVideo && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-800 shadow-sm">
                        <Play size={10} className="fill-black text-black" />
                        Pitch Video
                      </div>
                    )}

                    {/* Favorite / Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(creator.id, e)}
                      title={savedIds.has(String(creator.id)) ? "Remove from Saved" : "Save Creator"}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center shadow-md transition transform active:scale-90"
                    >
                      <Heart
                        size={15}
                        className={
                          savedIds.has(String(creator.id))
                            ? "text-[#FA2B56] fill-[#FA2B56]"
                            : "text-gray-600 hover:text-[#FA2B56]"
                        }
                      />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Name + Verification + Locality */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-[#FA2B56] transition-colors">
                          {creator.displayName}
                        </h3>
                        {creator.verified && (
                          <CheckCircle2 size={15} className="text-[#3B82F6] fill-[#3B82F6] text-white flex-shrink-0" />
                        )}
                      </div>
                      {creator.locality && (
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md flex-shrink-0">
                          {creator.locality}
                        </span>
                      )}
                    </div>

                    {/* Niches / Categories Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(creator.niches?.length > 0 ? creator.niches : ["UGC Creator", "Influencer"]).map((niche, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full"
                        >
                          {niche}
                        </span>
                      ))}
                    </div>

                    {/* Bio snippet */}
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                      {creator.bio || "Passionate content creator producing authentic UGC, reviews, and high-impact social media assets."}
                    </p>

                    {/* Bottom Stats Divider */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-700 font-semibold">
                      <div className="flex items-center gap-1 text-[#F59E0B]">
                        <Star size={13} className="fill-[#F59E0B]" />
                        <span>{creator.rating > 0 ? creator.rating.toFixed(1) : "5.0"}</span>
                        <span className="text-gray-400 font-normal text-[11px]">Rating</span>
                      </div>
                      <div className="h-3 w-px bg-gray-200" />
                      <div className="text-right">
                        <span className="text-gray-900 font-bold">{creator.jobsCompleted || 0}</span>{" "}
                        <span className="text-gray-400 font-normal text-[11px]">Jobs Completed</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

