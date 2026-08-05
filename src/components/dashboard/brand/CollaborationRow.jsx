import React from "react";

const STAGES = ["in_progress", "completed"];
const PAYMENTS = ["pending", "paid"];

export default function CollaborationRow({ collab, onUpdate }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)] flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <p className="font-bold text-[var(--color-text)]">
          {collab.influencer?.name || "Unknown creator"}
        </p>
        <p className="text-xs text-[var(--color-text-light)]">
          {collab.opportunity?.title || "No linked campaign"} · {collab.format}
        </p>
        <p className="text-xs text-[var(--color-text-light)] mt-1">
          Deliverables: {collab.deliverablesCompleted}/{collab.deliverablesTotal}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={collab.stage}
          onChange={(e) => onUpdate(collab._id, { stage: e.target.value })}
          className="text-xs font-semibold border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 bg-[var(--color-background)]"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>

        <select
          value={collab.paymentStatus}
          onChange={(e) => onUpdate(collab._id, { paymentStatus: e.target.value })}
          className="text-xs font-semibold border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 bg-[var(--color-background)]"
        >
          {PAYMENTS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
    </div>
  );
}