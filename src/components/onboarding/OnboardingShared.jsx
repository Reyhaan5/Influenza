import React from "react";
import {
  Camera, Plus, Trash2, X, Check, Upload, Image as ImageIcon,
  ChevronDown, ChevronUp, Wallet, Building, CreditCard, ShieldCheck,
} from "lucide-react";
import Avatar from "../dashboard/influencer/Avatar";
import { CONTENT_TYPES } from "../../constants/creatorMeta";

const DURATION_UNITS = ["Minutes", "Seconds", "Photos"];

export const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const TagBadge = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200">
    {label}
    {onRemove && <button type="button" onClick={onRemove} className="hover:text-red-500 ml-0.5"><X size={12} /></button>}
  </span>
);

export const FormField = ({ label, required, children, className = "" }) => (
  <div className={className}>
    {label && (
      <label className="text-[11px] font-bold text-gray-700 block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    {children}
  </div>
);

export const FormInput = ({ label, required, error, clearError, value, onChange, placeholder, type = "text", className = "", icon: Icon, ...props }) => (
  <FormField label={label} required={required} className={className}>
    <div className="relative">
      <input
        type={type}
        value={value ?? ""}
        onFocus={clearError}
        onChange={(e) => { onChange(e.target.value); clearError?.(); }}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black transition ${Icon ? "pl-8" : ""} ${
          error ? "border-2 border-red-500 ring-4 ring-red-100 bg-red-50/10" : "border-gray-200 bg-white"
        }`}
        {...props}
      />
      {Icon && <Icon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
    </div>
  </FormField>
);

export const FormSelect = ({ label, required, error, clearError, value, onChange, options = [], className = "", placeholder = "Select..." }) => (
  <FormField label={label} required={required} className={className}>
    <select
      value={value ?? ""}
      onFocus={clearError}
      onChange={(e) => { onChange(e.target.value); clearError?.(); }}
      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black ${
        error ? "border-2 border-red-500 ring-4 ring-red-100 bg-red-50/10" : "border-gray-200"
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </FormField>
);

export const InstagramConnectCard = ({ connectedInstagram, onRemove, onConnect, error }) => (
  <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-sm">
    <h2 className="text-xl font-extrabold text-gray-950">One-click profile set up</h2>
    <p className="text-xs sm:text-sm text-gray-500 mt-1">Add your social profiles to get started — we'll automatically verify and sync your live metrics.</p>
    <div className="mt-6">
      <p className="text-xs font-bold text-gray-700 mb-3">Add your social profiles ({connectedInstagram ? "1 added" : "0 added"} *required)</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {connectedInstagram ? (
          <div className="relative border-2 border-emerald-600 bg-emerald-50/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
            <button type="button" onClick={onRemove} className="absolute top-2 right-2 text-gray-400 hover:text-red-500" title="Remove Instagram"><X size={14} /></button>
            <Avatar name={connectedInstagram.handle} avatarUrl={connectedInstagram.avatar} size={46} />
            <div className="flex items-center gap-1 mt-2 text-[11px] font-bold text-gray-700">
              <InstagramIcon size={12} className="text-pink-600" />
              <span>{connectedInstagram.followers?.toLocaleString() || 0}</span>
            </div>
            <p className="text-xs font-bold text-gray-900 mt-1 truncate max-w-[110px]">{connectedInstagram.handle}</p>
          </div>
        ) : (
          <button type="button" onClick={onConnect}
            className={`rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-gray-50 transition border ${
              error ? "border-2 border-red-500 ring-4 ring-red-100 bg-red-50/20" : "border-dashed border-gray-300 hover:border-black"
            }`}>
            <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center"><InstagramIcon size={20} /></div>
            <span className="text-xs font-bold text-gray-800">Connect Instagram</span>
          </button>
        )}
      </div>
    </div>
  </div>
);

export const CoverPhotoGallery = ({ coverPhotos = [], coverInputRef, handleCoverUpload, handleDeleteCoverPhoto, clearErrorField, isError }) => (
  <div onClick={() => clearErrorField("cover")}
    className={`relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden bg-gray-100 border transition ${
      isError ? "border-2 border-red-500 ring-4 ring-red-100" : "border-gray-200"
    }`}>
    {coverPhotos.length === 0 ? (
      <div onClick={() => { clearErrorField("cover"); coverInputRef.current?.click(); }}
        className="w-full h-full flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-gray-50 transition">
        <Camera size={24} className="mx-auto text-gray-400 mb-1" />
        <p className="text-xs font-bold text-gray-800">Add Cover Photos (Up to 3)</p>
        <p className="text-[10px] text-gray-400 mt-0.5">700x700 photos to showcase your creator aesthetic *required</p>
        <button type="button" className="mt-2.5 px-3.5 py-1.5 rounded-xl bg-black hover:bg-gray-800 text-white text-[11px] font-bold shadow-sm">Upload Cover Photo</button>
      </div>
    ) : (
      <div className="flex w-full h-full p-1 gap-1">
        <div className={`grid gap-1 h-full ${coverPhotos.length < 3 ? "w-3/4" : "w-full"} grid-cols-${coverPhotos.length === 1 ? "1" : coverPhotos.length === 2 ? "2" : "3"}`}>
          {coverPhotos.map((photo, idx) => (
            <div key={idx} className="relative h-full w-full rounded-lg overflow-hidden group bg-gray-900">
              <img src={photo} alt={`Cover ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {idx === 0 && <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow">Cover 1/3 (Main)</span>}
              <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteCoverPhoto(idx); }}
                className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition shadow">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
        {coverPhotos.length < 3 && (
          <div onClick={(e) => { e.stopPropagation(); clearErrorField("cover"); coverInputRef.current?.click(); }}
            className="w-1/4 h-full flex flex-col items-center justify-center p-2 text-center border-l border-dashed border-gray-300 hover:border-black bg-gray-50/80 hover:bg-gray-100 cursor-pointer transition select-none">
            <Plus size={18} className="text-gray-600 mb-1" />
            <span className="text-[10px] font-bold text-gray-800 leading-tight">{coverPhotos.length === 1 ? "+ Add 2nd Photo" : "Add 3rd Photo"}</span>
            <span className="text-[9px] text-gray-400 mt-0.5">700x700 px</span>
          </div>
        )}
      </div>
    )}
    <input type="file" ref={coverInputRef} onChange={handleCoverUpload} multiple accept="image/*" className="hidden" />
  </div>
);

export const PortfolioSection = ({ items = [], uploading, inputRef, onUpload, onDelete, clearError, error }) => (
  <div className={`bg-white border rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 transition ${
    error ? "border-2 border-red-500 ring-4 ring-red-100" : "border-gray-200/90"
  }`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-base font-extrabold text-gray-950 flex items-center gap-2">Portfolio (Highlighted Content) <span className="text-red-500">*</span></h3>
        <p className="text-xs text-gray-500 mt-0.5">Add up to 12 videos or photos. Brands book creators with engaging portfolio samples.</p>
      </div>
      <button type="button" onClick={() => { clearError(); inputRef.current?.click(); }} disabled={uploading}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold shadow-sm transition disabled:opacity-50">
        <Upload size={13} /> {uploading ? "Uploading..." : "Upload Media"}
      </button>
      <input type="file" ref={inputRef} onChange={(e) => { onUpload(e); clearError(); }} multiple accept="video/*,image/*" className="hidden" />
    </div>

    {items.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
        {items.map((item, idx) => (
          <div key={item._id || item.id || idx} className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 shadow-sm">
            {item.mediaType === "video" || item.mediaUrl?.endsWith(".mp4") ? (
              <video src={item.mediaUrl} className="w-full h-full object-cover" muted playsInline />
            ) : (
              <img src={item.mediaUrl} alt="Portfolio" className="w-full h-full object-cover" />
            )}
            <button type="button" onClick={() => onDelete(item._id || item.id)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    ) : (
      <div onClick={() => inputRef.current?.click()} className="border-2 border-dashed border-gray-200 hover:border-black rounded-3xl p-8 text-center cursor-pointer transition bg-gray-50/50">
        <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="text-xs font-bold text-gray-800">Upload portfolio videos and photos</p>
        <p className="text-[11px] text-gray-500 mt-0.5">MP4, MOV, JPG, PNG up to 100MB</p>
      </div>
    )}
  </div>
);

export const ChecklistRow = ({ label, ok }) => (
  <div className="flex items-center justify-between text-xs font-bold">
    <span className="text-gray-800">{label}</span>
    {ok ? <span className="text-emerald-600 flex items-center gap-1"><Check size={14} strokeWidth={3} /> Ready</span> : <span className="text-amber-500">Pending</span>}
  </div>
);

// --- STEP 2 MICRO-COMPONENTS ---
export const PackageAccordionCard = ({ pkg, onToggle, onUpdate, onRemove, onSave }) => (
  <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-sm transition">
    <div onClick={onToggle} className="flex items-center justify-between cursor-pointer select-none">
      <h3 className="text-base font-extrabold text-gray-950">{pkg.title || `Instagram ${pkg.contentType}`}</h3>
      <button type="button" className="text-gray-500 hover:text-gray-900 p-1" aria-label="Toggle package details">
        {pkg.expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
    </div>

    {pkg.expanded && (
      <div className="mt-6 space-y-5 border-t border-gray-100 pt-5 animate-fadeIn">
        <div className="grid grid-cols-12 gap-3 sm:gap-4">
          <div className="col-span-8 sm:col-span-9">
            <FormField label="Content type">
              <select value={pkg.contentType} onChange={(e) => onUpdate("contentType", e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white">
                {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
          </div>
          <div className="col-span-4 sm:col-span-3">
            <FormField label="Number">
              <input type="number" min="1" value={pkg.count || 1} onChange={(e) => onUpdate("count", Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white" />
            </FormField>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 sm:gap-4">
          <div className="col-span-6">
            <FormField label="Duration (optional)">
              <input type="number" min="1" value={pkg.duration || ""} onChange={(e) => onUpdate("duration", Number(e.target.value))} placeholder="3"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white" />
            </FormField>
          </div>
          <div className="col-span-6">
            <FormField label="&nbsp;">
              <select value={pkg.durationUnit || "Minutes"} onChange={(e) => onUpdate("durationUnit", e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white">
                {DURATION_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </FormField>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700">Price</label>
            <span className="text-xs font-bold text-blue-600">Similar creators charge ${pkg.suggestedPrice || 70} for this.</span>
          </div>
          <div className="relative rounded-2xl border border-gray-200 focus-within:ring-1 focus-within:ring-black bg-white overflow-hidden">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">$</span>
            <input type="number" min="5" value={pkg.price || ""} onChange={(e) => onUpdate("price", Number(e.target.value))} placeholder="52"
              className="w-full pl-9 pr-4 py-3 text-sm font-bold text-gray-900 focus:outline-none bg-transparent" />
          </div>
        </div>

        <FormField label="Description (optional)">
          <textarea rows={3} value={pkg.description || ""} onChange={(e) => onUpdate("description", e.target.value)} placeholder="Tell brands what is included in this package"
            className="w-full p-3.5 rounded-2xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-white" />
        </FormField>

        <div className="flex items-center justify-between pt-3">
          <button type="button" onClick={onRemove} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 transition"><Trash2 size={14} /> Remove</button>
          <button type="button" onClick={onSave} className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition">Save Package</button>
        </div>
      </div>
    )}
  </div>
);

// --- STEP 3 MICRO-COMPONENTS ---
export const PayoutSection = ({ payoutInfo = {}, setPayoutInfo, onSave, saving }) => {
  const update = (f, v) => setPayoutInfo({ ...payoutInfo, [f]: v });
  const methods = [
    { id: "bank", label: "Bank Transfer", icon: Building },
    { id: "upi", label: "UPI (India)", icon: CreditCard },
    { id: "paypal", label: "PayPal", icon: Wallet },
    { id: "stripe", label: "Stripe", icon: CreditCard },
  ];

  return (
    <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
      <h3 className="text-base font-extrabold text-gray-950 flex items-center gap-2"><Wallet size={18} className="text-emerald-600" /> Payout Method</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {methods.map((m) => {
          const Icon = m.icon;
          const isSelected = payoutInfo.method === m.id;
          return (
            <button key={m.id} type="button" onClick={() => update("method", m.id)}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition font-bold text-xs ${
                isSelected ? "border-black bg-black text-white shadow-sm" : "border-gray-200 bg-gray-50/60 text-gray-700 hover:bg-gray-100"
              }`}>
              <Icon size={16} />{m.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4 pt-2">
        {payoutInfo.method === "bank" && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormInput label="Account Holder Name" value={payoutInfo.accountHolderName} onChange={(v) => update("accountHolderName", v)} placeholder="Full legal name" />
              <FormInput label="Bank Name" value={payoutInfo.bankName} onChange={(v) => update("bankName", v)} placeholder="e.g. Chase / HDFC Bank" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormInput label="Account Number / IBAN" value={payoutInfo.accountNumber} onChange={(v) => update("accountNumber", v)} placeholder="XXXXXXXXXXXX" />
              <FormInput label="IFSC / Routing / SWIFT" value={payoutInfo.ifscOrRouting} onChange={(v) => update("ifscOrRouting", v)} placeholder="e.g. HDFC0001234" />
            </div>
          </>
        )}
        {payoutInfo.method === "upi" && (
          <div className="space-y-4">
            <FormInput label="UPI ID (VPA)" value={payoutInfo.upiId} onChange={(v) => update("upiId", v)} placeholder="yourname@okaxis / yourhandle@upi" />
            <FormInput label="Account Holder Name" value={payoutInfo.accountHolderName} onChange={(v) => update("accountHolderName", v)} placeholder="Name on UPI account" />
          </div>
        )}
        {(payoutInfo.method === "paypal" || payoutInfo.method === "stripe") && (
          <FormInput label={payoutInfo.method === "paypal" ? "PayPal Email Address" : "Stripe Connected Email"} type="email" value={payoutInfo.paypalEmail} onChange={(v) => update("paypalEmail", v)} placeholder="payouts@domain.com" />
        )}
        <div className="flex justify-end pt-2">
          <button type="button" onClick={onSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition">
            Save Payout Details
          </button>
        </div>
      </div>
    </div>
  );
};

export const DiscoveryPreviewCard = ({ name, user, avatarUrl, title, locationStr, startingPrice }) => (
  <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50 flex items-center gap-4">
    <Avatar name={name || "Creator"} avatarUrl={avatarUrl} size={54} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <h4 className="font-extrabold text-sm text-gray-950 truncate">{name || user?.name || "Creator Name"}</h4>
        <ShieldCheck size={14} className="text-blue-500 fill-blue-500 text-white" />
      </div>
      <p className="text-xs text-gray-500 font-medium truncate">{title}</p>
      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-600">
        <span className="font-bold">{locationStr}</span><span>•</span><span className="font-bold text-emerald-600">Starting at ${startingPrice}</span>
      </div>
    </div>
  </div>
);
