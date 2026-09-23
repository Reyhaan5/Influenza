import React, { useState } from "react";
import axios from "axios";
import {
  Unlink,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { API_URL } from "../../../config/api";
import Avatar from "./Avatar";
import AddSocialAccountModal from "./AddSocialAccountModal";

const ETHNICITY_OPTIONS = [
  "Asian",
  "Black / African",
  "Hispanic / Latino",
  "Native American",
  "Other",
  "Pacific Islander",
  "White",
  "Prefer not to say",
];

const PET_OPTIONS = [
  "I have a cat",
  "I have a dog",
  "No",
  "I have another pet",
];

const COUNTRY_OPTIONS = [
  "United States 🇺🇸",
  "United Kingdom 🇬🇧",
  "Australia 🇦🇺",
  "New Zealand 🇳🇿",
  "Canada 🇨🇦",
  "France 🇫🇷",
  "India 🇮🇳",
  "Germany 🇩🇪",
];

export default function AccountSettingsTab({ user, profile, onUpdated }) {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    birthday: profile?.personalInfo?.birthday
      ? new Date(profile.personalInfo.birthday).toISOString().split("T")[0]
      : profile?.birthday || "",
    gender: profile?.personalInfo?.gender || profile?.gender || "",
    ethnicity: profile?.personalInfo?.ethnicity || profile?.ethnicity || "",
    petOwner: profile?.personalInfo?.petOwner || profile?.petOwner || "",
  });

  const [address, setAddress] = useState({
    line1: profile?.address?.line1 || "",
    line2: profile?.address?.line2 || "",
    city: profile?.address?.city || "",
    county: profile?.address?.county || "",
    state: profile?.address?.state || "",
    postcode: profile?.address?.postcode || "",
    country: profile?.address?.country || "",
    phone: profile?.address?.phone || profile?.address?.phoneNumber || "",
  });

  const [notifications, setNotifications] = useState({
    dailyDigest: profile?.notifications?.dailyDigest ?? true,
    marketing: profile?.notifications?.marketing ?? true,
    unreadMessages: profile?.notifications?.unreadMessages ?? true,
    contractAgreements: profile?.notifications?.contractAgreements ?? true,
    automaticFollowups: profile?.notifications?.automaticFollowups ?? true,
  });

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const [savingSection, setSavingSection] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);
  const [disconnectNotice, setDisconnectNotice] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const instagramAccount =
    profile?.socialAccounts?.find(
      (s) => s.platform?.toLowerCase() === "instagram" && s.handle?.trim()
    ) || null;

  const isInstagramConnected = Boolean(instagramAccount?.handle?.trim());
  const cleanHandle = (instagramAccount?.handle || "").replace(/^@+/, "").trim();

  const handleDisconnectInstagram = async () => {
    const confirmDisconnect = window.confirm(
      `Are you sure you want to disconnect your Instagram account (@${cleanHandle})?\n\nThis will immediately remove your connected handle, follower metrics, live performance analytics, and clear any linked rate card calculations.`
    );
    if (!confirmDisconnect) return;

    setDisconnecting(true);
    try {
      const res = await axios.post(
        `${API_URL}/influencer/disconnect-instagram`,
        {},
        authHeader()
      );
      if (onUpdated) {
        onUpdated(res.data.profile);
      }
      setDisconnectNotice("Instagram account disconnected and all retrieved profile data cleared successfully.");
      setTimeout(() => setDisconnectNotice(""), 6000);
    } catch (err) {
      console.error("Disconnect error:", err);
      alert(err.response?.data?.message || "Failed to disconnect Instagram account.");
    } finally {
      setDisconnecting(false);
    }
  };

  const handleAddAccountSubmit = async (accountData) => {
    try {
      const res = await axios.post(
        `${API_URL}/influencer/social-accounts`,
        accountData,
        authHeader()
      );
      if (onUpdated) onUpdated(res.data);
      setShowAddModal(false);
      setDisconnectNotice("Instagram account connected successfully!");
      setTimeout(() => setDisconnectNotice(""), 4000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to connect Instagram account.");
    }
  };

  const saveSection = async (sectionKey, payload) => {
    setSavingSection(sectionKey);
    try {
      const res = await axios.put(`${API_URL}/influencer/profile`, payload, authHeader());
      if (onUpdated) onUpdated(res.data);
      alert("Settings updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update settings.");
    } finally {
      setSavingSection(null);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.repeatPassword) {
      alert("New passwords do not match.");
      return;
    }
    if (password.newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    setSavingSection("password");
    try {
      await axios.put(`${API_URL}/auth/update-password`, password, authHeader());
      alert("Password updated successfully!");
      setPassword({ oldPassword: "", newPassword: "", repeatPassword: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password.");
    } finally {
      setSavingSection(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Connected Instagram Account & Data Sync (Top Section) */}
      <div className="grid md:grid-cols-[1fr_2.5fr] gap-6 items-start">
        <div>
          <h3 className="font-bold text-gray-900 text-sm tracking-tight">
            Connected Instagram Account
          </h3>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">
            Manage your verified social profile connection. Disconnecting will instantly wipe all retrieved analytics, metrics, and reset your commercial rate card.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-5">
          {disconnectNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{disconnectNotice}</span>
            </div>
          )}

          {isInstagramConnected ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-xs shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.79-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900">
                        @{cleanHandle}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Connected &amp; Synced
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {instagramAccount.followers
                        ? Number(instagramAccount.followers).toLocaleString("en-IN")
                        : "Active"}{" "}
                      Followers
                    </p>
                  </div>
                </div>

                <a
                  href={`https://instagram.com/${cleanHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 shadow-xs transition"
                >
                  <span>View on Instagram</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Robust Disconnect Action Area */}
              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                  <span>
                    Disconnecting will remove all live engagement metrics, rate card suggestions, and public profile sync.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleDisconnectInstagram}
                  disabled={disconnecting}
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-red-700 text-xs font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <Unlink size={13} />
                  {disconnecting ? "Disconnecting..." : "Disconnect Instagram Account"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 px-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gray-200 text-gray-500 flex items-center justify-center mx-auto">
                <Unlink size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">No Instagram Account Connected</h4>
                <p className="text-xs text-gray-500 mt-0.5 max-w-sm mx-auto">
                  Connect your Instagram to automatically calculate what you should charge and get discovered by brand campaigns.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Plus size={14} /> Connect Instagram Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Personal Information Section */}
      <div className="grid md:grid-cols-[1fr_2.5fr] gap-6 items-start">
        <div>
          <h3 className="font-bold text-gray-900 text-sm tracking-tight">Personal Information</h3>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">
            We'll share this information with brands to help with the matchmaking process and ensure a seamless experience.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
          {/* Avatar Header */}
          <div className="flex items-center gap-3.5 border-b border-gray-100 pb-5">
            <Avatar name={user?.name} size={48} />
            <div>
              <h4 className="text-sm font-bold text-gray-900">{user?.name || "Profile Photo"}</h4>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">First Name</label>
              <input
                type="text"
                value={personalInfo.firstName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Last Name</label>
              <input
                type="text"
                value={personalInfo.lastName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                readOnly
                value={personalInfo.email}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-500 opacity-80 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Birthday</label>
              <input
                type="date"
                value={personalInfo.birthday}
                onChange={(e) => setPersonalInfo({ ...personalInfo, birthday: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Gender</label>
              <select
                value={personalInfo.gender}
                onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other / Prefer not to say">Other / Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ethnicity</label>
              <select
                value={personalInfo.ethnicity}
                onChange={(e) => setPersonalInfo({ ...personalInfo, ethnicity: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
              >
                <option value="">Select ethnicity</option>
                {ETHNICITY_OPTIONS.map((eth) => (
                  <option key={eth} value={eth}>{eth}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Pet Owner</label>
              <select
                value={personalInfo.petOwner}
                onChange={(e) => setPersonalInfo({ ...personalInfo, petOwner: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
              >
                <option value="">Select pet status</option>
                {PET_OPTIONS.map((pet) => (
                  <option key={pet} value={pet}>{pet}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => saveSection("personalInfo", { personalInfo })}
              disabled={savingSection === "personalInfo"}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {savingSection === "personalInfo" ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Address Section */}
      <div className="grid md:grid-cols-[1fr_2.5fr] gap-6 items-start">
        <div>
          <h3 className="font-bold text-gray-900 text-sm tracking-tight">Address</h3>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">
            After a successful match, we'll share your address with the brand to ensure a seamless product delivery experience.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Address Line 1</label>
              <input
                type="text"
                placeholder="Flat D, Suite 101"
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Address Line 2</label>
              <input
                type="text"
                placeholder="10 Hyde Park Road"
                value={address.line2}
                onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">City</label>
              <input
                type="text"
                placeholder="New York"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">County</label>
              <input
                type="text"
                placeholder="Hamilton"
                value={address.county}
                onChange={(e) => setAddress({ ...address, county: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">State / Region</label>
              <input
                type="text"
                placeholder="New York"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Postcode</label>
              <input
                type="text"
                value={address.postcode}
                onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Country</label>
              <select
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
              >
                <option value="">Select country</option>
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => saveSection("address", { address })}
              disabled={savingSection === "address"}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {savingSection === "address" ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Notifications Section */}
      <div className="grid md:grid-cols-[1fr_2.5fr] gap-6 items-start">
        <div>
          <h3 className="font-bold text-gray-900 text-sm tracking-tight">Notifications</h3>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">
            We'll always let you know about important changes, but you pick what else you want to hear about.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          {[
            { key: "dailyDigest", label: "Daily digest", desc: "You can disable your daily digest if you are getting too many emails and prefer just using the dashboard." },
            { key: "marketing", label: "Marketing", desc: "General marketing emails like newsletter and other info." },
            { key: "unreadMessages", label: "Unread messages reminder", desc: "You can disable receiving emails about unread messages." },
            { key: "contractAgreements", label: "Contract agreements", desc: "You can disable receiving emails about contract agreements." },
            { key: "automaticFollowups", label: "Automatic Followups", desc: "You can disable receiving emails for replying to creators." },
          ].map((item) => (
            <label key={item.key} className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-zinc-900 focus:ring-zinc-900"
              />
              <div>
                <p className="font-bold text-xs text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </label>
          ))}

          <div className="flex justify-end pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => saveSection("notifications", { notifications })}
              disabled={savingSection === "notifications"}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {savingSection === "notifications" ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Update Password Section */}
      <div className="grid md:grid-cols-[1fr_2.5fr] gap-6 items-start">
        <div>
          <h3 className="font-bold text-gray-900 text-sm tracking-tight">Update Password</h3>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">
            Make sure you choose a secure password. Please have minimum 6 characters.
          </p>
        </div>

        <form onSubmit={handlePasswordUpdate} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Old password</label>
            <input
              type="password"
              required
              value={password.oldPassword}
              onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">New password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password.newPassword}
              onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Repeat new password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password.repeatPassword}
              onChange={(e) => setPassword({ ...password, repeatPassword: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-gray-100">
            <button
              type="submit"
              disabled={savingSection === "password"}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {savingSection === "password" ? "Updating..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {showAddModal && (
        <AddSocialAccountModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddAccountSubmit}
        />
      )}
    </div>
  );
}