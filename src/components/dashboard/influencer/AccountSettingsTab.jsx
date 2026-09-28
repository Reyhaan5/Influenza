import React, { useState } from "react";
import { Unlink, CheckCircle2, AlertTriangle, ExternalLink, Plus } from "lucide-react";
import api from "../../../config/api";
import Avatar from "./Avatar";
import AddSocialAccountModal from "./AddSocialAccountModal";
import { InstagramIcon, SettingsSection, FormField } from "./InfluencerShared";

const ETHNICITY_OPTIONS = ["Asian", "Black / African", "Hispanic / Latino", "Native American", "Other", "Pacific Islander", "White", "Prefer not to say"];
const PET_OPTIONS = ["I have a cat", "I have a dog", "No", "I have another pet"];
const COUNTRY_OPTIONS = ["United States 🇺🇸", "United Kingdom 🇬🇧", "Australia 🇦🇺", "New Zealand 🇳🇿", "Canada 🇨🇦", "France 🇫🇷", "India 🇮🇳", "Germany 🇩🇪"];
const NOTIF_CONFIG = [
  { key: "dailyDigest", label: "Daily digest", desc: "You can disable your daily digest if you prefer just using the dashboard." },
  { key: "marketing", label: "Marketing", desc: "General marketing emails like newsletter and other info." },
  { key: "unreadMessages", label: "Unread messages reminder", desc: "You can disable receiving emails about unread messages." },
  { key: "contractAgreements", label: "Contract agreements", desc: "You can disable receiving emails about contract agreements." },
  { key: "automaticFollowups", label: "Automatic Followups", desc: "You can disable receiving emails for replying to creators." },
];

const PERSONAL_FIELDS = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email Address", readOnly: true, className: "opacity-80 cursor-not-allowed" },
  { key: "birthday", label: "Birthday", type: "date" },
  { key: "gender", label: "Gender", type: "select", options: ["Female", "Male", "Other / Prefer not to say"], placeholder: "Select gender" },
  { key: "ethnicity", label: "Ethnicity", type: "select", options: ETHNICITY_OPTIONS, placeholder: "Select ethnicity" },
  { key: "petOwner", label: "Pet Owner", type: "select", options: PET_OPTIONS, placeholder: "Select pet status" },
];

const ADDRESS_FIELDS = [
  { key: "line1", label: "Address Line 1", placeholder: "Flat D, Suite 101" },
  { key: "line2", label: "Address Line 2", placeholder: "10 Hyde Park Road" },
  { key: "city", label: "City", placeholder: "New York" },
  { key: "county", label: "County", placeholder: "Hamilton" },
  { key: "state", label: "State / Region", placeholder: "New York" },
  { key: "postcode", label: "Postcode" },
  { key: "country", label: "Country", type: "select", options: COUNTRY_OPTIONS, placeholder: "Select country" },
  { key: "phone", label: "Phone Number", type: "tel" },
];

const PWD_FIELDS = [
  { key: "oldPassword", label: "Old password" },
  { key: "newPassword", label: "New password", minLength: 6 },
  { key: "repeatPassword", label: "Repeat new password", minLength: 6 },
];

export default function AccountSettingsTab({ user, profile, onUpdated }) {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    birthday: profile?.personalInfo?.birthday ? new Date(profile.personalInfo.birthday).toISOString().split("T")[0] : profile?.birthday || "",
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

  const [password, setPassword] = useState({ oldPassword: "", newPassword: "", repeatPassword: "" });
  const [savingSection, setSavingSection] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);
  const [disconnectNotice, setDisconnectNotice] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const instagramAccount = profile?.socialAccounts?.find((s) => s.platform?.toLowerCase() === "instagram" && s.handle?.trim()) || null;
  const isInstagramConnected = Boolean(instagramAccount?.handle?.trim());
  const cleanHandle = (instagramAccount?.handle || "").replace(/^@+/, "").trim();

  const handleDisconnectInstagram = async () => {
    if (!window.confirm(`Disconnect Instagram account (@${cleanHandle})?\n\nThis will remove connected handle, metrics, and reset linked rate calculations.`)) return;
    setDisconnecting(true);
    try {
      const res = await api.post("/influencer/disconnect-instagram", {});
      if (onUpdated) onUpdated(res.data.profile);
      setDisconnectNotice("Instagram account disconnected successfully.");
      setTimeout(() => setDisconnectNotice(""), 6000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to disconnect Instagram account.");
    } finally {
      setDisconnecting(false);
    }
  };

  const handleAddAccountSubmit = async (accountData) => {
    try {
      const res = await api.post("/influencer/social-accounts", accountData);
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
      const res = await api.put("/influencer/profile", payload);
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
    if (password.newPassword !== password.repeatPassword) return alert("New passwords do not match.");
    if (password.newPassword.length < 6) return alert("Password must be at least 6 characters long.");
    setSavingSection("password");
    try {
      await api.put("/auth/update-password", password);
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
      <SettingsSection
        title="Connected Instagram Account"
        description="Manage your verified social profile connection. Disconnecting will instantly wipe all retrieved analytics, metrics, and reset your commercial rate card."
      >
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
                  <InstagramIcon className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-gray-900">@{cleanHandle}</h4>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Connected &amp; Synced
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {instagramAccount.followers ? Number(instagramAccount.followers).toLocaleString("en-IN") : "Active"} Followers
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

            <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                <span>Disconnecting will remove all live engagement metrics, rate card suggestions, and public profile sync.</span>
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
            <div className="w-10 h-10 rounded-xl bg-gray-200 text-gray-500 flex items-center justify-center mx-auto"><Unlink size={20} /></div>
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
      </SettingsSection>

      <SettingsSection
        title="Personal Information"
        description="We'll share this information with brands to help with the matchmaking process and ensure a seamless experience."
        onSave={() => saveSection("personalInfo", { personalInfo })}
        saving={savingSection === "personalInfo"}
      >
        <div className="flex items-center gap-3.5 border-b border-gray-100 pb-5">
          <Avatar name={user?.name} size={48} />
          <div>
            <h4 className="text-sm font-bold text-gray-900">{user?.name || "Profile Photo"}</h4>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PERSONAL_FIELDS.map((f) => (
            <FormField
              key={f.key}
              {...f}
              value={personalInfo[f.key]}
              onChange={(e) => setPersonalInfo({ ...personalInfo, [f.key]: e.target.value })}
            />
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Address"
        description="After a successful match, we'll share your address with the brand to ensure a seamless product delivery experience."
        onSave={() => saveSection("address", { address })}
        saving={savingSection === "address"}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADDRESS_FIELDS.map((f) => (
            <FormField
              key={f.key}
              {...f}
              value={address[f.key]}
              onChange={(e) => setAddress({ ...address, [f.key]: e.target.value })}
            />
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Notifications"
        description="We'll always let you know about important changes, but you pick what else you want to hear about."
        onSave={() => saveSection("notifications", { notifications })}
        saving={savingSection === "notifications"}
      >
        {NOTIF_CONFIG.map((item) => (
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
      </SettingsSection>

      <div className="grid md:grid-cols-[1fr_2.5fr] gap-6 items-start">
        <div>
          <h3 className="font-bold text-gray-900 text-sm tracking-tight">Update Password</h3>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">Make sure you choose a secure password. Minimum 6 characters.</p>
        </div>

        <form onSubmit={handlePasswordUpdate} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          {PWD_FIELDS.map((f) => (
            <FormField
              key={f.key}
              {...f}
              type="password"
              required
              value={password[f.key]}
              onChange={(e) => setPassword({ ...password, [f.key]: e.target.value })}
            />
          ))}
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
        <AddSocialAccountModal onClose={() => setShowAddModal(false)} onSubmit={handleAddAccountSubmit} />
      )}
    </div>
  );
}