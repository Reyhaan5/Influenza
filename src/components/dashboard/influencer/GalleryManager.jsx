import React, { useEffect, useState } from "react";
import { Upload, Trash2, Star } from "lucide-react";
import api, { API_ORIGIN } from "../../../config/api";

const PLATFORMS = ["Instagram"];
const MAX_HIGHLIGHTED = 10;

function GalleryItemCard({ item, toggling, onToggleHighlight, onDelete }) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl bg-[var(--color-background)]">
      {item.mediaType === "video" ? (
        <video src={`${API_ORIGIN}${item.mediaUrl}`} className="h-full w-full object-cover" muted />
      ) : (
        <img src={`${API_ORIGIN}${item.mediaUrl}`} alt={item.caption} className="h-full w-full object-cover" />
      )}
      <button
        onClick={() => onToggleHighlight(item)}
        disabled={toggling}
        className={`absolute top-1.5 left-1.5 flex h-7 w-7 items-center justify-center rounded-full transition ${item.highlighted ? "bg-[var(--color-warning)] text-white" : "bg-black/50 text-white opacity-0 group-hover:opacity-100"}`}
        aria-label="Highlight"
      >
        <Star size={13} className={item.highlighted ? "fill-white" : ""} />
      </button>
      <button
        onClick={() => onDelete(item._id)}
        className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
        aria-label="Remove"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [uploading, setUploading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    api.get("/influencer/gallery").then((res) => setItems(res.data.items || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const highlightedCount = items.filter((i) => i.highlighted).length;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("media", file);
      formData.append("caption", caption);
      formData.append("platform", platform);
      const res = await api.post("/influencer/gallery", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setItems((prev) => [res.data.item, ...prev]);
      setFile(null);
      setCaption("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload content.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this from your public gallery?")) return;
    try {
      await api.delete(`/influencer/gallery/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert("Failed to remove item.");
    }
  };

  const handleToggleHighlight = async (item) => {
    if (!item.highlighted && highlightedCount >= MAX_HIGHLIGHTED) return alert(`You can highlight up to ${MAX_HIGHLIGHTED} items.`);
    setTogglingId(item._id);
    try {
      const res = await api.patch(`/influencer/gallery/${item._id}/highlight`, {});
      setItems((prev) => prev.map((i) => (i._id === item._id ? res.data.item : i)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update item.");
    } finally {
      setTogglingId(null);
    }
  };

  const sortedItems = [...items].sort((a, b) => (a.highlighted !== b.highlighted ? (a.highlighted ? -1 : 1) : new Date(b.createdAt) - new Date(a.createdAt)));

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)]">
        <h3 className="font-bold text-[var(--color-text)]">Highlighted content ({highlightedCount} of {MAX_HIGHLIGHTED})</h3>
        <p className="mt-1 text-sm text-[var(--color-text-light)]">
          Pick your best content and get accepted to more campaigns. Brands see highlighted content first.
        </p>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)]">
        <h3 className="font-bold text-[var(--color-text)] mb-1">Upload videos or photos to your portfolio</h3>
        <p className="text-xs text-[var(--color-text-light)] mb-5">Showcase your previous collaborations with brands.</p>
        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3">
          <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files[0])} className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm" />
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm">
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (optional)" className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm" />
          <button type="submit" disabled={!file || uploading} className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold px-5 py-2.5 transition disabled:opacity-60 cursor-pointer">
            <Upload size={14} /> {uploading ? "Uploading..." : "Upload file"}
          </button>
        </form>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)]">
        <h3 className="font-bold text-[var(--color-text)] mb-5">Your portfolio</h3>
        {loading ? (
          <p className="text-sm text-[var(--color-text-light)]">Loading your gallery...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-14">
            <p className="font-semibold text-[var(--color-text)]">No content found</p>
            <p className="text-sm text-[var(--color-text-light)] mt-1">You haven't uploaded any portfolio items yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {sortedItems.map((item) => (
              <GalleryItemCard key={item._id} item={item} toggling={togglingId === item._id} onToggleHighlight={handleToggleHighlight} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}