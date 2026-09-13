import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Share2,
  Heart,
  Plus,
  Play,
  Check,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  HelpCircle,
  MessageCircle,
  Send,
  Sparkles,
  X,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/footer/Footer";
import Avatar from "../components/dashboard/influencer/Avatar";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

export default function CreatorProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPackageId, setSelectedPackageId] = useState("ugc-unboxing");
  const [expandedPackageId, setExpandedPackageId] = useState(null);
  const [negotiateOpen, setNegotiateOpen] = useState(false);
  const [negotiateOffer, setNegotiateOffer] = useState("");
  const [negotiateNotes, setNegotiateNotes] = useState("");

  const [reviewsOpen, setReviewsOpen] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Gallery Modal
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState(null);

  // Campaign Invite / Request Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [brandCampaigns, setBrandCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const reviewsRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get(`${API_URL}/public/creators/${id}`)
      .then((res) => {
        setData(res.data);
        if (res.data.packages?.length > 0) {
          setSelectedPackageId(res.data.packages[0].id);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to find or load this creator's profile.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // If user is a brand, fetch their campaigns for the Invite modal
  useEffect(() => {
    if (user && user.role === "brand") {
      axios
        .get(`${API_URL}/brand/campaigns`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setBrandCampaigns(res.data.campaigns || []))
        .catch(() => {});
    }
  }, [user]);

  // Check saved status
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !data?.creator?.id) return;

    axios
      .get(`${API_URL}/brand/saved-creators/ids`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const ids = new Set(res.data.savedIds || []);
        if (ids.has(String(data.creator.id))) {
          setSaved(true);
        }
      })
      .catch(() => {});
  }, [data?.creator?.id]);

  const handleToggleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to save creators to your lists.");
      return;
    }
    const creatorId = data?.creator?.id;
    if (!creatorId) return;

    try {
      setSaved((prev) => !prev);
      await axios.post(
        `${API_URL}/brand/saved-creators/${creatorId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error saving creator:", err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${data?.creator?.displayName || "Creator"} on Influenza`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const scrollToReviews = () => {
    setReviewsOpen(true);
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    setSendingInvite(true);
    try {
      await axios.post(
        `${API_URL}/collaboration-requests`,
        {
          influencerId: data.creator.id,
          opportunityId: selectedCampaignId || undefined,
          message: inviteMessage || `Hi ${data.creator.displayName}, we'd love to collaborate with you!`,
          packageSelected: selectedPackageId,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setInviteSuccess(true);
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess(false);
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send collaboration request.");
    } finally {
      setSendingInvite(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 pt-36 pb-20 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="h-80 bg-gray-200 rounded-3xl mb-10" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-24 bg-gray-100 rounded-2xl" />
              <div className="h-40 bg-gray-100 rounded-2xl" />
            </div>
            <div className="h-80 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-md mx-auto text-center px-4 pt-40 pb-20">
          <p className="text-red-500 font-bold mb-4">{error || "Creator profile not found."}</p>
          <Link
            to="/creator-discovery"
            className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-xl"
          >
            Explore Other Creators
          </Link>
        </div>
      </div>
    );
  }

  const { creator, packages = [], portfolio = [], reviews = [], stats = {} } = data;

  const selectedPackage =
    packages.find((p) => p.id === selectedPackageId) || packages[0] || null;

  // Featured header photos (up to 3)
  const headerPhotos = portfolio.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Back navigation & Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 transition font-bold cursor-pointer shadow-xs"
            title="Go back"
          >
            <ArrowLeft size={13} />
            <span>Back</span>
          </button>
          <span className="text-gray-300">/</span>
          <Link to="/creator-discovery" className="hover:text-gray-900 transition">
            Creators
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold">@{creator.handle || "profile"}</span>
        </div>

        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950">
            {creator.headline || (creator.categories?.[0] ? `${creator.categories[0]} Content Creator` : `${creator.displayName}'s Profile`)}
          </h1>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <Share2 size={14} />
              {copied ? "Copied!" : "Share"}
            </button>

            <button
              type="button"
              onClick={handleToggleSave}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold transition ${
                saved ? "text-[#FA2B56] border-[#FA2B56]/30 bg-pink-50/50" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Heart size={14} className={saved ? "fill-[#FA2B56]" : ""} />
              {saved ? "Saved" : "Save"}
            </button>

            <button
              type="button"
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FA2B56] to-[#E0244B] hover:opacity-90 text-white text-xs font-bold shadow-sm transition active:scale-95"
            >
              <Plus size={15} />
              Invite to Campaign
            </button>
          </div>
        </div>

        {/* Photo Header Showcase Banner (Dynamic 1, 2, or 3 Cover Photos) */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gray-900 border border-gray-200">
          {creator.coverPhotos?.length > 0 || creator.coverPhoto ? (
            (() => {
              const covers = creator.coverPhotos?.length > 0 ? creator.coverPhotos : [creator.coverPhoto];
              return (
                <div
                  className={`grid gap-1 h-72 sm:h-96 w-full ${
                    covers.length === 1
                      ? "grid-cols-1"
                      : covers.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-3"
                  }`}
                >
                  {covers.slice(0, 3).map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative h-full w-full overflow-hidden bg-gray-900 group"
                    >
                      <img
                        src={photo}
                        alt={`Cover ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              );
            })()
          ) : portfolio.length > 0 ? (
            <div
              className={`grid gap-2 h-72 sm:h-96 ${
                portfolio.length === 1
                  ? "grid-cols-1"
                  : portfolio.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-3"
              }`}
            >
              {portfolio.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="relative h-full w-full overflow-hidden cursor-pointer group bg-gray-900"
                  onClick={() => setLightboxMedia(item)}
                >
                  {item.mediaType === "video" || item.mediaUrl?.endsWith(".mp4") ? (
                    <video
                      src={item.mediaUrl}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.mediaUrl}
                      alt={`Portfolio ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {item.mediaType === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play size={18} className="fill-black text-black ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-72 sm:h-96 w-full flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 text-gray-400 text-sm font-bold">
              <span>{creator.displayName}'s Creator Profile</span>
            </div>
          )}

          {portfolio.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAllPhotos(true)}
              className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md hover:bg-white text-xs font-bold text-gray-900 shadow-md transition"
            >
              <ImageIcon size={14} />
              Show All Content ({portfolio.length})
            </button>
          )}
        </div>

        {/* 2-Column Main Section */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Main Details, Packages, Analytics, Portfolio, Reviews) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Identity & Basic Info Card */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Avatar
                  name={creator.displayName}
                  avatarUrl={creator.avatar}
                  size={58}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-gray-950">
                      {creator.displayName}
                    </h2>
                    {creator.verified && (
                      <ShieldCheck size={18} className="text-[#3B82F6]" />
                    )}
                    <button
                      onClick={scrollToReviews}
                      className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-black ml-2"
                    >
                      <Star size={13} className="fill-[#F59E0B] text-[#F59E0B]" />
                      <span>{reviews.length > 0 && stats.rating > 0 ? stats.rating.toFixed(1) : "New"}</span>
                      <span className="underline font-semibold text-gray-500">
                        ({reviews.length} {reviews.length === 1 ? "Review" : "Reviews"})
                      </span>
                    </button>
                  </div>
                  {creator.locality && (
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <MapPin size={12} className="text-gray-400" />
                      {creator.locality}
                    </p>
                  )}
                </div>
              </div>

              {/* Follower / Social Channel Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {creator.socialAccounts && creator.socialAccounts.length > 0 ? (
                  creator.socialAccounts.map((acc, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200"
                    >
                      <span className="capitalize">{acc.platform}</span>:{" "}
                      <span className="font-bold text-gray-900">{acc.followers?.toLocaleString() || "0"}</span> Followers
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    Verified Creator
                  </span>
                )}
              </div>

              {/* Bio Paragraph */}
              {creator.bio && (
                <p className="text-sm text-gray-700 leading-relaxed pt-2">
                  {creator.bio}
                </p>
              )}

              {creator.passions && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs text-gray-600">
                  <span className="font-bold text-gray-900">Passions & Style: </span>
                  {creator.passions}
                </div>
              )}
            </div>

            <hr className="border-gray-200" />

            {/* Packages Section */}
            <div>
              <h2 className="text-lg font-extrabold text-gray-950 mb-4">Packages</h2>

              <div className="space-y-3">
                {packages.length > 0 ? (
                  packages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    const isExpanded = expandedPackageId === pkg.id;

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`rounded-2xl border p-4 transition cursor-pointer ${
                          isSelected
                            ? "border-gray-900 bg-white shadow-sm ring-1 ring-gray-900"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="package-selector"
                              checked={isSelected}
                              onChange={() => setSelectedPackageId(pkg.id)}
                              className="w-4 h-4 text-black focus:ring-black accent-black cursor-pointer"
                            />
                            <div>
                              <p className="font-bold text-sm text-gray-950 flex items-center gap-2">
                                {pkg.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {pkg.description}
                              </p>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="text-base font-extrabold text-gray-950">
                              ${Number(pkg.price || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Expandable Details */}
                        <div className="mt-2 pl-7 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPackageId(isExpanded ? null : pkg.id);
                            }}
                            className="text-[11px] font-bold text-gray-600 hover:text-black underline flex items-center gap-1"
                          >
                            {isExpanded ? "See Less" : "See More"}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="mt-3 pl-7 pt-3 border-t border-gray-100 text-xs text-gray-600 leading-relaxed animate-fadeIn">
                            {pkg.fullDetails || pkg.description}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 text-center">
                    <p className="text-xs font-bold text-gray-700">No fixed packages published yet</p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      This creator accepts customized deliverables. Propose your budget and requirements below.
                    </p>
                  </div>
                )}

                {/* Negotiate a Package Accordion */}
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition">
                  <button
                    type="button"
                    onClick={() => setNegotiateOpen((o) => !o)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/70 transition"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle size={18} className="text-gray-600" />
                      <div>
                        <p className="font-bold text-sm text-gray-950">
                          {packages.length === 0 ? "Propose a Custom Offer" : "Negotiate a Package"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Tailor a collaboration to your needs: propose custom terms, pricing, or requirements.
                        </p>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                      {negotiateOpen ? <ChevronUp size={16} /> : <Plus size={16} />}
                    </div>
                  </button>

                  {negotiateOpen && (
                    <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50/50 space-y-3 animate-fadeIn">
                      <div className="grid sm:grid-cols-2 gap-3 pt-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Your Proposed Budget ($)
                          </label>
                          <input
                            type="number"
                            value={negotiateOffer}
                            onChange={(e) => setNegotiateOffer(e.target.value)}
                            placeholder="e.g. 150"
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Deliverables Required
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 2 Reels + 3 Product Photos"
                            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Custom Requirements / Message
                        </label>
                        <textarea
                          rows={2}
                          value={negotiateNotes}
                          onChange={(e) => setNegotiateNotes(e.target.value)}
                          placeholder="Describe your brand's campaign goals, timelines, and special requirements..."
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setInviteMessage(`Custom Negotiation Offer: $${negotiateOffer || "Negotiable"}. Requirements: ${negotiateNotes}`);
                          setShowInviteModal(true);
                        }}
                        className="px-5 py-2 bg-black hover:bg-black/90 text-white text-xs font-bold rounded-xl transition"
                      >
                        Submit Custom Proposal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Analytics Section */}
            <div>
              <h2 className="text-lg font-extrabold text-gray-950 mb-3">Analytics</h2>
              {creator.socialAccounts && creator.socialAccounts.length > 0 ? (
                <div className="grid sm:grid-cols-3 gap-3">
                  {creator.socialAccounts.map((acc, i) => (
                    <div key={i} className="p-4 bg-white border border-gray-200 rounded-2xl">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {acc.platform}
                      </p>
                      <p className="text-xl font-extrabold text-gray-950 mt-1">
                        {acc.followers?.toLocaleString() || "0"}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Followers</p>
                    </div>
                  ))}
                  {stats.responseTimeHours ? (
                    <div className="p-4 bg-white border border-gray-200 rounded-2xl">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Avg Response
                      </p>
                      <p className="text-xl font-extrabold text-gray-950 mt-1">
                        {stats.responseTimeHours}h
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Response Time</p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-2xl p-4 text-center text-xs text-gray-500 font-medium">
                  {creator.displayName} is verified for UGC direct collaboration.
                </div>
              )}
            </div>

            <hr className="border-gray-200" />

            {/* Portfolio Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-gray-950">Portfolio</h2>
                {portfolio.length > 0 && (
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="text-xs font-bold text-gray-500 hover:text-black underline"
                  >
                    View All ({portfolio.length})
                  </button>
                )}
              </div>

              {portfolio.length === 0 ? (
                <div className="text-center py-12 bg-white border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-xs text-gray-500">No public portfolio items uploaded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {portfolio.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setLightboxMedia(item)}
                      className="relative aspect-[9/16] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 cursor-pointer group shadow-sm"
                    >
                      <img
                        src={item.mediaUrl}
                        alt={item.caption || "Portfolio item"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      {item.mediaType === "video" && (
                        <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                          <Play size={14} className="fill-white ml-0.5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-gray-200" />

            {/* Collapsible Reviews Section */}
            <div ref={reviewsRef} className="rounded-3xl border border-gray-200 bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setReviewsOpen((o) => !o)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50/60 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-lg font-extrabold text-gray-950">
                    <Star size={18} className="fill-[#F59E0B] text-[#F59E0B]" />
                    <span>Reviews</span>
                    <span className="text-sm font-semibold text-gray-400">
                      ({reviews.length})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-600">
                    {reviews.length > 0 && stats.rating > 0 ? `${stats.rating.toFixed(1)} / 5.0` : "No reviews yet"}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                    {reviewsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </button>

              {reviewsOpen && (
                <div className="p-5 pt-0 border-t border-gray-100 space-y-4 animate-fadeIn">
                  {reviews.length === 0 ? (
                    <div className="text-center py-10">
                      <Star size={32} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm font-bold text-gray-800">No brand reviews yet</p>
                      <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                        Be the first brand to collaborate with {creator.displayName} and leave feedback on their performance.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="py-4 first:pt-2 last:pb-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <Avatar name={rev.brandName} size={30} />
                              <div>
                                <p className="text-xs font-bold text-gray-900">{rev.brandName}</p>
                                <p className="text-[10px] text-gray-400">
                                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Verified Brand"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={12}
                                  className={
                                    s <= rev.rating
                                      ? "fill-[#F59E0B] text-[#F59E0B]"
                                      : "text-gray-200"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed pl-9">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Sticky Checkout / Request Card) */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            {packages.length > 0 && selectedPackage ? (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-3xl font-extrabold text-gray-950">
                    ${Number(selectedPackage.price || 0).toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">USD</span>
                </div>

                {/* Package Dropdown Selector */}
                <div className="mb-4">
                  <select
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} (${Number(pkg.price || 0).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected package short description */}
                {selectedPackage.description && (
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    {selectedPackage.description}
                  </p>
                )}

                {/* Add to Cart / Invite to Campaign Button */}
                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FA2B56] to-[#E0244B] hover:opacity-95 text-white font-bold text-sm shadow-md transition active:scale-98"
                >
                  Add to Cart / Invite
                </button>

                <div className="text-center my-3 text-xs text-gray-400 font-medium">
                  or
                </div>

                <button
                  type="button"
                  onClick={() => setNegotiateOpen(true)}
                  className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold text-xs transition"
                >
                  Negotiate a Package
                </button>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-semibold cursor-pointer hover:text-black">
                  <HelpCircle size={13} />
                  <span>How does it work?</span>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="mb-5">
                  <h3 className="text-base font-extrabold text-gray-950">Direct Collaboration</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    This creator accepts direct campaign proposals and customized deliverables.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FA2B56] to-[#E0244B] hover:opacity-95 text-white font-bold text-sm shadow-md transition active:scale-98"
                >
                  Invite to Campaign
                </button>

                <div className="text-center my-3 text-xs text-gray-400 font-medium">
                  or
                </div>

                <button
                  type="button"
                  onClick={() => setNegotiateOpen(true)}
                  className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold text-xs transition"
                >
                  Propose Custom Offer
                </button>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-semibold cursor-pointer hover:text-black">
                  <HelpCircle size={13} />
                  <span>How does it work?</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Invite to Campaign / Collaboration Request Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <Avatar name={creator.displayName} size={44} />
              <div>
                <h3 className="font-extrabold text-gray-950 text-base">
                  Invite {creator.displayName}
                </h3>
                <p className="text-xs text-gray-500">
                  Selected: {selectedPackage.name} (${selectedPackage.price})
                </p>
              </div>
            </div>

            {inviteSuccess ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
                  <Check size={24} />
                </div>
                <h4 className="font-bold text-gray-900 text-base">Collaboration Request Sent!</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {creator.displayName} will be notified and you can track updates in your dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-4">
                {brandCampaigns.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Link with Campaign (Optional)
                    </label>
                    <select
                      value={selectedCampaignId}
                      onChange={(e) => setSelectedCampaignId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none"
                    >
                      <option value="">Direct Collaboration (No specific campaign)</option>
                      {brandCampaigns.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Message / Brief
                  </label>
                  <textarea
                    rows={4}
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    placeholder={`Hi ${creator.displayName}, we loved your content style and would like to collaborate for our upcoming campaign...`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingInvite}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FA2B56] to-[#E0244B] text-white text-xs font-bold shadow-md hover:opacity-95 disabled:opacity-50"
                  >
                    {sendingInvite ? "Sending..." : "Send Invitation"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Show All Photos Full Gallery Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-4 sm:p-8">
          <div className="flex items-center justify-between text-white mb-6">
            <h3 className="font-bold text-lg">
              {creator.displayName}'s Portfolio ({portfolio.length})
            </h3>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {portfolio.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxMedia(item)}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-800 cursor-pointer group"
              >
                <img
                  src={item.mediaUrl}
                  alt={item.caption || "Photo"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {item.mediaType === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play size={24} className="fill-white text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Single Media Lightbox Modal */}
      {lightboxMedia && (
        <div
          onClick={() => setLightboxMedia(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl max-h-[85vh] w-full rounded-2xl overflow-hidden bg-black flex flex-col items-center"
          >
            <button
              onClick={() => setLightboxMedia(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X size={20} />
            </button>

            {lightboxMedia.mediaType === "video" ? (
              <video
                src={lightboxMedia.mediaUrl}
                controls
                autoPlay
                className="max-h-[75vh] w-auto max-w-full rounded-2xl"
              />
            ) : (
              <img
                src={lightboxMedia.mediaUrl}
                alt={lightboxMedia.caption || "Preview"}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl"
              />
            )}

            {lightboxMedia.caption && (
              <p className="p-4 text-xs text-white text-center">
                {lightboxMedia.caption}
              </p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
