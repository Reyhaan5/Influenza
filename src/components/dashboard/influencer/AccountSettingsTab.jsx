import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config/api";
import Avatar from "./Avatar";

const ETHNICITY_OPTIONS = [
  "Asian",
  "Black / African",
  "Hispanic / Latino",
  "Native American",
  "Other",
  "Pacific Islander",
  "White",
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
];

export default function AccountSettingsTab({ user, profile, onUpdated }) {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    birthday: profile?.birthday || "",
    gender: profile?.gender || "",
    ethnicity: profile?.ethnicity || "Asian",
    petOwner: profile?.petOwner || "No",
  });

  const [address, setAddress] = useState({
    line1: profile?.address?.line1 || "",
    line2: profile?.address?.line2 || "",
    city: profile?.address?.city || "",
    county: profile?.address?.county || "",
    state: profile?.address?.state || "",
    postcode: profile?.address?.postcode || "",
    country: profile?.address?.country || "United States 🇺🇸",
    phone: profile?.address?.phone || "",
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

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

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
    <div className="flex flex-col gap-10">
      {/* Personal Information Section */}
      <div className="grid md:grid-cols-[1fr_2.5fr] gap-6 items-start">
        <div>
          <h3 className="font-bold text-[var(--color-text)] text-base">Personal information</h3>
          <p className="mt-1 text-xs text-[var(--color-text-light)] leading-relaxed">
            We'll share this information with brands to help with the matchmaking process and ensure a seamless experience.
          </p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] flex flex-col gap-6">
          {/* Avatar Header */}
          <div className="flex items-center gap-4 border-b border-[var(--color-border)] pb-6">
            <Avatar name={user?.name} size={56} />
            <button
              type="button"
              className="border border-[var(--color-border)] hover:bg-[var(--color-background)] px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-text)] transition-colors"
            >
              Change avatar
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">First Name</label>
              <input
                type="text"
                value={personalInfo.firstName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">Last Name</label>
              <input
                type="text"
                value={personalInfo.lastName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">Email Address</label>
              <input
                type="email"
                readOnly
                value={personalInfo.email}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm opacity-75 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">Birthday</label>
              <input
                type="date"
                value={personalInfo.birthday}
                onChange={(e) => setPersonalInfo({ ...personalInfo, birthday: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">Gender</label>
              <select
                value={personalInfo.gender}
                onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm"
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
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">Ethnicity</label>
              <select
                value={personalInfo.ethnicity}
                onChange={(e) => setPersonalInfo({ ...personalInfo, ethnicity: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm"
              >
                {ETHNICITY_OPTIONS.map((eth) => (
                  <option key={eth} value={eth}>{eth}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">Pet owner</label>
              <select
                value={personalInfo.petOwner}
                onChange={(e) => setPersonalInfo({ ...personalInfo, petOwner: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm"
              >
                {PET_OPTIONS.map((pet) => (
                  <option key={pet} value={pet}>{pet}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => saveSection("personalInfo", { personalInfo })}
              disabled={savingSection === "personalInfo"}
              className="bg-black hover:bg-black/80 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition disabled:opacity-50"
            >
              {savingSection === "personalInfo" ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="grid md:grid-cols-[1fr_2.5fr] gap-6 items-start">
        <div>
          <h3 className="font-bold text-[var(--color-text)] text-base">Address</h3>
          <p className="mt-1 text-xs text-[var(--color-text-light)] leading-relaxed">
            After a successful match, we'll share your address with the brand to ensure a seamless product delivery experience.
          </p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] flex flex-col gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">Address Line 1</label>
              <input
                type="text"
                placeholder="Example: Flat D"
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">Address Line 2</label>
              <input
                type="text"
                placeholder="Example: 10 Hyde Park Road"
                value={address.line2}
                onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">City</label>
              <input
                type="text"
                placeholder="Example: New York"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">County</label>
              <input
                type="text"
                placeholder="Example: Hamilton"
                value={address.county}
                onChange={(e) => setAddress({ ...address, county: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">State / Region</label>
              <input
                type="text"
                placeholder="Example: New York"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">Postcode</label>
              <input
                type="text"
                value={address.postcode}
                onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">Country</label>
              <select
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => saveSection("address", { address })}
              disabled={savingSection === "address"}
              className="bg-black hover:bg-black/80 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition disabled:opacity-50"
            >
              {savingSection === "address" ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="grid md:grid-cols-[1fr_2.5fr] gap-6 items-start">
        <div>
          <h3 className="font-bold text-[var(--color-text)] text-base">Notifications</h3>
          <p className="mt-1 text-xs text-[var(--color-text-light)] leading-relaxed">
            We'll always let you know about important changes, but you pick what else you want to hear about.
          </p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] flex flex-col gap-5">
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
                className="mt-1 h-4 w-4 rounded border-[var(--color-border)] text-black focus:ring-black"
              />
              <div>
                <p className="font-bold text-xs text-[var(--color-text)]">{item.label}</p>
                <p className="text-xs text-[var(--color-text-light)] mt-0.5">{item.desc}</p>
              </div>
            </label>
          ))}

          <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => saveSection("notifications", { notifications })}
              disabled={savingSection === "notifications"}
              className="bg-black hover:bg-black/80 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition disabled:opacity-50"
            >
              {savingSection === "notifications" ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Update Password Section */}
      <div className="grid md:grid-cols-[1fr_2.5fr] gap-6 items-start">
        <div>
          <h3 className="font-bold text-[var(--color-text)] text-base">Update password</h3>
          <p className="mt-1 text-xs text-[var(--color-text-light)] leading-relaxed">
            Make sure you choose a secure password. Please have minimum 6 characters.
          </p>
        </div>

        <form onSubmit={handlePasswordUpdate} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">Old password</label>
            <input
              type="password"
              required
              value={password.oldPassword}
              onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">New password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password.newPassword}
              onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">Repeat new password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password.repeatPassword}
              onChange={(e) => setPassword({ ...password, repeatPassword: e.target.value })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm"
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
            <button
              type="submit"
              disabled={savingSection === "password"}
              className="bg-black hover:bg-black/80 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition disabled:opacity-50"
            >
              {savingSection === "password" ? "Updating..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}