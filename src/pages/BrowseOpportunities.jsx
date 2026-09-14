import React, { useEffect, useState } from "react";
import axios from "axios";
import { Target, Calendar, Send, Check, Clock, AlertCircle, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";

import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import { API_URL } from "../config/api";

function OpportunityCard({ opportunity, onApply, applying, isComplete }) {
  const status = opportunity.myRequestStatus;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-zinc-300 transition flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div>
          <h4 className="font-bold text-gray-900 text-sm tracking-tight">{opportunity.title}</h4>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            {opportunity.brand?.name || "Brand Partner"}
          </p>
        </div>

        {opportunity.description && (
          <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
            {opportunity.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 text-gray-700 font-semibold px-2.5 py-1 rounded-full text-[11px]">
            <Target size={12} className="text-gray-500" /> {opportunity.format}
            {opportunity.rewardValue ? ` · ${opportunity.rewardValue}` : ""}
          </span>
          {opportunity.deadline && (
            <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 text-gray-600 font-semibold px-2.5 py-1 rounded-full text-[11px]">
              <Calendar size={12} className="text-gray-500" /> {new Date(opportunity.deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        {opportunity.requirements && (
          <p className="text-[11px] text-gray-500 italic bg-gray-50/70 p-2.5 rounded-xl border border-gray-100">
            {opportunity.requirements}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-gray-100">
        {status ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700">
            {status === "pending" && <Clock size={13} className="text-amber-600" />}
            {status === "accepted" && <Check size={13} className="text-emerald-600" />}
            {status === "pending" && "Application pending"}
            {status === "accepted" && "You're collaborating"}
            {status === "rejected" && "Application declined"}
          </span>
        ) : (
          <button
            onClick={onApply}
            disabled={applying}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs transition active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <Send size={13} />
            {applying ? "Applying..." : "Apply to Campaign"}
          </button>
        )}
      </div>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 mb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Browse Open Campaigns</h1>
          <p className="text-xs text-gray-500 mt-1">
            Apply to active brand campaigns that match your audience and niche.
          </p>
        </div>

        {!isProfileComplete() && (
          <Link
            to="/creator-onboarding"
            className="inline-flex items-center gap-1.5 self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs"
          >
            <AlertCircle size={14} /> Complete Profile to Apply
          </Link>
        )}
      </div>

      {!isProfileComplete() && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>
              Your profile is currently incomplete. Brands prefer creators with a completed bio, cover photo, portfolio, and connected Instagram.
            </span>
          </div>
          <Link
            to="/creator-onboarding"
            className="font-bold text-amber-900 underline hover:text-black shrink-0"
          >
            Finish Setup &rarr;
          </Link>
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-xs text-gray-400">Loading open campaigns...</div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl bg-white p-8">
          <Target size={32} className="mx-auto text-gray-300 mb-2" />
          <h3 className="text-sm font-bold text-gray-900">No Open Campaigns Right Now</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Check back soon as new brands post campaign opportunities daily.
          </p>
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center space-y-4">
            <button
              onClick={() => setShowIncompleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>

            <h3 className="text-base font-bold text-gray-900">
              Complete Your Profile to Apply
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed">
              {incompleteReason ||
                "Brands need to review your portfolio, pricing packages, and connected Instagram before accepting collaboration requests."}
            </p>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowIncompleteModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <Link
                to="/creator-onboarding"
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
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
