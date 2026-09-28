import React from "react";
import { CheckCircle2 } from "lucide-react";
import { ChecklistRow, PayoutSection, DiscoveryPreviewCard } from "./OnboardingShared";

export default function OnboardingStep3Payout({
  payoutInfo = {}, setPayoutInfo, payoutSaved, handleSavePayout, handleGoLive,
  setCurrentStep, saving, coverPhotos = [], avatarUrl, connectedInstagram,
  portfolioItems = [], packages = [], name, user, title, locationStr,
}) {
  const checklistItems = [
    { label: "Profile Cover & Avatar", ok: coverPhotos.length > 0 && !!avatarUrl },
    { label: "Connected Instagram Account", ok: !!connectedInstagram },
    { label: "Highlighted Portfolio Content", ok: portfolioItems.length > 0 },
    { label: "UGC Packages Configured", ok: packages.length > 0 },
    {
      label: "Payout Destination Connected",
      ok: !!payoutInfo.accountHolderName || !!payoutInfo.upiId || !!payoutInfo.paypalEmail,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">Payout details &amp; Go live</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
          Connect your preferred payout destination to receive automatic transfers when brands hire you.
        </p>
      </div>

      {payoutSaved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 size={16} /> Payout details updated successfully!
        </div>
      )}

      {/* Payout Information Card */}
      <PayoutSection payoutInfo={payoutInfo} setPayoutInfo={setPayoutInfo} onSave={handleSavePayout} saving={saving} />

      {/* Launch Readiness Checklist */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-gray-950">Launch Readiness Checklist</h3>
        <div className="space-y-3">
          {checklistItems.map((chk, i) => (
            <ChecklistRow key={i} label={chk.label} ok={chk.ok} />
          ))}
        </div>
      </div>

      {/* Live Profile Card Preview */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Creator Discovery Preview</p>
        <DiscoveryPreviewCard
          name={name}
          user={user}
          avatarUrl={avatarUrl}
          title={title}
          locationStr={locationStr}
          startingPrice={packages[0]?.price || 50}
        />
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
  );
}
