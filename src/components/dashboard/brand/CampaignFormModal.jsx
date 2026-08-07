import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const FORMATS = ["money", "barter", "product"];

const emptyForm = {
  title: "",
  description: "",
  format: "money",
  rewardValue: "",
  deliverablesRequired: 1,
  requirements: "",
  deadline: "",
};

export default function CampaignFormModal({ campaign, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (campaign) {
      setForm({
        title: campaign.title || "",
        description: campaign.description || "",
        format: campaign.format || "money",
        rewardValue: campaign.rewardValue || "",
        deliverablesRequired: campaign.deliverablesRequired || 1,
        requirements: campaign.requirements || "",
        deadline: campaign.deadline ? campaign.deadline.slice(0, 10) : "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [campaign]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-text)]/40 px-4">
      <div className="w-full max-w-lg bg-[var(--color-surface)] rounded-2xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-text)]/50 hover:text-[var(--color-text)]"
        >
          <X size={18} />
        </button>

        <h3 className="font-bold text-lg text-[var(--color-text)] mb-4">
          {campaign ? "Edit Campaign" : "Create Campaign"}
        </h3>

        <div className="flex flex-col gap-3">
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Summer Collection Launch"
              className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm bg-[var(--color-background)]"
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="What is this campaign about?"
              className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm bg-[var(--color-background)] resize-none"
            />
          </Field>

          <Field label="Format">
            <select
              value={form.format}
              onChange={(e) => handleChange("format", e.target.value)}
              className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm bg-[var(--color-background)]"
            >
              {FORMATS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </Field>

          <Field label="Reward Value">
            <input
              value={form.rewardValue}
              onChange={(e) => handleChange("rewardValue", e.target.value)}
              placeholder="$500 or Product worth $200"
              className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm bg-[var(--color-background)]"
            />
          </Field>

          <Field label="Deliverables Required">
            <input
              type="number"
              min="1"
              value={form.deliverablesRequired}
              onChange={(e) => handleChange("deliverablesRequired", Number(e.target.value))}
              className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm bg-[var(--color-background)]"
            />
          </Field>

          <Field label="Requirements">
            <textarea
              rows={2}
              value={form.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              placeholder="Niche, follower minimum, etc."
              className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm bg-[var(--color-background)] resize-none"
            />
          </Field>

          <Field label="Deadline">
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => handleChange("deadline", e.target.value)}
              className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm bg-[var(--color-background)]"
            />
          </Field>

          <button
            onClick={() => onSubmit(form)}
            disabled={saving || !form.title}
            className="mt-2 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : campaign ? "Update Campaign" : "Create Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}