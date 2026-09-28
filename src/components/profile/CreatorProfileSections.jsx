import React from "react";
import { Star, MapPin, Plus, Play, Image as ImageIcon, HelpCircle, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import Avatar from "../dashboard/influencer/Avatar";

const formatPrice = (price) => Number(price || 0).toLocaleString("en-IN");

export function CoverShowcase({ covers, portfolio, creator, setLightboxMedia, setShowAllPhotos }) {
  return (
    <div className="relative rounded-3xl overflow-hidden mb-8 bg-gray-900 border border-gray-200">
      {covers.length > 0 ? (
        <div className={`grid gap-1 h-72 sm:h-96 w-full ${covers.length === 1 ? "grid-cols-1" : covers.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {covers.slice(0, 3).map((photo, idx) => (
            <div key={idx} className="relative h-full w-full overflow-hidden bg-gray-900 group">
              <img src={photo} alt={`Cover ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      ) : portfolio.length > 0 ? (
        <div className={`grid gap-2 h-72 sm:h-96 ${portfolio.length === 1 ? "grid-cols-1" : portfolio.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
          {portfolio.slice(0, 3).map((item, idx) => (
            <div key={idx} className="relative h-full w-full overflow-hidden cursor-pointer group bg-gray-900" onClick={() => setLightboxMedia(item)}>
              {item.mediaType === "video" || item.mediaUrl?.endsWith(".mp4") ? (
                <video src={item.mediaUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" muted playsInline />
              ) : (
                <img src={item.mediaUrl} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              )}
              {item.mediaType === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play size={18} className="fill-black text-black ml-0.5" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="h-72 sm:h-96 w-full flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 text-gray-400 text-sm font-bold">
          <span>{creator.displayName}'s Creator Profile</span>
        </div>
      )}

      {portfolio.length > 0 && (
        <button type="button" onClick={() => setShowAllPhotos(true)} className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md hover:bg-white text-xs font-bold text-gray-900 shadow-md transition cursor-pointer">
          <ImageIcon size={14} />
          Show All Content ({portfolio.length})
        </button>
      )}
    </div>
  );
}

export function CreatorIdentity({ creator, reviews, stats, setReviewsOpen, reviewsRef }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar name={creator.displayName} avatarUrl={creator.avatar} size={58} />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-gray-950">{creator.displayName}</h2>
            {creator.verified && <ShieldCheck size={18} className="text-[#3B82F6]" />}
            <button onClick={() => { setReviewsOpen(true); reviewsRef.current?.scrollIntoView({ behavior: "smooth" }); }} className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-black ml-2 cursor-pointer">
              <Star size={13} className="fill-[#F59E0B] text-[#F59E0B]" />
              <span>{reviews.length > 0 && stats.rating > 0 ? stats.rating.toFixed(1) : "New"}</span>
              <span className="underline font-semibold text-gray-500">({reviews.length})</span>
            </button>
          </div>
          {creator.locality && (
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <MapPin size={12} className="text-gray-400" />
              {creator.locality}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {creator.socialAccounts?.length > 0 ? (
          creator.socialAccounts.map((acc, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
              <span className="capitalize">{acc.platform}</span>: <span className="font-bold text-gray-900">{acc.followers?.toLocaleString() || "0"}</span> Followers
            </span>
          ))
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">Verified Creator</span>
        )}
      </div>

      {creator.categories?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {creator.categories.map((cat) => (
            <span key={cat} className="px-2.5 py-1 rounded-lg bg-pink-50 text-[#FA2B56] text-[11px] font-bold border border-pink-100">{cat}</span>
          ))}
        </div>
      )}

      {creator.bio && <p className="text-sm text-gray-700 leading-relaxed pt-2">{creator.bio}</p>}
      {creator.passions && (
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs text-gray-600">
          <span className="font-bold text-gray-900">Passions & Style: </span>{creator.passions}
        </div>
      )}
    </div>
  );
}

export function AnalyticsSection({ creator, stats }) {
  return (
    <div>
      <h2 className="text-lg font-extrabold text-gray-950 mb-3">Analytics</h2>
      {creator.socialAccounts?.length > 0 ? (
        <div className="grid sm:grid-cols-3 gap-3">
          {creator.socialAccounts.map((acc, i) => (
            <div key={i} className="p-4 bg-white border border-gray-200 rounded-2xl">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{acc.platform}</p>
              <p className="text-xl font-extrabold text-gray-950 mt-1">{acc.followers?.toLocaleString() || "0"}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Followers</p>
            </div>
          ))}
          {stats.responseTimeHours && (
            <div className="p-4 bg-white border border-gray-200 rounded-2xl">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Response</p>
              <p className="text-xl font-extrabold text-gray-950 mt-1">{stats.responseTimeHours}h</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Response Time</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-2xl p-4 text-center text-xs text-gray-500 font-medium">{creator.displayName} is verified for UGC direct collaboration.</div>
      )}
    </div>
  );
}

export function PortfolioPreview({ portfolio, setShowAllPhotos, setLightboxMedia }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-gray-950">Portfolio</h2>
        {portfolio.length > 0 && <button onClick={() => setShowAllPhotos(true)} className="text-xs font-bold text-gray-500 hover:text-black underline cursor-pointer">View All ({portfolio.length})</button>}
      </div>
      {portfolio.length === 0 ? (
        <div className="text-center py-12 bg-white border border-dashed border-gray-200 rounded-2xl text-xs text-gray-500">No public portfolio items uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {portfolio.slice(0, 6).map((item) => (
            <div key={item.id} onClick={() => setLightboxMedia(item)} className="relative aspect-[9/16] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 cursor-pointer group shadow-sm">
              <img src={item.mediaUrl} alt={item.caption || "Portfolio"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.style.display = "none"; }} />
              {item.mediaType === "video" && (
                <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                  <Play size={14} className="fill-white ml-0.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReviewsAccordion({ reviewsRef, reviewsOpen, setReviewsOpen, reviews, stats }) {
  return (
    <div ref={reviewsRef} className="rounded-3xl border border-gray-200 bg-white overflow-hidden">
      <button type="button" onClick={() => setReviewsOpen((o) => !o)} className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50/60 transition cursor-pointer">
        <div className="flex items-center gap-1.5 text-lg font-extrabold text-gray-950">
          <Star size={18} className="fill-[#F59E0B] text-[#F59E0B]" />
          <span>Reviews</span>
          <span className="text-sm font-semibold text-gray-400">({reviews.length})</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-600">{reviews.length > 0 && stats.rating > 0 ? `${stats.rating.toFixed(1)} / 5.0` : "No reviews yet"}</span>
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">{reviewsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
        </div>
      </button>

      {reviewsOpen && (
        <div className="p-5 pt-0 border-t border-gray-100 space-y-4 animate-fadeIn">
          {reviews.length === 0 ? (
            <div className="text-center py-10">
              <Star size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-800">No brand reviews yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {reviews.map((rev) => (
                <div key={rev.id} className="py-4 first:pt-2 last:pb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Avatar name={rev.brandName} size={30} />
                      <div>
                        <p className="text-xs font-bold text-gray-900">{rev.brandName}</p>
                        <p className="text-[10px] text-gray-400">{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Verified Brand"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} className={s <= rev.rating ? "fill-[#F59E0B] text-[#F59E0B]" : "text-gray-200"} />)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed pl-9">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CheckoutSidebar({ packages, selectedPackage, selectedPackageId, setSelectedPackageId, setShowInviteModal, setNegotiateOpen }) {
  return (
    <div className="lg:col-span-4 sticky top-28 space-y-4">
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        {packages.length > 0 && selectedPackage ? (
          <>
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-3xl font-extrabold text-gray-950">₹{formatPrice(selectedPackage.price)}</span>
              <span className="text-xs font-semibold text-gray-400">INR</span>
            </div>
            <div className="mb-4">
              <select value={selectedPackageId} onChange={(e) => setSelectedPackageId(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-black cursor-pointer">
                {packages.map((pkg) => <option key={pkg.id} value={pkg.id}>{pkg.name} (₹{formatPrice(pkg.price)})</option>)}
              </select>
            </div>
            {selectedPackage.description && <p className="text-xs text-gray-500 leading-relaxed mb-6">{selectedPackage.description}</p>}
          </>
        ) : (
          <div className="mb-5">
            <h3 className="text-base font-extrabold text-gray-950">Direct Collaboration</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">This creator accepts direct campaign proposals and customized deliverables.</p>
          </div>
        )}

        <button type="button" onClick={() => setShowInviteModal(true)} className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-md transition active:scale-98 cursor-pointer">
          <Plus size={16} />
          {packages.length > 0 ? "Add to Cart / Invite" : "Invite to Campaign"}
        </button>
        <div className="text-center my-3 text-xs text-gray-400 font-medium">or</div>
        <button type="button" onClick={() => setNegotiateOpen(true)} className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold text-xs transition cursor-pointer">
          {packages.length > 0 ? "Negotiate a Package" : "Propose Custom Offer"}
        </button>
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-semibold cursor-pointer hover:text-black">
          <HelpCircle size={13} />
          <span>How does it work?</span>
        </div>
      </div>
    </div>
  );
}
