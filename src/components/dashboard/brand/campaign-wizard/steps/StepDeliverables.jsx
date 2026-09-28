import React from "react";
import { Plus } from "lucide-react";
import DeliverableCard from "./DeliverableCard";

export default function StepDeliverables({
  deliverables = [], handleDeliverableChange, handleAddDeliverable,
  handleDeleteDeliverable, handleDuplicateDeliverable, handleFormatText
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-extrabold text-gray-950">Deliverables</h3>
        <p className="text-xs text-gray-500 mt-1">Add a separate asset for every creative that you want creators to deliver.</p>
      </div>

      {deliverables.map((deliv, idx) => (
        <DeliverableCard
          key={idx} deliv={deliv} idx={idx} handleDeliverableChange={handleDeliverableChange}
          handleDeleteDeliverable={handleDeleteDeliverable} handleDuplicateDeliverable={handleDuplicateDeliverable}
          handleFormatText={handleFormatText}
        />
      ))}

      <button type="button" onClick={handleAddDeliverable} className="w-full py-3.5 px-4 rounded-2xl border border-gray-200 hover:border-fuchsia-400 bg-white hover:bg-fuchsia-50/30 text-xs font-bold text-gray-800 transition flex items-center justify-center gap-2 shadow-sm cursor-pointer">
        <Plus size={16} className="text-fuchsia-600" /> Add Deliverable
      </button>
    </div>
  );
}
