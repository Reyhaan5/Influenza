import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Image,
  Video,
  Play,
  Download,
  Filter,
  Search,
  ChevronDown,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
  Plus,
  Eye,
  X,
} from "lucide-react";

import BrandDashboardLayout from "../components/layout/BrandDashBoardLayout";
import { API_URL } from "../config/api";

export default function BrandCreativeLibrary() {
  const [creatives, setCreatives] = useState([]);
  const [brands, setBrands] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState("");

  // Preview Modal
  const [previewCreative, setPreviewCreative] = useState(null);

  const token = localStorage.getItem("token");
  const authHeader = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [creatRes, brandRes, campRes] = await Promise.allSettled([
        axios.get(`${API_URL}/brand/creatives`, authHeader),
        axios.get(`${API_URL}/brand/brands`, authHeader),
        axios.get(`${API_URL}/brand/campaigns`, authHeader),
      ]);

      if (creatRes.status === "fulfilled") {
        setCreatives(creatRes.value.data.creatives || []);
      }
      if (brandRes.status === "fulfilled") {
        setBrands(brandRes.value.data.brands || []);
      }
      if (campRes.status === "fulfilled") {
        setCampaigns(campRes.value.data.campaigns || []);
      }
    } catch (err) {
      console.error("Error loading creative library:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCreatives = useMemo(() => {
    return creatives.filter((c) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = c.title?.toLowerCase().includes(query);
        const matchesCampaign = c.campaignTitle?.toLowerCase().includes(query);
        const matchesBrand = c.brandName?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCampaign && !matchesBrand) return false;
      }

      if (selectedBrand && String(c.brandId) !== String(selectedBrand)) {
        return false;
      }

      if (selectedCampaign && String(c.campaignId) !== String(selectedCampaign)) {
        return false;
      }

      if (selectedMediaType && c.mediaType !== selectedMediaType) {
        return false;
      }

      return true;
    });
  }, [creatives, searchQuery, selectedBrand, selectedCampaign, selectedMediaType]);

  return (
    <BrandDashboardLayout>
      <div className="max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Creative Library</h1>
            <p className="text-xs text-gray-500 mt-1">
              All high-performing UGC videos, photos, and ad assets created by influencers for your brand campaigns.
            </p>
          </div>
          <Link
            to="/brand-dashboard/campaigns"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>New Campaign</span>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 my-6">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search creatives by title, campaign, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#c026d3] text-gray-800 placeholder-gray-400 transition"
            />
          </div>

          {/* Brand Filter */}
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-9 py-2 text-xs font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:border-[#c026d3] transition cursor-pointer"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Campaign Filter */}
          <div className="relative">
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-9 py-2 text-xs font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:border-[#c026d3] transition cursor-pointer"
            >
              <option value="">All Campaigns</option>
              {campaigns.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Media Type Filter */}
          <div className="relative">
            <select
              value={selectedMediaType}
              onChange={(e) => setSelectedMediaType(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-9 py-2 text-xs font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:border-[#c026d3] transition cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="Video">Video</option>
              <option value="Photo">Photo</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="py-24 text-center text-gray-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-gray-400" />
            <span>Loading creative library...</span>
          </div>
        ) : filteredCreatives.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-white border border-dashed border-gray-200 rounded-3xl p-8">
            <div className="w-16 h-16 rounded-full bg-fuchsia-50 flex items-center justify-center text-[#c026d3] mb-4">
              <Layers size={28} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">No creatives in library yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mb-6">
              When creators produce and submit UGC videos or photos for your campaigns, they will be organized and available for download here.
            </p>
            <Link
              to="/brand-dashboard/campaigns"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus size={15} />
              <span>Launch a Campaign</span>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCreatives.map((item) => {
              const isVideo = item.mediaType === "Video";
              const mediaUrl = item.mediaUrl || (item.referenceFiles && item.referenceFiles[0]);

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden text-left"
                >
                  {/* Media Preview Box */}
                  <div
                    onClick={() => setPreviewCreative(item)}
                    className="relative h-60 w-full overflow-hidden bg-gray-950 flex items-center justify-center cursor-pointer group"
                  >
                    {mediaUrl ? (
                      <img
                        src={mediaUrl.startsWith("http") ? mediaUrl : `${API_URL}${mediaUrl}`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-fuchsia-950 to-gray-950 text-white p-4 text-center">
                        {isVideo ? <Video size={36} className="text-fuchsia-400 mb-2 opacity-80" /> : <Image size={36} className="text-fuchsia-400 mb-2 opacity-80" />}
                        <span className="text-xs font-semibold text-gray-300">{item.format}</span>
                        <span className="text-[10px] text-gray-400 mt-1">{item.rawOrReady}</span>
                      </div>
                    )}

                    {/* Format Pill */}
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {item.format}
                    </div>

                    {/* Play / View Overlay Icon */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        {isVideo ? <Play size={18} className="fill-gray-900 ml-0.5" /> : <Eye size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* Creative Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                        <span className="font-semibold text-[#c026d3]">{item.brandName}</span>
                        <span>{item.mediaType}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-xs truncate mb-1">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-gray-500 truncate">
                        Campaign: {item.campaignTitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs mt-3">
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setPreviewCreative(item)}
                        className="inline-flex items-center gap-1 text-[#c026d3] hover:text-[#a21caf] font-semibold text-[11px] cursor-pointer"
                      >
                        <span>Preview</span>
                        <Eye size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Media Preview Modal */}
        {previewCreative && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{previewCreative.title}</h3>
                  <p className="text-xs text-gray-500">
                    {previewCreative.brandName} · {previewCreative.campaignTitle}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewCreative(null)}
                  className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 bg-gray-950 flex items-center justify-center min-h-[320px] max-h-[480px]">
                {previewCreative.mediaUrl ? (
                  <img
                    src={
                      previewCreative.mediaUrl.startsWith("http")
                        ? previewCreative.mediaUrl
                        : `${API_URL}${previewCreative.mediaUrl}`
                    }
                    alt={previewCreative.title}
                    className="max-h-96 max-w-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="text-center text-white space-y-2 p-8">
                    <Video size={48} className="mx-auto text-fuchsia-400" />
                    <h4 className="text-sm font-bold">{previewCreative.title}</h4>
                    <p className="text-xs text-gray-400">
                      Format: {previewCreative.format} | Placement: {previewCreative.rawOrReady}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-5 bg-gray-50 flex items-center justify-between border-t border-gray-100">
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-900">Type:</span> {previewCreative.mediaType} (
                  {previewCreative.format})
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewCreative(null)}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-100 transition cursor-pointer"
                  >
                    Close
                  </button>
                  {previewCreative.mediaUrl && (
                    <a
                      href={
                        previewCreative.mediaUrl.startsWith("http")
                          ? previewCreative.mediaUrl
                          : `${API_URL}${previewCreative.mediaUrl}`
                      }
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c026d3] hover:bg-[#a21caf] text-white text-xs font-semibold rounded-xl shadow-xs transition"
                    >
                      <Download size={13} />
                      <span>Download Creative</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BrandDashboardLayout>
  );
}
