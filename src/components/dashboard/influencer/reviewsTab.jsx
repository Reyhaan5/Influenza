import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, MessageSquareText } from "lucide-react";
import { API_URL } from "../../../config/api";
import Avatar from "./Avatar";

function StarRow({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={
            n <= rating
              ? "fill-[var(--color-warning)] text-[var(--color-warning)]"
              : "text-[var(--color-border)]"
          }
        />
      ))}
    </div>
  );
}

export default function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ count: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/influencer/reviews`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setReviews(res.data.reviews || []);
        setSummary(res.data.summary || { count: 0, avgRating: 0 });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-[var(--color-text-light)]">Loading reviews...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] flex items-center gap-6">
        <div className="text-center flex-shrink-0">
          <p className="text-4xl font-extrabold text-[var(--color-text)]">
            {summary.avgRating > 0 ? summary.avgRating : "—"}
          </p>
          <StarRow rating={Math.round(summary.avgRating)} size={16} />
        </div>
        <div className="w-px h-12 bg-[var(--color-border)]" />
        <div>
          <p className="font-bold text-[var(--color-text)]">{summary.count}</p>
          <p className="text-sm text-[var(--color-text-light)]">
            {summary.count === 1 ? "review" : "reviews"} from brands you've collaborated with
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-2xl">
          <MessageSquareText className="mx-auto mb-3 text-[var(--color-text-light)]" size={28} />
          <p className="text-[var(--color-text-light)]">
            No reviews yet — brands can review you after a completed collaboration.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)] flex gap-4"
            >
              <Avatar name={r.brand?.name || "Brand"} size={44} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-[var(--color-text)]">{r.brand?.name || "Brand"}</p>
                  <StarRow rating={r.rating} />
                </div>
                <p className="text-xs text-[var(--color-text-light)] mt-0.5">
                  {r.collaboration?.format ? `${r.collaboration.format} collaboration · ` : ""}
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
                {r.comment && (
                  <p className="mt-2.5 text-sm text-[var(--color-text)] leading-relaxed">{r.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}