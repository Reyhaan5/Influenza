import React, { useEffect, useState } from "react";
import axios from "axios";
import { Upload, Trash2, Star } from "lucide-react";
import { API_URL, API_ORIGIN } from "../../../config/api";

const PLATFORMS = ["Instagram", "YouTube", "Twitter"];
const MAX_HIGHLIGHTED = 10;

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [uploading, setUploading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/influencer/gallery`, authHeader());
      setItems(res.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
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

      const res = await axios.post(`${API_URL}/influencer/gallery`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setItems((prev) => [res.data.item, ...prev]);
      setFile(null);
      setCaption("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to upload content.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Remove this from your public gallery?");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/influencer/gallery/${id}`, authHeader());
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item.");
    }
  };

  const handleToggleHighlight = async (item) => {
    if (!item.highlighted && highlightedCount >= MAX_HIGHLIGHTED) {
      alert(`You can highlight up to ${MAX_HIGHLIGHTED} items.`);
      return;
    }

    setTogglingId(item._id);
    try {
      const res = await axios.patch(
        `${API_URL}/influencer/gallery/${item._id}/highlight`,
        {},
        authHeader()
      );
      setItems((prev) => prev.map((i) => (i._id === item._id ? res.data.item : i)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update item.");
    } finally {
      setTogglingId(null);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (a.highlighted !== b.highlighted) return a.highlighted ? -1 : 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)]">
        <h3 className="font-bold text-[var(--color-text)]">
          Highlighted content ({highlightedCount} of {MAX_HIGHLIGHTED})
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-light)]">
          Pick your best content and get accepted to more campaigns. Upload content below and tap the
          star icon to highlight the best of it. Brands see highlighted content first. We recommend a
          minimum of 5 highlighted items.
        </p>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)]">
        <h3 className="font-bold text-[var(--color-text)] mb-1">Upload videos or photos to your portfolio</h3>
        <p className="text-xs text-[var(--color-text-light)] mb-5">
          We suggest selecting content that showcases your previous collaborations with brands.
        </p>

        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm"
          />

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm"
          />

          <button
            type="submit"
            disabled={!file || uploading}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold px-5 py-2.5 transition disabled:opacity-60"
          >
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
            <p className="text-sm text-[var(--color-text-light)] mt-1">
              You haven't uploaded any portfolio items yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {sortedItems.map((item) => (
              <div
                key={item._id}
                className="group relative aspect-square overflow-hidden rounded-xl bg-[var(--color-background)]"
              >
                {item.mediaType === "video" ? (
                  <video src={`${API_ORIGIN}${item.mediaUrl}`} className="h-full w-full object-cover" muted />
                ) : (
                  <img
                    src={`${API_ORIGIN}${item.mediaUrl}`}
                    alt={item.caption}
                    className="h-full w-full object-cover"
                  />
                )}

                <button
                  onClick={() => handleToggleHighlight(item)}
                  disabled={togglingId === item._id}
                  className={`absolute top-1.5 left-1.5 flex h-7 w-7 items-center justify-center rounded-full transition ${
                    item.highlighted
                      ? "bg-[var(--color-warning)] text-white"
                      : "bg-black/50 text-white opacity-0 group-hover:opacity-100"
                  }`}
                  aria-label={item.highlighted ? "Remove highlight" : "Highlight"}
                  title={item.highlighted ? "Remove highlight" : "Highlight this content"}
                >
                  <Star size={13} className={item.highlighted ? "fill-white" : ""} />
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Remove"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}