import React, { useEffect, useState } from "react";
import axios from "axios";
import { Target, Calendar, Send, Check, Clock, AlertCircle, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";

import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import { API_URL } from "../config/api";

function OpportunityCard({ opportunity, onApply, applying, isComplete }) {
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
  const [profile, setProfile] = useState(null);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [incompleteReason, setIncompleteReason] = useState("");

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchData = async () => {
    try {
      const [oppRes, profRes] = await Promise.all([
        axios.get(`${API_URL}/influencer/opportunities`, authHeader()).catch(() => ({ data: {} })),
        axios.get(`${API_URL}/influencer/profile`, authHeader()).catch(() => ({ data: null })),
      ]);
      setOpportunities(oppRes.data?.opportunities || []);
      setProfile(profRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isProfileComplete = () => {
    if (!profile) return false;
    const hasSocial = profile.socialAccounts && profile.socialAccounts.length > 0;
    const hasNiche = profile.categories && profile.categories.length > 0;
    const hasAvatar = !!profile.personalInfo?.avatar;
    const hasCover = !!profile.personalInfo?.coverPhoto;
    const hasBio = !!profile.matchProfile?.bio || !!profile.personalInfo?.title;
    return hasSocial && hasNiche && hasAvatar && hasCover && hasBio;
  };

  const handleApply = async (opportunityId) => {
    if (!isProfileComplete()) {
      setIncompleteReason(
        "Please complete your creator profile (avatar, cover photo, bio, categories, and connected Instagram) before applying to brand campaigns."
      );
      setShowIncompleteModal(true);
      return;
    }

    setApplyingId(opportunityId);
    try {
      await axios.post(`${API_URL}/collaboration-requests`, { opportunityId }, authHeader());
      setOpportunities((prev) =>
        prev.map((o) => (o._id === opportunityId ? { ...o, myRequestStatus: "pending" } : o))
      );
    } catch (error) {
      console.error(error);
      if (error.response?.data?.incompleteProfile) {
        setIncompleteReason(error.response.data.message);
        setShowIncompleteModal(true);
      } else {
        alert(error.response?.data?.message || "Failed to apply.");
      }
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <InfluencerDashboardLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Browse Campaigns</h1>
          <p className="text-xs text-[var(--color-text-light)] mt-1">
            Apply to open brand campaigns that match your audience and niche.
          </p>
        </div>

        {!isProfileComplete() && (
          <Link
            to="/creator-onboarding"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <AlertCircle size={14} /> Complete Profile to Apply
          </Link>
        )}
      </div>

      {!isProfileComplete() && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
            <span>
              Your profile is currently incomplete. Brands prefer creators with a completed bio, cover photo, portfolio, and connected Instagram.
            </span>
          </div>
          <Link
            to="/creator-onboarding"
            className="font-bold text-amber-800 underline hover:text-black flex-shrink-0"
          >
            Finish Setup &rarr;
          </Link>
        </div>
      )}

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
              isComplete={isProfileComplete()}
              onApply={() => handleApply(o._id)}
            />
          ))}
        </div>
      )}

      {/* Incomplete Profile Modal */}
      {showIncompleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-fadeIn text-center space-y-4">
            <button
              onClick={() => setShowIncompleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>

            <h3 className="text-lg font-extrabold text-gray-950">
              Complete Your Profile to Apply
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed">
              {incompleteReason ||
                "Brands need to review your portfolio, pricing packages, and connected Instagram before accepting collaboration requests."}
            </p>

            <div className="flex items-center justify-center gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowIncompleteModal(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <Link
                to="/creator-onboarding"
                className="px-6 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
              >
                Complete in Onboarding <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </InfluencerDashboardLayout>
  );
}
