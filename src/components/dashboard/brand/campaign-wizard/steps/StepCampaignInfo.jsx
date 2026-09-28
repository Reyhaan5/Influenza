import React from "react";
import { Sparkles, Users, Gift, Share2, TrendingUp, ShoppingBag, PackageCheck, ChevronRight, RefreshCw } from "lucide-react";
import {
  CAMPAIGN_GOALS,
  CAMPAIGN_TYPES_BY_GOAL,
  VISIBILITY_OPTIONS,
  SHIPMENT_OPTIONS,
} from "./wizardConstants";

export default function StepCampaignInfo({
  campaignGoal,
  handleGoalChange,
  platform,
  setPlatform,
  campaignType,
  setCampaignType,
  boostWithPartnershipAds,
  setBoostWithPartnershipAds,
  campaignVisibility,
  setCampaignVisibility,
  productDelivery,
  setProductDelivery,
  isDigitalProduct,
  setShowBriefSampleModal,
}) {
  const activeCampaignTypes = CAMPAIGN_TYPES_BY_GOAL[campaignGoal] || [];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-extrabold text-gray-950 border-b border-gray-100 pb-3">
          Campaign info
        </h3>

        {/* 1. Campaign Goal */}
        <div>
          <label className="block text-xs font-bold text-gray-900 mb-2.5">Campaign Goal</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CAMPAIGN_GOALS.map((goal) => {
              const isSelected = campaignGoal === goal.id;
              return (
                <div
                  key={goal.id}
                  onClick={() => handleGoalChange(goal.id)}
                  className={`p-4 rounded-2xl border cursor-pointer text-center transition flex flex-col items-center justify-center min-h-[75px] ${
                    isSelected
                      ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-900 font-bold"
                      : "border-gray-200 bg-white hover:border-gray-300 text-gray-700 font-medium"
                  }`}
                >
                  <span className="text-xs font-bold leading-tight whitespace-pre-line">
                    {goal.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Platform */}
        <div>
          <label className="block text-xs font-bold text-gray-900 mb-2.5">Platform</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setPlatform("Meta")}
              className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-center gap-2 ${
                platform === "Meta"
                  ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-900 font-bold"
                  : "border-gray-200 bg-white hover:border-gray-300 text-gray-700 font-medium"
              }`}
            >
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7.3 4.5 3.5 8.3 3.5 13c0 2.6 1.2 5 3.1 6.6l.4.3.4-.3c1.7-1.4 2.8-3.5 2.8-5.8 0-1.8.8-3.4 2-4.5 1.2 1.1 2 2.7 2 4.5 0 2.3 1.1 4.4 2.8 5.8l.4.3.4-.3c1.9-1.6 3.1-4 3.1-6.6 0-4.7-3.8-8.5-8.9-8.5zm0 1.8c3.9 0 7.1 3.2 7.1 7.1 0 2-.9 3.8-2.3 5-1.4-1.3-2.3-3.1-2.3-5.1 0-2.3-1.1-4.4-2.8-5.8l-.4-.3-.4.3C9.2 8.8 8.1 10.9 8.1 13.2c0 2-.9 3.8-2.3 5.1-1.4-1.2-2.3-3-2.3-5 0-3.9 3.2-7.1 7.1-7.1z" />
                </svg>
                <span className="text-[10px] text-fuchsia-600 font-bold">📷</span>
                <span className="text-[10px] text-blue-600 font-bold">f</span>
              </div>
              <span className="text-xs font-bold">Meta</span>
            </div>

            <div
              onClick={() => setPlatform("TikTok")}
              className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-center gap-2 ${
                platform === "TikTok"
                  ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-900 font-bold"
                  : "border-gray-200 bg-white hover:border-gray-300 text-gray-700 font-medium"
              }`}
            >
              <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.05.86.15V9.41a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 8.78 5.86 6.33 6.33 0 0 0 3.9-5.86V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
              </svg>
              <span className="text-xs font-bold">TikTok</span>
            </div>

            <div
              onClick={() => setPlatform("YouTube (Shorts)")}
              className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-center gap-2 ${
                platform === "YouTube (Shorts)"
                  ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-900 font-bold"
                  : "border-gray-200 bg-white hover:border-gray-300 text-gray-700 font-medium"
              }`}
            >
              <div className="w-5 h-3.5 bg-red-600 rounded flex items-center justify-center">
                <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-white border-b-[3px] border-b-transparent ml-0.5" />
              </div>
              <span className="text-xs font-bold">YouTube (Shorts)</span>
            </div>
          </div>
        </div>

        {/* 3. Campaign Type */}
        <div>
          <label className="block text-xs font-bold text-gray-900 mb-2.5">Campaign Type</label>
          <div
            className={`grid gap-3 ${
              activeCampaignTypes.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {activeCampaignTypes.map((t) => {
              const isSelected = campaignType === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setCampaignType(t.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {t.type === "ugc" && (
                        <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                          <Sparkles size={14} />
                        </div>
                      )}
                      {t.type === "influencer" && (
                        <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                          <Users size={14} />
                        </div>
                      )}
                      {t.type === "seeding" && (
                        <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                          <Gift size={14} />
                        </div>
                      )}
                      {t.type === "spark_ads" && (
                        <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                          <Share2 size={14} />
                        </div>
                      )}
                      {t.type === "meta_ads" && (
                        <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                          <TrendingUp size={14} />
                        </div>
                      )}
                      {t.type === "shop" && (
                        <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                          <ShoppingBag size={14} />
                        </div>
                      )}
                      <h4 className="font-bold text-xs text-gray-950">{t.title}</h4>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{t.subtitle}</p>
                  </div>

                  {t.hasAuthButton && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("TikTok Shop authorization dialog will open.");
                      }}
                      className="self-start mt-1 px-3 py-1.5 rounded-lg bg-amber-100/90 hover:bg-amber-200/90 text-amber-900 border border-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition"
                    >
                      <RefreshCw size={11} /> Click here to authorize TikTok Shop
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowBriefSampleModal(true)}
              className="text-xs font-bold text-fuchsia-600 hover:text-fuchsia-700 flex items-center gap-1 transition"
            >
              Check Brief Sample <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* 4. Boost reach with Meta Partnership Ads */}
        <div className="border border-gray-200 rounded-2xl p-4 bg-white flex items-center gap-4">
          <div className="w-16 h-20 rounded-xl bg-slate-900 flex-shrink-0 overflow-hidden relative shadow-inner border border-gray-200 flex flex-col justify-end p-1.5">
            <div className="w-full bg-indigo-600 text-white text-[7px] font-bold px-1 py-0.5 rounded text-center mb-1">
              Sponsored
            </div>
            <div className="w-full h-1 bg-white/40 rounded-full" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-extrabold text-xs text-gray-950">
              Boost reach with Meta Partnership Ads
            </h4>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
              Want to extend your creator collaborations with Meta ads after this deal? Turn this on so we can match you with eligible creators and keep your mix diverse. Brands using partnership ads see 53% higher CTRs and 19% lower CPAs.
            </p>
          </div>

          <div
            onClick={() => setBoostWithPartnershipAds(!boostWithPartnershipAds)}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition flex-shrink-0 ${
              boostWithPartnershipAds ? "bg-fuchsia-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                boostWithPartnershipAds ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* 5. Campaign Visibility */}
        <div>
          <label className="block text-xs font-bold text-gray-900 mb-2.5">Campaign Visibility</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VISIBILITY_OPTIONS.map((vis) => {
              const isSelected = campaignVisibility === vis.id;
              return (
                <div
                  key={vis.id}
                  onClick={() => setCampaignVisibility(vis.id)}
                  className={`p-4 rounded-2xl border cursor-pointer text-center transition flex flex-col items-center justify-center min-h-[75px] ${
                    isSelected
                      ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="text-xs font-bold text-gray-900 mb-0.5">{vis.title}</span>
                  <span className="text-[11px] text-gray-500">{vis.subtitle}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card 2: Shipment */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-extrabold text-gray-950 border-b border-gray-100 pb-3">Shipment</h3>

        {isDigitalProduct ? (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <PackageCheck size={24} />
            </div>
            <h4 className="font-extrabold text-sm text-blue-950">
              No Shipment Needed for Digital Product
            </h4>
            <p className="text-xs text-blue-700 max-w-md mx-auto leading-relaxed">
              Your selected product is a digital asset (software, digital course, membership, etc.). Creators will receive instant access or download instructions digitally.
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1">Product Delivery</label>
            <p className="text-xs text-gray-500 mb-3">Choose how you want creators to receive the product</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SHIPMENT_OPTIONS.map((opt) => {
                const isSelected =
                  productDelivery === opt.id || productDelivery.startsWith(opt.title);
                return (
                  <div
                    key={opt.id}
                    onClick={() => setProductDelivery(opt.id)}
                    className={`p-4 rounded-2xl border cursor-pointer text-center transition flex flex-col items-center justify-center min-h-[85px] ${
                      isSelected
                        ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-900 mb-1">{opt.title}</span>
                    <span className="text-[11px] text-gray-500">{opt.subtitle}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
