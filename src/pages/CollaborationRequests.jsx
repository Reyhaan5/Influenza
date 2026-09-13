import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Check, X, Clock, ArrowUpRight } from "lucide-react";

import BrandDashboardLayout from "../components/layout/BrandDashBoardLayout";
import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200/60",
  accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  rejected: "bg-red-50 text-red-700 border border-red-200/60",
};

function RequestRow({ request, isMyTurnToRespond, onRespond, responding }) {
  const otherPartyName =
    request.brand && request.influencer
      ? request.__viewerRole === "brand"
        ? request.influencer?.name
        : request.brand?.name
      : "Unknown";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <p className="font-bold text-gray-900 text-sm">{otherPartyName}</p>
        <p className="text-xs text-gray-500 mt-1">
          {request.opportunity?.title || "Direct outreach"}
          {request.opportunity?.rewardValue ? ` · ${request.opportunity.rewardValue}` : ""}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">
          {request.initiatedBy === "brand" ? "Brand reached out" : "Influencer applied"} ·{" "}
          {new Date(request.requestedAt || request.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[request.status] || "bg-gray-100 text-gray-700"}`}
        >
          {request.status === "pending" && <Clock size={12} />}
          {request.status === "accepted" && <Check size={12} />}
          {request.status === "rejected" && <X size={12} />}
          <span className="capitalize">{request.status}</span>
        </span>

        {isMyTurnToRespond && request.status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => onRespond(request._id, "accepted")}
              disabled={responding}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              Accept
            </button>
            <button
              onClick={() => onRespond(request._id, "rejected")}
              disabled={responding}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition disabled:opacity-60 cursor-pointer"
            >
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CollaborationRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/collaboration-requests`, authHeader());
      setRequests(res.data.requests || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (id, status) => {
    setRespondingId(id);
    try {
      await axios.put(`${API_URL}/collaboration-requests/${id}`, { status }, authHeader());
      await fetchRequests();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update request.");
    } finally {
      setRespondingId(null);
    }
  };

  const isBrand = user?.role === "brand";

  const content = (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Collaboration Requests</h1>
          <p className="text-xs text-gray-500 mt-1">Review incoming partnership applications and direct creator outreach.</p>
        </div>
        {!isBrand && (
          <Link
            to="/opportunities"
            className="flex items-center gap-1.5 text-xs font-bold text-[#c026d3] hover:underline"
          >
            Browse open campaigns <ArrowUpRight size={15} />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-gray-400">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-white">
          <p className="text-xs text-gray-500 font-medium">
            {isBrand
              ? "No requests yet — find and invite creators from Creator Discovery."
              : "No requests yet — brands you match with will show up here, or apply to a campaign."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((r) => {
            const isMyTurnToRespond = r.initiatedBy !== user?.role;
            return (
              <RequestRow
                key={r._id}
                request={{ ...r, __viewerRole: user?.role }}
                isMyTurnToRespond={isMyTurnToRespond}
                onRespond={handleRespond}
                responding={respondingId === r._id}
              />
            );
          })}
        </div>
      )}
    </div>
  );

  if (isBrand) {
    return <BrandDashboardLayout>{content}</BrandDashboardLayout>;
  }

  return <InfluencerDashboardLayout>{content}</InfluencerDashboardLayout>;
}
