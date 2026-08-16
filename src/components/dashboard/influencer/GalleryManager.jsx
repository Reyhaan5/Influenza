import React, { useEffect, useState } from "react";
import axios from "axios";
import { Upload, Trash2 } from "lucide-react";
import { API_URL, API_ORIGIN } from "../../../config/api";

const PLATFORMS = ["Instagram", "YouTube", "Twitter"];

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [uploading, setUploading] = useState(false);

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

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-bold text-[var(--color-text)] mb-1">My Gallery</h3>
      <p className="text-xs text-[var(--color-text-light)] mb-5">
        Content you add here shows up on the public Content Gallery — visible to brands without them needing to log in.
      </p>

      <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3 mb-6">
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
          <Upload size={14} /> {uploading ? "Uploading..." : "Add"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-[var(--color-text-light)]">Loading your gallery...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-[var(--color-text-light)]">
          Nothing here yet — add a photo or video from a recent post to start building your public gallery.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="group relative aspect-square overflow-hidden rounded-xl bg-[var(--color-background)]"
            >
              {item.mediaType === "video" ? (
                <video
                  src={`${API_ORIGIN}${item.mediaUrl}`}
                  className="h-full w-full object-cover"
                  muted
                />
              ) : (
                <img
                  src={`${API_ORIGIN}${item.mediaUrl}`}
                  alt={item.caption}
                  className="h-full w-full object-cover"
                />
              )}

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
  );
}
