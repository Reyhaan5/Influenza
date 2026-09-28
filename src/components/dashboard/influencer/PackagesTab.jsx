import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Save, CheckCircle2, Sparkles, Layers, ArrowRight } from "lucide-react";
import api from "../../../config/api";

const CONTENT_TYPES = [
  "Reel", "Story", "Post", "Carousel", "Video Ad", "Testimonial Video", "Product Showcase", "Full Dedicated Reel",
];

function PackageItemRow({ pkg, pkgId, onUpdate, onDelete }) {
  return (
    <div className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-all space-y-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase">Deliverable</label>
            <select
              value={pkg.contentType || "Reel"}
              onChange={(e) => onUpdate(pkgId, "contentType", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
            >
              {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase">Quantity</label>
            <input
              type="number"
              min="1"
              max="10"
              value={pkg.count || 1}
              onChange={(e) => onUpdate(pkgId, "count", Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase">Price ($ USD)</label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2 text-xs text-gray-400 font-bold">$</span>
              <input
                type="number"
                min="1"
                value={pkg.price || 0}
                onChange={(e) => onUpdate(pkgId, "price", Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-emerald-700 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        </div>
        <button type="button" onClick={() => onDelete(pkgId)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition cursor-pointer" title="Delete package">
          <Trash2 size={16} />
        </button>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-500 uppercase">Scope &amp; Deliverable Description</label>
        <textarea
          rows={2}
          value={pkg.description || ""}
          onChange={(e) => onUpdate(pkgId, "description", e.target.value)}
          placeholder="What's included? (e.g. concept ideation, video hook, product unboxing, raw b-roll)"
          className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>
    </div>
  );
}

export default function PackagesTab({ profile, onUpdated }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/influencer/rate-cards").catch(() => ({ data: {} })),
      api.get("/influencer/profile").catch(() => ({ data: {} })),
    ]).then(([r, p]) => {
      setPackages(r.data?.packages?.length ? r.data.packages : p.data?.packages || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleUpdate = (id, field, val) => {
    setPackages((prev) => prev.map((p, idx) => {
      if ((p.id || p._id || `pkg-${idx}`) !== id) return p;
      const up = { ...p, [field]: val };
      if (field === "contentType") up.title = `${up.count || 1}x ${val}`;
      return up;
    }));
  };

  const handleAdd = () => {
    setPackages((prev) => [
      ...prev,
      {
        id: `pkg-${Date.now()}`,
        title: "1x Instagram Reel",
        contentType: "Reel",
        count: 1,
        duration: 30,
        durationUnit: "Seconds",
        price: 75,
        description: "High-converting UGC video formatted in 9:16 vertical view for maximum engagement.",
      },
    ]);
  };

  const handleDelete = (id) => setPackages((prev) => prev.filter((p, idx) => (p.id || p._id || `pkg-${idx}`) !== id));

  const handleSave = async () => {
    setSaving(true);
    try {
      const getPrice = (t, d) => packages.find((p) => p.contentType === t)?.price || d;
      await api.post("/influencer/rate-cards", {
        packages,
        rates: { reel: getPrice("Reel", 60), post: getPrice("Post", 50), story: getPrice("Story", 35) },
      });
      const res = await api.put("/influencer/profile", { packages });
      if (onUpdated && res.data) onUpdated(res.data);
      setFeedback("Pricing packages saved successfully!");
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save packages.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-[var(--color-text-light)]">Loading your packages...</p>;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-[1fr_2.5fr] gap-6 items-start">
        <div>
          <h3 className="font-bold text-[var(--color-text)] text-base">Commercial Packages</h3>
          <p className="mt-1 text-xs text-[var(--color-text-light)] leading-relaxed">
            Configure the fixed deliverable packages displayed to brands on your public profile.
          </p>
          <div className="mt-4 p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-2">
            <p className="font-bold flex items-center gap-1.5"><Sparkles size={14} className="text-blue-600" /> Need step-by-step guidance?</p>
            <p className="text-[11px] text-blue-800 leading-relaxed">You can also use the comprehensive Setup Wizard to configure packages, portfolio, and identity all at once.</p>
            <Link to="/creator-onboarding" className="inline-flex items-center gap-1 font-bold text-xs text-blue-700 hover:text-blue-900 underline pt-1">
              Open Setup Wizard <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm text-[var(--color-text)]">Active Packages</h4>
              <p className="text-xs text-[var(--color-text-light)] mt-0.5">Set transparent pricing for your deliverables.</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleAdd} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold transition shadow-sm cursor-pointer">
                <Plus size={14} /> Add Package
              </button>
              <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer">
                <Save size={14} /> {saving ? "Saving..." : "Save Packages"}
              </button>
            </div>
          </div>

          {feedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 size={16} /> {feedback}
            </div>
          )}

          {packages.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <Layers size={32} className="mx-auto text-gray-400 mb-2" />
              <h4 className="text-sm font-bold text-gray-900">No packages created yet</h4>
              <p className="text-xs text-gray-500 mt-0.5 max-w-sm mx-auto">Add deliverables to display on your creator profile.</p>
              <button type="button" onClick={handleAdd} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold shadow-sm cursor-pointer">
                <Plus size={14} /> Create First Package
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg, idx) => (
                <PackageItemRow key={pkg.id || pkg._id || `pkg-${idx}`} pkg={pkg} pkgId={pkg.id || pkg._id || `pkg-${idx}`} onUpdate={handleUpdate} onDelete={handleDelete} />
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-[var(--color-border)]">
            <button type="button" onClick={handleSave} disabled={saving} className="bg-black hover:bg-black/80 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition disabled:opacity-50 cursor-pointer">
              {saving ? "Saving..." : "Save Packages"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
