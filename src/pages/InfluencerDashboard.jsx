import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, Play, Plus, ArrowRight, DollarSign,
  Star, Layers, AlertCircle, LayoutGrid, Handshake
} from "lucide-react";
import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import ProfileCard from "../components/dashboard/influencer/ProfileCard";
import ConnectBanner from "../components/dashboard/influencer/ConnectBanner";
import StatCard from "../components/dashboard/influencer/StatCard";
import MyRateCard from "../components/dashboard/influencer/MyRateCard";
import Folder from "../components/ui/Folder";
import api from "../config/api";

const MEDIA_KIT_VAULTS = [
  {
    title: "Deliverable Stack",
    desc: "Standard formats & production quality",
    color: "#DB2777",
    items: [
      { top: "🎬 4K Reel", sub: "In-Feed 60s", topCol: "text-pink-950", subCol: "text-pink-600" },
      { top: "📱 3x Stories", sub: "Link + Poll", topCol: "text-fuchsia-950", subCol: "text-fuchsia-600" },
      { top: "📄 Usage Rights", sub: "30-Day Digital", topCol: "text-purple-950", subCol: "text-purple-600" },
    ],
  },
  {
    title: "Verified Media Kit",
    desc: "Real metrics verified by platform",
    color: "#7C3AED",
    items: [
      { top: "📈 High Eng.", sub: "8.4% Average", topCol: "text-purple-950", subCol: "text-purple-600" },
      { top: "👥 Top Niche", sub: "18-34 Urban", topCol: "text-indigo-950", subCol: "text-indigo-600" },
      { top: "🛡️ Brand Safe", sub: "100% Authentic", topCol: "text-pink-950", subCol: "text-pink-600" },
    ],
  },
  {
    title: "Protected Payouts",
    desc: "Secure contracts & escrow terms",
    color: "#4F46E5",
    items: [
      { top: "💳 Escrow Pay", sub: "Guaranteed", topCol: "text-indigo-950", subCol: "text-indigo-600" },
      { top: "⚡ 48h Delivery", sub: "Fast Turnaround", topCol: "text-blue-950", subCol: "text-blue-600" },
      { top: "🤝 Direct Deals", sub: "No Agency Cuts", topCol: "text-teal-950", subCol: "text-teal-600" },
    ],
  },
];

export default function InfluencerDashboard() {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const [profileRes, dashboardRes, gallRes, rateRes] = await Promise.all([
        api.get("/influencer/profile").catch(() => ({ data: null })),
        api.get("/influencer/dashboard").catch(() => ({ data: null })),
        api.get("/influencer/gallery").catch(() => ({ data: {} })),
        api.get("/influencer/rate-cards").catch(() => ({ data: {} })),
      ]);

      setProfile(profileRes.data);
      setDashboard(dashboardRes.data);
      setGalleryItems(gallRes.data?.items || []);
      setPackages(rateRes.data?.packages?.length ? rateRes.data.packages : profileRes.data?.packages || []);
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
        <p className="text-(--color-text-light)">Loading your dashboard...</p>
      </InfluencerDashboardLayout>
    );
  }

  if (error || !profile || !dashboard) {
    return (
      <InfluencerDashboardLayout>
        <p className="text-(--color-danger)">{error || "Something went wrong."}</p>
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
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">Dashboard</h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 max-w-2xl font-medium">
            Live overview of your creator performance, active deliverables, public showcase, and rate card.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Link
            to="/creator-onboarding"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
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
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-yellow-400 shrink-0 mt-0.5">
              <AlertCircle size={22} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Complete your mandatory Creator Setup</h3>
              <p className="text-xs text-zinc-400 mt-0.5 max-w-xl">
                Complete your profile, configure rate deliverables, and link your Instagram so brands can discover and book you.
              </p>
            </div>
          </div>
          <Link
            to="/creator-onboarding"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 shrink-0 cursor-pointer"
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
          icon={Handshake}
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

      {/* INTERACTIVE CREATOR MEDIA KIT & DELIVERABLE VAULTS */}
      <div className="mt-8 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
        <div>
          <h2 className="font-black text-base sm:text-lg text-zinc-950 flex items-center gap-2">
            <Sparkles size={20} className="text-zinc-900" />
            Interactive Media Kit &amp; Deliverables Vault
          </h2>
          <p className="text-xs text-zinc-500 font-medium mt-1">
            Click any folder below to fan out your verified deliverable cards, performance metrics, and sponsorship assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 pb-2 items-center justify-items-center">
          {MEDIA_KIT_VAULTS.map(({ title, desc, color, items }, i) => (
            <div key={i} className="w-full flex flex-col items-center p-5 rounded-2xl bg-zinc-50/70 border border-zinc-200/80 hover:border-zinc-300 shadow-2xs hover:shadow-xs transition-all">
              <div className="h-28 flex items-center justify-center">
                <Folder
                  size={1.15}
                  color={color}
                  items={items.map((it, idx) => (
                    <div key={idx} className="w-full h-full p-2 flex flex-col justify-center items-center text-center">
                      <span className={`text-[9px] font-black ${it.topCol} leading-none`}>{it.top}</span>
                      <span className={`text-[7.5px] ${it.subCol} font-semibold mt-0.5`}>{it.sub}</span>
                    </div>
                  ))}
                />
              </div>
              <h4 className="text-xs font-black text-zinc-950 mt-3">{title}</h4>
              <p className="text-[10px] text-zinc-500 font-medium text-center mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
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
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${packages.length >= 3 ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-800"}`}>
                {packages.length} Active
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Deliverable rates displayed on your public creator profile. Manage or adjust them inside your Account hub.
            </p>
          </div>
          <Link to="/account?tab=packages" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 text-zinc-900 hover:bg-zinc-50 text-xs font-bold transition shadow-sm">
            Manage in Account →
          </Link>
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
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
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
                <div key={pkgId} className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50/60 hover:border-zinc-300 transition-all flex flex-col justify-between gap-4 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between w-full">
                      <div>
                        <h4 className="font-extrabold text-sm text-zinc-950">{pkg.title || `${pkg.count || 1}x ${pkg.contentType || "Reel"}`}</h4>
                        <p className="text-[11px] font-semibold text-zinc-500 mt-0.5">
                          {pkg.count || 1}x {pkg.contentType || "Deliverable"} · {pkg.duration || 30} {pkg.durationUnit || "Seconds"}
                        </p>
                      </div>
                      <span className="text-sm font-black text-zinc-950 bg-white px-2.5 py-1 rounded-xl border border-zinc-200 shadow-xs">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {pkg.description && <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">{pkg.description}</p>}
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
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${galleryItems.length >= 3 ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-800"}`}>
                {galleryItems.length} Uploaded
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Public portfolio content featured on your creator profile for brand discovery.
            </p>
          </div>
          <Link to="/account?tab=portfolio" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 text-zinc-900 hover:bg-zinc-50 text-xs font-bold transition shadow-sm">
            Manage Portfolio →
          </Link>
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
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
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
                <div key={itemId} className="group relative aspect-9/16 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 shadow-sm">
                  {isVideo ? (
                    <video src={item.mediaUrl} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <img src={item.mediaUrl} alt="Portfolio item" className="w-full h-full object-cover" />
                  )}

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

                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                    <p className="text-[10px] text-white font-bold truncate">{item.caption || "Showcase Highlight"}</p>
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
          <Link to="/rate-benchmark" className="text-xs sm:text-sm font-semibold text-gray-900 hover:underline">
            View full rate benchmark →
          </Link>
        </div>
        <MyRateCard profile={profile} />
      </div>
    </InfluencerDashboardLayout>
  );
}