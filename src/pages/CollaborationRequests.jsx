import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Check, X, Clock, ArrowUpRight, MessageCircle } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";
import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import BrandDashboardLayout from "../components/dashboard/brand/BrandDashboardLayout";

const STATUS_STYLES = {
  pending: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
  accepted: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
  rejected: "bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
};

function RequestRow({ request, isMyTurnToRespond, onRespond, responding }) {
  const otherParty =
    request.brand && request.influencer
      ? request.__viewerRole === "brand"
        ? request.influencer
        : request.brand
      : null;

  const otherPartyName = otherParty?.name || "Unknown";

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)] flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <p className="font-bold text-[var(--color-text)]">{otherPartyName}</p>
        <p className="text-xs text-[var(--color-text-light)] mt-1">
          {request.opportunity?.title || "Direct outreach"}
          {request.opportunity?.rewardValue
            ? ` · ${request.opportunity.rewardValue}`
            : ""}
        </p>
        <p className="text-xs text-[var(--color-text-light)] mt-1">
          {request.initiatedBy === "brand"
            ? "Brand reached out"
            : "Influencer applied"}{" "}
          ·{" "}
          {new Date(
            request.requestedAt || request.createdAt,
          ).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_STYLES[request.status]}`}
        >
          {request.status === "pending" && <Clock size={13} />}
          {request.status === "accepted" && <Check size={13} />}
          {request.status === "rejected" && <X size={13} />}
          {request.status}
        </span>

        {otherParty?._id && (
          <Link
            to={`/messages?with=${otherParty._id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] text-xs font-semibold hover:bg-[var(--color-background)] transition"
          >
            <MessageCircle size={13} /> Message
          </Link>
        )}

        {isMyTurnToRespond && request.status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => onRespond(request._id, "accepted")}
              disabled={responding}
              className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold transition disabled:opacity-60"
            >
              Accept
            </button>
            <button
              onClick={() => onRespond(request._id, "rejected")}
              disabled={responding}
              className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] text-xs font-semibold hover:bg-[var(--color-background)] transition disabled:opacity-60"
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
      const res = await axios.get(
        `${API_URL}/collaboration-requests`,
        authHeader(),
      );
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
      await axios.put(
        `${API_URL}/collaboration-requests/${id}`,
        { status },
        authHeader(),
      );
      await fetchRequests();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update request.");
    } finally {
      setRespondingId(null);
    }
  };

  const isBrand = user?.role === "brand";
  const isInfluencer = user?.role === "influencer";

  const content = (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Collaboration Requests
        </h1>
        {!isBrand && (
          <Link
            to="/opportunities"
            className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-primary-hover)] hover:underline"
          >
            Browse open campaigns <ArrowUpRight size={16} />
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-[var(--color-text-light)]">Loading requests...</p>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-2xl">
          <p className="text-[var(--color-text-light)]">
            {isBrand
              ? "No requests yet — send one from Search Creators."
              : "No requests yet — brands you match with will show up here, or apply to a campaign."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
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
    </>
  );

  if (isInfluencer) {
    return <InfluencerDashboardLayout>{content}</InfluencerDashboardLayout>;
  }

  return <BrandDashboardLayout>{content}</BrandDashboardLayout>;
} 