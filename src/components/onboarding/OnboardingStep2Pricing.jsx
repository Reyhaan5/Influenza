import React from "react";
import { CheckCircle2, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { PackageAccordionCard } from "./OnboardingShared";

export default function OnboardingStep2Pricing({
  packages = [], savedPackageNotice, handleTogglePackageExpand, handleUpdatePackageField,
  handleRemovePackage, handleSaveSinglePackage, handleAddPackage, handleSaveStep2,
  setCurrentStep, saving,
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">Set your pricing</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
          Add content formats you'd like to offer to brands. You can change this at any time. Suggested pricing is competitive and gets 3x more deals.
        </p>
      </div>

      {savedPackageNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 size={15} /> {savedPackageNotice}
        </div>
      )}

      <div className="space-y-4">
        {packages.map((pkg) => (
          <PackageAccordionCard
            key={pkg.id}
            pkg={pkg}
            onToggle={() => handleTogglePackageExpand(pkg.id)}
            onUpdate={(field, val) => handleUpdatePackageField(pkg.id, field, val)}
            onRemove={() => handleRemovePackage(pkg.id)}
            onSave={() => handleSaveSinglePackage(pkg.id)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddPackage}
        className="w-full py-4 rounded-3xl border-2 border-dashed border-gray-300 hover:border-black bg-white hover:bg-gray-50 text-xs font-bold text-gray-800 transition flex items-center justify-center gap-2 shadow-sm"
      >
        <Plus size={16} /> Add another package
      </button>

      <div className="flex items-center justify-between pt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <button
          type="button"
          onClick={handleSaveStep2}
          disabled={saving}
          className="flex items-center gap-1.5 px-8 py-3.5 rounded-2xl bg-black hover:bg-gray-800 text-white text-xs font-bold shadow-md transition"
        >
          {saving ? "Saving Pricing..." : "Proceed to Payment & Go Live"}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
