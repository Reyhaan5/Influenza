import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, Check } from "lucide-react";
import api, { API_URL } from "../config/api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/footer/Footer";
import { useAuth } from "../context/AuthContext";
import { POPULAR_NICHES } from "../constants/creatorMeta";
import OnboardingStep1Profile from "../components/onboarding/OnboardingStep1Profile";
import OnboardingStep2Pricing from "../components/onboarding/OnboardingStep2Pricing";
import OnboardingStep3Payout from "../components/onboarding/OnboardingStep3Payout";

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

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorFields, setErrorFields] = useState({});

  // Profile Form States
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationStr, setLocationStr] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverPhotos, setCoverPhotos] = useState([]);
  const [connectedInstagram, setConnectedInstagram] = useState(null);
  const [selectedNiches, setSelectedNiches] = useState(["Lifestyle"]);
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [languages, setLanguages] = useState([]);
  const [ethnicity, setEthnicity] = useState("");
  const [newLanguageInput, setNewLanguageInput] = useState("");
  const [showAddLang, setShowAddLang] = useState(false);

  // Portfolio
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Pricing Packages
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);
  const [savedPackageNotice, setSavedPackageNotice] = useState(null);

  // Payout Details
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

  // File Refs
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const portfolioInputRef = useRef(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [profRes, gallRes, rateRes] = await Promise.all([
        api.get("/influencer/profile").catch(() => null),
        api.get("/influencer/gallery").catch(() => null),
        api.get("/influencer/rate-cards").catch(() => null),
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
        if (p.personalInfo?.languages) setLanguages(p.personalInfo.languages);

        const ig = p.socialAccounts?.find((s) => s.platform?.toLowerCase() === "instagram");
        if (ig) setConnectedInstagram(ig);

        if (p.payoutInfo) {
          setPayoutInfo((prev) => ({ ...prev, ...p.payoutInfo }));
        }
      }

      if (gallRes?.data?.content) {
        setPortfolioItems(gallRes.data.content);
      }

      if (rateRes?.data?.packages && rateRes.data.packages.length > 0) {
        setPackages(rateRes.data.packages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearErrorField = (fieldName) => {
    setErrorFields((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("avatar", file);

    try {
      const res = await api.post("/influencer/profile/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.avatarUrl || res.data.avatar;
      setAvatarUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload avatar.");
    }
  };

  const handleCoverUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const availableSlots = 3 - coverPhotos.length;
    const filesToUpload = files.slice(0, availableSlots);

    const form = new FormData();
    filesToUpload.forEach((f) => form.append("coverPhotos", f));

    try {
      const res = await api.post("/influencer/profile/cover-photos", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newPhotos = res.data.coverPhotos || [];
      setCoverPhotos(newPhotos.slice(0, 3));
    } catch (err) {
      console.error(err);
      alert("Failed to upload cover photos.");
    }
  };

  const handleDeleteCoverPhoto = async (indexToDelete) => {
    const updated = coverPhotos.filter((_, idx) => idx !== indexToDelete);
    setCoverPhotos(updated);
    try {
      await api.put("/influencer/profile", {
        personalInfo: {
          ...profile?.personalInfo,
          coverPhotos: updated,
          coverPhoto: updated[0] || "",
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePortfolioUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingMedia(true);
    try {
      for (const file of files) {
        const form = new FormData();
        form.append("media", file);
        form.append("mediaType", file.type.startsWith("video") ? "video" : "image");
        form.append("caption", "Portfolio highlight");
        form.append("highlighted", "true");

        const res = await api.post("/influencer/gallery", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data?.content) {
          setPortfolioItems((prev) => [res.data.content, ...prev]);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload portfolio item.");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeletePortfolioItem = async (itemId) => {
    try {
      await api.delete(`/influencer/gallery/${itemId}`);
      setPortfolioItems((prev) => prev.filter((item) => (item._id || item.id) !== itemId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item.");
    }
  };

  const handleConnectInstagram = async (e) => {
    e.preventDefault();
    const handle = instagramHandleInput.trim().replace(/^@/, "");
    if (!handle) {
      setInstagramError("Please enter an Instagram handle.");
      return;
    }

    setConnectingInstagram(true);
    setInstagramError("");

    try {
      const res = await api.post("/influencer/social-accounts/connect-instagram", { handle });
      setConnectedInstagram(res.data.socialAccount);
      if (res.data.updatedProfile) {
        setProfile(res.data.updatedProfile);
        if (res.data.updatedProfile.personalInfo?.avatar) {
          setAvatarUrl(res.data.updatedProfile.personalInfo.avatar);
        }
      }
      setShowInstagramModal(false);
      setInstagramHandleInput("");
    } catch (err) {
      setInstagramError(err.response?.data?.message || "Failed to connect Instagram account.");
    } finally {
      setConnectingInstagram(false);
    }
  };

  const handleRemoveInstagram = async () => {
    if (!window.confirm("Remove connected Instagram account?")) return;
    try {
      await api.delete("/influencer/social-accounts/instagram");
      setConnectedInstagram(null);
    } catch (err) {
      alert("Failed to remove Instagram.");
    }
  };

  const handleGenerateBio = async () => {
    setGeneratingBio(true);
    try {
      const res = await api.post("/influencer/ai-generate-bio", {
        niches: selectedNiches,
        title,
        name,
        followers: connectedInstagram?.followers || 5000,
      });
      if (res.data?.bio) {
        setDescription(res.data.bio);
      }
    } catch (err) {
      // Fallback AI bio template
      setDescription(
        `Hey! I'm ${name || "a creator"} specializing in ${selectedNiches.slice(0, 2).join(" & ") || "lifestyle"} content. I create high-converting, authentic UGC videos & reels that connect with audiences and drive engagement.`
      );
    } finally {
      setGeneratingBio(false);
    }
  };

  const handleAddLanguage = () => {
    if (!newLanguageInput.trim()) return;
    if (!languages.includes(newLanguageInput.trim())) {
      setLanguages([...languages, newLanguageInput.trim()]);
    }
    setNewLanguageInput("");
    setShowAddLang(false);
  };

  const handleRemoveLanguage = (lang) => {
    setLanguages(languages.filter((l) => l !== lang));
  };

  const validateStep1 = () => {
    const errors = {};
    if (!connectedInstagram) errors.instagram = "Instagram account is required.";
    if (coverPhotos.length === 0) errors.cover = "At least 1 cover photo is required.";
    if (!avatarUrl) errors.avatar = "Profile avatar is required.";
    if (!name.trim()) errors.name = "Creator name is required.";
    if (!title.trim()) errors.title = "Title is required.";
    if (!locationStr.trim()) errors.location = "Location is required.";
    if (!description.trim()) errors.description = "Description is required.";
    if (selectedNiches.length === 0) errors.niches = "Select at least 1 niche.";
    if (portfolioItems.length === 0) errors.portfolio = "Upload at least 1 portfolio video or photo.";

    setErrorFields(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveStep1 = async () => {
    if (!validateStep1()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);
    try {
      const [firstName, ...rest] = name.trim().split(" ");
      const lastName = rest.join(" ");

      const locParts = locationStr.split(",").map((s) => s.trim());
      const city = locParts[0] || "";
      const state = locParts[1] || "";
      const country = locParts[2] || locParts[1] || "United States";

      const payload = {
        personalInfo: {
          ...profile?.personalInfo,
          firstName,
          lastName,
          title,
          description,
          avatar: avatarUrl,
          coverPhotos,
          coverPhoto: coverPhotos[0] || "",
          birthday: dob || undefined,
          gender: gender || undefined,
          ethnicity: ethnicity || undefined,
          languages,
        },
        address: {
          city,
          state,
          country,
        },
        matchProfile: {
          ...profile?.matchProfile,
          bio: description,
          niche: selectedNiches,
          gender: gender || undefined,
          ethnicity: ethnicity || undefined,
          location: { city, state, country },
        },
        categories: selectedNiches,
      };

      await api.put("/influencer/profile", payload);
      setCurrentStep(2);
      localStorage.setItem("creator_onboarding_step", "2");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save profile settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePackageExpand = (pkgId) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === pkgId ? { ...p, expanded: !p.expanded } : p))
    );
  };

  const handleUpdatePackageField = (pkgId, field, value) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id === pkgId) {
          const updated = { ...p, [field]: value };
          if (field === "contentType") updated.title = `Instagram ${value}`;
          if (field === "price") updated.suggestedPrice = Math.round(Number(value) * 1.35) || 70;
          return updated;
        }
        return p;
      })
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
    const newPkg = {
      id: `pkg-custom-${Date.now()}`,
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
      await api.post("/influencer/rate-cards", {
        packages,
        rates: {
          reel: packages.find((p) => p.contentType === "Reel")?.price || 60,
          post: packages.find((p) => p.contentType === "Post")?.price || 50,
          story: packages.find((p) => p.contentType === "Story")?.price || 35,
        },
      });
      setSavedPackageNotice(`Saved "${pkg.title}" package!`);
      setTimeout(() => setSavedPackageNotice(null), 3000);
    } catch (err) {
      alert("Failed to save package.");
    }
  };

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

      await api.post("/influencer/rate-cards", {
        packages,
        rates: { reel: reelPrice, post: postPrice, story: storyPrice },
      });

      await api.put("/influencer/profile", { packages });

      setCurrentStep(3);
      localStorage.setItem("creator_onboarding_step", "3");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Failed to save pricing.");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayout = async () => {
    setSaving(true);
    try {
      const updatedPayout = { ...payoutInfo, isConfigured: true };
      await api.put("/influencer/profile", { payoutInfo: updatedPayout });
      setPayoutInfo(updatedPayout);
      setPayoutSaved(true);
      setTimeout(() => setPayoutSaved(false), 4000);
    } catch (err) {
      alert("Failed to save payout info.");
    } finally {
      setSaving(false);
    }
  };

  const handleGoLive = async () => {
    setSaving(true);
    try {
      await api.put("/influencer/profile", {
        approved: true,
        isProfileComplete: true,
        packages,
        payoutInfo: { ...payoutInfo, isConfigured: true },
      });
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
        {/* Stepper Header */}
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
                currentStep > 2
                  ? "bg-emerald-600"
                  : currentStep === 2
                  ? "bg-emerald-600 ring-4 ring-emerald-100"
                  : "bg-gray-300"
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

        {/* STEP 1: Profile */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <OnboardingStep1Profile
              connectedInstagram={connectedInstagram}
              handleRemoveInstagram={handleRemoveInstagram}
              setShowInstagramModal={setShowInstagramModal}
              coverPhotos={coverPhotos}
              coverInputRef={coverInputRef}
              handleCoverUpload={handleCoverUpload}
              handleDeleteCoverPhoto={handleDeleteCoverPhoto}
              avatarUrl={avatarUrl}
              avatarInputRef={avatarInputRef}
              handleAvatarUpload={handleAvatarUpload}
              name={name}
              setName={setName}
              title={title}
              setTitle={setTitle}
              locationStr={locationStr}
              setLocationStr={setLocationStr}
              description={description}
              setDescription={setDescription}
              generatingBio={generatingBio}
              handleGenerateBio={handleGenerateBio}
              selectedNiches={selectedNiches}
              setSelectedNiches={setSelectedNiches}
              setShowNicheModal={setShowNicheModal}
              portfolioItems={portfolioItems}
              uploadingMedia={uploadingMedia}
              portfolioInputRef={portfolioInputRef}
              handlePortfolioUpload={handlePortfolioUpload}
              handleDeletePortfolioItem={handleDeletePortfolioItem}
              dob={dob}
              setDob={setDob}
              gender={gender}
              setGender={setGender}
              ethnicity={ethnicity}
              setEthnicity={setEthnicity}
              languages={languages}
              setLanguages={setLanguages}
              newLanguageInput={newLanguageInput}
              setNewLanguageInput={setNewLanguageInput}
              showAddLang={showAddLang}
              setShowAddLang={setShowAddLang}
              handleAddLanguage={handleAddLanguage}
              handleRemoveLanguage={handleRemoveLanguage}
              errorFields={errorFields}
              clearErrorField={clearErrorField}
            />

            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleSaveStep1}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-black hover:bg-gray-800 text-white font-bold text-sm shadow-md transition active:scale-95"
              >
                {saving ? "Validating & Saving..." : "Save & Continue to Pricing"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Pricing */}
        {currentStep === 2 && (
          <OnboardingStep2Pricing
            packages={packages}
            savedPackageNotice={savedPackageNotice}
            handleTogglePackageExpand={handleTogglePackageExpand}
            handleUpdatePackageField={handleUpdatePackageField}
            handleRemovePackage={handleRemovePackage}
            handleSaveSinglePackage={handleSaveSinglePackage}
            handleAddPackage={handleAddPackage}
            handleSaveStep2={handleSaveStep2}
            setCurrentStep={setCurrentStep}
            saving={saving}
          />
        )}

        {/* STEP 3: Payout */}
        {currentStep === 3 && (
          <OnboardingStep3Payout
            payoutInfo={payoutInfo}
            setPayoutInfo={setPayoutInfo}
            payoutSaved={payoutSaved}
            handleSavePayout={handleSavePayout}
            handleGoLive={handleGoLive}
            setCurrentStep={setCurrentStep}
            saving={saving}
            coverPhotos={coverPhotos}
            avatarUrl={avatarUrl}
            connectedInstagram={connectedInstagram}
            portfolioItems={portfolioItems}
            packages={packages}
            name={name}
            user={user}
            title={title}
            locationStr={locationStr}
          />
        )}
      </main>

      {/* Instagram Modal */}
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
                  placeholder="handle"
                  className="flex-1 px-3 py-3 text-xs font-bold text-gray-900 focus:outline-none"
                  autoFocus
                />
              </div>

              {instagramError && <p className="text-xs text-red-500 font-semibold">{instagramError}</p>}

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

      {/* Niches Modal */}
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
            <p className="text-xs text-gray-500">Pick the topics that best match your content.</p>

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
                        if (selectedNiches.length >= 10) return alert("You can select up to 10 niches.");
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
