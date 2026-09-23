import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import Heading from "../components/ui/Heading";
import AccountSettingsTab from "../components/dashboard/influencer/AccountSettingsTab";
import MatchProfileTab from "../components/dashboard/influencer/matchProfileTab";
import ReviewsTab from "../components/dashboard/influencer/reviewsTab";
import PortfolioTab from "../components/dashboard/influencer/PortFolioTab";
import PackagesTab from "../components/dashboard/influencer/PackagesTab";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

const TABS = [
  { id: "account-settings", label: "Account Settings" },
  { id: "match-profile", label: "Match Profile" },
  { id: "packages", label: "Packages & Rates" },
  { id: "portfolio", label: "Portfolio" },
  { id: "reviews", label: "Reviews" },
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
  }, [user?._id]);

  return (
    <InfluencerDashboardLayout>
      {/* Top Header Row with Page Title and Preview Action */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Your Profile</h1>
        <Link
          to={`/creators/${profile?.user?._id || profile?._id || user?._id || ""}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black hover:bg-black/80 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
        >
          Preview Profile
        </Link>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`pb-3 text-sm transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-zinc-950 text-zinc-950 font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-900 font-medium"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Body */}
      {loading ? (
        <p className="text-(--color-text-light)">Loading your profile...</p>
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

          {activeTab === "packages" && (
            <PackagesTab 
              profile={profile} 
              onUpdated={setProfile} 
            />
          )}

          {activeTab === "portfolio" && <PortfolioTab />}

          {activeTab === "reviews" && <ReviewsTab />}
        </>
      )}
    </InfluencerDashboardLayout>
  );
}