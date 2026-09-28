import React from "react";
import { Link } from "react-router-dom";
import { X, Check, LogIn, AlertCircle } from "lucide-react";
import Avatar from "../dashboard/influencer/Avatar";

const actionClass = "inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer";
const cancelClass = "px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition";

export default function InviteCreatorModal({ isOpen, onClose, creator, selectedPackage, brandCampaigns = [], selectedCampaignId, setSelectedCampaignId, inviteMessage, setInviteMessage, sendingInvite, inviteSuccess, onSubmit, user, profileId }) {
  if (!isOpen) return null;

  const creatorName = creator?.displayName || creator?.handle;
  const selectedText = selectedPackage
    ? `Selected: ${selectedPackage.name} (₹${Number(selectedPackage.price || 0).toLocaleString("en-IN")})`
    : "Direct Collaboration / Custom Brief";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-fadeIn">
        <button type="button" onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-black transition">
          <X size={20} />
        </button>
        <div className="flex items-center gap-3 mb-5">
          <Avatar name={creatorName} size={44} />
          <div>
            <h3 className="font-extrabold text-gray-950 text-base">Invite {creatorName}</h3>
            <p className="text-xs text-gray-500 font-medium">{selectedText}</p>
          </div>
        </div>
        {inviteSuccess ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Check size={24} />
            </div>
            <h4 className="font-bold text-gray-900 text-base">Collaboration Request Sent!</h4>
            <p className="text-xs text-gray-500 mt-1">{creator?.displayName || "The creator"} has been notified and you can track updates in your Brand Dashboard.</p>
          </div>
        ) : !user ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#FA2B56] flex items-center justify-center mx-auto">
              <LogIn size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Account Required</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Please log in or register a Brand account to invite {creator?.displayName || "creators"} to your campaigns.</p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button type="button" onClick={onClose} className={cancelClass}>
                Cancel
              </button>
              <Link to={`/login?redirect=/creators/${profileId}`} className={actionClass}>
                Log In to Continue
              </Link>
            </div>
          </div>
        ) : user.role === "influencer" ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Creator Account Active</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">You are logged in as an Influencer/Creator. Campaign hiring invitations are sent from Brand accounts. To connect with @{creator?.handle || "this creator"}, you can chat directly via Messages.</p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button type="button" onClick={onClose} className={cancelClass}>
                Close
              </button>
              <Link to={`/messages?with=${creator?.id || creator?.profileId || profileId}`} className={actionClass}>
                Send Direct Message
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {brandCampaigns.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Link with Campaign (Optional)</label>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                >
                  <option value="">Direct Collaboration (No specific campaign)</option>
                  {brandCampaigns.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Message / Brief</label>
              <textarea
                rows={4}
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder={`Hi ${creator?.displayName || "there"}, we loved your content style and would like to collaborate on our upcoming project...`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-black resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button type="button" onClick={onClose} className={cancelClass}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={sendingInvite}
                className={`${actionClass} disabled:opacity-50`}
              >
                {sendingInvite ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
