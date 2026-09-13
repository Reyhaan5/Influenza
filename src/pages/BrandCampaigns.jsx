import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Folder,
  AlignLeft,
  Trash2,
  Plus,
  MoreVertical,
  ExternalLink,
  CheckCircle2,
  Clock,
  Archive,
  RefreshCw,
} from "lucide-react";

import BrandDashboardLayout from "../components/layout/BrandDashBoardLayout";
import CampaignWizard from "../components/dashboard/brand/campaign-wizard/CampaignWizard";
import { API_URL } from "../config/api";

export default function BrandCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  // Tabs: "active" | "drafts" | "closed"
  const [activeTab, setActiveTab] = useState("active");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedHiredFilter, setSelectedHiredFilter] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [campRes, brandsRes] = await Promise.allSettled([
        axios.get(`${API_URL}/brand/campaigns`, authHeader),
        axios.get(`${API_URL}/brand/brands`, authHeader),
      ]);

      if (campRes.status === "fulfilled") {
        setCampaigns(campRes.value.data.campaigns || []);
      }
      if (brandsRes.status === "fulfilled") {
        setBrands(brandsRes.value.data.brands || []);
      }
    } catch (error) {
      console.error("Failed to load campaigns or brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateWizard = () => {
    setEditingCampaign(null);
    setShowWizard(true);
  };

  const openFinishBrief = (campaign) => {
    setEditingCampaign(campaign);
    setShowWizard(true);
  };

  const handleCampaignSaved = (savedCampaign) => {
    setCampaigns((prev) => {
      const exists = prev.some((c) => c._id === savedCampaign._id);
      if (exists) {
        return prev.map((c) => (c._id === savedCampaign._id ? savedCampaign : c));
      }
      return [savedCampaign, ...prev];
    });
    setShowWizard(false);
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to delete this brief? This cannot be undone.");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/brand/campaigns/${id}`, authHeader);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete campaign.");
    }
  };

  const handleCloseCampaign = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await axios.put(
        `${API_URL}/brand/campaigns/${id}`,
        { status: "closed" },
        authHeader
      );
      setCampaigns((prev) =>
        prev.map((c) => (c._id === id ? res.data.campaign : c))
      );
    } catch (error) {
      console.error(error);
      alert("Failed to close campaign.");
    }
  };

  const handleReopenCampaign = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await axios.put(
        `${API_URL}/brand/campaigns/${id}`,
        { status: "open" },
        authHeader
      );
      setCampaigns((prev) =>
        prev.map((c) => (c._id === id ? res.data.campaign : c))
      );
    } catch (error) {
      console.error(error);
      alert("Failed to reopen campaign.");
    }
  };

  // Split into categories
  const activeCampaigns = useMemo(
    () => campaigns.filter((c) => c.status === "open" || c.status === "active" || (!c.status && c.currentStep >= 5)),
    [campaigns]
  );
  const draftCampaigns = useMemo(
    () => campaigns.filter((c) => c.status === "draft" || (c.currentStep < 5 && c.status !== "closed")),
    [campaigns]
  );
  const closedCampaigns = useMemo(
    () => campaigns.filter((c) => c.status === "closed"),
    [campaigns]
  );

  // Top KPI Stats
  const zeroHiresCount = useMemo(
    () => activeCampaigns.filter((c) => !c.hiredCount || c.hiredCount === 0).length,
    [activeCampaigns]
  );
  const awaitingReplyCount = 0;
  const awaitingReviewCount = 0;

  // Filter current active tab list
  const currentTabList = useMemo(() => {
    let list = [];
    if (activeTab === "active") list = activeCampaigns;
    else if (activeTab === "drafts") list = draftCampaigns;
    else if (activeTab === "closed") list = closedCampaigns;

    return list.filter((c) => {
      // Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = c.title?.toLowerCase().includes(query);
        const matchesBrand = c.brandEntity?.name?.toLowerCase().includes(query);
        const matchesProduct = c.product?.name?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesBrand && !matchesProduct) return false;
      }

      // Brand Filter
      if (selectedBrand) {
        const brandId = c.brandEntity?._id || c.brandEntity;
        if (brandId !== selectedBrand) return false;
      }

      // Campaign Type Filter
      if (selectedType) {
        if (c.campaignType !== selectedType) return false;
      }

      // Status filter on active tab
      if (activeTab === "active" && selectedStatusFilter) {
        if (selectedStatusFilter === "open" && c.status !== "open") return false;
        if (selectedStatusFilter === "paused" && c.status !== "paused") return false;
      }

      return true;
    });
  }, [
    activeTab,
    activeCampaigns,
    draftCampaigns,
    closedCampaigns,
    searchQuery,
    selectedBrand,
    selectedType,
    selectedStatusFilter,
  ]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <BrandDashboardLayout>
      <div className="max-w-7xl mx-auto pb-12">
        {/* Header Title and New Campaign Button */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Campaigns</h1>
          <button
            onClick={openCreateWizard}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
          >
            + New campaign
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-8 border-b border-gray-200 mb-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 relative transition-colors cursor-pointer ${
              activeTab === "active"
                ? "text-[#c026d3] font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Active campaigns
            {activeTab === "active" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c026d3]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("drafts")}
            className={`pb-3 relative flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "drafts"
                ? "text-[#c026d3] font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Drafts
            {draftCampaigns.length > 0 && (
              <span className="inline-flex items-center justify-center bg-[#c026d3] text-white text-[11px] font-bold h-4.5 min-w-4.5 px-1.5 rounded-full">
                {draftCampaigns.length}
              </span>
            )}
            {activeTab === "drafts" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c026d3]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("closed")}
            className={`pb-3 relative transition-colors cursor-pointer ${
              activeTab === "closed"
                ? "text-[#c026d3] font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Closed
            {activeTab === "closed" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c026d3]" />
            )}
          </button>
        </div>

        {/* Top 3 KPI Summary Cards (Shown on Active Tab) */}
        {activeTab === "active" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 hover:border-gray-300 transition shadow-xs">
              <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
                <span>Campaigns with zero hires</span>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{zeroHiresCount}</div>
            </div>

            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 hover:border-gray-300 transition shadow-xs">
              <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
                <span>Hired creators awaiting reply</span>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{awaitingReplyCount}</div>
            </div>

            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 hover:border-gray-300 transition shadow-xs">
              <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
                <span>Creatives awaiting review</span>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{awaitingReviewCount}</div>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search campaign name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#c026d3] text-gray-800 placeholder-gray-400 transition"
            />
          </div>

          {/* Brands Dropdown */}
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-9 py-2 text-xs font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:border-[#c026d3] transition cursor-pointer"
            >
              <option value="">Brands</option>
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

          {/* Campaign Type Dropdown */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-9 py-2 text-xs font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:border-[#c026d3] transition cursor-pointer"
            >
              <option value="">Campaign type</option>
              <option value="User-Generated Content">User-Generated Content</option>
              <option value="Influencer Posts">Influencer Posts</option>
              <option value="Affiliate / Commission">Affiliate / Commission</option>
              <option value="Product Review">Product Review</option>
              <option value="Brand Ambassador">Brand Ambassador</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Additional filters for Active Tab */}
          {activeTab === "active" && (
            <>
              {/* Hired / Goal */}
              <div className="relative">
                <select
                  value={selectedHiredFilter}
                  onChange={(e) => setSelectedHiredFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-9 py-2 text-xs font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:border-[#c026d3] transition cursor-pointer"
                >
                  <option value="">Hired/Goal</option>
                  <option value="zero">0 Hired</option>
                  <option value="in_progress">In Progress</option>
                  <option value="reached">Goal Reached</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* Status */}
              <div className="relative">
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-9 py-2 text-xs font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:border-[#c026d3] transition cursor-pointer"
                >
                  <option value="">Status</option>
                  <option value="open">Active / Open</option>
                  <option value="paused">Paused</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Content Area / Table Views */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          {loading ? (
            <div className="py-24 text-center text-gray-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw size={16} className="animate-spin text-gray-400" />
              <span>Loading campaigns...</span>
            </div>
          ) : activeTab === "active" ? (
            /* TAB 1: ACTIVE CAMPAIGNS */
            <div>
              {currentTabList.length === 0 ? (
                <div>
                  <div className="border-b border-gray-100 bg-gray-50/60 px-6 py-3.5 grid grid-cols-8 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <span className="col-span-2">Campaign</span>
                    <span>Applications</span>
                    <span>Hired / Goal</span>
                    <span>Chats</span>
                    <span>Creative for review</span>
                    <span>Completed deals</span>
                    <span>Launched ⌵</span>
                    <span>Status</span>
                  </div>
                  <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4 border border-gray-100">
                      <Folder size={28} strokeWidth={1.5} className="text-gray-400" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">No campaigns yet</h3>
                    <p className="text-xs text-gray-500 mb-6">
                      Start your first campaign to manage everything in one place.
                    </p>
                    <button
                      onClick={openCreateWizard}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      + New campaign
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/75 text-gray-500 font-semibold uppercase text-[11px]">
                        <th className="py-3.5 px-5">Campaign</th>
                        <th className="py-3.5 px-4 text-center">Applications</th>
                        <th className="py-3.5 px-4 text-center">Hired / Goal</th>
                        <th className="py-3.5 px-4 text-center">Chats</th>
                        <th className="py-3.5 px-4 text-center">Creative for review</th>
                        <th className="py-3.5 px-4 text-center">Completed deals</th>
                        <th className="py-3.5 px-4">Launched ⌵</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentTabList.map((c) => {
                        const brandLogo = c.brandEntity?.logo;
                        const brandName = c.brandEntity?.name || "Brand";
                        const targetCount = c.targetCreatorsCount || 3;
                        return (
                          <tr key={c._id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3">
                                {brandLogo ? (
                                  <img
                                    src={brandLogo.startsWith("http") ? brandLogo : `${API_URL}${brandLogo}`}
                                    alt={brandName}
                                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                                    {brandName.substring(0, 3).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-gray-900 text-xs">{c.title}</p>
                                  <p className="text-[11px] text-gray-500 mt-0.5">
                                    {c.product?.name ? `${c.product.name} · ` : ""}
                                    {brandName} · {c.campaignType || "User-Generated Content"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center font-medium text-gray-700">0</td>
                            <td className="py-4 px-4 text-center font-medium text-gray-700">
                              0 / {targetCount}
                            </td>
                            <td className="py-4 px-4 text-center font-medium text-gray-700">0</td>
                            <td className="py-4 px-4 text-center font-medium text-gray-700">0</td>
                            <td className="py-4 px-4 text-center font-medium text-gray-700">0</td>
                            <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                              {formatDate(c.createdAt)}
                            </td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Active
                              </span>
                            </td>
                            <td className="py-4 px-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openFinishBrief(c)}
                                  className="text-xs font-semibold text-[#c026d3] hover:text-[#a21caf] px-2 py-1 rounded hover:bg-fuchsia-50 transition cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => handleCloseCampaign(c._id, e)}
                                  className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100 transition cursor-pointer"
                                >
                                  Close
                                </button>
                                <button
                                  onClick={(e) => handleDelete(c._id, e)}
                                  className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                                  title="Delete campaign"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === "drafts" ? (
            /* TAB 2: DRAFTS */
            <div>
              {currentTabList.length === 0 ? (
                <div>
                  <div className="border-b border-gray-100 bg-gray-50/60 px-6 py-3.5 grid grid-cols-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <span className="col-span-1">Campaign</span>
                    <span>Date of creation ⌵</span>
                    <span>Status</span>
                    <span className="text-right">Actions</span>
                  </div>
                  <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4 border border-gray-100">
                      <Folder size={28} strokeWidth={1.5} className="text-gray-400" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">No drafts yet</h3>
                    <p className="text-xs text-gray-500 mb-6">
                      Drafts of unfinished campaigns will appear here.
                    </p>
                    <button
                      onClick={openCreateWizard}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      + New campaign
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/75 text-gray-500 font-semibold text-[11px]">
                        <th className="py-3.5 px-6 font-semibold">Campaign</th>
                        <th className="py-3.5 px-6 font-semibold">Date of creation ⌵</th>
                        <th className="py-3.5 px-6 font-semibold">Status</th>
                        <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentTabList.map((c) => {
                        const brandLogo = c.brandEntity?.logo;
                        const brandName = c.brandEntity?.name || "Brand";
                        return (
                          <tr key={c._id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="py-4.5 px-6">
                              <div className="flex items-center gap-3">
                                {brandLogo ? (
                                  <img
                                    src={brandLogo.startsWith("http") ? brandLogo : `${API_URL}${brandLogo}`}
                                    alt={brandName}
                                    className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                                    {brandName.substring(0, 3).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-gray-900 text-xs">{c.title || "Untitled Draft"}</p>
                                  <p className="text-[11px] text-gray-500 mt-0.5">
                                    {brandName} · {c.campaignType || "Influencer Posts"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4.5 px-6 text-gray-700 whitespace-nowrap">
                              {formatDate(c.createdAt)}
                            </td>
                            <td className="py-4.5 px-6">
                              <span className="inline-flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                                <span className="w-2 h-2 rounded-full bg-pink-400" />
                                Draft
                              </span>
                            </td>
                            <td className="py-4.5 px-6 text-right">
                              <div className="flex items-center justify-end gap-5">
                                <button
                                  onClick={() => openFinishBrief(c)}
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c026d3] hover:text-[#a21caf] transition cursor-pointer"
                                >
                                  <AlignLeft size={14} />
                                  <span>Finish brief</span>
                                </button>
                                <button
                                  onClick={(e) => handleDelete(c._id, e)}
                                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-red-600 transition cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                  <span>Delete brief</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* TAB 3: CLOSED */
            <div>
              {currentTabList.length === 0 ? (
                <div>
                  <div className="border-b border-gray-100 bg-gray-50/60 px-6 py-3.5 grid grid-cols-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <span className="col-span-1">Campaign</span>
                    <span>Completed</span>
                    <span>Total spent</span>
                    <span className="text-right">Status</span>
                  </div>
                  <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4 border border-gray-100">
                      <Folder size={28} strokeWidth={1.5} className="text-gray-400" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">No closed campaigns yet</h3>
                    <p className="text-xs text-gray-500 mb-6">
                      Once you complete a campaign, you'll see it here.
                    </p>
                    <button
                      onClick={openCreateWizard}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      + New campaign
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/75 text-gray-500 font-semibold text-[11px]">
                        <th className="py-3.5 px-6 font-semibold">Campaign</th>
                        <th className="py-3.5 px-6 font-semibold">Completed</th>
                        <th className="py-3.5 px-6 font-semibold">Total spent</th>
                        <th className="py-3.5 px-6 font-semibold text-right">Status & Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentTabList.map((c) => {
                        const brandLogo = c.brandEntity?.logo;
                        const brandName = c.brandEntity?.name || "Brand";
                        return (
                          <tr key={c._id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="py-4.5 px-6">
                              <div className="flex items-center gap-3">
                                {brandLogo ? (
                                  <img
                                    src={brandLogo.startsWith("http") ? brandLogo : `${API_URL}${brandLogo}`}
                                    alt={brandName}
                                    className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-gray-400 text-white font-bold flex items-center justify-center text-xs shrink-0">
                                    {brandName.substring(0, 3).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-gray-900 text-xs">{c.title}</p>
                                  <p className="text-[11px] text-gray-500 mt-0.5">
                                    {brandName} · {c.campaignType || "User-Generated Content"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4.5 px-6 text-gray-700 whitespace-nowrap">
                              {formatDate(c.updatedAt || c.createdAt)}
                            </td>
                            <td className="py-4.5 px-6 text-gray-700 font-medium">
                              $0.00
                            </td>
                            <td className="py-4.5 px-6 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                  Closed
                                </span>
                                <button
                                  onClick={(e) => handleReopenCampaign(c._id, e)}
                                  className="text-xs text-[#c026d3] hover:text-[#a21caf] font-semibold hover:underline cursor-pointer"
                                >
                                  Reopen
                                </button>
                                <button
                                  onClick={(e) => handleDelete(c._id, e)}
                                  className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Campaign Wizard Modal */}
        {showWizard && (
          <CampaignWizard
            campaign={editingCampaign}
            onClose={() => {
              setShowWizard(false);
              setEditingCampaign(null);
            }}
            onCampaignSaved={handleCampaignSaved}
          />
        )}
      </div>
    </BrandDashboardLayout>
  );
}