import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Send, CheckCircle2, Clock, XCircle, MessageSquare, Layers, Building2, User, Sparkles } from "lucide-react";
import BrandDashboardLayout from "../components/layout/BrandDashBoardLayout";
import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import DeliverableWorkflowModal from "../components/dashboard/common/DeliverableWorkflowModal";
import LeaveReviewModal from "../components/dashboard/brand/LeaveReviewModal";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200/60",
  accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  rejected: "bg-red-50 text-red-700 border border-red-200/60",
  in_progress: "bg-blue-50 text-blue-700 border border-blue-200/60",
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
};

export default function PartnershipsHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isBrand = user?.role === "brand";
  const defaultTab = searchParams.get("tab") || (location.pathname.endsWith("/collaborations") && isBrand ? "active" : "invitations");
  const activeTab = searchParams.get("tab") || defaultTab;
  const setTab = (tab) => setSearchParams({ tab });

  const [requests, setRequests] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);
  const [updatingCollabId, setUpdatingCollabId] = useState(null);
  const [workflowCollab, setWorkflowCollab] = useState(null);
  const [reviewCollab, setReviewCollab] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, cRes] = await Promise.allSettled([
        api.get("/collaboration-requests"),
        api.get(`/${isBrand ? "brand" : "influencer"}/collaborations`),
      ]);
      if (rRes.status === "fulfilled") setRequests(rRes.value.data?.requests || []);
      if (cRes.status === "fulfilled") setCollaborations(cRes.value.data?.collaborations || []);
    } catch (err) {
      console.error("Error loading partnerships:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user?.role]);

  const handleRespondRequest = async (id, status) => {
    setRespondingId(id);
    try {
      await api.put(`/collaboration-requests/${id}`, { status });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update request.");
    } finally {
      setRespondingId(null);
    }
  };

  const handleUpdateCollaboration = async (id, updates) => {
    setUpdatingCollabId(id);
    try {
      await api.put(`/brand/collaborations/${id}`, updates);
      await fetchData();
    } catch {
      alert("Failed to update collaboration.");
    } finally {
      setUpdatingCollabId(null);
    }
  };

  const activeCollabs = collaborations.filter((c) => c.stage === "in_progress" || c.status === "active" || c.status === "in_progress");
  const completedCollabs = collaborations.filter((c) => c.stage === "completed" || c.status === "completed");

  const Layout = isBrand ? BrandDashboardLayout : InfluencerDashboardLayout;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Partnership Hub</h1>
            <p className="text-xs text-gray-500 mt-1">Manage all collaboration requests, track deliverables, and manage escrow payouts.</p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 text-xs font-semibold">
          {[
            { id: "invitations", label: "Invitations & Inquiries", count: requests.length },
            { id: "active", label: "Active Deals", count: activeCollabs.length },
            { id: "completed", label: "Completed Deals", count: completedCollabs.length },
          ].map(({ id, label, count }) => (
            <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${activeTab === id ? "bg-black text-white shadow-xs font-bold" : "text-gray-600 hover:bg-gray-100"}`}>
              <span>{label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === id ? "bg-zinc-700 text-white" : "bg-zinc-200 text-zinc-700"}`}>{count}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-24 text-center text-xs text-gray-400">Loading partnerships data...</div>
        ) : activeTab === "invitations" ? (
          /* TAB 1: INVITATIONS */
          <div className="space-y-4">
            {!requests.length ? (
              <div className="text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-white p-8">
                <Send size={32} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-sm font-bold text-gray-900">No Partnership Invitations Yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">{isBrand ? "Discover and reach out to high-performing creators to propose collaborations." : "When brands match with your profile or you apply to campaigns, invitations will show up here."}</p>
              </div>
            ) : requests.map((r) => {
              const other = isBrand ? r.influencer : r.brand;
              const isMyTurn = r.initiatedBy !== user?.role && r.status === "pending";
              return (
                <div key={r._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-zinc-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-700 shrink-0">
                      {other?.name?.charAt(0) || (isBrand ? <User size={16} /> : <Building2 size={16} />)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 text-sm">{other?.name || "Partner"}</p>
                        <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[r.status] || "bg-gray-100 text-gray-700"}`}>
                          {r.status === "pending" && <Clock size={11} />}
                          {r.status === "accepted" && <CheckCircle2 size={11} />}
                          {r.status === "rejected" && <XCircle size={11} />}
                          <span className="capitalize">{r.status}</span>
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1"><span className="font-semibold text-gray-800">{r.opportunity?.title || "Direct Brand Partnership"}</span>{r.opportunity?.rewardValue ? ` · ${r.opportunity.rewardValue}` : ""}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{r.initiatedBy === "brand" ? "Brand reached out" : "Influencer applied"} · {new Date(r.requestedAt || r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {other?._id && (
                      <button onClick={() => navigate(`/messages?with=${other._id}`)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition cursor-pointer">
                        <MessageSquare size={13} />Chat
                      </button>
                    )}
                    {isMyTurn && (
                      <div className="flex gap-2">
                        <button onClick={() => handleRespondRequest(r._id, "accepted")} disabled={respondingId === r._id} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer">Accept</button>
                        <button onClick={() => handleRespondRequest(r._id, "rejected")} disabled={respondingId === r._id} className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition disabled:opacity-60 cursor-pointer">Decline</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : activeTab === "active" ? (
          /* TAB 2: ACTIVE DEALS */
          <div className="space-y-4">
            {!activeCollabs.length ? (
              <div className="text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-white p-8">
                <Layers size={32} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-sm font-bold text-gray-900">No Active Deals in Progress</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">When invitations are accepted, active deliverables and milestone tracking appear here.</p>
              </div>
            ) : activeCollabs.map((c) => {
              const partner = isBrand ? c.influencer : c.brand;
              const percent = Math.min(100, Math.round(((c.deliverablesCompleted || 0) / (c.deliverablesTotal || 1)) * 100));
              return (
                <div key={c._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-zinc-300 transition space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-xs font-bold text-pink-700 shrink-0">{partner?.name?.charAt(0) || "P"}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 text-sm">{partner?.name || "Partner"}</p>
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 capitalize">In Progress</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">{c.opportunity?.title || "Campaign Partnership"} · Format: <span className="font-semibold text-gray-900 uppercase text-[11px]">{c.format}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button type="button" onClick={() => setWorkflowCollab(c)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition cursor-pointer shadow-xs">
                        <Sparkles size={13} className="text-amber-400" /><span>{isBrand ? "Review Deliverables" : "Submit Deliverables"}</span>
                      </button>
                      {partner?._id && (
                        <button onClick={() => navigate(`/messages?with=${partner._id}`)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition cursor-pointer">
                          <MessageSquare size={13} />Message {isBrand ? "Creator" : "Brand"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-600">Deliverables Progress</span>
                        <span className="font-bold text-gray-900">{c.deliverablesCompleted || 0} / {c.deliverablesTotal || 1} Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${c.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                        Payment: <span className="capitalize">{c.paymentStatus || "pending"}</span>
                      </span>
                      {isBrand && (
                        <div className="flex items-center gap-2">
                          <select value={c.stage} onChange={(e) => handleUpdateCollaboration(c._id, { stage: e.target.value })} disabled={updatingCollabId === c._id} className="text-xs font-semibold border border-gray-300 rounded-lg px-2 py-1 bg-white cursor-pointer">
                            <option value="in_progress">In Progress</option><option value="completed">Mark Completed</option>
                          </select>
                          <select value={c.paymentStatus} onChange={(e) => handleUpdateCollaboration(c._id, { paymentStatus: e.target.value })} disabled={updatingCollabId === c._id} className="text-xs font-semibold border border-gray-300 rounded-lg px-2 py-1 bg-white cursor-pointer">
                            <option value="pending">Payment Pending</option><option value="paid">Payment Released</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TAB 3: COMPLETED */
          <div className="space-y-4">
            {!completedCollabs.length ? (
              <div className="text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-white p-8">
                <CheckCircle2 size={32} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-sm font-bold text-gray-900">No Completed Deals Yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">Collaborations you finish will be archived here along with verified deliverable records and ratings.</p>
              </div>
            ) : completedCollabs.map((c) => {
              const partner = isBrand ? c.influencer : c.brand;
              return (
                <div key={c._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-700 shrink-0"><CheckCircle2 size={18} /></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 text-sm">{partner?.name || "Partner"}</p>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">Completed</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{c.opportunity?.title || "Brand Collaboration"} · Format: {c.format} · Completed {new Date(c.updatedAt || c.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button type="button" onClick={() => setWorkflowCollab(c)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition cursor-pointer">
                      <Sparkles size={12} className="text-amber-500" />View Deliverables
                    </button>
                    {isBrand && (
                      <button type="button" onClick={() => setReviewCollab(c)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold hover:bg-amber-100 transition cursor-pointer">
                        ⭐ Rate Creator
                      </button>
                    )}
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">Payment: {c.paymentStatus}</span>
                    {partner?._id && (
                      <button onClick={() => navigate(`/messages?with=${partner._id}`)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition cursor-pointer">
                        <MessageSquare size={13} />Chat
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <DeliverableWorkflowModal
          isOpen={Boolean(workflowCollab)} onClose={() => setWorkflowCollab(null)} collaboration={workflowCollab} role={user?.role || "influencer"}
          onUpdated={(up) => { setCollaborations((p) => p.map((c) => c._id === up._id ? { ...c, ...up } : c)); setWorkflowCollab((p) => p ? { ...p, ...up } : null); }}
          onOpenReviewModal={() => { const target = workflowCollab; setWorkflowCollab(null); setReviewCollab(target); }}
        />

        <LeaveReviewModal isOpen={Boolean(reviewCollab)} onClose={() => setReviewCollab(null)} collaboration={reviewCollab} onReviewSubmitted={fetchData} />
      </div>
    </Layout>
  );
}
