import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Share2,
  Heart,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/footer/Footer";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import InviteCreatorModal from "../components/profile/InviteCreatorModal";
import CreatorPackages from "../components/profile/CreatorPackages";
import { FullGalleryModal, MediaLightboxModal } from "../components/profile/ProfileGalleryLightbox";
import { AnalyticsSection, CheckoutSidebar, CoverShowcase, CreatorIdentity, PortfolioPreview, ReviewsAccordion } from "../components/profile/CreatorProfileSections";

export default function CreatorProfile() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [expandedPackageId, setExpandedPackageId] = useState(null);
  const [negotiateOpen, setNegotiateOpen] = useState(false);
  const [negotiateOffer, setNegotiateOffer] = useState("");
  const [negotiateNotes, setNegotiateNotes] = useState("");

  const [reviewsOpen, setReviewsOpen] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Gallery & Lightbox
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState(null);

  // Invite Modal
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

    api.get(`/public/creators/${id}`)
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

  // Brand campaign fetching
  useEffect(() => {
    if (user?.role === "brand") {
      api.get("/brand/campaigns")
        .then((res) => setBrandCampaigns(res.data.campaigns || []))
        .catch(() => {});
    }
  }, [user]);

  // Saved check
  useEffect(() => {
    if (!localStorage.getItem("token") || !data?.creator?.id) return;
    api.get("/brand/saved-creators/ids")
      .then((res) => {
        const ids = new Set(res.data.savedIds || []);
        if (ids.has(String(data.creator.id))) setSaved(true);
      })
      .catch(() => {});
  }, [data?.creator?.id]);

  useEffect(() => {
    if (searchParams.get("invite") === "true") setShowInviteModal(true);
  }, [searchParams]);

  const handleToggleSave = async () => {
    if (!localStorage.getItem("token")) return alert("Please log in to save creators to your lists.");
    const creatorId = data?.creator?.id;
    if (!creatorId) return;

    try {
      setSaved((prev) => !prev);
      await api.post(`/brand/saved-creators/${creatorId}`, {});
    } catch (err) {
      console.error("Error saving creator:", err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${data?.creator?.displayName || "Creator"} on Influenza`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!user) return navigate(`/login?redirect=/creators/${id}`);
    if (user.role === "influencer") return navigate(`/messages?with=${data?.creator?.id || id}`);

    setSendingInvite(true);
    try {
      const creatorTargetId = data?.creator?.id || data?.creator?.profileId || id;
      const creatorName = data?.creator?.displayName || data?.creator?.handle || "Creator";

      await api.post("/collaboration-requests", {
        influencerId: creatorTargetId,
        creatorName,
        opportunityId: selectedCampaignId || undefined,
        message: inviteMessage || `Hi ${creatorName}, we'd love to collaborate with you!`,
        packageSelected: selectedPackage?.name || selectedPackageId,
      });
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
        <div className="max-w-6xl mx-auto px-4 pt-36 pb-20 animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-80 bg-gray-200 rounded-3xl" />
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
          <Link to="/creator-discovery" className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-xl">
            Explore Other Creators
          </Link>
        </div>
      </div>
    );
  }

  const { creator, packages = [], portfolio = [], reviews = [], stats = {} } = data;
  const selectedPackage = packages.find((p) => p.id === selectedPackageId) || packages[0] || null;
  const covers = creator.coverPhotos?.length > 0 ? creator.coverPhotos : creator.coverPhoto ? [creator.coverPhoto] : [];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 transition font-bold cursor-pointer shadow-xs"
          >
            <ArrowLeft size={13} />
            <span>Back</span>
          </button>
          <span className="text-gray-300">/</span>
          <Link to="/creator-discovery" className="hover:text-gray-900 transition">Creators</Link>
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              <Share2 size={14} />
              {copied ? "Copied!" : "Share"}
            </button>
            <button
              type="button"
              onClick={handleToggleSave}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                saved ? "text-[#FA2B56] border-[#FA2B56]/30 bg-pink-50/50" : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Heart size={14} className={saved ? "fill-[#FA2B56]" : ""} />
              {saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus size={15} />
              Invite to Campaign
            </button>
          </div>
        </div>

        <CoverShowcase covers={covers} portfolio={portfolio} creator={creator} setLightboxMedia={setLightboxMedia} setShowAllPhotos={setShowAllPhotos} />

        {/* Main 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Details */}
          <div className="lg:col-span-8 space-y-8">
            <CreatorIdentity creator={creator} reviews={reviews} stats={stats} setReviewsOpen={setReviewsOpen} reviewsRef={reviewsRef} />

            <hr className="border-gray-200" />

            {/* Packages */}
            <CreatorPackages
              packages={packages}
              selectedPackageId={selectedPackageId}
              setSelectedPackageId={setSelectedPackageId}
              expandedPackageId={expandedPackageId}
              setExpandedPackageId={setExpandedPackageId}
              negotiateOpen={negotiateOpen}
              setNegotiateOpen={setNegotiateOpen}
              negotiateOffer={negotiateOffer}
              setNegotiateOffer={setNegotiateOffer}
              negotiateNotes={negotiateNotes}
              setNegotiateNotes={setNegotiateNotes}
              onSubmitProposal={() => {
                setInviteMessage(`Custom Negotiation Offer: ₹${negotiateOffer || "Negotiable"}. Requirements: ${negotiateNotes}`);
                setShowInviteModal(true);
              }}
            />

            <hr className="border-gray-200" />

            <AnalyticsSection creator={creator} stats={stats} />

            <hr className="border-gray-200" />

            <PortfolioPreview portfolio={portfolio} setShowAllPhotos={setShowAllPhotos} setLightboxMedia={setLightboxMedia} />

            <hr className="border-gray-200" />

            <ReviewsAccordion reviewsRef={reviewsRef} reviewsOpen={reviewsOpen} setReviewsOpen={setReviewsOpen} reviews={reviews} stats={stats} />
          </div>

          <CheckoutSidebar packages={packages} selectedPackage={selectedPackage} selectedPackageId={selectedPackageId} setSelectedPackageId={setSelectedPackageId} setShowInviteModal={setShowInviteModal} setNegotiateOpen={setNegotiateOpen} />
        </div>
      </main>

      <InviteCreatorModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        creator={creator}
        selectedPackage={selectedPackage}
        brandCampaigns={brandCampaigns}
        selectedCampaignId={selectedCampaignId}
        setSelectedCampaignId={setSelectedCampaignId}
        inviteMessage={inviteMessage}
        setInviteMessage={setInviteMessage}
        sendingInvite={sendingInvite}
        inviteSuccess={inviteSuccess}
        onSubmit={handleSendInvite}
        user={user}
        profileId={id}
      />

      <FullGalleryModal
        isOpen={showAllPhotos}
        onClose={() => setShowAllPhotos(false)}
        creatorName={creator.displayName}
        portfolio={portfolio}
        onSelectMedia={(item) => {
          setShowAllPhotos(false);
          setLightboxMedia(item);
        }}
      />

      <MediaLightboxModal media={lightboxMedia} onClose={() => setLightboxMedia(null)} />

      <Footer />
    </div>
  );
}
