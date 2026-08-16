import React, { useEffect, useState } from "react";
import axios from "axios";

import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import Heading from "../components/ui/Heading";
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
      <InfluencerDashboardLayout>
        <p className="text-[var(--color-text-light)]">Loading your dashboard...</p>
      </InfluencerDashboardLayout>
    );
  }

  if (error || !profile || !dashboard) {
    return (
      <InfluencerDashboardLayout>
        <p className="text-[var(--color-danger)]">{error || "Something went wrong."}</p>
      </InfluencerDashboardLayout>
    );
  }

  return (
    <InfluencerDashboardLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Heading level={1}>Dashboard</Heading>
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

      <div className="mt-6 grid sm:grid-cols-2 gap-6">
        <StatCard
          icon={<img src="/icons/camera.svg" alt="" className="w-5 h-5 object-contain" />}
          label="Total Collaborations"
          value={dashboard.stats.collaborationsCompleted}
          suffix={dashboard.stats.collaborationsCompleted === 0 ? "No collaborations yet" : undefined}
        />
        <StatCard
          icon={<img src="/icons/star.svg" alt="" className="w-5 h-5 object-contain" />}
          label="Reviews"
          value={dashboard.stats.reviewsCount > 0 ? dashboard.stats.rating : "—"}
          suffix={dashboard.stats.reviewsCount > 0 ? `${dashboard.stats.reviewsCount} reviews` : "No reviews yet"}
        />
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

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-bold text-[var(--color-text)]">Highlighted content</h2>
        <Link
          to="/content-gallery"
          className="text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary-hover)] hover:underline"
        >
          Manage portfolio →
        </Link>
      </div>

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
    </InfluencerDashboardLayout>
  );
}