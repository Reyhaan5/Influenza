import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Kanban, List, Search, Plus, CheckCircle2, Users, Video, FileCheck, ChevronDown
} from "lucide-react";
import BrandDashboardLayout from "../components/layout/BrandDashBoardLayout";
import CollaborationRow from "../components/dashboard/brand/CollaborationRow";
import KanbanBoard from "../components/dashboard/brand/KanbanBoard";
import DeliverableWorkflowModal from "../components/dashboard/common/DeliverableWorkflowModal";
import LeaveReviewModal from "../components/dashboard/brand/LeaveReviewModal";
import api from "../config/api";

export default function BrandCollaborations() {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("kanban");
  const [brands, setBrands] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [workflowCollab, setWorkflowCollab] = useState(null);
  const [reviewCollab, setReviewCollab] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [collabsRes, brandsRes, campsRes] = await Promise.allSettled([
        api.get("/brand/collaborations"),
        api.get("/brand/brands"),
        api.get("/brand/campaigns"),
      ]);
      setCollaborations(collabsRes.status === "fulfilled" ? collabsRes.value.data.collaborations || [] : []);
      if (brandsRes.status === "fulfilled") setBrands(brandsRes.value.data.brands || []);
      if (campsRes.status === "fulfilled") setCampaigns(campsRes.value.data.campaigns || []);
    } catch (error) {
      console.error("Error loading collaborations:", error);
      setCollaborations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (id, newStage) => {
    setCollaborations((prev) => prev.map((c) => (c._id === id ? { ...c, stage: newStage } : c)));
    try {
      const res = await api.put(`/brand/collaborations/${id}`, { stage: newStage });
      if (res.data?.collaboration) {
        setCollaborations((prev) => prev.map((c) => (c._id === id ? res.data.collaboration : c)));
      }
    } catch (err) {
      console.error("Failed to update stage:", err);
      fetchData();
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const res = await api.put(`/brand/collaborations/${id}`, updates);
      if (res.data?.collaboration) {
        setCollaborations((prev) => prev.map((c) => (c._id === id ? res.data.collaboration : c)));
      }
    } catch (error) {
      console.error("Failed to update collaboration:", error);
      alert("Failed to update collaboration.");
    }
  };

  const availableBrands = useMemo(() => {
    const list = [...brands];
    collaborations.forEach((c) => {
      const bName = c.brandEntity?.name || c.opportunity?.brandEntity?.name;
      if (bName && !list.some((b) => b.name === bName)) list.push({ _id: bName, name: bName });
    });
    return list;
  }, [brands, collaborations]);

  const availableCampaigns = useMemo(() => {
    const list = [...campaigns];
    collaborations.forEach((c) => {
      const cTitle = c.opportunity?.title;
      if (cTitle && !list.some((camp) => camp.title === cTitle)) list.push({ _id: cTitle, title: cTitle });
    });
    return list;
  }, [campaigns, collaborations]);

  const filteredCollabs = useMemo(() => {
    return collaborations.filter((c) => {
      if (selectedBrand !== "all") {
        const brandName = c.brandEntity?.name || c.opportunity?.brandEntity?.name || c.brand?.company || "";
        const brandId = c.brandEntity?._id || c.opportunity?.brandEntity?._id;
        if (brandName !== selectedBrand && brandId !== selectedBrand) return false;
      }
      if (selectedCampaign !== "all") {
        const campId = c.opportunity?._id;
        const campTitle = c.opportunity?.title;
        if (campId !== selectedCampaign && campTitle !== selectedCampaign) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const creatorName = (c.influencerProfile?.displayName || c.influencer?.name || "").toLowerCase();
        const handle = (c.influencerProfile?.handle || c.influencer?.email || "").toLowerCase();
        const campTitle = (c.opportunity?.title || "").toLowerCase();
        if (!creatorName.includes(q) && !handle.includes(q) && !campTitle.includes(q)) return false;
      }
      return true;
    });
  }, [collaborations, selectedBrand, selectedCampaign, searchQuery]);

  const kpis = [
    { label: "Total Deals", value: collaborations.length, icon: Users, bg: "bg-gray-100", text: "text-gray-700" },
    { label: "In Creation", value: collaborations.filter((c) => c.stage === "content_creation" || c.stage === "in_progress").length, icon: Video, bg: "bg-purple-50", text: "text-purple-600" },
    { label: "In Review", value: collaborations.filter((c) => c.stage === "review").length, icon: FileCheck, bg: "bg-amber-50", text: "text-amber-600" },
    { label: "Completed", value: collaborations.filter((c) => c.stage === "completed").length, icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-600" },
  ];

  return (
    <BrandDashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-950 flex items-center gap-2.5">
            <span>Collaborations & Pipeline</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-fuchsia-100 text-[#c026d3]">Kanban</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Visually drag and drop influencer deliverables across workflow stages or track automatic lifecycle progressions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-gray-100/90 rounded-2xl border border-gray-200">
            {[{ mode: "kanban", label: "Board", icon: Kanban }, { mode: "list", label: "Table", icon: List }].map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  viewMode === mode ? "bg-white text-gray-950 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Icon size={13} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <Link
            to="/creator-discovery"
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#FA2B56] to-[#E0244B] hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95"
          >
            <Plus size={14} />
            <span>Find Creators</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
        {kpis.map(({ label, value, icon: Icon, bg, text }, i) => (
          <div key={i} className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${text}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500">{label}</p>
              <p className="text-lg font-black text-gray-950">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search creator, campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-gray-800"
            />
          </div>

          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-gray-700 hover:border-gray-300 focus:outline-none transition cursor-pointer"
            >
              <option value="all">All Brands</option>
              {availableBrands.map((b) => (
                <option key={b._id} value={b.name || b._id}>{b.name}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-gray-700 hover:border-gray-300 focus:outline-none transition cursor-pointer max-w-[200px] truncate"
            >
              <option value="all">All Campaigns</option>
              {availableCampaigns.map((c) => (
                <option key={c._id} value={c.title || c._id}>{c.title}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <span className="text-xs font-medium text-gray-500 shrink-0">
          Showing {filteredCollabs.length} of {collaborations.length} collaborations
        </span>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse">
          <p className="text-sm font-semibold text-gray-400">Loading collaboration pipelines...</p>
        </div>
      ) : viewMode === "kanban" ? (
        <KanbanBoard
          collaborations={filteredCollabs}
          onStageChange={handleStageChange}
          onOpenWorkflow={(c) => setWorkflowCollab(c)}
          onOpenReview={(c) => setReviewCollab(c)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          {filteredCollabs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-gray-500">No collaborations match your filters.</p>
            </div>
          ) : (
            <div className="p-4 flex flex-col gap-3">
              {filteredCollabs.map((c) => (
                <CollaborationRow
                  key={c._id}
                  collab={c}
                  onUpdate={handleUpdate}
                  onOpenWorkflow={(collab) => setWorkflowCollab(collab)}
                  onOpenReview={(collab) => setReviewCollab(collab)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <DeliverableWorkflowModal
        isOpen={Boolean(workflowCollab)}
        onClose={() => setWorkflowCollab(null)}
        collaboration={workflowCollab}
        role="brand"
        onUpdated={(updatedCollab) => {
          setCollaborations((prev) => prev.map((c) => (c._id === updatedCollab._id ? { ...c, ...updatedCollab } : c)));
          setWorkflowCollab((prev) => (prev ? { ...prev, ...updatedCollab } : null));
        }}
        onOpenReviewModal={() => {
          const target = workflowCollab;
          setWorkflowCollab(null);
          setReviewCollab(target);
        }}
      />

      <LeaveReviewModal
        isOpen={Boolean(reviewCollab)}
        onClose={() => setReviewCollab(null)}
        collaboration={reviewCollab}
        onReviewSubmitted={fetchData}
      />
    </BrandDashboardLayout>
  );
}