import React, { useState } from "react";
import axios from "axios";
import { Check } from "lucide-react";
import { API_URL } from "../../../config/api";

const COLLAB_FORMATS = ["Instagram Reels", "Instagram Stories", "Instagram Post"];

const PAYMENT_OPTIONS = [
  {
    id: "gifted",
    title: "Gifted",
    desc: "You'll work with brands on just a gifted product and no payments. Social Cat is mainly a gifted influencer platform and we've only recently started testing paid and affiliate options.",
  },
  {
    id: "paid",
    title: "Paid",
    desc: "The brand will pay a fixed fee per post, story or reels. You'll be able to choose your fees on the next step.",
  },
  {
    id: "affiliate",
    title: "Affiliate",
    desc: "On top of the free product, you'll also get a commission for every sale the brand receives through your discount code.",
  },
];

const NICHE_LIST = ["Lifestyle", "Tech", "Travel"];
const PREFERRED_COMPANIES = ["Services", "Software"];

function SectionLayout({ title, description, children, onSave, saving }) {
  return (
    <div className="grid md:grid-cols-[1fr_2.5fr] gap-6 items-start">
      <div>
        <h3 className="font-bold text-[var(--color-text)] text-base">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-[var(--color-text-light)] leading-relaxed">{description}</p>
        )}
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] flex flex-col gap-5">
        {children}
        {onSave && (
          <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="bg-black hover:bg-black/80 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MatchProfileTab({ profile, onUpdated }) {
  const [data, setData] = useState({
    campaignActive: profile?.matchProfile?.campaignActive ?? true,
    invitationsActive: profile?.matchProfile?.invitationsActive ?? true,
    collaborationFormats: profile?.matchProfile?.collaborationFormats || ["Instagram Reels", "Instagram Stories", "Instagram Post"],
    paymentType: profile?.matchProfile?.paymentType || "gifted",
    minAskingPrice: profile?.matchProfile?.minAskingPrice ?? "",
    maxAskingPrice: profile?.matchProfile?.maxAskingPrice ?? "",
    bio: profile?.matchProfile?.bio || "",
    accountNiche:
      (Array.isArray(profile?.matchProfile?.niche) && profile.matchProfile.niche[0]) ||
      profile?.matchProfile?.accountNiche ||
      "Lifestyle",
    topics: profile?.matchProfile?.topics || [],
    leadTimeDays: profile?.matchProfile?.leadTimeDays ?? "",
    preferredCompanies: profile?.matchProfile?.preferredCompanies || ["Software"],
    audience: profile?.matchProfile?.audience || ["Men (25-44)"],
    followersLocations:
      profile?.matchProfile?.followersLocations ||
      profile?.matchProfile?.followersLocation ||
      ["United States 🇺🇸"],
  });

  // Sync state if profile prop updates after mounting
  React.useEffect(() => {
    if (profile?.matchProfile) {
      setData({
        campaignActive: profile.matchProfile.campaignActive ?? true,
        invitationsActive: profile.matchProfile.invitationsActive ?? true,
        collaborationFormats: profile.matchProfile.collaborationFormats || ["Instagram Reels", "Instagram Stories", "Instagram Post"],
        paymentType: profile.matchProfile.paymentType || "gifted",
        minAskingPrice: profile.matchProfile.minAskingPrice ?? "",
        maxAskingPrice: profile.matchProfile.maxAskingPrice ?? "",
        bio: profile.matchProfile.bio || "",
        accountNiche:
          (Array.isArray(profile.matchProfile.niche) && profile.matchProfile.niche[0]) ||
          profile.matchProfile.accountNiche ||
          "Lifestyle",
        topics: profile.matchProfile.topics || [],
        leadTimeDays: profile.matchProfile.leadTimeDays ?? "",
        preferredCompanies: profile.matchProfile.preferredCompanies || ["Software"],
        audience: profile.matchProfile.audience || ["Men (25-44)"],
        followersLocations:
          profile.matchProfile.followersLocations ||
          profile.matchProfile.followersLocation ||
          ["United States 🇺🇸"],
      });
    }
  }, [profile]);

  const [savingKey, setSavingKey] = useState(null);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const updateField = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  const toggleFormat = (fmt) => {
    const list = data.collaborationFormats.includes(fmt)
      ? data.collaborationFormats.filter((f) => f !== fmt)
      : [...data.collaborationFormats, fmt];
    updateField("collaborationFormats", list);
  };

  const save = async (fields, key) => {
    setSavingKey(key);
    try {
      const payload = {};
      fields.forEach((f) => {
        if (f === "accountNiche") {
          payload.niche = [data.accountNiche];
          payload.accountNiche = data.accountNiche;
        } else if (f === "followersLocation" || f === "followersLocations") {
          payload.followersLocations = Array.isArray(data.followersLocations)
            ? data.followersLocations
            : [data.followersLocations];
        } else {
          payload[f] = data[f];
        }
      });
      const res = await axios.put(`${API_URL}/influencer/match-profile`, payload, authHeader());
      if (onUpdated) onUpdated(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save match profile.");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Campaign Active */}
      <SectionLayout
        title="Campaign Active"
        description="If you would like to take a break from working with brands you can pause your account using the toggle below."
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const next = !data.campaignActive;
              updateField("campaignActive", next);
              save(["campaignActive"], "campaignActive");
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              data.campaignActive ? "bg-slate-700" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                data.campaignActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm font-semibold text-[var(--color-text)]">Active</span>
        </div>
      </SectionLayout>

      {/* Invitations Active */}
      <SectionLayout
        title="Invitations Active"
        description="If you want to opt out of receiving invitations for work opportunities from brands."
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const next = !data.invitationsActive;
              updateField("invitationsActive", next);
              save(["invitationsActive"], "invitationsActive");
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              data.invitationsActive ? "bg-slate-700" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                data.invitationsActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm font-semibold text-[var(--color-text)]">Active</span>
        </div>
      </SectionLayout>

      {/* Collaboration Format Selection */}
      <SectionLayout
        title="Collaboration"
        description="How would you like to review products for brands?"
        onSave={() => save(["collaborationFormats"], "collab")}
        saving={savingKey === "collab"}
      >
        <div className="flex flex-col gap-2.5">
          {COLLAB_FORMATS.map((format) => {
            const selected = data.collaborationFormats.includes(format);
            return (
              <button
                key={format}
                type="button"
                onClick={() => toggleFormat(format)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                  selected
                    ? "border-slate-800 bg-slate-50 text-[var(--color-text)]"
                    : "border-[var(--color-border)] text-[var(--color-text-light)] hover:border-slate-400"
                }`}
              >
                <span>{format}</span>
                {selected && <Check size={16} className="text-slate-800" />}
              </button>
            );
          })}
        </div>
      </SectionLayout>

      {/* Payment Options */}
      <SectionLayout
        title="Payment"
        description="How would you like to compensated for collaborations?"
        onSave={() => save(["paymentType", "minAskingPrice", "maxAskingPrice"], "payment")}
        saving={savingKey === "payment"}
      >
        <div className="flex flex-col gap-3">
          {PAYMENT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => updateField("paymentType", opt.id)}
              className={`text-left rounded-xl border p-4 transition-colors ${
                data.paymentType === opt.id
                  ? "border-slate-800 bg-slate-50"
                  : "border-[var(--color-border)] hover:border-slate-400"
              }`}
            >
              <p className="font-bold text-sm text-[var(--color-text)]">{opt.title}</p>
              <p className="mt-1 text-xs text-[var(--color-text-light)] leading-relaxed">{opt.desc}</p>
            </button>
          ))}
        </div>

        {data.paymentType === "paid" && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                Minimum asking price
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-gray-500">$</span>
                <input
                  type="number"
                  value={data.minAskingPrice}
                  onChange={(e) => updateField("minAskingPrice", e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] pl-7 pr-12 py-2.5 text-sm"
                />
                <span className="absolute right-3 text-xs text-gray-400">USD</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                Maximum asking price
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-gray-500">$</span>
                <input
                  type="number"
                  value={data.maxAskingPrice}
                  onChange={(e) => updateField("maxAskingPrice", e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] pl-7 pr-12 py-2.5 text-sm"
                />
                <span className="absolute right-3 text-xs text-gray-400">USD</span>
              </div>
            </div>
          </div>
        )}
      </SectionLayout>

      {/* Tell us about yourself */}
      <SectionLayout
        title="Tell us about yourself"
        description="The more interesting and relevant information you provide, the higher the chances of being approved by the brands."
        onSave={() => save(["bio"], "bio")}
        saving={savingKey === "bio"}
      >
        <div>
          <h4 className="font-bold text-xs text-[var(--color-text)] mb-1">Highlight your passions</h4>
          <p className="text-xs text-[var(--color-text-light)] mb-3 leading-relaxed">
            Share more about your unique interests, hobbies, and experiences. The more detailed and captivating your story is, the greater your chances of resonating with brands.
          </p>
          <textarea
            rows={4}
            value={data.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3.5 text-sm resize-none"
          />
        </div>
      </SectionLayout>

      {/* Your creator account */}
      <SectionLayout
        title="Your creator account"
        description="Select the keywords that best describe you and your creator account."
        onSave={() => save(["accountNiche", "topics", "leadTimeDays"], "account")}
        saving={savingKey === "account"}
      >
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text)] mb-2">Account niche</label>
          <div className="flex flex-wrap gap-2">
            {NICHE_LIST.map((niche) => (
              <button
                key={niche}
                type="button"
                onClick={() => updateField("accountNiche", niche)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  data.accountNiche === niche
                    ? "bg-black text-white border-black"
                    : "border-[var(--color-border)] text-[var(--color-text)]"
                }`}
              >
                {niche}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-text)] mb-2">
            Lead time for creating content (in days)
          </label>
          <input
            type="number"
            value={data.leadTimeDays}
            onChange={(e) => updateField("leadTimeDays", e.target.value)}
            className="w-full md:w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2 text-sm"
          />
        </div>
      </SectionLayout>

      {/* Brands that you like */}
      <SectionLayout
        title="Brands that you like"
        description="Let us know what kind of brands are interesting to you, so that we give you more accurate recommendations."
        onSave={() => save(["preferredCompanies"], "companies")}
        saving={savingKey === "companies"}
      >
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text)] mb-2">Preferred companies</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {PREFERRED_COMPANIES.map((company) => (
              <button
                key={company}
                type="button"
                onClick={() => {
                  const list = data.preferredCompanies.includes(company)
                    ? data.preferredCompanies.filter((c) => c !== company)
                    : [...data.preferredCompanies, company];
                  updateField("preferredCompanies", list);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  data.preferredCompanies.includes(company)
                    ? "bg-black text-white border-black"
                    : "border-[var(--color-border)] text-[var(--color-text)]"
                }`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      </SectionLayout>
    </div>
  );
}