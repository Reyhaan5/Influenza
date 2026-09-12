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
  Trash2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Star,
  Edit2,
  Save,
  Check,
  X,
  Clock,
  Layers,
} from "lucide-react";

import InfluencerDashboardLayout from "../components/dashboard/influencer/InfluencerDashboardLayout";
import Heading from "../components/ui/Heading";
import ProfileCard from "../components/dashboard/influencer/ProfileCard";
import ConnectBanner from "../components/dashboard/influencer/ConnectBanner";
import StatCard from "../components/dashboard/influencer/StatCard";
import AddSocialAccountModal from "../components/dashboard/influencer/AddSocialAccountModal";
import CategoryPickerModal from "../components/dashboard/influencer/CategoryPickerModal";
import EditCreatorProfileModal from "../components/dashboard/influencer/EditCreatorProfileModal";
import SegmentedProgressBar from "../components/dashboard/influencer/SegmentedProgressBar";
import MyRateCard from "../components/dashboard/influencer/MyRateCard";

import { API_URL } from "../config/api";

const CONTENT_TYPES = [
  "Reel",
  "Story",
  "Post",
  "Carousel",
  "Video Ad",
  "Testimonial Video",
  "Product Showcase",
  "Full Dedicated Reel",
];

export default function InfluencerDashboard() {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals & In-place state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [savingCategories, setSavingCategories] = useState(false);

  // In-place Package Editing State
  const [isEditingPackages, setIsEditingPackages] = useState(false);
  const [savingPackages, setSavingPackages] = useState(false);
  const [packageFeedback, setPackageFeedback] = useState(null);

  // In-place Highlighted Content State
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaFeedback, setMediaFeedback] = useState(null);
  const fileInputRef = useRef(null);

  // Section refs for smooth scrolling from progress bar checklist
  const packageSectionRef = useRef(null);
  const gallerySectionRef = useRef(null);

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
        // Default empty packages for brand new creators
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
    if (!window.confirm("Are you sure you want to disconnect this Instagram account? All retrieved follower analytics and rate card links will be cleared.")) {
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/influencer/disconnect-instagram`, {}, authHeader());
      if (res.data?.profile) {
        setProfile(res.data.profile);
      }
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to disconnect account.");
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

  // ==========================================
  // IN-PLACE PACKAGE MANAGEMENT (DIRECT IN DASHBOARD)
  // ==========================================
  const handleUpdatePackage = (pkgId, field, val) => {
    setPackages((prev) =>
      prev.map((p, idx) => {
        const currentId = p.id || p._id || `pkg-${idx}`;
        if (currentId === pkgId) {
          const updated = { ...p, [field]: val };
          if (field === "contentType") {
            updated.title = `${updated.count || 1}x ${val}`;
          }
          return updated;
        }
        return p;
      })
    );
  };

  const handleAddPackageItem = () => {
    const newId = `pkg-${Date.now()}`;
    const newPkg = {
      id: newId,
      title: "1x Instagram Reel",
      contentType: "Reel",
      count: 1,
      duration: 30,
      durationUnit: "Seconds",
      price: 75,
      description: "High-hook UGC promotional reel formatted for 9:16 vertical view.",
    };
    setPackages((prev) => [...prev, newPkg]);
    setIsEditingPackages(true);
  };

  const handleDeletePackageItem = (pkgId) => {
    setPackages((prev) => prev.filter((p, idx) => (p.id || p._id || `pkg-${idx}`) !== pkgId));
  };

  const handleSaveAllPackages = async () => {
    if (packages.length < 3) {
      if (!window.confirm(`You currently have ${packages.length} package(s). Minimum 3 packages are recommended for full profile verification. Save anyway?`)) {
        return;
      }
    }

    setSavingPackages(true);
    try {
      const reelPrice = packages.find((p) => p.contentType === "Reel")?.price || 60;
      const postPrice = packages.find((p) => p.contentType === "Post")?.price || 50;
      const storyPrice = packages.find((p) => p.contentType === "Story")?.price || 35;

      await axios.post(
        `${API_URL}/influencer/rate-cards`,
        {
          packages,
          rates: { reel: reelPrice, post: postPrice, story: storyPrice },
        },
        authHeader()
      );

      await axios.put(
        `${API_URL}/influencer/profile`,
        { packages },
        authHeader()
      );

      setIsEditingPackages(false);
      setPackageFeedback("Pricing packages saved successfully!");
      setTimeout(() => setPackageFeedback(null), 3500);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save packages.");
    } finally {
      setSavingPackages(false);
    }
  };

  // ==========================================
  // IN-PLACE HIGHLIGHTED CONTENT UPLOADER & MANAGEMENT
  // ==========================================
  const handleDirectGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingMedia(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("media", file);
        formData.append("caption", "Showcase Highlight");
        formData.append("platform", "Instagram");

        const res = await axios.post(`${API_URL}/influencer/gallery`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.data?.item) {
          setGalleryItems((prev) => [res.data.item, ...prev]);
        }
      }
      setMediaFeedback("Highlighted portfolio content uploaded!");
      setTimeout(() => setMediaFeedback(null), 3500);
    } catch (err) {
      console.error(err);
      alert("Failed to upload portfolio item.");
    } finally {
      setUploadingMedia(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteGalleryItem = async (itemId) => {
    if (!window.confirm("Remove this highlighted content from your showcase?")) return;
    try {
      await axios.delete(`${API_URL}/influencer/gallery/${itemId}`, authHeader());
      setGalleryItems((prev) => prev.filter((i) => i._id !== itemId && i.id !== itemId));
    } catch (err) {
      alert("Failed to remove item.");
    }
  };

  const handleToggleGalleryHighlight = async (itemId) => {
    try {
      const res = await axios.patch(`${API_URL}/influencer/gallery/${itemId}/highlight`, {}, authHeader());
      if (res.data?.item) {
        setGalleryItems((prev) =>
          prev.map((i) => ((i._id === itemId || i.id === itemId) ? res.data.item : i))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle star.");
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
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Heading level={1}>Dashboard</Heading>
          <p className="mt-1.5 text-sm text-[var(--color-text-light)] max-w-2xl">
            Manage your creator brand, packages, Instagram connection, and opportunities from one workspace.
          </p>
        </div>
        <div className="flex gap-2.5 flex-shrink-0">
          <Link
            to="/creator-onboarding"
            className="px-4 py-2.5 rounded-xl border border-black bg-black text-white text-xs sm:text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm"
          >
            Setup Wizard
          </Link>
          <Link
            to="/opportunities"
            className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs sm:text-sm font-bold text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors"
          >
            Browse Campaigns
          </Link>
          <Link
            to="/collaboration-requests"
            className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs sm:text-sm font-bold transition-colors"
          >
            My Requests
          </Link>
        </div>
      </div>

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
            onEditProfile={() => setShowEditProfileModal(true)}
            onAddAccount={() => setShowAddModal(true)}
            onRemoveAccount={handleRemoveAccount}
            onEditCategories={() => setShowCategoryModal(true)}
          />
        </div>
        <ConnectBanner
          profile={profile}
          onConnect={() => setShowAddModal(true)}
          onEditProfile={() => setShowEditProfileModal(true)}
        />
      </div>

      {/* Quick Stats */}
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

      {/* IN-PLACE UGC DELIVERABLES & PRICING PACKAGES MANAGER */}
      <div
        ref={packageSectionRef}
        className="mt-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base sm:text-lg text-[var(--color-text)] flex items-center gap-2">
                <DollarSign size={20} className="text-emerald-600" />
                Active Pricing Packages (In-Place Management)
              </h2>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  packages.length >= 3
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {packages.length} / 3 Min Required
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-light)] mt-1">
              Set and update your rates anytime right from this dashboard. Changes immediately update what brands see.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddPackageItem}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold transition shadow-sm"
            >
              <Plus size={14} /> Add Package
            </button>

            {isEditingPackages ? (
              <button
                type="button"
                onClick={handleSaveAllPackages}
                disabled={savingPackages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
              >
                <Save size={14} /> {savingPackages ? "Saving..." : "Save Pricing"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingPackages(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-50 text-xs font-bold transition shadow-sm"
              >
                <Edit2 size={13} /> Edit Rates
              </button>
            )}
          </div>
        </div>

        {packageFeedback && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} />
            {packageFeedback}
          </div>
        )}

        {packages.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
            <Layers size={32} className="mx-auto text-gray-400 mb-2" />
            <h4 className="text-sm font-bold text-gray-900">No packages created yet</h4>
            <p className="text-xs text-gray-500 mt-0.5 max-w-sm mx-auto">
              Add at least 3 deliverables (e.g. 1x Reel, 3x Reels, 1x Reel + 2x Stories) to complete your profile.
            </p>
            <button
              type="button"
              onClick={handleAddPackageItem}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold shadow-sm"
            >
              <Plus size={14} /> Create First Package
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg, idx) => {
              const pkgId = pkg.id || pkg._id || `pkg-${idx}`;
              const price = Number(pkg.price) || 0;
              const creatorEarning = Math.max(0, Math.round(price * 0.85));

              return (
                <div
                  key={pkgId}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 shadow-sm ${
                    isEditingPackages
                      ? "bg-white border-blue-300 ring-2 ring-blue-50"
                      : "bg-gray-50/80 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Title & Delete */}
                    <div className="flex items-start justify-between gap-2">
                      {isEditingPackages ? (
                        <div className="w-full space-y-2">
                          <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Deliverable Type</label>
                            <select
                              value={pkg.contentType || "Reel"}
                              onChange={(e) => handleUpdatePackage(pkgId, "contentType", e.target.value)}
                              className="w-full mt-0.5 px-2.5 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 bg-white"
                            >
                              {CONTENT_TYPES.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Quantity</label>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={pkg.count || 1}
                                onChange={(e) => handleUpdatePackage(pkgId, "count", Number(e.target.value))}
                                className="w-full mt-0.5 px-2.5 py-1 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Price ($)</label>
                              <div className="relative mt-0.5">
                                <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 font-bold">$</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={pkg.price || 0}
                                  onChange={(e) => handleUpdatePackage(pkgId, "price", Number(e.target.value))}
                                  className="w-full pl-6 pr-2 py-1 rounded-xl border border-gray-300 text-xs font-bold text-emerald-700 bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between w-full">
                          <div>
                            <h4 className="font-extrabold text-sm text-gray-950">
                              {pkg.title || `${pkg.count || 1}x ${pkg.contentType || "Reel"}`}
                            </h4>
                            <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
                              {pkg.count || 1}x {pkg.contentType} · {pkg.duration || 30} {pkg.durationUnit || "Seconds"}
                            </p>
                          </div>
                          <span className="text-base font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                            ${pkg.price}
                          </span>
                        </div>
                      )}

                      {isEditingPackages && (
                        <button
                          type="button"
                          onClick={() => handleDeletePackageItem(pkgId)}
                          className="text-gray-400 hover:text-red-500 p-1 transition"
                          title="Delete package"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    {/* Description */}
                    {isEditingPackages ? (
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Package Description</label>
                        <textarea
                          rows={2}
                          value={pkg.description || ""}
                          onChange={(e) => handleUpdatePackage(pkgId, "description", e.target.value)}
                          placeholder="What is included? (e.g. concept ideation, video hook, raw footage)"
                          className="w-full mt-0.5 px-2.5 py-1.5 rounded-xl border border-gray-300 text-xs text-gray-800 bg-white"
                        />
                      </div>
                    ) : (
                      pkg.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {pkg.description}
                        </p>
                      )
                    )}
                  </div>

                  {/* Earning footer */}
                  <div className="pt-2.5 border-t border-gray-200 text-[11px] font-semibold text-gray-500 flex items-center justify-between">
                    <span>
                      You take home: <strong className="text-emerald-700">${creatorEarning}</strong>
                    </span>
                    <span className="text-gray-400">15% platform fee</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* IN-PLACE HIGHLIGHTED PORTFOLIO CONTENT MANAGER */}
      <div
        ref={gallerySectionRef}
        className="mt-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base sm:text-lg text-[var(--color-text)]">
                Highlighted Portfolio Content (In-Place Management)
              </h2>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  galleryItems.length >= 3
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {galleryItems.length} / 3 Min Required
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-light)] mt-1">
              Upload your high-performing Instagram videos and photos directly here to feature on your public profile showcase.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleDirectGalleryUpload}
              multiple
              accept="image/*,video/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingMedia}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
            >
              <Upload size={14} />
              {uploadingMedia ? "Uploading..." : "+ Upload Highlighted Media"}
            </button>
          </div>
        </div>

        {mediaFeedback && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} />
            {mediaFeedback}
          </div>
        )}

        {galleryItems.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
            <Play size={32} className="mx-auto text-gray-400 mb-2" />
            <h4 className="text-sm font-bold text-gray-900">No portfolio content uploaded yet</h4>
            <p className="text-xs text-gray-500 mt-0.5 max-w-sm mx-auto">
              Upload at least 3 videos or photos to prove your content quality to brands.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold shadow-sm"
            >
              <Upload size={14} /> Upload Portfolio Content
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {galleryItems.map((item) => {
              const itemId = item._id || item.id;
              const isVideo = item.mediaType === "video" || item.mediaUrl?.endsWith(".mp4");

              return (
                <div
                  key={itemId}
                  className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 shadow-sm"
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

                  <button
                    type="button"
                    onClick={() => handleToggleGalleryHighlight(itemId)}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition ${
                      item.highlighted
                        ? "bg-amber-400 text-gray-950 shadow"
                        : "bg-black/50 text-white hover:bg-black/70"
                    }`}
                    title={item.highlighted ? "Featured Highlight" : "Star to feature"}
                  >
                    <Star size={12} fill={item.highlighted ? "currentColor" : "none"} />
                  </button>

                  {/* Hover Overlay with Delete */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                    <p className="text-[10px] text-white font-bold truncate">
                      {item.caption || "Showcase Highlight"}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryItem(itemId)}
                      className="mt-1.5 flex items-center justify-center gap-1 w-full py-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-[10px] font-bold shadow transition"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rate Card Formula */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[var(--color-text)]">My Rate Card Formula</h2>
          <Link
            to="/insider-rate"
            className="text-sm font-bold text-[var(--color-primary-hover)] hover:underline"
          >
            See your insider rate →
          </Link>
        </div>
        <MyRateCard profile={profile} />
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

      {showEditProfileModal && (
        <EditCreatorProfileModal
          profile={profile}
          onClose={() => setShowEditProfileModal(false)}
          onSaved={(updated) => {
            setProfile(updated);
            fetchProfile();
          }}
        />
      )}
    </InfluencerDashboardLayout>
  );
}