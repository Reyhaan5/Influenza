import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus,
  X,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Edit2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Play,
  Trash2,
  DollarSign,
  MapPin,
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Building,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";

const Instagram = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

import Navbar from "../components/layout/Navbar";
import Footer from "../components/footer/Footer";
import Avatar from "../components/dashboard/influencer/Avatar";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

const POPULAR_NICHES = [
  "Lifestyle",
  "Beauty",
  "Fashion",
  "Travel",
  "Health & Fitness",
  "Family & Children",
  "Food & Drink",
  "Comedy & Entertainment",
  "Animals & Pets",
  "Education",
  "Art & Photography",
  "Music & Dance",
  "Entrepreneur & Business",
  "Model",
  "Adventure & Outdoors",
  "Technology",
  "Athlete & Sports",
  "Gaming",
  "Healthcare",
  "Celebrity & Public Figure",
  "Automotive",
  "Actor",
  "LGBTQ2+",
  "Skilled Trades",
  "Vegan",
  "Cannabis",
];

const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];
const ETHNICITIES = [
  "Asian",
  "Black / African",
  "Hispanic / Latino",
  "White / Caucasian",
  "Mixed / Other",
  "Prefer not to say",
];

const CONTENT_TYPES = [
  "Reel",
  "Post",
  "Story",
  "UGC Video",
  "Product Review",
  "Product Photos",
  "Video Ad",
];

const DURATION_UNITS = ["Minutes", "Seconds", "Photos"];

const DEFAULT_PACKAGES = [
  {
    id: "pkg-reel",
    title: "Instagram Reel",
    contentType: "Reel",
    count: 1,
    duration: 3,
    durationUnit: "Minutes",
    price: 52,
    suggestedPrice: 70,
    description: "High-impact Instagram Reel featuring your product organically with a strong 3-second hook and dynamic pacing.",
    expanded: true,
  },
  {
    id: "pkg-post",
    title: "Instagram Post / Photos",
    contentType: "Post",
    count: 1,
    duration: 3,
    durationUnit: "Photos",
    price: 45,
    suggestedPrice: 60,
    description: "Aesthetic high-resolution staging and carousel images for grid posting and social ads.",
    expanded: false,
  },
  {
    id: "pkg-story",
    title: "Instagram Story (2 Frames)",
    contentType: "Story",
    count: 2,
    duration: 30,
    durationUnit: "Seconds",
    price: 35,
    suggestedPrice: 45,
    description: "2x authentic casual story frames with swipe-up sticker / promo link and tag.",
    expanded: false,
  },
];

export default function CreatorOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem("creator_onboarding_step");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Calculate 18 years max date (Platform requirement)
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const maxDob = eighteenYearsAgo.toISOString().split("T")[0];

  useEffect(() => {
    localStorage.setItem("creator_onboarding_step", String(currentStep));
  }, [currentStep]);

  // Step 1 Validation & Highlighted Error Fields
  const [errorFields, setErrorFields] = useState({});

  const clearErrorField = (field) => {
    setErrorFields((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // Profile Data State
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationStr, setLocationStr] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverPhotos, setCoverPhotos] = useState([]);
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [connectedInstagram, setConnectedInstagram] = useState(null);

  // Demographics (Get Discovered)
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [languages, setLanguages] = useState([]);
  const [ethnicity, setEthnicity] = useState("");
  const [newLanguageInput, setNewLanguageInput] = useState("");
  const [showAddLang, setShowAddLang] = useState(false);

  // Portfolio
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Pricing Packages (Step 2 - Matching Image)
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);
  const [savedPackageNotice, setSavedPackageNotice] = useState(null);

  // Payout Details (Step 3)
  const [payoutInfo, setPayoutInfo] = useState({
    method: "bank",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscOrRouting: "",
    upiId: "",
    paypalEmail: "",
    currency: "USD",
    isConfigured: false,
  });
  const [payoutSaved, setPayoutSaved] = useState(false);

  // Modals
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [instagramHandleInput, setInstagramHandleInput] = useState("");
  const [connectingInstagram, setConnectingInstagram] = useState(false);
  const [instagramError, setInstagramError] = useState("");

  const [showNicheModal, setShowNicheModal] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);

  // File input refs
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const portfolioInputRef = useRef(null);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [profRes, gallRes, rateRes] = await Promise.all([
        axios.get(`${API_URL}/influencer/profile`, authHeader()).catch(() => null),
        axios.get(`${API_URL}/influencer/gallery`, authHeader()).catch(() => null),
        axios.get(`${API_URL}/influencer/rate-cards`, authHeader()).catch(() => null),
      ]);

      if (profRes && profRes.data) {
        const p = profRes.data;
        setProfile(p);
        setName([p.personalInfo?.firstName, p.personalInfo?.lastName].filter(Boolean).join(" ") || user?.name || "");
        setTitle(p.personalInfo?.title || "");
        setDescription(p.matchProfile?.bio || p.personalInfo?.description || "");
        
        const loc = [p.address?.city, p.address?.state, p.address?.country].filter(Boolean).join(", ");
        if (loc) setLocationStr(loc);

        setAvatarUrl(p.personalInfo?.avatar || user?.avatar || "");
        if (Array.isArray(p.personalInfo?.coverPhotos) && p.personalInfo.coverPhotos.length > 0) {
          setCoverPhotos(p.personalInfo.coverPhotos.slice(0, 3));
        } else if (p.personalInfo?.coverPhoto) {
          setCoverPhotos([p.personalInfo.coverPhoto]);
        }
        if (p.categories?.length > 0) setSelectedNiches(p.categories);
        else if (p.matchProfile?.niche?.length > 0) setSelectedNiches(p.matchProfile.niche);

        if (p.personalInfo?.birthday) {
          setDob(new Date(p.personalInfo.birthday).toISOString().split("T")[0]);
        }
        if (p.personalInfo?.gender) setGender(p.personalInfo.gender);
        if (p.personalInfo?.ethnicity) setEthnicity(p.personalInfo.ethnicity);
        if (p.personalInfo?.languages?.length > 0) setLanguages(p.personalInfo.languages);

        if (p.payoutInfo) {
          setPayoutInfo((prev) => ({ ...prev, ...p.payoutInfo }));
        }

        const ig = (p.socialAccounts || []).find((s) => s.platform?.toLowerCase() === "instagram");
        if (ig) {
          setConnectedInstagram(ig);
        }
      }

      if (gallRes && gallRes.data?.items) {
        setPortfolioItems(gallRes.data.items);
      }

      const rateData = rateRes?.data;
      if (rateData?.packages && Array.isArray(rateData.packages) && rateData.packages.length > 0) {
        setPackages(
          rateData.packages.map((pkg, i) => ({
            ...pkg,
            expanded: i === 0,
            suggestedPrice: pkg.suggestedPrice || Math.round((pkg.price || 50) * 1.35),
          }))
        );
      } else if (profRes?.data?.packages && profRes.data.packages.length > 0) {
        setPackages(
          profRes.data.packages.map((pkg, i) => ({
            ...pkg,
            expanded: i === 0,
            suggestedPrice: pkg.suggestedPrice || Math.round((pkg.price || 50) * 1.35),
          }))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Connect Instagram via Apify Scraper
  const handleConnectInstagram = async (e) => {
    e.preventDefault();
    const clean = instagramHandleInput.trim().replace(/^@/, "").replace(/.*instagram\.com\//, "");
    if (!clean) {
      setInstagramError("Please enter your Instagram handle.");
      return;
    }

    setConnectingInstagram(true);
    setInstagramError("");

    try {
      const res = await axios.get(`${API_URL}/public/instagram-lookup?handle=${clean}`);
      if (!res.data.found) {
        setInstagramError(res.data.message || `Could not find @${clean} on Instagram.`);
        setConnectingInstagram(false);
        return;
      }

      const igData = res.data;

      // 1. Save Instagram account to influencer profile
      await axios.post(
        `${API_URL}/influencer/social-accounts`,
        {
          platform: "Instagram",
          handle: `@${clean}`,
          followers: igData.followers || 0,
        },
        authHeader()
      );

      // 2. Auto-fill avatar and bio if empty
      const updates = {
        handle: `@${clean}`,
      };
      if (igData.profilePicUrl && !avatarUrl) {
        updates.personalInfo = { avatar: igData.profilePicUrl };
        setAvatarUrl(igData.profilePicUrl);
      }
      if (igData.biography && !description) {
        setDescription(igData.biography);
      }

      await axios.put(`${API_URL}/influencer/profile`, updates, authHeader());

      setConnectedInstagram({
        platform: "Instagram",
        handle: `@${clean}`,
        followers: igData.followers || 0,
        avatar: igData.profilePicUrl,
      });

      setShowInstagramModal(false);
      setInstagramHandleInput("");
      setSuccessMessage(`Instagram @${clean} connected successfully!`);
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err) {
      console.error(err);
      setInstagramError(err.response?.data?.message || "Failed to connect Instagram account.");
    } finally {
      setConnectingInstagram(false);
    }
  };

  // Disconnect Instagram
  const handleRemoveInstagram = async () => {
    if (!window.confirm("Remove connected Instagram account?")) return;
    try {
      await axios.delete(`${API_URL}/influencer/social-accounts/Instagram`, authHeader());
      setConnectedInstagram(null);
    } catch (err) {
      alert("Failed to remove account.");
    }
  };

  // Generate AI Description
  const handleGenerateBio = async () => {
    setGeneratingBio(true);
    setTimeout(() => {
      const nicheStr = selectedNiches.slice(0, 3).join(", ") || "Lifestyle & UGC";
      const generated = `Creative & authentic UGC creator specializing in ${nicheStr}. Passionate about storytelling, scroll-stopping visual hooks, and driving measurable conversions for leading brands. Let's create impactful content together!`;
      setDescription(generated);
      setGeneratingBio(false);
    }, 600);
  };

  // Upload Cover Photo (Up to 3 allowed)
  const handleCoverUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverPhotos((prev) => {
          if (prev.length >= 3) return prev;
          return [...prev, event.target.result];
        });
      };
      reader.readAsDataURL(file);
    });
    clearErrorField("cover");
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  // Delete Cover Photo
  const handleDeleteCoverPhoto = (idxToRemove) => {
    setCoverPhotos((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  // Upload Avatar
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Portfolio Media
  const handlePortfolioUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingMedia(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("media", file);
        formData.append("caption", "Portfolio highlight");
        formData.append("platform", "Instagram");

        const res = await axios.post(`${API_URL}/influencer/gallery`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.data?.item) {
          setPortfolioItems((prev) => [res.data.item, ...prev]);
        }
      }
    } catch (err) {
      alert("Failed to upload media. Please try again.");
    } finally {
      setUploadingMedia(false);
    }
  };

  // Delete Portfolio item
  const handleDeletePortfolioItem = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/influencer/gallery/${itemId}`, authHeader());
      setPortfolioItems((prev) => prev.filter((i) => i._id !== itemId && i.id !== itemId));
    } catch (err) {
      alert("Failed to remove item.");
    }
  };

  // Step 1 Mandatory Validation and Save
  const handleSaveStep1 = async () => {
    const errs = {};
    if (coverPhotos.length === 0) errs.cover = true;
    if (!avatarUrl && !user?.avatar) errs.avatar = true;
    if (!name.trim()) errs.name = true;
    if (!title.trim()) errs.title = true;
    if (!description.trim() || description.trim().length < 10) errs.description = true;
    if (!locationStr.trim()) errs.location = true;
    if (!connectedInstagram) errs.instagram = true;
    if (selectedNiches.length === 0) errs.niches = true;
    if (languages.length === 0) errs.languages = true;
    if (!gender) errs.gender = true;
    if (!ethnicity) errs.ethnicity = true;
    if (!dob) errs.dob = true;
    if (portfolioItems.length === 0) errs.portfolio = true;

    const locParts = locationStr.split(",").map((s) => s.trim()).filter(Boolean);
    const city = locParts[0] || "";
    const state = locParts[1] || "";
    const country = locParts[2] || locParts[1] || "";

    if (!city) errs.location = true;

    if (Object.keys(errs).length > 0) {
      setErrorFields(errs);
      // Highlight invalid fields on page with red borders
      return;
    }

    setErrorFields({});
    setSaving(true);

    try {
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await axios.put(
        `${API_URL}/influencer/profile`,
        {
          categories: selectedNiches,
          personalInfo: {
            firstName,
            lastName,
            title,
            avatar: avatarUrl,
            coverPhoto: coverPhotos[0] || "",
            coverPhotos: coverPhotos,
            birthday: dob || undefined,
            gender,
            ethnicity,
            languages,
          },
          address: { city, state, country },
        },
        authHeader()
      );

      await axios.put(
        `${API_URL}/influencer/match-profile`,
        {
          bio: description,
          niche: selectedNiches,
          topics: selectedNiches,
        },
        authHeader()
      );

      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save profile settings.");
    } finally {
      setSaving(false);
    }
  };

  // Step 2 Package Management
  const handleUpdatePackageField = (pkgId, field, value) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id === pkgId) {
          const updated = { ...p, [field]: value };
          if (field === "contentType") {
            updated.title = `Instagram ${value}`;
          }
          if (field === "price") {
            updated.suggestedPrice = Math.round(Number(value) * 1.35) || 70;
          }
          return updated;
        }
        return p;
      })
    );
  };

  const handleTogglePackageExpand = (pkgId) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === pkgId ? { ...p, expanded: !p.expanded } : p))
    );
  };

  const handleRemovePackage = (pkgId) => {
    if (packages.length <= 1) {
      alert("You need at least one pricing package so brands can book you.");
      return;
    }
    setPackages((prev) => prev.filter((p) => p.id !== pkgId));
  };

  const handleAddPackage = () => {
    const newId = `pkg-custom-${Date.now()}`;
    const newPkg = {
      id: newId,
      title: "Instagram Reel",
      contentType: "Reel",
      count: 1,
      duration: 30,
      durationUnit: "Seconds",
      price: 60,
      suggestedPrice: 85,
      description: "",
      expanded: true,
    };
    setPackages((prev) => [...prev.map((p) => ({ ...p, expanded: false })), newPkg]);
  };

  const handleSaveSinglePackage = async (pkgId) => {
    const pkg = packages.find((p) => p.id === pkgId);
    if (!pkg) return;

    try {
      await axios.post(
        `${API_URL}/influencer/rate-cards`,
        {
          packages,
          rates: {
            reel: packages.find((p) => p.contentType === "Reel")?.price || 60,
            post: packages.find((p) => p.contentType === "Post")?.price || 50,
            story: packages.find((p) => p.contentType === "Story")?.price || 35,
          },
        },
        authHeader()
      );
      setSavedPackageNotice(`Saved "${pkg.title}" package!`);
      setTimeout(() => setSavedPackageNotice(null), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save package.");
    }
  };

  // Save Step 2 (Proceed to Step 3)
  const handleSaveStep2 = async () => {
    if (packages.length === 0) {
      alert("Please add at least one deliverable package.");
      return;
    }

    setSaving(true);
    try {
      const reelPrice = packages.find((p) => p.contentType === "Reel")?.price || 60;
      const postPrice = packages.find((p) => p.contentType === "Post")?.price || 50;
      const storyPrice = packages.find((p) => p.contentType === "Story")?.price || 35;

      await axios.post(
        `${API_URL}/influencer/rate-cards`,
        {
          packages,
          rates: {
            reel: reelPrice,
            post: postPrice,
            story: storyPrice,
          },
        },
        authHeader()
      );

      await axios.put(
        `${API_URL}/influencer/profile`,
        {
          packages,
        },
        authHeader()
      );

      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Failed to save pricing.");
    } finally {
      setSaving(false);
    }
  };

  // Step 3 Payout Setup Save
  const handleSavePayout = async () => {
    setSaving(true);
    try {
      const updatedPayout = {
        ...payoutInfo,
        isConfigured: true,
      };

      await axios.put(
        `${API_URL}/influencer/profile`,
        {
          payoutInfo: updatedPayout,
        },
        authHeader()
      );

      setPayoutInfo(updatedPayout);
      setPayoutSaved(true);
      setTimeout(() => setPayoutSaved(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Failed to save payout info.");
    } finally {
      setSaving(false);
    }
  };

  // Save Step 3 (Going Live)
  const handleGoLive = async () => {
    setSaving(true);
    try {
      await axios.put(
        `${API_URL}/influencer/profile`,
        {
          approved: true,
          isProfileComplete: true,
          packages,
          payoutInfo: {
            ...payoutInfo,
            isConfigured: true,
          },
        },
        authHeader()
      );

      localStorage.removeItem("creator_onboarding_step");
      navigate("/influencer-dashboard");
    } catch (err) {
      alert("Failed to launch profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-36 pb-20 px-4 text-center">
          <p className="text-gray-500 font-semibold animate-pulse">Loading creator onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
            <CheckCircle2 size={16} />
            {successMessage}
          </div>
        )}

        {/* Stepper Header (Matching reference design top) */}
        <div className="mb-10 flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-2 transition hover:opacity-80"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                currentStep > 1 ? "bg-emerald-600" : currentStep === 1 ? "bg-black" : "bg-gray-300"
              }`}
            >
              {currentStep > 1 ? <Check size={13} strokeWidth={3} /> : "1"}
            </div>
            <span className={currentStep === 1 ? "text-gray-950 font-extrabold" : "text-gray-500"}>
              Your profile
            </span>
          </button>

          <span className="w-8 sm:w-12 h-0.5 bg-gray-200" />

          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="flex items-center gap-2 transition hover:opacity-80"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                currentStep > 2 ? "bg-emerald-600" : currentStep === 2 ? "bg-emerald-600 ring-4 ring-emerald-100" : "bg-gray-300"
              }`}
            >
              {currentStep > 2 ? <Check size={13} strokeWidth={3} /> : "2"}
            </div>
            <span className={currentStep === 2 ? "text-gray-950 font-extrabold" : "text-gray-500"}>
              Pricing
            </span>
          </button>

          <span className="w-8 sm:w-12 h-0.5 bg-gray-200" />

          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className="flex items-center gap-2 transition hover:opacity-80"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                currentStep === 3 ? "bg-emerald-600 ring-4 ring-emerald-100" : "bg-gray-300"
              }`}
            >
              3
            </div>
            <span className={currentStep === 3 ? "text-gray-950 font-extrabold" : "text-gray-500"}>
              Go live &amp; Payout
            </span>
          </button>
        </div>

        {/* STEP 1: YOUR PROFILE */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            {/* One-Click Instagram Setup Card (Matching Image 3) */}
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-sm">
              <h2 className="text-xl font-extrabold text-gray-950">One-click profile set up</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Add your social profiles to get started — we'll automatically verify and sync your live metrics.
              </p>

              <div className="mt-6">
                <p className="text-xs font-bold text-gray-700 mb-3">
                  Add your social profiles ({connectedInstagram ? "1 added" : "0 added"} *required)
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {/* Instagram Card */}
                  {connectedInstagram ? (
                    <div className="relative border-2 border-emerald-600 bg-emerald-50/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                      <button
                        type="button"
                        onClick={handleRemoveInstagram}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        title="Remove Instagram"
                      >
                        <X size={14} />
                      </button>
                      <Avatar name={connectedInstagram.handle} avatarUrl={connectedInstagram.avatar} size={46} />
                      <div className="flex items-center gap-1 mt-2 text-[11px] font-bold text-gray-700">
                        <Instagram size={12} className="text-pink-600" />
                        <span>{connectedInstagram.followers?.toLocaleString() || 0}</span>
                      </div>
                      <p className="text-xs font-bold text-gray-900 mt-1 truncate max-w-[110px]">
                        {connectedInstagram.handle}
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        clearErrorField("instagram");
                        setShowInstagramModal(true);
                      }}
                      className={`rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-gray-50 transition ${
                        errorFields.instagram
                          ? "border-2 border-red-500 ring-4 ring-red-100 bg-red-50/20"
                          : "border border-dashed border-gray-300 hover:border-black"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                        <Instagram size={20} />
                      </div>
                      <span className="text-xs font-bold text-gray-800">Connect Instagram</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Live verified sync</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Main 2-Column Profile Builder Layout (Matching Image 4) */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column Profile Card */}
              <div className="lg:col-span-5 bg-white border border-gray-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
                {/* Cover Photo Area (Up to 3 photos allowed: 75% + 25% dynamic layout) */}
                <div
                  onClick={() => clearErrorField("cover")}
                  className={`relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden bg-gray-100 border transition ${
                    errorFields.cover
                      ? "border-2 border-red-500 ring-4 ring-red-100"
                      : "border-gray-200"
                  }`}
                >
                  {coverPhotos.length === 0 ? (
                    // 0 photos: 100% full upload dropzone
                    <div
                      onClick={() => {
                        clearErrorField("cover");
                        coverInputRef.current?.click();
                      }}
                      className="w-full h-full flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-gray-50 transition"
                    >
                      <Camera size={24} className="mx-auto text-gray-400 mb-1" />
                      <p className="text-xs font-bold text-gray-800">Add Cover Photos (Up to 3)</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        700x700 photos to showcase your creator aesthetic *required
                      </p>
                      <button
                        type="button"
                        className="mt-2.5 px-3.5 py-1.5 rounded-xl bg-black hover:bg-gray-800 text-white text-[11px] font-bold shadow-sm"
                      >
                        Upload Cover Photo
                      </button>
                    </div>
                  ) : coverPhotos.length === 1 ? (
                    // 1 photo: 75% image on left + 25% upload slot on right for 2nd photo
                    <div className="flex w-full h-full">
                      <div className="relative w-[75%] h-full group overflow-hidden bg-gray-900">
                        <img
                          src={coverPhotos[0]}
                          alt="Cover 1"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow">
                          Cover 1/3 (Main)
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCoverPhoto(0);
                          }}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition shadow"
                          title="Remove cover"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          clearErrorField("cover");
                          coverInputRef.current?.click();
                        }}
                        className="w-[25%] h-full flex flex-col items-center justify-center p-2 text-center border-l border-dashed border-gray-300 hover:border-black bg-gray-50/80 hover:bg-gray-100 cursor-pointer transition select-none"
                      >
                        <Plus size={18} className="text-gray-600 mb-1" />
                        <span className="text-[10px] font-bold text-gray-800 leading-tight">
                          + Add 2nd Photo
                        </span>
                        <span className="text-[9px] text-gray-400 mt-0.5">700x700 px</span>
                      </div>
                    </div>
                  ) : coverPhotos.length === 2 ? (
                    // 2 photos: 75% area on left (split 50/50 side by side) + 25% upload slot on right for 3rd photo
                    <div className="flex w-full h-full">
                      <div className="grid grid-cols-2 gap-1 w-[75%] h-full p-1 bg-gray-100">
                        {coverPhotos.map((photo, idx) => (
                          <div key={idx} className="relative h-full w-full rounded-lg overflow-hidden group bg-gray-900">
                            <img
                              src={photo}
                              alt={`Cover ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                              {idx === 0 ? "Cover 1" : "Cover 2"}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCoverPhoto(idx);
                              }}
                              className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition shadow"
                              title={`Remove cover ${idx + 1}`}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          clearErrorField("cover");
                          coverInputRef.current?.click();
                        }}
                        className="w-[25%] h-full flex flex-col items-center justify-center p-2 text-center border-l border-dashed border-gray-300 hover:border-black bg-gray-50/80 hover:bg-gray-100 cursor-pointer transition select-none"
                      >
                        <Plus size={18} className="text-gray-600 mb-1" />
                        <span className="text-[10px] font-bold text-gray-800 leading-tight">
                          + Add 3rd Photo
                        </span>
                        <span className="text-[9px] text-gray-400 mt-0.5">Final slot</span>
                      </div>
                    </div>
                  ) : (
                    // 3 photos: 100% full width with 3 photos side by side
                    <div className="grid grid-cols-3 gap-1 w-full h-full p-1 bg-gray-100">
                      {coverPhotos.map((photo, idx) => (
                        <div key={idx} className="relative h-full w-full rounded-lg overflow-hidden group bg-gray-900">
                          <img
                            src={photo}
                            alt={`Cover ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                            {idx + 1}/3
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCoverPhoto(idx);
                            }}
                            className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition shadow"
                            title={`Remove cover ${idx + 1}`}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Avatar + Direct Name & Title Inputs */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`relative group rounded-full transition cursor-pointer flex-shrink-0 ${
                        errorFields.avatar ? "ring-4 ring-red-500" : ""
                      }`}
                      onClick={() => {
                        clearErrorField("avatar");
                        avatarInputRef.current?.click();
                      }}
                    >
                      <Avatar name={name || "Creator"} avatarUrl={avatarUrl} size={60} />
                      <div className="absolute inset-0 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-[10px] font-bold">
                        Change
                      </div>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          handleAvatarUpload(e);
                          clearErrorField("avatar");
                        }}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Creator Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onFocus={() => clearErrorField("name")}
                        onChange={(e) => {
                          setName(e.target.value);
                          clearErrorField("name");
                        }}
                        placeholder="Your full name"
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black transition ${
                          errorFields.name
                            ? "border-2 border-red-500 ring-4 ring-red-100 bg-red-50/10"
                            : "border-gray-200 bg-white"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      Title / Headline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onFocus={() => clearErrorField("title")}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        clearErrorField("title");
                      }}
                      placeholder="e.g. Lifestyle & UGC Creator"
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black transition ${
                        errorFields.title
                          ? "border-2 border-red-500 ring-4 ring-red-100 bg-red-50/10"
                          : "border-gray-200 bg-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={locationStr}
                        onFocus={() => clearErrorField("location")}
                        onChange={(e) => {
                          setLocationStr(e.target.value);
                          clearErrorField("location");
                        }}
                        placeholder="City, State, Country"
                        className={`w-full pl-8 pr-3 py-2 rounded-xl border text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black transition ${
                          errorFields.location
                            ? "border-2 border-red-500 ring-4 ring-red-100 bg-red-50/10"
                            : "border-gray-200 bg-white"
                        }`}
                      />
                      <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Connected Instagram Handle Pill */}
                {connectedInstagram && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
                    <Instagram size={16} className="text-pink-600 flex-shrink-0" />
                    <span className="font-bold text-gray-900">{connectedInstagram.handle}</span>
                    <span className="ml-auto text-gray-500 font-semibold">
                      {connectedInstagram.followers?.toLocaleString() || 0} followers
                    </span>
                  </div>
                )}

                {/* Description & AI Generator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        clearErrorField("description");
                        handleGenerateBio();
                      }}
                      disabled={generatingBio}
                      className="text-[11px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition"
                    >
                      <Sparkles size={13} />
                      {generatingBio ? "Generating..." : "Generate Description"}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={description}
                    onFocus={() => clearErrorField("description")}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      clearErrorField("description");
                    }}
                    placeholder="Tell brands what makes your content authentic, high-converting, and engaging..."
                    className={`w-full p-3.5 rounded-2xl border text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-gray-50/50 transition ${
                      errorFields.description
                        ? "border-2 border-red-500 ring-4 ring-red-100"
                        : "border-gray-200"
                    }`}
                  />
                </div>

                {/* Niches / Categories Area */}
                <div className={`space-y-2 rounded-2xl transition ${errorFields.niches ? "border-2 border-red-500 ring-4 ring-red-100 p-3 bg-red-50/10" : ""}`}>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">
                      Niches ({selectedNiches.length}/10) <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        clearErrorField("niches");
                        setShowNicheModal(true);
                      }}
                      className="text-xs font-bold text-black hover:underline flex items-center gap-1"
                    >
                      <Plus size={13} /> Add Niche
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {selectedNiches.map((niche) => (
                      <span
                        key={niche}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200"
                      >
                        {niche}
                        <button
                          type="button"
                          onClick={() => setSelectedNiches(selectedNiches.filter((n) => n !== niche))}
                          className="hover:text-red-500 ml-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Portfolio & Get Discovered */}
              <div className="lg:col-span-7 space-y-6">
                {/* Highlighted Content / Portfolio Section */}
                <div
                  className={`bg-white border rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 transition ${
                    errorFields.portfolio
                      ? "border-2 border-red-500 ring-4 ring-red-100"
                      : "border-gray-200/90"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-950 flex items-center gap-2">
                        Portfolio (Highlighted Content) <span className="text-red-500">*</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Add up to 12 videos or photos. Brands book creators with engaging video portfolio samples.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        clearErrorField("portfolio");
                        portfolioInputRef.current?.click();
                      }}
                      disabled={uploadingMedia}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                    >
                      <Upload size={13} />
                      {uploadingMedia ? "Uploading..." : "Upload Media"}
                    </button>
                    <input
                      type="file"
                      ref={portfolioInputRef}
                      onChange={(e) => {
                        handlePortfolioUpload(e);
                        clearErrorField("portfolio");
                      }}
                      multiple
                      accept="video/*,image/*"
                      className="hidden"
                    />
                  </div>

                  {/* Portfolio Grid */}
                  {portfolioItems.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {portfolioItems.map((item, idx) => (
                        <div
                          key={item._id || item.id || idx}
                          className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 shadow-sm"
                        >
                          {item.mediaType === "video" || item.mediaUrl?.endsWith(".mp4") ? (
                            <video
                              src={item.mediaUrl}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                          ) : (
                            <img
                              src={item.mediaUrl}
                              alt="Portfolio"
                              className="w-full h-full object-cover"
                            />
                          )}

                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                            <Play size={10} fill="white" />
                            <span>0:30</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeletePortfolioItem(item._id || item.id)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      onClick={() => portfolioInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-black rounded-3xl p-8 text-center cursor-pointer transition bg-gray-50/50"
                    >
                      <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-xs font-bold text-gray-800">Upload portfolio videos and photos</p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        MP4, MOV, JPG, PNG up to 50MB each *at least 1 required
                      </p>
                    </div>
                  )}
                </div>

                {/* Get Discovered Demographics Card */}
                <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-950">Get Discovered</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Brands frequently search for creators based on language and demographic criteria.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* DOB & Gender */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                            <span>Date of birth</span> <span className="text-red-500">*</span>
                          </label>
                          {dob && (
                            <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                              {Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000))} years old
                            </span>
                          )}
                        </div>
                        <input
                          type="date"
                          max={maxDob}
                          value={dob}
                          onFocus={() => {
                            if (!dob) setDob(maxDob);
                            clearErrorField("dob");
                          }}
                          onChange={(e) => {
                            setDob(e.target.value);
                            clearErrorField("dob");
                          }}
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black bg-white cursor-pointer transition ${
                            errorFields.dob
                              ? "border-2 border-red-500 ring-4 ring-red-100 bg-red-50/10"
                              : "border-gray-200"
                          }`}
                        />
                        <p className="text-[10px] text-gray-500">
                          Must be at least 18 years old (Born on or before{" "}
                          {new Date(maxDob).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          )
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-800 block mb-1.5">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={gender}
                          onFocus={() => clearErrorField("gender")}
                          onChange={(e) => {
                            setGender(e.target.value);
                            clearErrorField("gender");
                          }}
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white transition ${
                            errorFields.gender
                              ? "border-2 border-red-500 ring-4 ring-red-100 bg-red-50/10"
                              : "border-gray-200"
                          }`}
                        >
                          <option value="">Select gender</option>
                          {GENDERS.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className={`rounded-2xl transition ${errorFields.languages ? "border-2 border-red-500 ring-4 ring-red-100 p-2.5 bg-red-50/10" : ""}`}>
                      <label className="text-xs font-bold text-gray-800 block mb-1.5">
                        Language(s) <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {languages.map((lang) => (
                          <span
                            key={lang}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800"
                          >
                            {lang}
                            <button
                              type="button"
                              onClick={() => setLanguages(languages.filter((l) => l !== lang))}
                              className="text-gray-400 hover:text-black"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}

                        {showAddLang ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={newLanguageInput}
                              onChange={(e) => setNewLanguageInput(e.target.value)}
                              placeholder="e.g. Spanish"
                              className="px-3 py-1 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black w-28"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && newLanguageInput.trim()) {
                                  setLanguages([...languages, newLanguageInput.trim()]);
                                  setNewLanguageInput("");
                                  setShowAddLang(false);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newLanguageInput.trim()) {
                                  setLanguages([...languages, newLanguageInput.trim()]);
                                  setNewLanguageInput("");
                                }
                                setShowAddLang(false);
                              }}
                              className="text-xs font-bold text-black hover:underline"
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowAddLang(true)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-gray-300 hover:border-black text-xs font-bold text-gray-600 hover:text-black"
                          >
                            <Plus size={12} /> Add
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Ethnicity */}
                    <div>
                      <label className="text-xs font-bold text-gray-800 block mb-1.5">
                        Ethnicity <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={ethnicity}
                        onFocus={() => clearErrorField("ethnicity")}
                        onChange={(e) => {
                          setEthnicity(e.target.value);
                          clearErrorField("ethnicity");
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white transition ${
                          errorFields.ethnicity
                            ? "border-2 border-red-500 ring-4 ring-red-100 bg-red-50/10"
                            : "border-gray-200"
                        }`}
                      >
                        <option value="">Select ethnicity</option>
                        {ETHNICITIES.map((eth) => (
                          <option key={eth} value={eth}>{eth}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Stepper CTA */}
            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleSaveStep1}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-black hover:bg-gray-800 text-white font-bold text-sm shadow-md transition active:scale-95"
              >
                {saving ? "Validating & Saving..." : "Save & Continue to Pricing"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SET YOUR PRICING (Precisely Matching Image 1) */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            {/* Header matching Mockup */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
                Set your pricing
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                Add content formats you'd like to offer to brands. You can change this at any time. Suggested pricing is competitive and gets 3x more deals.
              </p>
            </div>

            {/* Notification alert for single saved package */}
            {savedPackageNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
                <CheckCircle2 size={15} />
                {savedPackageNotice}
              </div>
            )}

            {/* Package Accordion Cards */}
            <div className="space-y-4">
              {packages.map((pkg) => {
                const keepAmount = Math.max(0, Math.round((Number(pkg.price) || 0) * 0.85));

                return (
                  <div
                    key={pkg.id}
                    className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-sm transition"
                  >
                    {/* Card Header with Title & Chevron */}
                    <div
                      onClick={() => handleTogglePackageExpand(pkg.id)}
                      className="flex items-center justify-between cursor-pointer select-none"
                    >
                      <h3 className="text-base font-extrabold text-gray-950">
                        {pkg.title || `Instagram ${pkg.contentType}`}
                      </h3>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-900 p-1"
                        aria-label="Toggle package details"
                      >
                        {pkg.expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>

                    {/* Accordion Content */}
                    {pkg.expanded && (
                      <div className="mt-6 space-y-5 border-t border-gray-100 pt-5 animate-fadeIn">
                        {/* Row 1: Content Type & Number */}
                        <div className="grid grid-cols-12 gap-3 sm:gap-4">
                          <div className="col-span-8 sm:col-span-9">
                            <label className="text-xs font-bold text-gray-700 block mb-1.5">
                              Content type
                            </label>
                            <select
                              value={pkg.contentType}
                              onChange={(e) =>
                                handleUpdatePackageField(pkg.id, "contentType", e.target.value)
                              }
                              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                            >
                              {CONTENT_TYPES.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-span-4 sm:col-span-3">
                            <label className="text-xs font-bold text-gray-700 block mb-1.5">
                              Number
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={pkg.count || 1}
                              onChange={(e) =>
                                handleUpdatePackageField(pkg.id, "count", Number(e.target.value))
                              }
                              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                            />
                          </div>
                        </div>

                        {/* Row 2: Duration (optional) & Unit */}
                        <div className="grid grid-cols-12 gap-3 sm:gap-4">
                          <div className="col-span-6 sm:col-span-6">
                            <label className="text-xs font-bold text-gray-700 block mb-1.5">
                              Duration (optional)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={pkg.duration || ""}
                              onChange={(e) =>
                                handleUpdatePackageField(pkg.id, "duration", Number(e.target.value))
                              }
                              placeholder="3"
                              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-6">
                            <label className="text-xs font-bold text-gray-700 block mb-1.5">
                              &nbsp;
                            </label>
                            <select
                              value={pkg.durationUnit || "Minutes"}
                              onChange={(e) =>
                                handleUpdatePackageField(pkg.id, "durationUnit", e.target.value)
                              }
                              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                            >
                              {DURATION_UNITS.map((u) => (
                                <option key={u} value={u}>
                                  {u}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Row 3: Price + Suggested + Fee notice */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-gray-700">Price</label>
                            <span className="text-xs font-bold text-blue-600">
                              Similar creators charge ${pkg.suggestedPrice || 70} for this.
                            </span>
                          </div>

                          <div className="relative rounded-2xl border border-gray-200 focus-within:ring-1 focus-within:ring-black bg-white overflow-hidden">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">
                              $
                            </span>
                            <input
                              type="number"
                              min="5"
                              value={pkg.price || ""}
                              onChange={(e) =>
                                handleUpdatePackageField(pkg.id, "price", Number(e.target.value))
                              }
                              placeholder="52"
                              className="w-full pl-9 pr-4 py-3 text-sm font-bold text-gray-900 focus:outline-none bg-transparent"
                            />
                          </div>
                        </div>

                        {/* Row 4: Description (optional) */}
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1.5">
                            Description (optional)
                          </label>
                          <textarea
                            rows={3}
                            value={pkg.description || ""}
                            onChange={(e) =>
                              handleUpdatePackageField(pkg.id, "description", e.target.value)
                            }
                            placeholder="Tell brands what is included in this package"
                            className="w-full p-3.5 rounded-2xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                          />
                        </div>

                        {/* Footer: Remove & Save Package */}
                        <div className="flex items-center justify-between pt-3">
                          <button
                            type="button"
                            onClick={() => handleRemovePackage(pkg.id)}
                            className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 transition"
                          >
                            <Trash2 size={14} /> Remove
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSaveSinglePackage(pkg.id)}
                            className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition"
                          >
                            Save Package
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Another Package Button */}
            <button
              type="button"
              onClick={handleAddPackage}
              className="w-full py-4 rounded-3xl border-2 border-dashed border-gray-300 hover:border-black bg-white hover:bg-gray-50 text-xs font-bold text-gray-800 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus size={16} /> Add another package
            </button>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft size={14} /> Back
              </button>

              <button
                type="button"
                onClick={handleSaveStep2}
                disabled={saving}
                className="flex items-center gap-1.5 px-8 py-3.5 rounded-2xl bg-black hover:bg-gray-800 text-white text-xs font-bold shadow-md transition"
              >
                {saving ? "Saving Pricing..." : "Proceed to Payment & Go Live"}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT SETUP & GOING LIVE */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
                Payout details &amp; Go live
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                Connect your preferred payout destination to receive automatic transfers when brands hire you.
              </p>
            </div>

            {/* Payout Success Notice */}
            {payoutSaved && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
                <CheckCircle2 size={16} />
                Payout details updated successfully!
              </div>
            )}

            {/* Payout Information Card */}
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
              <h3 className="text-base font-extrabold text-gray-950 flex items-center gap-2">
                <Wallet size={18} className="text-emerald-600" />
                Payout Method
              </h3>

              {/* Method Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "bank", label: "Bank Transfer", icon: Building },
                  { id: "upi", label: "UPI (India)", icon: CreditCard },
                  { id: "paypal", label: "PayPal", icon: Wallet },
                  { id: "stripe", label: "Stripe", icon: CreditCard },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = payoutInfo.method === m.id;

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayoutInfo({ ...payoutInfo, method: m.id })}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition font-bold text-xs ${
                        isSelected
                          ? "border-black bg-black text-white shadow-sm"
                          : "border-gray-200 bg-gray-50/60 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={16} />
                      {m.label}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Payout Form Fields */}
              <div className="space-y-4 pt-2">
                {payoutInfo.method === "bank" && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          Account Holder Name
                        </label>
                        <input
                          type="text"
                          value={payoutInfo.accountHolderName}
                          onChange={(e) =>
                            setPayoutInfo({ ...payoutInfo, accountHolderName: e.target.value })
                          }
                          placeholder="Full legal name"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={payoutInfo.bankName}
                          onChange={(e) =>
                            setPayoutInfo({ ...payoutInfo, bankName: e.target.value })
                          }
                          placeholder="e.g. Chase / HDFC Bank"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          Account Number / IBAN
                        </label>
                        <input
                          type="text"
                          value={payoutInfo.accountNumber}
                          onChange={(e) =>
                            setPayoutInfo({ ...payoutInfo, accountNumber: e.target.value })
                          }
                          placeholder="XXXXXXXXXXXX"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          IFSC / Routing / SWIFT
                        </label>
                        <input
                          type="text"
                          value={payoutInfo.ifscOrRouting}
                          onChange={(e) =>
                            setPayoutInfo({ ...payoutInfo, ifscOrRouting: e.target.value })
                          }
                          placeholder="e.g. HDFC0001234 / 021000021"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                        />
                      </div>
                    </div>
                  </>
                )}

                {payoutInfo.method === "upi" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        UPI ID (VPA)
                      </label>
                      <input
                        type="text"
                        value={payoutInfo.upiId}
                        onChange={(e) => setPayoutInfo({ ...payoutInfo, upiId: e.target.value })}
                        placeholder="yourname@okaxis / yourhandle@upi"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        value={payoutInfo.accountHolderName}
                        onChange={(e) =>
                          setPayoutInfo({ ...payoutInfo, accountHolderName: e.target.value })
                        }
                        placeholder="Name on UPI account"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                      />
                    </div>
                  </div>
                )}

                {payoutInfo.method === "paypal" && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      PayPal Email Address
                    </label>
                    <input
                      type="email"
                      value={payoutInfo.paypalEmail}
                      onChange={(e) =>
                        setPayoutInfo({ ...payoutInfo, paypalEmail: e.target.value })
                      }
                      placeholder="payouts@yourdomain.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                    />
                  </div>
                )}

                {payoutInfo.method === "stripe" && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Stripe Connected Email
                    </label>
                    <input
                      type="email"
                      value={payoutInfo.paypalEmail}
                      onChange={(e) =>
                        setPayoutInfo({ ...payoutInfo, paypalEmail: e.target.value })
                      }
                      placeholder="stripe-account@domain.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                    />
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSavePayout}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition"
                  >
                    Save Payout Details
                  </button>
                </div>
              </div>
            </div>

            {/* Launch Readiness Checklist */}
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-gray-950">Launch Readiness Checklist</h3>
              <div className="space-y-3">
                {[
                  { label: "Profile Cover & Avatar", ok: coverPhotos.length > 0 && !!avatarUrl },
                  { label: "Connected Instagram Account", ok: !!connectedInstagram },
                  { label: "Highlighted Portfolio Content", ok: portfolioItems.length > 0 },
                  { label: "UGC Packages Configured", ok: packages.length > 0 },
                  { label: "Payout Destination Connected", ok: !!payoutInfo.accountHolderName || !!payoutInfo.upiId || !!payoutInfo.paypalEmail },
                ].map((chk, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-800">{chk.label}</span>
                    {chk.ok ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <Check size={14} strokeWidth={3} /> Ready
                      </span>
                    ) : (
                      <span className="text-amber-500">Pending</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Live Profile Card Preview */}
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Creator Discovery Preview
              </p>
              <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50 flex items-center gap-4">
                <Avatar name={name || "Creator"} avatarUrl={avatarUrl} size={54} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-gray-950 truncate">
                      {name || user?.name || "Creator Name"}
                    </h4>
                    <ShieldCheck size={14} className="text-blue-500 fill-blue-500 text-white" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium truncate">{title}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-600">
                    <span className="font-bold">{locationStr}</span>
                    <span>•</span>
                    <span className="font-bold text-emerald-600">
                      Starting at ${packages[0]?.price || 50}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Back to Pricing
              </button>

              <button
                type="button"
                onClick={handleGoLive}
                disabled={saving}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FA2B56] to-[#E0244B] hover:opacity-95 text-white font-extrabold text-sm shadow-xl transition active:scale-95"
              >
                {saving ? "Launching..." : "Launch Profile & Go Live!"}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: Connect Instagram (Matching Image 1) */}
      {showInstagramModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowInstagramModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-extrabold text-gray-950 mb-5">
              What's your handle on Instagram?
            </h3>

            <form onSubmit={handleConnectInstagram} className="space-y-4">
              <div className="flex items-center rounded-2xl border border-gray-300 overflow-hidden focus-within:ring-1 focus-within:ring-black">
                <span className="bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500 border-r border-gray-200">
                  instagram.com/
                </span>
                <input
                  type="text"
                  value={instagramHandleInput}
                  onChange={(e) => setInstagramHandleInput(e.target.value)}
                  placeholder="reyhaannnn_19"
                  className="flex-1 px-3 py-3 text-xs font-bold text-gray-900 focus:outline-none"
                  autoFocus
                />
              </div>

              {instagramError && (
                <p className="text-xs text-red-500 font-semibold">{instagramError}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowInstagramModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={connectingInstagram}
                  className="px-6 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {connectingInstagram ? "Syncing live profile..." : "Add to Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Popular Niches Picker */}
      {showNicheModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative animate-fadeIn space-y-4">
            <button
              onClick={() => setShowNicheModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-extrabold text-gray-950">
              Select Your Niches ({selectedNiches.length}/10)
            </h3>
            <p className="text-xs text-gray-500">
              Pick the topics and industries that best match your content.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {POPULAR_NICHES.map((niche) => {
                const isSelected = selectedNiches.includes(niche);
                return (
                  <button
                    key={niche}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedNiches(selectedNiches.filter((n) => n !== niche));
                      } else {
                        if (selectedNiches.length >= 10) {
                          alert("You can select up to 10 niches.");
                          return;
                        }
                        setSelectedNiches([...selectedNiches, niche]);
                      }
                    }}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold border transition ${
                      isSelected
                        ? "bg-black text-white border-black"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    {isSelected ? `✓ ${niche}` : `+ ${niche}`}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowNicheModal(false)}
                className="px-6 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
