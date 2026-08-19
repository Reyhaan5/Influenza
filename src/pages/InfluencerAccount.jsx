import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import Heading from "../components/ui/Heading";
import AccountSettingsTab from "../components/dashboard/influencer/AccountSettingsTab";
import MatchProfileTab from "../components/dashboard/influencer/matchProfileTab";
import ReviewsTab from "../components/dashboard/influencer/reviewsTab";
import PortfolioTab from "../components/dashboard/influencer/PortFolioTab";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

const TABS = [
  { id: "account-settings", label: "Account Settings" },
  { id: "match-profile", label: "Match Profile" },
  { id: "reviews", label: "Reviews" },
  { id: "portfolio", label: "Portfolio" },
];

export default function InfluencerAccount() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "account-settings";

  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Sync activeTab with URL search params when navigation changes
  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/influencer/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.error("Error fetching influencer profile:", err);
        // Fallback default state so the UI renders gracefully instead of staying on red error text
        setProfile({
          handle: user?.name || "Creator",
          categories: [],
          matchProfile: {},
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <InfluencerDashboardLayout>
      {/* Top Header Row with Page Title and Preview Action */}
      <div className="flex items-center justify-between mb-6">
        <Heading level={1}>Your Profile</Heading>
        <button 
          type="button" 
          className="bg-black hover:bg-black/80 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          Preview
        </button>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-6 border-b border-[var(--color-border)] mb-8">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
                isActive
                  ? "border-red-500 text-[var(--color-text)] font-bold"
                  : "border-transparent text-[var(--color-text-light)] hover:text-[var(--color-text)]"
              }`}
            >
              {tab.label}
              {isActive && <span className="text-red-500 font-black text-xs">•</span>}
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Body */}
      {loading ? (
        <p className="text-[var(--color-text-light)]">Loading your profile...</p>
      ) : (
        <>
          {activeTab === "account-settings" && (
            <AccountSettingsTab 
              user={user} 
              profile={profile} 
              onUpdated={setProfile} 
            />
          )}

          {activeTab === "match-profile" && (
            <MatchProfileTab 
              profile={profile} 
              onUpdated={setProfile} 
            />
          )}

          {activeTab === "reviews" && <ReviewsTab />}

          {activeTab === "portfolio" && <PortfolioTab />}
        </>
      )}
    </InfluencerDashboardLayout>
  );
}