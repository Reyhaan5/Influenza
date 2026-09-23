import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, X, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";
import { API_URL } from "../../../config/api";

export default function LeaveReviewModal({
  isOpen,
  onClose,
  collaboration,
  onReviewSubmitted,
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const creatorName =
    collaboration?.influencerProfile?.displayName ||
    collaboration?.influencer?.name ||
    "Creator";

  useEffect(() => {
    if (isOpen && collaboration?._id) {
      fetchExistingReview();
    }
  }, [isOpen, collaboration?._id]);

  const fetchExistingReview = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/brand/reviews/${collaboration._id}`,
        authHeader
      );
      if (res.data?.review) {
        setExistingReview(res.data.review);
        setRating(res.data.review.rating);
        setComment(res.data.review.comment || "");
      } else {
        setExistingReview(null);
        setRating(5);
        setComment("");
      }
    } catch (err) {
      console.error("Error loading existing review:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${API_URL}/brand/reviews`,
        {
          collaborationId: collaboration._id,
          rating,
          comment,
        },
        authHeader
      );

      if (onReviewSubmitted) {
        onReviewSubmitted(res.data.review);
      }
      onClose();
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !collaboration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Star size={20} className="fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {existingReview ? "Update Review" : "Rate & Review Creator"}
            </h3>
            <p className="text-xs text-gray-500">
              Collaboration with <span className="font-semibold text-gray-800">{creatorName}</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading details...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center py-4 bg-gray-50 rounded-2xl border border-gray-100">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Overall Experience Rating
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={`${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <span className="inline-block mt-2 text-sm font-bold text-gray-800">
                {rating === 5 && "⭐⭐⭐⭐⭐ Outstanding / Exceeded Expectations"}
                {rating === 4 && "⭐⭐⭐⭐ Great / Very Professional"}
                {rating === 3 && "⭐⭐⭐ Good / Met Requirements"}
                {rating === 2 && "⭐⭐ Fair / Minor Issues"}
                {rating === 1 && "⭐ Poor / Did Not Meet Standards"}
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Feedback & Review Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share how the creator performed on content quality, adherence to brief, communication, and timeliness..."
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none text-sm text-gray-800 resize-none transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                {submitting ? "Saving..." : existingReview ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}