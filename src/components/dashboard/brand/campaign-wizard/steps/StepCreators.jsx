import React from "react";
import { Bookmark, ChevronDown } from "lucide-react";
import { CREATOR_TIERS } from "./wizardConstants";

export default function StepCreators({
  creatorsCountTier,
  setCreatorsCountTier,
  targetCreatorsCount,
  setTargetCreatorsCount,
  lookalikesLink,
  setLookalikesLink,
  autoInviteSource,
  setAutoInviteSource,
  excludePastCampaigns,
  setExcludePastCampaigns,
  excludeCreatorsType,
  setExcludeCreatorsType,
  excludeCampaignQuery,
  setExcludeCampaignQuery,
  tierError,
}) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-extrabold text-gray-950 border-b border-gray-100 pb-3">
        Manage Creators
      </h3>

      {/* 1. How many creators do you want to hire? */}
      <div>
        <label className="block text-xs font-bold text-gray-900 mb-2.5">
          How many creators do you want to hire?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {CREATOR_TIERS.map((tier) => {
            const isSelected = creatorsCountTier === tier;
            return (
              <button
                key={tier}
                type="button"
                onClick={() => {
                  setCreatorsCountTier(tier);
                  if (tier === "<5") setTargetCreatorsCount("3");
                  if (tier === "5-10") setTargetCreatorsCount("7");
                  if (tier === "10-20") setTargetCreatorsCount("15");
                  if (tier === ">20") setTargetCreatorsCount("25");
                }}
                className={`py-3.5 px-4 rounded-2xl border text-sm font-bold transition text-center ${
                  isSelected
                    ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                    : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                }`}
              >
                {tier}
              </button>
            );
          })}
        </div>

        <input
          type="number"
          value={targetCreatorsCount}
          onChange={(e) => setTargetCreatorsCount(e.target.value)}
          placeholder="Enter your target number of creators"
          className={`w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white text-gray-900 focus:outline-none transition ${
            tierError
              ? "border-red-400 focus:ring-2 focus:ring-red-400"
              : "border-gray-200 focus:ring-2 focus:ring-fuchsia-500"
          }`}
        />
        {tierError && (
          <p className="text-[11px] text-red-500 font-medium mt-1.5 flex items-center gap-1">
            <span>ⓧ</span> {tierError}
          </p>
        )}
      </div>

      {/* 2. Lookalikes */}
      <div>
        <label className="block text-xs font-bold text-gray-900 mb-1.5">Lookalikes</label>
        <input
          type="text"
          value={lookalikesLink}
          onChange={(e) => setLookalikesLink(e.target.value)}
          placeholder="Add link to favorites creator"
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition"
        />
      </div>

      {/* 3. Auto-invite creators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0">
            <Bookmark size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-950">Auto-invite creators to this campaign</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">
              These creators will be invited after the brief is launched
            </p>
          </div>
        </div>

        <div className="relative min-w-[140px]">
          <select
            value={autoInviteSource}
            onChange={(e) => setAutoInviteSource(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-fuchsia-500 cursor-pointer appearance-none pr-8"
          >
            <option value="From Lists">From Lists</option>
            <option value="Saved Creators">Saved Creators</option>
            <option value="Top Recommended">Top Recommended</option>
            <option value="None">None</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* 4. Exclude past campaigns */}
      <div className="pt-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-gray-950">Exclude creators from past campaign(s)</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Avoid sending this brief to creators in all or specific campaigns
            </p>
          </div>

          <div
            onClick={() => setExcludePastCampaigns(!excludePastCampaigns)}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition flex-shrink-0 ${
              excludePastCampaigns ? "bg-fuchsia-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                excludePastCampaigns ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {excludePastCampaigns && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Creators</label>
              <div className="relative">
                <select
                  value={excludeCreatorsType}
                  onChange={(e) => setExcludeCreatorsType(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 cursor-pointer appearance-none pr-8"
                >
                  <option value="All creators">All creators</option>
                  <option value="Hired creators">Hired creators</option>
                  <option value="Declined creators">Declined creators</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Campaigns</label>
              <input
                type="text"
                value={excludeCampaignQuery}
                onChange={(e) => setExcludeCampaignQuery(e.target.value)}
                placeholder="Add campaign"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
