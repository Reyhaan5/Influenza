import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Bookmark,
  Search,
  MessageSquare,
  Trash2,
  ExternalLink,
  Star,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Plus,
  Compass,
  Heart,
} from "lucide-react";

import BrandDashboardLayout from "../components/layout/BrandDashBoardLayout";
import Avatar from "../components/dashboard/influencer/Avatar";
import { API_URL } from "../config/api";

export default function BrandCreatorLists() {
  const [savedCreators, setSavedCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const authHeader = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  useEffect(() => {
    fetchSavedCreators();
  }, []);

  const fetchSavedCreators = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/brand/saved-creators`, authHeader);
      setSavedCreators(res.data.savedCreators || []);
    } catch (err) {
      console.error("Error loading saved creators:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (creatorId, e) => {
    if (e) e.preventDefault();
    try {
      await axios.delete(`${API_URL}/brand/saved-creators/${creatorId}`, authHeader);
      setSavedCreators((prev) => prev.filter((s) => s.creator?._id !== creatorId));
    } catch (err) {
      console.error("Error removing creator:", err);
      alert("Failed to remove creator from list.");
    }
  };

  const filteredList = useMemo(() => {
    return savedCreators.filter((s) => {
      const profile = s.creator;
      const user = profile?.user;
      if (!profile) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const name = (profile.displayName || user?.name || "").toLowerCase();
        const bio = (profile.bio || "").toLowerCase();
        const location = (profile.locality || "").toLowerCase();
        const niches = (profile.niches || []).join(" ").toLowerCase();
        if (
          !name.includes(query) &&
          !bio.includes(query) &&
          !location.includes(query) &&
          !niches.includes(query)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [savedCreators, searchQuery]);

  return (
    <BrandDashboardLayout>
      <div className="max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Creator Lists</h1>
            <p className="text-xs text-gray-500 mt-1">
              Your saved and favorited creators ready for campaign outreach and direct messaging.
            </p>
          </div>
          <Link
            to="/creator-discovery"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Compass size={15} />
            <span>Discover more creators</span>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="my-6 max-w-sm">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search saved creators by name, niche, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#c026d3] text-gray-800 placeholder-gray-400 transition"
            />
          </div>
        </div>

        {/* Content View */}
        {loading ? (
          <div className="py-24 text-center text-gray-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-gray-400" />
            <span>Loading creator list...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-white border border-dashed border-gray-200 rounded-3xl p-8">
            <div className="w-16 h-16 rounded-full bg-fuchsia-50 flex items-center justify-center text-[#c026d3] mb-4">
              <Bookmark size={28} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">No saved creators yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mb-6">
              Browse creators in Creator Discovery and click the heart icon on any creator card to save them to your lists.
            </p>
            <Link
              to="/creator-discovery"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Compass size={15} />
              <span>Browse Creator Discovery</span>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredList.map((item) => {
              const profile = item.creator;
              const userObj = profile.user || {};
              const creatorId = profile._id;
              const creatorUserId = userObj._id;
              const displayName = profile.displayName || userObj.name || "Creator";
              const coverImg = profile.coverImage || profile.avatar;

              return (
                <div
                  key={item._id}
                  className="group bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden text-left"
                >
                  {/* Photo Banner with Remove Favorite Button */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    {coverImg ? (
                      <img
                        src={coverImg}
                        alt={displayName}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 text-gray-700 font-bold text-2xl">
                        {displayName[0]?.toUpperCase() || "C"}
                      </div>
                    )}

                    {/* Unfavorite Heart button top right */}
                    <button
                      onClick={(e) => handleRemoveSaved(creatorId, e)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-red-500 hover:bg-white shadow-xs transition cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Heart size={15} className="fill-red-500 text-red-500" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm truncate">
                          {displayName}
                        </h3>
                        {profile.verified && (
                          <CheckCircle2
                            size={14}
                            className="text-[#3B82F6] fill-[#3B82F6] text-white shrink-0"
                          />
                        )}
                      </div>
                      {profile.locality && (
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                          {profile.locality}
                        </span>
                      )}
                    </div>

                    {/* Niches */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(profile.niches?.length > 0
                        ? profile.niches.slice(0, 2)
                        : ["UGC Creator"]
                      ).map((niche, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full"
                        >
                          {niche}
                        </span>
                      ))}
                    </div>

                    <p className="text-[11px] text-gray-500 line-clamp-2 mb-4 flex-1">
                      {profile.bio || "Passionate UGC and influencer content creator."}
                    </p>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                      {creatorUserId && (
                        <button
                          onClick={() =>
                            navigate(`/messages?with=${creatorUserId}`)
                          }
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-[11px] font-bold shadow-sm transition active:scale-95 cursor-pointer"
                        >
                          <MessageSquare size={13} />
                          <span>Message</span>
                        </button>
                      )}
                      <Link
                        to={`/creators/${profile._id}`}
                        className="p-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition"
                        title="View Profile"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </BrandDashboardLayout>
  );
}
