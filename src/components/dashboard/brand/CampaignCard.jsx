import React from "react";
import { Pencil, Trash2, Calendar, Target } from "lucide-react";

export default function CampaignCard({ campaign, onEdit, onDelete, onToggleStatus }) {
  const isOpen = campaign.status === "open";

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)] flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-[var(--color-text)]">{campaign.title}</h4>
          <span
            className={`inline-flex mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isOpen
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                : "bg-[var(--color-text-light)]/10 text-[var(--color-text-light)]"
            }`}
          >
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onEdit(campaign)}
            className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
            aria-label="Edit campaign"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(campaign._id)}
            className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
            aria-label="Delete campaign"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {campaign.description && (
        <p className="text-sm text-[var(--color-text-light)] line-clamp-2">
          {campaign.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-light)]">
        <span className="flex items-center gap-1 bg-[var(--color-background)] px-2.5 py-1 rounded-full">
          <Target size={12} /> {campaign.format} · {campaign.rewardValue || "—"}
        </span>
        {campaign.deadline && (
          <span className="flex items-center gap-1 bg-[var(--color-background)] px-2.5 py-1 rounded-full">
            <Calendar size={12} /> {new Date(campaign.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      <button
        onClick={() => onToggleStatus(campaign)}
        className="self-start text-xs font-semibold text-[var(--color-primary-hover)] hover:underline mt-1"
      >
        Mark as {isOpen ? "Closed" : "Open"}
      </button>
    </div>
  );
}