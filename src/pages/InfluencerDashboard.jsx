import React, { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/layout/Navbar";
import Section from "../components/common/Section";
import ProfileCard from "../components/dashboard/influencer/ProfileCard";
import ConnectBanner from "../components/dashboard/influencer/ConnectBanner";
import StatCard from "../components/dashboard/influencer/StatCard";
import AddSocialAccountModal from "../components/dashboard/influencer/AddSocialAccountModal";
import CategoryPickerModal from "../components/dashboard/influencer/CategoryPickerModal";

import { Link } from "react-router-dom";
import MyRateCard from "../components/dashboard/influencer/MyRateCard";

import { API_URL } from "../config/api";

export default function InfluencerDashboard() {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [savingCategories, setSavingCategories] = useState(false);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchProfile = async () => {
    try {
      const [profileRes, dashboardRes] = await Promise.all([
        axios.get(`${API_URL}/influencer/profile`, authHeader()),
        axios.get(`${API_URL}/influencer/dashboard`, authHeader()),
      ]);
      setProfile(profileRes.data);
      setDashboard(dashboardRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddAccount = async (account) => {
    try {
      const res = await axios.post(`${API_URL}/influencer/social-accounts`, account, authHeader());
      setProfile(res.data);
      setShowAddModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add account.");
    }
  };

  const handleRemoveAccount = async (platform) => {
    try {
      const res = await axios.delete(`${API_URL}/influencer/social-accounts/${platform}`, authHeader());
      setProfile(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove account.");
    }
  };

  const handleSaveCategories = async (categories) => {
    setSavingCategories(true);
    try {
      const res = await axios.put(`${API_URL}/influencer/profile`, { categories }, authHeader());
      setProfile(res.data);
      setShowCategoryModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save categories.");
    } finally {
      setSavingCategories(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Section className="pt-32">
          <p className="text-[var(--color-text-light)]">Loading your dashboard...</p>
        </Section>
      </>
    );
  }

  if (error || !profile || !dashboard) {
    return (
      <>
        <Navbar />
        <Section className="pt-32">
          <p className="text-[var(--color-danger)]">{error || "Something went wrong."}</p>
        </Section>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Section className="pt-32">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--color-text)]">Dashboard</h1>
            <p className="mt-2 text-[var(--color-text-light)] max-w-2xl">
              Earn from your influence through gifted and paid collabs. Connect your accounts and start
              receiving opportunities.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link
              to="/opportunities"
              className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors"
            >
              Browse Campaigns
            </Link>
            <Link
              to="/collaboration-requests"
              className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold transition-colors"
            >
              My Requests
            </Link>
          </div>
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProfileCard
              handle={profile.handle}
              socialAccounts={profile.socialAccounts}
              categories={profile.categories || []}
              approved={profile.approved}
              onAddAccount={() => setShowAddModal(true)}
              onRemoveAccount={handleRemoveAccount}
              onEditCategories={() => setShowCategoryModal(true)}
            />
          </div>
          <ConnectBanner />
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[var(--color-text)]">My Rate Card</h2>
            <Link
              to="/insider-rate"
              className="text-sm font-bold text-[var(--color-primary-hover)] hover:underline"
            >
              See your insider rate →
            </Link>
          </div>
          <MyRateCard profile={profile} />
        </div>

        {/* Stats, challenges, opportunities, requests, and collaborations
            sections plug in here once those backend endpoints exist. */}
        <div className="mt-8">
          <h2 className="font-bold text-[var(--color-text)] mb-4">My Stats</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <StatCard
              icon={<img src="/icons/camera.svg" alt="Camera" className="w-5 h-5 object-contain" />}
              label="Collaborations Completed"
              value={dashboard.stats.collaborationsCompleted}
            />
            <StatCard
              icon={<img src="/icons/star.svg" alt="Star" className="w-5 h-5 object-contain" />}
              label="Rating"
              value={dashboard.stats.rating}
              suffix={`out of ${dashboard.stats.reviewsCount} reviews`}
            />
            <StatCard
              icon={<img src="/icons/gift.svg" alt="Gift" className="w-5 h-5 object-contain" />}
              label="Formats Completed"
              value={dashboard.challenges.allFormats.completed.length}
              suffix="out of 3"
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-bold text-[var(--color-text)] mb-4">Challenges</h2>
          <div className="flex flex-col gap-3">
            <ChallengeRow
              title="Response time"
              description="Respond to brand requests in under 2 days."
              achieved={dashboard.challenges.responseTime.achieved}
              detail={
                dashboard.challenges.responseTime.avgHours !== null
                  ? `Current average: ${dashboard.challenges.responseTime.avgHours}h`
                  : "No responded requests yet."
              }
            />
            <ChallengeRow
              title="Stay active"
              description="Apply to 7+ opportunities this week."
              achieved={dashboard.challenges.activeness.achieved}
              detail={`${dashboard.challenges.activeness.applicationsThisWeek}/7 this week`}
            />
            <ChallengeRow
              title="Try every format"
              description="Complete a collaboration in money, barter, and product formats."
              achieved={dashboard.challenges.allFormats.achieved}
              detail={`Completed: ${dashboard.challenges.allFormats.completed.join(", ") || "none yet"}`}
            />
          </div>
        </div>
      </Section>

      {showAddModal && (
        <AddSocialAccountModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddAccount}
        />
      )}

      {showCategoryModal && (
        <CategoryPickerModal
          initialCategories={profile.categories || []}
          saving={savingCategories}
          onClose={() => setShowCategoryModal(false)}
          onSave={handleSaveCategories}
        />
      )}
    </>
  );
}

function ChallengeRow({ title, description, achieved, detail }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)] flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-[var(--color-text)]">{title}</h4>
          {achieved && (
            <span className="text-[10px] font-bold text-[var(--color-success)] bg-[var(--color-success)]/10 px-2 py-0.5 rounded-full">
              Achieved
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--color-text-light)] mt-1">{description}</p>
      </div>
      <span className="text-sm font-semibold text-[var(--color-text)] whitespace-nowrap">{detail}</span>
    </div>
  );
}