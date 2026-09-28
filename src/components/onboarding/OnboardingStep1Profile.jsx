import React from "react";
import { Plus, Sparkles, MapPin } from "lucide-react";
import Avatar from "../dashboard/influencer/Avatar";
import { GENDERS, ETHNICITIES } from "../../constants/creatorMeta";
import {
  TagBadge, FormField, FormInput, FormSelect,
  CoverPhotoGallery, InstagramConnectCard, PortfolioSection,
} from "./OnboardingShared";

export default function OnboardingStep1Profile(p) {
  const { errorFields = {}, clearErrorField = () => {} } = p;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Instagram Setup Card */}
      <InstagramConnectCard
        connectedInstagram={p.connectedInstagram}
        onRemove={p.handleRemoveInstagram}
        onConnect={() => { clearErrorField("instagram"); p.setShowInstagramModal(true); }}
        error={errorFields.instagram}
      />

      {/* 2. Main 2-Column Profile Builder */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column Profile Card */}
        <div className="lg:col-span-5 bg-white border border-gray-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <CoverPhotoGallery
            coverPhotos={p.coverPhotos}
            coverInputRef={p.coverInputRef}
            handleCoverUpload={p.handleCoverUpload}
            handleDeleteCoverPhoto={p.handleDeleteCoverPhoto}
            clearErrorField={clearErrorField}
            isError={Boolean(errorFields.cover)}
          />

          {/* Avatar + Basic Inputs */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <div
                className={`relative group rounded-full transition cursor-pointer flex-shrink-0 ${errorFields.avatar ? "ring-4 ring-red-500" : ""}`}
                onClick={() => { clearErrorField("avatar"); p.avatarInputRef.current?.click(); }}
              >
                <Avatar name={p.name || "Creator"} avatarUrl={p.avatarUrl} size={60} />
                <div className="absolute inset-0 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-[10px] font-bold">Change</div>
                <input type="file" ref={p.avatarInputRef} onChange={(e) => { p.handleAvatarUpload(e); clearErrorField("avatar"); }} accept="image/*" className="hidden" />
              </div>
              <FormInput label="Creator Name" required value={p.name} onChange={p.setName} clearError={() => clearErrorField("name")} error={errorFields.name} placeholder="Your full name" className="flex-1 min-w-0" />
            </div>

            <FormInput label="Title / Headline" required value={p.title} onChange={p.setTitle} clearError={() => clearErrorField("title")} error={errorFields.title} placeholder="e.g. Lifestyle & UGC Creator" />
            <FormInput label="Location" required value={p.locationStr} onChange={p.setLocationStr} clearError={() => clearErrorField("location")} error={errorFields.location} placeholder="City, State, Country" icon={MapPin} />
          </div>

          {/* Description & AI Generator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1">Description <span className="text-red-500">*</span></label>
              <button type="button" onClick={() => { clearErrorField("description"); p.handleGenerateBio(); }} disabled={p.generatingBio} className="text-[11px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition">
                <Sparkles size={13} /> {p.generatingBio ? "Generating..." : "Generate Description"}
              </button>
            </div>
            <textarea
              rows={4}
              value={p.description}
              onFocus={() => clearErrorField("description")}
              onChange={(e) => { p.setDescription(e.target.value); clearErrorField("description"); }}
              placeholder="Tell brands what makes your content authentic, high-converting, and engaging..."
              className={`w-full p-3.5 rounded-2xl border text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-gray-50/50 transition ${
                errorFields.description ? "border-2 border-red-500 ring-4 ring-red-100" : "border-gray-200"
              }`}
            />
          </div>

          {/* Niches */}
          <div className={`space-y-2 rounded-2xl transition ${errorFields.niches ? "border-2 border-red-500 ring-4 ring-red-100 p-3 bg-red-50/10" : ""}`}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">Niches ({p.selectedNiches.length}/10) <span className="text-red-500">*</span></label>
              <button type="button" onClick={() => { clearErrorField("niches"); p.setShowNicheModal(true); }} className="text-xs font-bold text-black hover:underline flex items-center gap-1">
                <Plus size={13} /> Add Niche
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.selectedNiches.map((niche) => (
                <TagBadge key={niche} label={niche} onRemove={() => p.setSelectedNiches(p.selectedNiches.filter((n) => n !== niche))} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Portfolio & Demographics */}
        <div className="lg:col-span-7 space-y-6">
          <PortfolioSection
            items={p.portfolioItems}
            uploading={p.uploadingMedia}
            inputRef={p.portfolioInputRef}
            onUpload={p.handlePortfolioUpload}
            onDelete={p.handleDeletePortfolioItem}
            clearError={() => clearErrorField("portfolio")}
            error={errorFields.portfolio}
          />

          {/* Demographics Card */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            <h3 className="text-base font-extrabold text-gray-950">Get Discovered</h3>
            <p className="text-xs text-gray-500">Provide your details so brands can match their campaign demographic criteria with your profile.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Date of Birth" required type="date" value={p.dob} onChange={p.setDob} />
              <FormSelect label="Gender" required value={p.gender} onChange={p.setGender} options={GENDERS} placeholder="Select Gender" />
              <FormSelect label="Ethnicity" value={p.ethnicity} onChange={p.setEthnicity} options={ETHNICITIES} placeholder="Select Ethnicity" />

              <FormField label="Languages">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {p.languages.map((lang) => <TagBadge key={lang} label={lang} onRemove={() => p.handleRemoveLanguage(lang)} />)}
                </div>
                {p.showAddLang ? (
                  <div className="flex gap-2">
                    <input type="text" value={p.newLanguageInput} onChange={(e) => p.setNewLanguageInput(e.target.value)} placeholder="e.g. Spanish" className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs" />
                    <button type="button" onClick={p.handleAddLanguage} className="px-3 py-1.5 rounded-xl bg-black text-white text-xs font-bold">Add</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => p.setShowAddLang(true)} className="text-xs font-bold text-black hover:underline flex items-center gap-1">
                    <Plus size={13} /> Add language
                  </button>
                )}
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
