import React from "react";
import { MessageCircle, ChevronUp, Plus } from "lucide-react";

const formatPrice = (price) => Number(price || 0).toLocaleString("en-IN");

export default function CreatorPackages({ packages = [], selectedPackageId, setSelectedPackageId, expandedPackageId, setExpandedPackageId, negotiateOpen, setNegotiateOpen, negotiateOffer, setNegotiateOffer, negotiateNotes, setNegotiateNotes, onSubmitProposal }) {
  return (
    <div>
      <h2 className="text-lg font-extrabold text-gray-950 mb-4">Packages</h2>
      <div className="space-y-3">
        {packages.length > 0 ? (
          packages.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;
            const isExpanded = expandedPackageId === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackageId(pkg.id)}
                className={`rounded-2xl border p-4 transition cursor-pointer ${isSelected ? "border-gray-900 bg-white shadow-sm ring-1 ring-gray-900" : "border-gray-200 bg-white hover:border-gray-300"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="package-selector"
                      checked={isSelected}
                      onChange={() => setSelectedPackageId(pkg.id)}
                      className="w-4 h-4 text-black focus:ring-black accent-black cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-sm text-gray-950 flex items-center gap-2">{pkg.name}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pkg.description}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-base font-extrabold text-gray-950">₹{formatPrice(pkg.price)}</span>
                  </div>
                </div>
                <div className="mt-2 pl-7 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedPackageId(isExpanded ? null : pkg.id);
                    }}
                    className="text-[11px] font-bold text-gray-600 hover:text-black underline flex items-center gap-1 cursor-pointer"
                  >
                    {isExpanded ? "See Less" : "See More"}
                  </button>
                </div>
                {isExpanded && (
                  <div className="mt-3 pl-7 pt-3 border-t border-gray-100 text-xs text-gray-600 leading-relaxed animate-fadeIn">
                    {pkg.fullDetails || pkg.description}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 text-center">
            <p className="text-xs font-bold text-gray-700">No fixed packages published yet</p>
            <p className="text-[11px] text-gray-500 mt-1">This creator accepts customized deliverables. Propose your budget and requirements below.</p>
          </div>
        )}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition">
          <button
            type="button"
            onClick={() => setNegotiateOpen((o) => !o)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/70 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <MessageCircle size={18} className="text-gray-600" />
              <div>
                <p className="font-bold text-sm text-gray-950">{packages.length === 0 ? "Propose a Custom Offer" : "Negotiate a Package"}</p>
                <p className="text-xs text-gray-500">Tailor a collaboration to your needs: propose custom terms, pricing, or requirements.</p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
              {negotiateOpen ? <ChevronUp size={16} /> : <Plus size={16} />}
            </div>
          </button>

          {negotiateOpen && (
            <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50/50 space-y-3 animate-fadeIn">
              <div className="grid sm:grid-cols-2 gap-3 pt-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Proposed Budget (₹)</label>
                  <input
                    type="number"
                    value={negotiateOffer}
                    onChange={(e) => setNegotiateOffer(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Deliverables Required</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Reels + 3 Product Photos"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Custom Requirements / Message</label>
                <textarea
                  rows={2}
                  value={negotiateNotes}
                  onChange={(e) => setNegotiateNotes(e.target.value)}
                  placeholder="Describe your brand's campaign goals, timelines, and special requirements..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <button
                type="button"
                onClick={onSubmitProposal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
              >
                Submit Custom Proposal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
