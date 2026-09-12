import React, { useState, useRef } from "react";
import axios from "axios";
import {
  X,
  Camera,
  MapPin,
  Sparkles,
  Calendar,
  Building,
  CreditCard,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import Avatar from "./Avatar";
import { API_URL } from "../../../config/api";

const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];
const ETHNICITIES = ["Asian", "Black / African", "Hispanic / Latino", "White / Caucasian", "Mixed / Other", "Prefer not to say"];

export default function EditCreatorProfileModal({ profile, onClose, onSaved }) {
  const p = profile || {};
  const personalInfo = p.personalInfo || {};
  const address = p.address || {};
  const payoutInfo = p.payoutInfo || {};

  // Form State
  const [firstName, setFirstName] = useState(personalInfo.firstName || "");
  const [lastName, setLastName] = useState(personalInfo.lastName || "");
  const [title, setTitle] = useState(personalInfo.title || "");
  const [bio, setBio] = useState(p.matchProfile?.bio || personalInfo.description || "");
  const [coverPhotos, setCoverPhotos] = useState(
    Array.isArray(personalInfo.coverPhotos) && personalInfo.coverPhotos.length > 0
      ? personalInfo.coverPhotos.slice(0, 3)
      : personalInfo.coverPhoto
      ? [personalInfo.coverPhoto]
      : []
  );
  const [avatarUrl, setAvatarUrl] = useState(personalInfo.avatar || "");

  const [city, setCity] = useState(address.city || "");
  const [state, setState] = useState(address.state || "");
  const [country, setCountry] = useState(address.country || "India");

  // Calculate 18 years max date
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const maxDob = eighteenYearsAgo.toISOString().split("T")[0];

  const [dob, setDob] = useState(
    personalInfo.birthday ? new Date(personalInfo.birthday).toISOString().split("T")[0] : ""
  );
  const [gender, setGender] = useState(personalInfo.gender || "");
  const [ethnicity, setEthnicity] = useState(personalInfo.ethnicity || "");
  const [languages, setLanguages] = useState(personalInfo.languages || []);
  const [newLangInput, setNewLangInput] = useState("");

  // Payout State
  const [payoutMethod, setPayoutMethod] = useState(payoutInfo.method || "bank");
  const [accountHolderName, setAccountHolderName] = useState(payoutInfo.accountHolderName || "");
  const [bankName, setBankName] = useState(payoutInfo.bankName || "");
  const [accountNumber, setAccountNumber] = useState(payoutInfo.accountNumber || "");
  const [ifscOrRouting, setIfscOrRouting] = useState(payoutInfo.ifscOrRouting || "");
  const [upiId, setUpiId] = useState(payoutInfo.upiId || "");
  const [paypalEmail, setPaypalEmail] = useState(payoutInfo.paypalEmail || "");

  const [activeTab, setActiveTab] = useState("general"); // "general" | "demographics" | "payout"
  const [saving, setSaving] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

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
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const handleDeleteCoverPhoto = (idxToRemove) => {
    setCoverPhotos((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAvatarUrl(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateBio = () => {
    setGeneratingBio(true);
    setTimeout(() => {
      const nicheStr = (p.categories || []).slice(0, 3).join(", ") || "Lifestyle & UGC";
      setBio(
        `Creative & authentic UGC creator specializing in ${nicheStr}. Passionate about storytelling, scroll-stopping visual hooks, and driving measurable conversions for leading brands. Let's create impactful content together!`
      );
      setGeneratingBio(false);
    }, 500);
  };

  const handleAddLanguage = () => {
    const clean = newLangInput.trim();
    if (clean && !languages.includes(clean)) {
      setLanguages([...languages, clean]);
      setNewLangInput("");
    }
  };

  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const updatePayload = {
        personalInfo: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          title: title.trim(),
          description: bio.trim(),
          avatar: avatarUrl,
          coverPhoto: coverPhotos[0] || "",
          coverPhotos: coverPhotos,
          birthday: dob || undefined,
          gender: gender || undefined,
          ethnicity: ethnicity || undefined,
          languages: languages,
        },
        address: {
          city: city.trim(),
          state: state.trim(),
          country: country.trim(),
        },
        payoutInfo: {
          method: payoutMethod,
          accountHolderName: accountHolderName.trim(),
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          ifscOrRouting: ifscOrRouting.trim(),
          upiId: upiId.trim(),
          paypalEmail: paypalEmail.trim(),
          isConfigured: !!(accountHolderName || upiId || paypalEmail),
        },
      };

      const res = await axios.put(`${API_URL}/influencer/profile`, updatePayload, authHeader());
      await axios.put(
        `${API_URL}/influencer/match-profile`,
        { bio: bio.trim() },
        authHeader()
      );

      if (onSaved) onSaved(res.data);
      setFeedback("Profile updated successfully!");
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative animate-fadeIn">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-950">
              Edit Creator Profile
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage your personal branding, demographic criteria, and payout accounts.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 px-6 bg-gray-50/70 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === "general"
                ? "border-black text-black font-extrabold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            1. Profile &amp; Bio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("demographics")}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === "demographics"
                ? "border-black text-black font-extrabold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            2. Demographics &amp; Age (18+)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("payout")}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === "payout"
                ? "border-black text-black font-extrabold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            3. Payout Destination
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {feedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              {feedback}
            </div>
          )}

          {/* TAB 1: GENERAL PROFILE */}
          {activeTab === "general" && (
            <div className="space-y-5">
              {/* Cover Banner Uploader (Up to 3 photos allowed: 75% + 25% dynamic layout) */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Profile Cover Photos (700x700 px - Up to 3 allowed)
                </label>
                <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-200">
                  {coverPhotos.length === 0 ? (
                    <div
                      onClick={() => coverInputRef.current?.click()}
                      className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs font-bold cursor-pointer hover:bg-gray-800 transition"
                    >
                      <Camera size={20} className="mb-1 text-gray-400" />
                      <span>Upload 700x700 Cover Photos</span>
                      <span className="text-[10px] text-gray-500 mt-0.5">Click to select 1, 2, or 3 photos</span>
                    </div>
                  ) : coverPhotos.length === 1 ? (
                    <div className="flex w-full h-full">
                      <div className="relative w-[75%] h-full group overflow-hidden bg-gray-900">
                        <img
                          src={coverPhotos[0]}
                          alt="Cover 1"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteCoverPhoto(0)}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition shadow"
                          title="Remove cover"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div
                        onClick={() => coverInputRef.current?.click()}
                        className="w-[25%] h-full flex flex-col items-center justify-center p-2 text-center border-l border-dashed border-gray-600 bg-gray-800/80 hover:bg-gray-700/80 cursor-pointer transition select-none text-gray-300 hover:text-white"
                      >
                        <Plus size={16} className="mb-1" />
                        <span className="text-[10px] font-bold leading-tight">+ Add 2nd Photo</span>
                      </div>
                    </div>
                  ) : coverPhotos.length === 2 ? (
                    <div className="flex w-full h-full">
                      <div className="grid grid-cols-2 gap-1 w-[75%] h-full p-1 bg-gray-900">
                        {coverPhotos.map((photo, idx) => (
                          <div key={idx} className="relative h-full w-full rounded-lg overflow-hidden group bg-gray-800">
                            <img
                              src={photo}
                              alt={`Cover ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteCoverPhoto(idx)}
                              className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition shadow"
                              title={`Remove cover ${idx + 1}`}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div
                        onClick={() => coverInputRef.current?.click()}
                        className="w-[25%] h-full flex flex-col items-center justify-center p-2 text-center border-l border-dashed border-gray-600 bg-gray-800/80 hover:bg-gray-700/80 cursor-pointer transition select-none text-gray-300 hover:text-white"
                      >
                        <Plus size={16} className="mb-1" />
                        <span className="text-[10px] font-bold leading-tight">+ Add 3rd Photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-1 w-full h-full p-1 bg-gray-900">
                      {coverPhotos.map((photo, idx) => (
                        <div key={idx} className="relative h-full w-full rounded-lg overflow-hidden group bg-gray-800">
                          <img
                            src={photo}
                            alt={`Cover ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteCoverPhoto(idx)}
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
              </div>

              {/* Avatar + Names */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                  <Avatar name={firstName || "Creator"} avatarUrl={avatarUrl} size={70} />
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold">
                    Upload
                  </div>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Rivera"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* Creator Title */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Creator Headline / Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. UGC Creator & Lifestyle Content Producer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Location Fields */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Location Details</label>
                <div className="grid grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City (e.g. Mumbai)"
                    className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State / Region"
                    className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Bio / Description with AI Generator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">Bio / Profile Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateBio}
                    disabled={generatingBio}
                    className="text-[11px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition"
                  >
                    <Sparkles size={12} />
                    {generatingBio ? "Generating..." : "AI Generate Bio"}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell brands what makes your content authentic, high-converting, and engaging..."
                  className="w-full p-3.5 rounded-2xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black bg-gray-50/50"
                />
              </div>
            </div>
          )}

          {/* TAB 2: DEMOGRAPHICS & 18+ CALENDAR */}
          {activeTab === "demographics" && (
            <div className="space-y-5">
              {/* Modern 18+ Date Picker */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-purple-950 flex items-center gap-1.5">
                    <Calendar size={14} className="text-purple-600" />
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  {dob && (
                    <span className="text-[11px] font-extrabold text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
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
                  }}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white shadow-inner cursor-pointer"
                />
                <p className="text-[10px] text-gray-500">
                  Minimum platform age requirement: <strong>18+</strong> (Born on or before{" "}
                  {new Date(maxDob).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  )
                </p>
              </div>

              {/* Gender & Ethnicity */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option value="">Select gender</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Ethnicity</label>
                  <select
                    value={ethnicity}
                    onChange={(e) => setEthnicity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option value="">Select ethnicity</option>
                    {ETHNICITIES.map((eth) => (
                      <option key={eth} value={eth}>{eth}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Languages Spoken</label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {languages.map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => setLanguages(languages.filter((l) => l !== lang))}
                        className="hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}

                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newLangInput}
                      onChange={(e) => setNewLangInput(e.target.value)}
                      placeholder="Add language..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddLanguage();
                        }
                      }}
                      className="px-3 py-1 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 w-32 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <button
                      type="button"
                      onClick={handleAddLanguage}
                      className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYOUT CONFIGURATION */}
          {activeTab === "payout" && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "bank", label: "Bank Transfer", icon: Building },
                  { id: "upi", label: "UPI (India)", icon: CreditCard },
                  { id: "paypal", label: "PayPal", icon: Wallet },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = payoutMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayoutMethod(m.id)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition font-bold text-xs ${
                        isSelected
                          ? "border-black bg-black text-white shadow-sm"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={16} />
                      {m.label}
                    </button>
                  );
                })}
              </div>

              {payoutMethod === "bank" && (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        placeholder="Full legal name"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. HDFC / Chase"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="XXXXXXXXXXXX"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        IFSC / Routing / SWIFT
                      </label>
                      <input
                        type="text"
                        value={ifscOrRouting}
                        onChange={(e) => setIfscOrRouting(e.target.value)}
                        placeholder="e.g. HDFC0001234"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>
              )}

              {payoutMethod === "upi" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">UPI ID (VPA)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@okaxis / handle@upi"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      placeholder="Name registered on UPI"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              )}

              {payoutMethod === "paypal" && (
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    PayPal Email Address
                  </label>
                  <input
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    placeholder="payouts@yourdomain.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
