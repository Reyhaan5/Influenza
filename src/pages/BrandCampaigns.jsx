import React, { useEffect, useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import BrandDashboardLayout from "../components/layout/BrandDashBoardLayout";
import CampaignWizard from "../components/dashboard/brand/campaign-wizard/CampaignWizard";
import CampaignsFilterBar from "../components/dashboard/brand/CampaignsFilterBar";
import CampaignsTable from "../components/dashboard/brand/CampaignsTable";
import api from "../config/api";

export default function BrandCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedHiredFilter, setSelectedHiredFilter] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [cRes, bRes] = await Promise.allSettled([api.get("/brand/campaigns"), api.get("/brand/brands")]);
        if (cRes.status === "fulfilled") setCampaigns(cRes.value.data.campaigns || []);
        if (bRes.status === "fulfilled") setBrands(bRes.value.data.brands || []);
      } catch (err) {
        console.error("Failed to load campaigns or brands:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openCreateWizard = () => { setEditingCampaign(null); setShowWizard(true); };
  const openFinishBrief = (c) => { setEditingCampaign(c); setShowWizard(true); };

  const handleCampaignSaved = (saved) => {
    setCampaigns((prev) => prev.some((c) => c._id === saved._id) ? prev.map((c) => c._id === saved._id ? saved : c) : [saved, ...prev]);
    setShowWizard(false);
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this brief? This cannot be undone.")) return;
    try {
      await api.delete(`/brand/campaigns/${id}`);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to delete campaign.");
    }
  };

  const handleCloseCampaign = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.put(`/brand/campaigns/${id}`, { status: "closed" });
      setCampaigns((prev) => prev.map((c) => c._id === id ? res.data.campaign : c));
    } catch {
      alert("Failed to close campaign.");
    }
  };

  const handleReopenCampaign = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.put(`/brand/campaigns/${id}`, { status: "open" });
      setCampaigns((prev) => prev.map((c) => c._id === id ? res.data.campaign : c));
    } catch {
      alert("Failed to reopen campaign.");
    }
  };

  const activeCampaigns = useMemo(() => campaigns.filter((c) => !c.status || c.status === "open" || c.status === "active"), [campaigns]);
  const draftCampaigns = useMemo(() => campaigns.filter((c) => c.status === "draft"), [campaigns]);
  const closedCampaigns = useMemo(() => campaigns.filter((c) => c.status === "closed"), [campaigns]);

  const currentTabList = useMemo(() => {
    const list = activeTab === "active" ? activeCampaigns : activeTab === "drafts" ? draftCampaigns : closedCampaigns;
    return list.filter((c) => {
      if (searchQuery.trim() && !c.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedBrand && c.brand !== selectedBrand && c.brandEntity?._id !== selectedBrand) return false;
      if (selectedType && c.campaignType !== selectedType) return false;
      if (activeTab === "active") {
        if (selectedHiredFilter === "zero" && (c.hiredCount || 0) > 0) return false;
        if (selectedStatusFilter && c.status !== selectedStatusFilter) return false;
      }
      return true;
    });
  }, [activeTab, activeCampaigns, draftCampaigns, closedCampaigns, searchQuery, selectedBrand, selectedType, selectedHiredFilter, selectedStatusFilter]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <BrandDashboardLayout>
      <div className="max-w-7xl mx-auto pb-12">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Campaigns</h1>
          <button onClick={openCreateWizard} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer">
            + New campaign
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-8 border-b border-gray-200 mb-6 text-sm font-medium">
          {["active", "drafts", "closed"].map((tab) => {
            const label = tab === "active" ? "Active campaigns" : tab === "drafts" ? "Drafts" : "Closed";
            const isActive = activeTab === tab;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer ${isActive ? "border-b-2 border-zinc-950 font-bold text-zinc-950 -mb-px" : "text-gray-500 hover:text-gray-900"}`}>
                <span>{label}</span>
                {tab === "drafts" && draftCampaigns.length > 0 && (
                  <span className="inline-flex items-center justify-center bg-zinc-900 text-white text-[11px] font-bold h-4.5 min-w-4.5 px-1.5 rounded-full">{draftCampaigns.length}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Top 3 KPI Summary Cards */}
        {activeTab === "active" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Campaigns with zero hires", count: activeCampaigns.filter((c) => !c.hiredCount).length },
              { label: "Hired creators awaiting reply", count: 0 },
              { label: "Creatives awaiting review", count: 0 },
            ].map(({ label, count }) => (
              <div key={label} className="bg-white border border-gray-200/90 rounded-2xl p-5 hover:border-gray-300 transition shadow-xs">
                <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
                  <span>{label}</span><ChevronRight size={14} className="text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{count}</div>
              </div>
            ))}
          </div>
        )}

        <CampaignsFilterBar
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}
          brands={brands} selectedType={selectedType} setSelectedType={setSelectedType} selectedHiredFilter={selectedHiredFilter}
          setSelectedHiredFilter={setSelectedHiredFilter} selectedStatusFilter={selectedStatusFilter} setSelectedStatusFilter={setSelectedStatusFilter}
          activeTab={activeTab}
        />

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          <CampaignsTable
            activeTab={activeTab} campaigns={currentTabList} loading={loading} openCreateWizard={openCreateWizard}
            openFinishBrief={openFinishBrief} handleDelete={handleDelete} handleCloseCampaign={handleCloseCampaign}
            handleReopenCampaign={handleReopenCampaign} formatDate={formatDate}
          />
        </div>

        {showWizard && (
          <CampaignWizard campaign={editingCampaign} onClose={() => { setShowWizard(false); setEditingCampaign(null); }} onCampaignSaved={handleCampaignSaved} />
        )}
      </div>
    </BrandDashboardLayout>
  );
}