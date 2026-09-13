import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Play,
  Plus,
  ArrowRight,
  DollarSign,
  ExternalLink,
  Star,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  LayoutGrid,
  Camera,
} from "lucide-react";

import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import Heading from "../components/ui/Heading";
import ProfileCard from "../components/dashboard/influencer/ProfileCard";
import ConnectBanner from "../components/dashboard/influencer/ConnectBanner";
import StatCard from "../components/dashboard/influencer/StatCard";
import MyRateCard from "../components/dashboard/influencer/MyRateCard";

import { API_URL } from "../config/api";

export default function InfluencerDashboard() {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchProfile = async () => {
    try {
      const [profileRes, dashboardRes, gallRes, rateRes] = await Promise.all([
        axios.get(`${API_URL}/influencer/profile`, authHeader()).catch(() => ({ data: null })),
        axios.get(`${API_URL}/influencer/dashboard`, authHeader()).catch(() => ({ data: null })),
        axios.get(`${API_URL}/influencer/gallery`, authHeader()).catch(() => ({ data: {} })),
        axios.get(`${API_URL}/influencer/rate-cards`, authHeader()).catch(() => ({ data: {} })),
      ]);

      setProfile(profileRes.data);
      setDashboard(dashboardRes.data);
      setGalleryItems(gallRes.data?.items || []);

      if (rateRes.data?.packages && rateRes.data.packages.length > 0) {
        setPackages(rateRes.data.packages);
      } else if (profileRes.data?.packages && profileRes.data.packages.length > 0) {
        setPackages(profileRes.data.packages);
      } else {
        setPackages([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const isSetupIncomplete =
    packages.length === 0 ||
    !profile.socialAccounts ||
    profile.socialAccounts.length === 0 ||
    !profile.personalInfo?.firstName;

  return (
    <InfluencerDashboardLayout>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 max-w-2xl font-medium">
            Live overview of your creator performance, active deliverables, public showcase, and rate card.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0 flex-wrap">
          <Link
            to="/creator-onboarding"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Sparkles size={14} className="text-yellow-300" />
            <span>Setup Wizard</span>
          </Link>
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
          >
            Browse Campaigns
          </Link>
          <Link
            to="/collaboration-requests"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
          >
            My Requests
          </Link>
        </div>
      </div>

      {/* Incomplete Setup Notice Banner */}
      {isSetupIncomplete && (
        <div className="mt-6 p-5 rounded-3xl bg-zinc-950 text-white border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-yellow-400 flex-shrink-0 mt-0.5">
              <AlertCircle size={22} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                Complete your mandatory Creator Setup
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 max-w-xl">
                Complete your profile, configure rate deliverables, and link your Instagram so brands can discover and book you.
              </p>
            </div>
          </div>

          <Link
            to="/creator-onboarding"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 flex-shrink-0 cursor-pointer"
          >
            <span>Launch Setup Wizard</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Profile Card & Connect Banner */}
      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileCard
            profile={profile}
            handle={profile.handle}
            socialAccounts={profile.socialAccounts}
            categories={profile.categories || []}
            approved={profile.approved}
            packages={packages}
            galleryItems={galleryItems}
          />
        </div>
        <ConnectBanner profile={profile} />
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid sm:grid-cols-2 gap-6">
        <StatCard
          icon={Camera}
          label="Total Collaborations"
          value={dashboard.stats.collaborationsCompleted}
          suffix={dashboard.stats.collaborationsCompleted === 0 ? "No collaborations yet" : undefined}
        />
        <StatCard
          icon={Star}
          label="Reviews"
          value={dashboard.stats.reviewsCount > 0 ? dashboard.stats.rating : "—"}
          suffix={dashboard.stats.reviewsCount > 0 ? `${dashboard.stats.reviewsCount} reviews` : "No reviews yet"}
        />
      </div>

      {/* ACTIVE PRICING PACKAGES SHOWCASE */}
      <div className="mt-8 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg text-zinc-950 flex items-center gap-2">
                <DollarSign size={20} className="text-zinc-900" />
                Active Pricing Packages
              </h2>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  packages.length >= 3
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-zinc-100 text-zinc-800"
                }`}
              >
                {packages.length} Active
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Deliverable rates displayed on your public creator profile. Manage or adjust them inside your Account hub.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/account?tab=packages"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 text-zinc-900 hover:bg-zinc-50 text-xs font-bold transition shadow-sm"
            >
              Manage in Account →
            </Link>
          </div>
        </div>

        {packages.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50">
            <Layers size={32} className="mx-auto text-zinc-400 mb-2" />
            <h4 className="text-sm font-bold text-zinc-900">No packages created yet</h4>
            <p className="text-xs text-zinc-500 mt-0.5 max-w-sm mx-auto">
              Configure deliverables (e.g. 1x Reel, 3x Reels, 1x Reel + 2x Stories) to start getting brand bookings.
            </p>
            <Link
              to="/creator-onboarding"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus size={14} /> Setup Packages in Wizard
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg, idx) => {
              const pkgId = pkg.id || pkg._id || `pkg-${idx}`;
              const price = Number(pkg.price) || 0;

              return (
                <div
                  key={pkgId}
                  className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50/60 hover:border-zinc-300 transition-all flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between w-full">
                      <div>
                        <h4 className="font-extrabold text-sm text-zinc-950">
                          {pkg.title || `${pkg.count || 1}x ${pkg.contentType || "Reel"}`}
                        </h4>
                        <p className="text-[11px] font-semibold text-zinc-500 mt-0.5">
                          {pkg.count || 1}x {pkg.contentType || "Deliverable"} · {pkg.duration || 30} {pkg.durationUnit || "Seconds"}
                        </p>
                      </div>
                      <span className="text-sm font-black text-zinc-950 bg-white px-2.5 py-1 rounded-xl border border-zinc-200 shadow-xs">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {pkg.description && (
                      <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                        {pkg.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* HIGHLIGHTED PORTFOLIO SHOWCASE */}
      <div className="mt-8 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg text-zinc-950 flex items-center gap-2">
                <LayoutGrid size={20} className="text-zinc-900" />
                Highlighted Portfolio Showcase
              </h2>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  galleryItems.length >= 3
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-zinc-100 text-zinc-800"
                }`}
              >
                {galleryItems.length} Uploaded
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Public portfolio content featured on your creator profile for brand discovery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/account?tab=portfolio"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 text-zinc-900 hover:bg-zinc-50 text-xs font-bold transition shadow-sm"
            >
              Manage Portfolio →
            </Link>
          </div>
        </div>

        {galleryItems.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50">
            <Play size={32} className="mx-auto text-zinc-400 mb-2" />
            <h4 className="text-sm font-bold text-zinc-900">No portfolio media uploaded yet</h4>
            <p className="text-xs text-zinc-500 mt-0.5 max-w-sm mx-auto">
              Upload videos or photos to prove your content quality and attract campaign invitations.
            </p>
            <Link
              to="/account?tab=portfolio"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus size={14} /> Upload in Portfolio Tab
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {galleryItems.map((item) => {
              const itemId = item._id || item.id;
              const isVideo = item.mediaType === "video" || item.mediaUrl?.endsWith(".mp4");

              return (
                <div
                  key={itemId}
                  className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 shadow-sm"
                >
                  {isVideo ? (
                    <video src={item.mediaUrl} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <img src={item.mediaUrl} alt="Portfolio item" className="w-full h-full object-cover" />
                  )}

                  {/* Star Highlight & Type Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    {isVideo && (
                      <div className="bg-black/70 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5">
                        <Play size={8} fill="white" />
                        <span>0:30</span>
                      </div>
                    )}
                  </div>

                  {item.highlighted && (
                    <div className="absolute top-2 right-2 p-1.5 rounded-full bg-amber-400 text-gray-950 shadow">
                      <Star size={12} fill="currentColor" />
                    </div>
                  )}

                  {/* Caption overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                    <p className="text-[10px] text-white font-bold truncate">
                      {item.caption || "Showcase Highlight"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Market Rate Benchmark */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900 tracking-tight">Market Rate Benchmark</h2>
          <Link
            to="/rate-benchmark"
            className="text-xs sm:text-sm font-semibold text-gray-900 hover:underline"
          >
            View full rate benchmark →
          </Link>
        </div>
        <MyRateCard profile={profile} />
      </div>
    </InfluencerDashboardLayout>
  );
}