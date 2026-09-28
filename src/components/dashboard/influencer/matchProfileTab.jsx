import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import api from "../../../config/api";
import { SettingsSection, ToggleSwitch } from "./InfluencerShared";

const COLLAB_FORMATS = ["Instagram Reels", "Instagram Stories", "Instagram Post"];
const PAYMENT_OPTIONS = [
  { id: "gifted", title: "Gifted", desc: "Collaborate with brands on gifted product campaigns without upfront fixed cash fees." },
  { id: "paid", title: "Paid", desc: "The brand will pay a fixed fee per post, story or reels. You'll be able to choose your fees on the next step." },
  { id: "affiliate", title: "Affiliate", desc: "On top of the free product, you'll also get a commission for every sale the brand receives through your discount code." },
];
const NICHE_LIST = ["Lifestyle", "Tech", "Travel"];
const PREFERRED_COMPANIES = ["Services", "Software"];

export default function MatchProfileTab({ profile, onUpdated }) {
  const [data, setData] = useState({
    campaignActive: profile?.matchProfile?.campaignActive ?? true,
    invitationsActive: profile?.matchProfile?.invitationsActive ?? true,
    collaborationFormats: profile?.matchProfile?.collaborationFormats || [],
    paymentType: profile?.matchProfile?.paymentType || "gifted",
    minAskingPrice: profile?.matchProfile?.minAskingPrice ?? "",
    maxAskingPrice: profile?.matchProfile?.maxAskingPrice ?? "",
    bio: profile?.matchProfile?.bio || "",
    accountNiche: (Array.isArray(profile?.matchProfile?.niche) && profile.matchProfile.niche[0]) || profile?.matchProfile?.accountNiche || "",
    topics: profile?.matchProfile?.topics || [],
    leadTimeDays: profile?.matchProfile?.leadTimeDays ?? "",
    preferredCompanies: profile?.matchProfile?.preferredCompanies || [],
    audience: profile?.matchProfile?.audience || [],
    followersLocations: profile?.matchProfile?.followersLocations || profile?.matchProfile?.followersLocation || [],
  });

  const [savingKey, setSavingKey] = useState(null);

  useEffect(() => {
    if (profile?.matchProfile) {
      const mp = profile.matchProfile;
      setData({
        campaignActive: mp.campaignActive ?? true,
        invitationsActive: mp.invitationsActive ?? true,
        collaborationFormats: mp.collaborationFormats || [],
        paymentType: mp.paymentType || "gifted",
        minAskingPrice: mp.minAskingPrice ?? "",
        maxAskingPrice: mp.maxAskingPrice ?? "",
        bio: mp.bio || "",
        accountNiche: (Array.isArray(mp.niche) && mp.niche[0]) || mp.accountNiche || "",
        topics: mp.topics || [],
        leadTimeDays: mp.leadTimeDays ?? "",
        preferredCompanies: mp.preferredCompanies || [],
        audience: mp.audience || [],
        followersLocations: mp.followersLocations || mp.followersLocation || [],
      });
    }
  }, [profile]);

  const updateField = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  const toggleItem = (key, item) => {
    const list = data[key].includes(item) ? data[key].filter((f) => f !== item) : [...data[key], item];
    updateField(key, list);
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
          payload.followersLocations = Array.isArray(data.followersLocations) ? data.followersLocations : [data.followersLocations];
        } else {
          payload[f] = data[f];
        }
      });
      const res = await api.put("/influencer/match-profile", payload);
      if (onUpdated) onUpdated(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save match profile.");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {[
        { key: "campaignActive", title: "Campaign Active", desc: "If you would like to take a break from working with brands you can pause your account using the toggle below." },
        { key: "invitationsActive", title: "Invitations Active", desc: "If you want to opt out of receiving invitations for work opportunities from brands." },
      ].map((item) => (
        <SettingsSection key={item.key} title={item.title} description={item.desc}>
          <ToggleSwitch
            active={data[item.key]}
            onToggle={() => {
              const next = !data[item.key];
              updateField(item.key, next);
              save([item.key], item.key);
            }}
            label="Active"
          />
        </SettingsSection>
      ))}

      <SettingsSection
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
                onClick={() => toggleItem("collaborationFormats", format)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                  selected ? "border-slate-800 bg-slate-50 text-[var(--color-text)]" : "border-[var(--color-border)] text-[var(--color-text-light)] hover:border-slate-400"
                }`}
              >
                <span>{format}</span>
                {selected && <Check size={16} className="text-slate-800" />}
              </button>
            );
          })}
        </div>
      </SettingsSection>

      <SettingsSection
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
                data.paymentType === opt.id ? "border-slate-800 bg-slate-50" : "border-[var(--color-border)] hover:border-slate-400"
              }`}
            >
              <p className="font-bold text-sm text-[var(--color-text)]">{opt.title}</p>
              <p className="mt-1 text-xs text-[var(--color-text-light)] leading-relaxed">{opt.desc}</p>
            </button>
          ))}
        </div>

        {data.paymentType === "paid" && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            {[
              { label: "Minimum asking price", key: "minAskingPrice" },
              { label: "Maximum asking price", key: "maxAskingPrice" },
            ].map((p) => (
              <div key={p.key}>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">{p.label}</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-gray-500">$</span>
                  <input
                    type="number"
                    value={data[p.key]}
                    onChange={(e) => updateField(p.key, e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] pl-7 pr-12 py-2.5 text-sm"
                  />
                  <span className="absolute right-3 text-xs text-gray-400">USD</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SettingsSection>

      <SettingsSection
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
      </SettingsSection>

      <SettingsSection
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
                  data.accountNiche === niche ? "bg-black text-white border-black" : "border-[var(--color-border)] text-[var(--color-text)]"
                }`}
              >
                {niche}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-text)] mb-2">Lead time for creating content (in days)</label>
          <input
            type="number"
            value={data.leadTimeDays}
            onChange={(e) => updateField("leadTimeDays", e.target.value)}
            className="w-full md:w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2 text-sm"
          />
        </div>
      </SettingsSection>

      <SettingsSection
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
                onClick={() => toggleItem("preferredCompanies", company)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  data.preferredCompanies.includes(company) ? "bg-black text-white border-black" : "border-[var(--color-border)] text-[var(--color-text)]"
                }`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}