import React from "react";
import { Star } from "lucide-react";

export function InstagramIcon({ className = "w-4 h-4 fill-current" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.79-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function StarRow({ rating = 0, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= rating ? "fill-[var(--color-warning)] text-[var(--color-warning)]" : "text-[var(--color-border)]"}
        />
      ))}
    </div>
  );
}

export function SettingsSection({ title, description, children, onSave, saving, saveLabel = "Save" }) {
  return (
    <div className="grid md:grid-cols-[1fr_2.5fr] gap-6 items-start">
      <div>
        <h3 className="font-bold text-gray-900 text-sm tracking-tight">{title}</h3>
        {description && <p className="mt-1 text-xs text-gray-500 leading-relaxed">{description}</p>}
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
        {children}
        {onSave && (
          <div className="flex justify-end pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : saveLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function FormField({ label, type = "text", options = [], placeholder, className = "", ...props }) {
  const baseCls = "w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition";
  return (
    <div className={className}>
      {label && <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>}
      {type === "select" ? (
        <select className={baseCls} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const v = typeof opt === "string" ? opt : opt.value;
            const l = typeof opt === "string" ? opt : opt.label;
            return <option key={v} value={v}>{l}</option>;
          })}
        </select>
      ) : (
        <input type={type} placeholder={placeholder} className={baseCls} {...props} />
      )}
    </div>
  );
}

export function ToggleSwitch({ active, onToggle, label }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${active ? "bg-slate-700" : "bg-slate-300"}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? "translate-x-6" : "translate-x-1"}`} />
      </button>
      {label && <span className="text-sm font-semibold text-[var(--color-text)]">{label}</span>}
    </div>
  );
}
