import React from "react";
import { Tag, MessageSquare } from "lucide-react";

export default function StepPaymentTerms({
  minFeePerCreator,
  setMinFeePerCreator,
  maxFeePerCreator,
  setMaxFeePerCreator,
  salesCommissionsEnabled,
  setSalesCommissionsEnabled,
  commissionRate,
  setCommissionRate,
}) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-extrabold text-gray-950 border-b border-gray-100 pb-3">
        Payment terms
      </h3>

      {/* Fee range per creator */}
      <div>
        <label className="block text-xs font-bold text-gray-900 mb-2">Fee range per creator</label>
        <div className="flex items-center gap-3 max-w-md">
          <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-fuchsia-500 flex-1">
            <div className="bg-gray-50 px-3.5 flex items-center border-r border-gray-200 text-gray-500 text-xs font-bold">
              $
            </div>
            <input
              type="number"
              value={minFeePerCreator}
              onChange={(e) => setMinFeePerCreator(e.target.value)}
              placeholder="Min"
              className="w-full px-3 py-2 text-xs bg-white text-gray-900 focus:outline-none"
            />
          </div>
          <span className="text-gray-400 font-bold">—</span>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-fuchsia-500 flex-1">
            <div className="bg-gray-50 px-3.5 flex items-center border-r border-gray-200 text-gray-500 text-xs font-bold">
              $
            </div>
            <input
              type="number"
              value={maxFeePerCreator}
              onChange={(e) => setMaxFeePerCreator(e.target.value)}
              placeholder="Max"
              className="w-full px-3 py-2 text-xs bg-white text-gray-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Sales commissions */}
      <div className="border border-fuchsia-200 rounded-3xl p-5 bg-white space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-fuchsia-50 border border-fuchsia-100 flex items-center justify-center text-fuchsia-600 flex-shrink-0 mt-0.5">
              <Tag size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-950">Sales commissions</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                Offer a sales commission to further motivate creators. Send it via “Make an extra payment” in chat—we won’t process it.
              </p>
            </div>
          </div>

          <div
            onClick={() => setSalesCommissionsEnabled(!salesCommissionsEnabled)}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition flex-shrink-0 ${
              salesCommissionsEnabled ? "bg-fuchsia-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                salesCommissionsEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {salesCommissionsEnabled && (
          <div className="pt-3 border-t border-gray-100 space-y-3 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">Commission rate</label>
              <p className="text-[11px] text-gray-500 mb-2">
                Set % per sale—pay manually in chat, not processed automatically.
              </p>

              <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-fuchsia-500 max-w-sm">
                <div className="bg-gray-50 px-3.5 flex items-center border-r border-gray-200 text-gray-500 text-xs font-bold">
                  %
                </div>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  placeholder="10"
                  className="w-full px-3 py-2 text-xs bg-white text-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border-l-4 border-emerald-500 text-emerald-950 text-[11px] leading-relaxed flex items-start gap-2">
              <MessageSquare size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                To ensure optimal performance of the campaign, we recommend setting the commission rate at 10% or higher
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
