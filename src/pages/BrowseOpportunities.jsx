import React, { useEffect, useState } from "react";
import axios from "axios";
import { Target, Calendar, Send, Check, Clock } from "lucide-react";

import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import { API_URL } from "../config/api";

function OpportunityCard({ opportunity, onApply, applying }) {
  const status = opportunity.myRequestStatus;

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)] flex flex-col gap-3">
      <div>
        <h4 className="font-bold text-[var(--color-text)]">{opportunity.title}</h4>
        <p className="text-xs text-[var(--color-text-light)] mt-1">
          {opportunity.brand?.name || "Brand"}
        </p>
      </div>

      {opportunity.description && (
        <p className="text-sm text-[var(--color-text-light)] line-clamp-3">
          {opportunity.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-light)]">
        <span className="flex items-center gap-1 bg-[var(--color-background)] px-2.5 py-1 rounded-full">
          <Target size={12} /> {opportunity.format} · {opportunity.rewardValue || "—"}
        </span>
        {opportunity.deadline && (
          <span className="flex items-center gap-1 bg-[var(--color-background)] px-2.5 py-1 rounded-full">
            <Calendar size={12} /> {new Date(opportunity.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      {opportunity.requirements && (
        <p className="text-xs text-[var(--color-text)]/70 italic">{opportunity.requirements}</p>
      )}

      {status ? (
        <span className="self-start flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-[var(--color-background)] text-[var(--color-text-light)] mt-1">
          {status === "pending" && <Clock size={14} />}
          {status === "accepted" && <Check size={14} className="text-[var(--color-success)]" />}
          {status === "pending" && "Application pending"}
          {status === "accepted" && "You're collaborating"}
          {status === "rejected" && "Application declined"}
        </span>
      ) : (
        <button
          onClick={onApply}
          disabled={applying}
          className="self-start flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition disabled:opacity-60 mt-1"
        >
          <Send size={14} />
          {applying ? "Applying..." : "Apply"}
        </button>
      )}
    </div>
  );
}

export default function BrowseOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchOpportunities = async () => {
    try {
      const res = await axios.get(`${API_URL}/influencer/opportunities`, authHeader());
      setOpportunities(res.data.opportunities || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleApply = async (opportunityId) => {
    setApplyingId(opportunityId);
    try {
      await axios.post(`${API_URL}/collaboration-requests`, { opportunityId }, authHeader());
      setOpportunities((prev) =>
        prev.map((o) => (o._id === opportunityId ? { ...o, myRequestStatus: "pending" } : o))
      );
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to apply.");
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <InfluencerDashboardLayout>
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">Browse Campaigns</h1>

        {loading ? (
          <p className="text-[var(--color-text-light)]">Loading campaigns...</p>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-2xl">
            <p className="text-[var(--color-text-light)]">No open campaigns right now — check back soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {opportunities.map((o) => (
              <OpportunityCard
                key={o._id}
                opportunity={o}
                applying={applyingId === o._id}
                onApply={() => handleApply(o._id)}
              />
            ))}
          </div>
        )}
    </InfluencerDashboardLayout>
  );
}
