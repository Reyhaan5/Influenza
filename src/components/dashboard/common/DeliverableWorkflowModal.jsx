import React, { useState, useEffect } from "react";
import {
  X, CheckCircle2, AlertCircle, Send, ExternalLink,
  FileVideo, Sparkles, RefreshCw, Eye
} from "lucide-react";
import api from "../../../config/api";

const STAGES_STEPPER = [
  { key: "draft", label: "1. Draft", icon: FileVideo, stages: ["content_creation", "review", "posting", "completed"], cls: "bg-purple-50 text-purple-900 border-purple-200" },
  { key: "review", label: "2. Review", icon: Eye, stages: ["review", "posting", "completed"], cls: "bg-amber-50 text-amber-900 border-amber-200" },
  { key: "posting", label: "3. Live Post", icon: Send, stages: ["posting", "completed"], cls: "bg-sky-50 text-sky-900 border-sky-200" },
  { key: "completed", label: "4. Complete", icon: CheckCircle2, stages: ["completed"], cls: "bg-emerald-50 text-emerald-900 border-emerald-200" },
];

const STATUS_BADGES = {
  approved: "bg-emerald-100 text-emerald-800",
  revision_requested: "bg-red-100 text-red-800",
  submitted: "bg-amber-100 text-amber-800",
};

function WorkflowStepper({ stage }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Workflow Stages</h4>
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {STAGES_STEPPER.map(({ key, label, icon: Icon, stages, cls }) => (
          <div key={key} className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${stages.includes(stage) ? `${cls} font-bold` : "bg-white text-gray-400 border-gray-100"}`}>
            <Icon size={16} /><span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandReviewPanel({ submission, submitting, onReview, showRevision, setShowRevision, feedback, setFeedback }) {
  const isDraft = submission.type === "draft";
  return (
    <div className="bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle size={18} className="text-amber-600" />
          <h4 className="font-bold text-amber-950 text-sm">Action Required: Review {isDraft ? "Draft Preview" : "Live Post"}</h4>
        </div>
        <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md">Submitted just now</span>
      </div>

      <div className="bg-white rounded-xl p-4 border border-amber-200/60 text-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Platform & Type:</span>
          <span className="font-bold text-gray-900">{submission.platform} · {isDraft ? "Draft Preview" : "Live Post URL"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Content URL:</span>
          <a href={submission.contentUrl || submission.postUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold hover:underline">
            Open Link <ExternalLink size={14} />
          </a>
        </div>
        {submission.caption && (
          <div>
            <span className="block font-semibold text-gray-700 text-xs mt-2">Proposed Caption:</span>
            <p className="bg-gray-50 p-2.5 rounded-lg text-gray-800 text-xs mt-1 border border-gray-100 whitespace-pre-wrap">{submission.caption}</p>
          </div>
        )}
        {submission.notes && (
          <div>
            <span className="block font-semibold text-gray-700 text-xs mt-2">Creator Note:</span>
            <p className="text-gray-600 text-xs italic mt-0.5">"{submission.notes}"</p>
          </div>
        )}
      </div>

      {!showRevision ? (
        <div className="flex items-center gap-3 pt-1">
          <button type="button" onClick={() => onReview(submission._id, "approve")} disabled={submitting} className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
            <CheckCircle2 size={16} /> Approve {isDraft ? "Draft" : "Live Post"}
          </button>
          <button type="button" onClick={() => setShowRevision(true)} className="py-2.5 px-4 rounded-xl bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer">
            <RefreshCw size={14} /> Request Changes
          </button>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-3">
          <label className="block text-xs font-bold text-gray-800">Specify Revisions / Changes Needed:</label>
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="e.g. Please add the brand tag @brand_name and highlight the free delivery offer..." rows={3} className="w-full p-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-black resize-none" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowRevision(false)} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800 font-semibold cursor-pointer">Cancel</button>
            <button type="button" onClick={() => onReview(submission._id, "request_revision", feedback)} disabled={submitting || !feedback.trim()} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-50 cursor-pointer">Send Revision Request</button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfluencerSubmissionForm({ stage, latestSubmission, type, setType, platform, setPlatform, contentUrl, setContentUrl, postUrl, setPostUrl, caption, setCaption, notes, setNotes, submitting, onSubmit }) {
  const isDraft = type === "draft";
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/80 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-gray-900 text-sm">{stage === "posting" ? "Step 3: Submit Live Post Link" : "Submit Deliverable / Draft Preview"}</h4>
        <div className="flex bg-gray-200/80 p-0.5 rounded-lg text-xs font-semibold">
          {["draft", "live_post"].map((t) => (
            <button key={t} type="button" onClick={() => setType(t)} className={`px-3 py-1 rounded-md transition-all cursor-pointer ${type === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
              {t === "draft" ? "Draft Preview" : "Live Post URL"}
            </button>
          ))}
        </div>
      </div>

      {latestSubmission?.status === "revision_requested" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">
          <strong className="block font-bold">Brand requested changes on previous draft:</strong>
          <p className="mt-1 italic">"{latestSubmission.feedback}"</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Platform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:ring-2 focus:ring-black">
              {["Instagram", "YouTube", "TikTok", "Twitter", "Other"].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">{isDraft ? "Preview Link (Drive / Video)" : "Live Public URL"} *</label>
            <input
              type="url"
              required
              value={isDraft ? contentUrl : postUrl}
              onChange={(e) => isDraft ? setContentUrl(e.target.value) : setPostUrl(e.target.value)}
              placeholder={isDraft ? "https://drive.google.com/file/... or unlisted YouTube link" : "https://www.instagram.com/reel/..."}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Proposed Caption & Hashtags</label>
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Enter the caption and hashtags you will use with the post..." rows={2} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:ring-2 focus:ring-black resize-none" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Notes to Brand (optional)</label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Created 2 hooks, let me know which one you prefer!" className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:ring-2 focus:ring-black" />
        </div>

        <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm cursor-pointer">
          <Send size={16} /><span>{submitting ? "Submitting..." : isDraft ? "Submit Draft for Brand Approval" : "Submit Live Post Proof"}</span>
        </button>
      </form>
    </div>
  );
}

function DeliverablesHistoryList({ deliverables, loading }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Submission History ({deliverables.length})</h4>
      {loading ? (
        <div className="py-6 text-center text-xs text-gray-400">Loading history...</div>
      ) : deliverables.length === 0 ? (
        <div className="py-6 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">No deliverables submitted yet.</div>
      ) : (
        <div className="space-y-3">
          {deliverables.map((item) => (
            <div key={item._id} className="p-4 rounded-2xl border border-gray-200/80 bg-white text-xs space-y-2 hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 capitalize">{item.type.replace("_", " ")} ({item.platform})</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500">{new Date(item.submittedAt || item.createdAt).toLocaleDateString()}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${STATUS_BADGES[item.status] || "bg-amber-100 text-amber-800"}`}>
                  {item.status.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a href={item.contentUrl || item.postUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 hover:underline">
                  {item.contentUrl || item.postUrl} <ExternalLink size={12} />
                </a>
              </div>
              {item.caption && <p className="text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100"><strong className="text-gray-700">Caption:</strong> {item.caption}</p>}
              {item.feedback && (
                <div className="bg-amber-50/80 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                  <strong className="block font-bold">Brand Feedback:</strong><p className="mt-0.5">{item.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DeliverableWorkflowModal({
  isOpen, onClose, collaboration, role = "brand", onUpdated, onOpenReviewModal
}) {
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionType, setSubmissionType] = useState("draft");
  const [platform, setPlatform] = useState("Instagram");
  const [contentUrl, setContentUrl] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [notes, setNotes] = useState("");
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState("");

  const isBrand = role === "brand";
  const creatorName = collaboration?.influencerProfile?.displayName || collaboration?.influencer?.name || "Creator";
  const brandName = collaboration?.brandEntity?.name || collaboration?.opportunity?.brandEntity?.name || collaboration?.brand?.company || collaboration?.brand?.name || "Brand";

  useEffect(() => {
    if (isOpen && collaboration?._id) fetchDeliverables();
  }, [isOpen, collaboration?._id]);

  const fetchDeliverables = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/collaborations/${collaboration._id}/deliverables`);
      setDeliverables(res.data?.deliverables || []);
    } catch (err) {
      console.error("Error fetching deliverables:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInfluencerSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { type: submissionType, platform, contentUrl, postUrl, caption, notes };
      const res = await api.post(`/collaborations/${collaboration._id}/deliverables`, payload);
      setContentUrl(""); setPostUrl(""); setCaption(""); setNotes("");
      await fetchDeliverables();
      if (onUpdated && res.data?.collaboration) onUpdated(res.data.collaboration);
    } catch (err) {
      console.error("Error submitting deliverable:", err);
      alert(err.response?.data?.message || "Failed to submit deliverable.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBrandReview = async (deliverableId, action, feedbackText) => {
    setSubmitting(true);
    try {
      const res = await api.patch(`/collaborations/${collaboration._id}/deliverables/${deliverableId}/review`, { action, feedback: feedbackText || "" });
      setShowRevisionForm(false);
      setRevisionFeedback("");
      await fetchDeliverables();
      if (onUpdated && res.data?.collaboration) onUpdated(res.data.collaboration);
    } catch (err) {
      console.error("Error reviewing deliverable:", err);
      alert(err.response?.data?.message || "Failed to review deliverable.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !collaboration) return null;

  const latestSubmission = deliverables[0] || null;
  const currentStage = collaboration.stage || "content_creation";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider bg-gray-100 text-gray-700">
                {collaboration.format} collaboration
              </span>
              <span className="text-xs text-gray-400">
                Stage: <strong className="text-gray-800 capitalize">{currentStage.replace(/_/g, " ")}</strong>
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-1">Deliverables & Proof of Work</h3>
            <p className="text-xs text-gray-500">{isBrand ? `Collaborating with ${creatorName}` : `Campaign for ${brandName}`}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
          <WorkflowStepper stage={currentStage} />

          {isBrand && latestSubmission?.status === "submitted" && (
            <BrandReviewPanel
              submission={latestSubmission}
              submitting={submitting}
              onReview={handleBrandReview}
              showRevision={showRevisionForm}
              setShowRevision={setShowRevisionForm}
              feedback={revisionFeedback}
              setFeedback={setRevisionFeedback}
            />
          )}

          {isBrand && currentStage === "completed" && onOpenReviewModal && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">Collaboration Completed!</h4>
                <p className="text-xs text-emerald-700">Leave a star rating & feedback for {creatorName}.</p>
              </div>
              <button type="button" onClick={onOpenReviewModal} className="px-4 py-2 bg-black text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-1.5 cursor-pointer">
                <Sparkles size={14} className="text-amber-400" /> Rate & Review
              </button>
            </div>
          )}

          {!isBrand && (
            <InfluencerSubmissionForm
              stage={currentStage}
              latestSubmission={latestSubmission}
              type={submissionType}
              setType={setSubmissionType}
              platform={platform}
              setPlatform={setPlatform}
              contentUrl={contentUrl}
              setContentUrl={setContentUrl}
              postUrl={postUrl}
              setPostUrl={setPostUrl}
              caption={caption}
              setCaption={setCaption}
              notes={notes}
              setNotes={setNotes}
              submitting={submitting}
              onSubmit={handleInfluencerSubmit}
            />
          )}

          <DeliverablesHistoryList deliverables={deliverables} loading={loading} />
        </div>

        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-xs text-gray-700 transition-colors cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}