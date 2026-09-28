import React, { useState, useRef } from "react";
import { X, Camera, Sparkles, Calendar, Building, CreditCard, Wallet, CheckCircle2, Plus, Trash2, Save } from "lucide-react";
import Avatar from "./Avatar";
import api from "../../../config/api";
import { GENDERS, ETHNICITIES } from "../../../constants/creatorMeta";

const TABS = [
  { id: "general", label: "1. Profile & Bio" },
  { id: "demographics", label: "2. Demographics & Age (18+)" },
  { id: "payout", label: "3. Payout Destination" },
];

const PAYOUT_METHODS = [
  { id: "bank", label: "Bank Transfer", icon: Building },
  { id: "upi", label: "UPI (India)", icon: CreditCard },
  { id: "paypal", label: "PayPal", icon: Wallet },
];

const BANK_FIELDS = [
  { key: "accountHolderName", label: "Account Holder Name", placeholder: "Full legal name" },
  { key: "bankName", label: "Bank Name", placeholder: "e.g. HDFC / Chase" },
  { key: "accountNumber", label: "Account Number", placeholder: "XXXXXXXXXXXX" },
  { key: "ifscOrRouting", label: "IFSC / Routing / SWIFT", placeholder: "e.g. HDFC0001234" },
];

function FieldInput({ label, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <label className="text-xs font-bold text-gray-700 block mb-1">{label}</label>}
      <input className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black" {...props} />
    </div>
  );
}

export default function EditCreatorProfileModal({ profile = {}, onClose, onSaved }) {
  const { personalInfo = {}, address = {}, payoutInfo = {}, matchProfile = {} } = profile || {};

  const [form, setForm] = useState({
    firstName: personalInfo.firstName || "",
    lastName: personalInfo.lastName || "",
    title: personalInfo.title || "",
    bio: matchProfile.bio || personalInfo.description || "",
    avatarUrl: personalInfo.avatar || "",
    city: address.city || "",
    state: address.state || "",
    country: address.country || "",
    dob: personalInfo.birthday ? new Date(personalInfo.birthday).toISOString().split("T")[0] : "",
    gender: personalInfo.gender || "",
    ethnicity: personalInfo.ethnicity || "",
    payoutMethod: payoutInfo.method || "bank",
    accountHolderName: payoutInfo.accountHolderName || "",
    bankName: payoutInfo.bankName || "",
    accountNumber: payoutInfo.accountNumber || "",
    ifscOrRouting: payoutInfo.ifscOrRouting || "",
    upiId: payoutInfo.upiId || "",
    paypalEmail: payoutInfo.paypalEmail || "",
  });

  const [coverPhotos, setCoverPhotos] = useState(
    Array.isArray(personalInfo.coverPhotos) && personalInfo.coverPhotos.length > 0
      ? personalInfo.coverPhotos.slice(0, 3)
      : personalInfo.coverPhoto ? [personalInfo.coverPhoto] : []
  );
  const [languages, setLanguages] = useState(personalInfo.languages || []);
  const [newLangInput, setNewLangInput] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const maxDob = new Date(Date.now() - 18 * 365.25 * 24 * 3600 * 1000).toISOString().split("T")[0];

  const handleCoverUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => setCoverPhotos((prev) => (prev.length >= 3 ? prev : [...prev, event.target.result]));
      reader.readAsDataURL(file);
    });
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => update("avatarUrl", event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateBio = () => {
    setGeneratingBio(true);
    setTimeout(() => {
      const nicheStr = (profile.categories || []).slice(0, 3).join(", ") || "Lifestyle & UGC";
      update("bio", `Creative & authentic UGC creator specializing in ${nicheStr}. Passionate about storytelling, scroll-stopping visual hooks, and driving measurable conversions for leading brands. Let's create impactful content together!`);
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
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          title: form.title.trim(),
          description: form.bio.trim(),
          avatar: form.avatarUrl,
          coverPhoto: coverPhotos[0] || "",
          coverPhotos,
          birthday: form.dob || undefined,
          gender: form.gender || undefined,
          ethnicity: form.ethnicity || undefined,
          languages,
        },
        address: { city: form.city.trim(), state: form.state.trim(), country: form.country.trim() },
        payoutInfo: {
          method: form.payoutMethod,
          accountHolderName: form.accountHolderName.trim(),
          bankName: form.bankName.trim(),
          accountNumber: form.accountNumber.trim(),
          ifscOrRouting: form.ifscOrRouting.trim(),
          upiId: form.upiId.trim(),
          paypalEmail: form.paypalEmail.trim(),
          isConfigured: !!(form.accountHolderName || form.upiId || form.paypalEmail),
        },
      };

      const res = await api.put("/influencer/profile", updatePayload);
      await api.put("/influencer/match-profile", { bio: form.bio.trim() });
      if (onSaved) onSaved(res.data);
      setFeedback("Profile updated successfully!");
      setTimeout(onClose, 1200);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative animate-fadeIn">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-950">Edit Creator Profile</h2>
            <p className="text-xs text-gray-500 mt-0.5">Manage your personal branding, demographic criteria, and payout accounts.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center transition">
            <X size={16} />
          </button>
        </div>

        <div className="flex border-b border-gray-200 px-6 bg-gray-50/70 text-xs font-bold">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`py-3 px-3 border-b-2 transition ${activeTab === t.id ? "border-black text-black font-extrabold" : "border-transparent text-gray-500 hover:text-gray-900"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {feedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} /> {feedback}
            </div>
          )}

          {activeTab === "general" && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Profile Cover Photos (700x700 px - Up to 3 allowed)</label>
                <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-200">
                  {coverPhotos.length === 0 ? (
                    <div onClick={() => coverInputRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs font-bold cursor-pointer hover:bg-gray-800 transition">
                      <Camera size={20} className="mb-1 text-gray-400" />
                      <span>Upload 700x700 Cover Photos</span>
                      <span className="text-[10px] text-gray-500 mt-0.5">Click to select 1, 2, or 3 photos</span>
                    </div>
                  ) : (
                    <div className="flex w-full h-full p-1 gap-1 bg-gray-900">
                      <div className={`grid gap-1 h-full ${coverPhotos.length < 3 ? "w-[75%]" : "w-full"} ${coverPhotos.length === 1 ? "grid-cols-1" : coverPhotos.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                        {coverPhotos.map((photo, idx) => (
                          <div key={idx} className="relative h-full w-full rounded-lg overflow-hidden group bg-gray-800">
                            <img src={photo} alt={`Cover ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <button type="button" onClick={() => setCoverPhotos((prev) => prev.filter((_, i) => i !== idx))} className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      {coverPhotos.length < 3 && (
                        <div onClick={() => coverInputRef.current?.click()} className="w-[25%] h-full flex flex-col items-center justify-center p-2 text-center border-l border-dashed border-gray-600 bg-gray-800/80 hover:bg-gray-700/80 cursor-pointer transition select-none text-gray-300 hover:text-white">
                          <Plus size={16} className="mb-1" />
                          <span className="text-[10px] font-bold leading-tight">+ Add {coverPhotos.length === 1 ? "2nd" : "3rd"} Photo</span>
                        </div>
                      )}
                    </div>
                  )}
                  <input type="file" ref={coverInputRef} onChange={handleCoverUpload} multiple accept="image/*" className="hidden" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                  <Avatar name={form.firstName || "Creator"} avatarUrl={form.avatarUrl} size={70} />
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold">Upload</div>
                  <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3">
                  <FieldInput label="First Name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="e.g. Alex" />
                  <FieldInput label="Last Name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="e.g. Rivera" />
                </div>
              </div>

              <FieldInput label="Creator Headline / Title" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. UGC Creator & Lifestyle Content Producer" />

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Location Details</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {["city", "state", "country"].map((k) => (
                    <input
                      key={k}
                      type="text"
                      value={form[k]}
                      onChange={(e) => update(k, e.target.value)}
                      placeholder={k === "city" ? "City (e.g. Mumbai)" : k === "state" ? "State / Region" : "Country"}
                      className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">Bio / Profile Description</label>
                  <button type="button" onClick={handleGenerateBio} disabled={generatingBio} className="text-[11px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition">
                    <Sparkles size={12} /> {generatingBio ? "Generating..." : "AI Generate Bio"}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  placeholder="Tell brands what makes your content authentic, high-converting, and engaging..."
                  className="w-full p-3.5 rounded-2xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black bg-gray-50/50"
                />
              </div>
            </div>
          )}

          {activeTab === "demographics" && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-purple-950 flex items-center gap-1.5">
                    <Calendar size={14} className="text-purple-600" /> Date of Birth <span className="text-red-500">*</span>
                  </label>
                  {form.dob && (
                    <span className="text-[11px] font-extrabold text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
                      {Math.floor((new Date() - new Date(form.dob)) / (365.25 * 24 * 60 * 60 * 1000))} years old
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  max={maxDob}
                  value={form.dob}
                  onFocus={() => { if (!form.dob) update("dob", maxDob); }}
                  onChange={(e) => update("dob", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white shadow-inner cursor-pointer"
                />
                <p className="text-[10px] text-gray-500">
                  Minimum platform age requirement: <strong>18+</strong> (Born on or before {new Date(maxDob).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: "gender", label: "Gender", options: GENDERS, placeholder: "Select gender" },
                  { key: "ethnicity", label: "Ethnicity", options: ETHNICITIES, placeholder: "Select ethnicity" },
                ].map((s) => (
                  <div key={s.key}>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">{s.label}</label>
                    <select
                      value={form[s.key]}
                      onChange={(e) => update(s.key, e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black bg-white"
                    >
                      <option value="">{s.placeholder}</option>
                      {s.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Languages Spoken</label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {languages.map((lang) => (
                    <span key={lang} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800">
                      {lang}
                      <button type="button" onClick={() => setLanguages(languages.filter((l) => l !== lang))} className="hover:text-red-500 cursor-pointer">
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
                    <button type="button" onClick={handleAddLanguage} className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded-xl cursor-pointer">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payout" && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {PAYOUT_METHODS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => update("payoutMethod", m.id)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition font-bold text-xs cursor-pointer ${
                        form.payoutMethod === m.id ? "border-black bg-black text-white shadow-sm" : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={16} /> {m.label}
                    </button>
                  );
                })}
              </div>

              {form.payoutMethod === "bank" && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {BANK_FIELDS.map((f) => (
                    <FieldInput key={f.key} {...f} value={form[f.key]} onChange={(e) => update(f.key, e.target.value)} />
                  ))}
                </div>
              )}

              {form.payoutMethod === "upi" && (
                <div className="space-y-3">
                  <FieldInput label="UPI ID (VPA)" value={form.upiId} onChange={(e) => update("upiId", e.target.value)} placeholder="yourname@okaxis / handle@upi" />
                  <FieldInput label="Account Holder Name" value={form.accountHolderName} onChange={(e) => update("accountHolderName", e.target.value)} placeholder="Name registered on UPI" />
                </div>
              )}

              {form.payoutMethod === "paypal" && (
                <FieldInput label="PayPal Email Address" type="email" value={form.paypalEmail} onChange={(e) => update("paypalEmail", e.target.value)} placeholder="payouts@yourdomain.com" />
              )}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition cursor-pointer">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <Save size={14} /> {saving ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
