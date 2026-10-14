import React from "react";
import { Film, Camera, Info, Trash2, Copy, UploadCloud, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Link2 } from "lucide-react";
import { FORMAT_OPTIONS, PRIMARY_CONTENT_TYPES, EXTRA_CONTENT_TYPES } from "./wizardConstants";

export default function DeliverableCard({
  deliv, idx, handleDeliverableChange, handleDeleteDeliverable,
  handleDuplicateDeliverable, handleFormatText
}) {
  const isVideo = deliv.mediaType !== "Photo";

  return (
    <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-sm space-y-6 relative">
      {/* 1. Media type */}
      <div>
        <label className="block text-xs font-bold text-gray-900 mb-1">Media type</label>
        <p className="text-xs text-gray-500 mb-2">Select the type of creative asset you want for this campaign.</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { type: "Video", Icon: Film, label: "Video" },
            { type: "Photo", Icon: Camera, label: "Photo" },
          ].map(({ type, Icon, label }) => (
            <button key={type} type="button" onClick={() => handleDeliverableChange(idx, "mediaType", type)} className={`py-3 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${deliv.mediaType === type ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950" : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Posting to social media */}
      <div>
        <label className="block text-xs font-bold text-gray-900 mb-1">Posting to social media</label>
        <p className="text-xs text-gray-500 mb-2">Specify if the content requested should be posted by Creators on their channels.</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { val: "Posting", label: "Posting to social channels" },
            { val: "Only raw / licensed content", label: "Only raw / licensed content" },
          ].map(({ val, label }) => (
            <button key={val} type="button" onClick={() => handleDeliverableChange(idx, "postingType", val)} className={`py-3 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${deliv.postingType === val ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950" : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"}`}>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Platform, Format, Aspect Ratio (if Posting) */}
      {deliv.postingType === "Posting" && (
        <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-5 animate-fadeIn">
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1">Platform</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {["Instagram", "TikTok", "YouTube", "Facebook"].map((platform) => (
                <button key={platform} type="button" onClick={() => handleDeliverableChange(idx, "platform", platform)} className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${deliv.platform === platform ? "border-fuchsia-600 bg-fuchsia-50 ring-1 ring-fuchsia-600 text-gray-950" : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"}`}>
                  {platform}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1">Format</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(FORMAT_OPTIONS[deliv.platform || "Instagram"] || ["Reel", "Post", "Story"]).map((fmt) => (
                <button key={fmt} type="button" onClick={() => handleDeliverableChange(idx, "format", fmt)} className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${deliv.format === fmt ? "border-fuchsia-600 bg-fuchsia-50 ring-1 ring-fuchsia-600 text-gray-950" : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"}`}>
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1">Aspect ratio</label>
            <div className="grid grid-cols-3 gap-2.5">
              {["9:16 (Vertical)", "1:1 (Square)", "16:9 (Landscape)"].map((ratio) => (
                <button key={ratio} type="button" onClick={() => handleDeliverableChange(idx, "aspectRatio", ratio)} className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${deliv.aspectRatio === ratio ? "border-fuchsia-600 bg-fuchsia-50 ring-1 ring-fuchsia-600 text-gray-950" : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"}`}>
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video length and details */}
      {isVideo && (
        <>
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1">Video length</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input type="number" min="5" value={deliv.videoMinLength || 15} onChange={(e) => handleDeliverableChange(idx, "videoMinLength", Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-center pr-9 bg-white" />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-gray-400">sec</span>
              </div>
              <span className="text-gray-400 font-bold">—</span>
              <div className="relative flex-1">
                <input type="number" min="10" value={deliv.videoMaxLength || 60} onChange={(e) => handleDeliverableChange(idx, "videoMaxLength", Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-center pr-9 bg-white" />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-gray-400">sec</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1">Raw / Ready to use</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {["Raw footage", "Ready to use Ad", "Ready to use Ad + Raw footage"].map((option) => (
                <button key={option} type="button" onClick={() => handleDeliverableChange(idx, "rawOrReady", option)} className={`p-3 rounded-2xl border text-[11px] font-bold transition flex items-center justify-center gap-1 text-center cursor-pointer ${deliv.rawOrReady === option ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950" : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"}`}>
                  <span>{option}</span><Info size={12} className="text-gray-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {deliv.rawOrReady && (
            <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">Content type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRIMARY_CONTENT_TYPES.map((ct) => (
                    <div key={ct} onClick={() => handleDeliverableChange(idx, "contentType", ct)} className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs font-medium ${deliv.contentType === ct ? "border-fuchsia-600 bg-fuchsia-50/40 ring-1 ring-fuchsia-600 font-bold text-gray-950" : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"}`}>
                      <span>{ct}</span><Info size={13} className="text-gray-400" />
                    </div>
                  ))}
                  {deliv.showExtraContentTypes && EXTRA_CONTENT_TYPES.map((ct) => (
                    <div key={ct} onClick={() => handleDeliverableChange(idx, "contentType", ct)} className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs font-medium ${deliv.contentType === ct ? "border-fuchsia-600 bg-fuchsia-50/40 ring-1 ring-fuchsia-600 font-bold text-gray-950" : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"}`}>
                      <span>{ct}</span><Info size={13} className="text-gray-400" />
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => handleDeliverableChange(idx, "showExtraContentTypes", !deliv.showExtraContentTypes)} className="mt-3 text-xs font-bold text-fuchsia-700 hover:underline cursor-pointer">
                  {deliv.showExtraContentTypes ? "See less options" : "See 6 more options"}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1.5">Step-by-step guide for the creator</label>
                <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-fuchsia-500 bg-white">
                  <textarea rows={6} value={deliv.creatorGuide || ""} onChange={(e) => handleDeliverableChange(idx, "creatorGuide", e.target.value)} placeholder="Provide instructions, scenes, or key talking points..." className="w-full p-3.5 text-xs text-gray-900 font-mono focus:outline-none resize-none leading-relaxed" />
                  <div className="bg-gray-50 border-t border-gray-200 px-3 py-2 flex items-center gap-1.5 text-gray-600">
                    {[
                      { action: "left", Icon: AlignLeft }, { action: "center", Icon: AlignCenter }, { action: "right", Icon: AlignRight },
                      { action: "bold", Icon: Bold }, { action: "italic", Icon: Italic }, { action: "underline", Icon: Underline },
                      { action: "strike", Icon: Strikethrough }, { action: "ul", Icon: List }, { action: "ol", Icon: ListOrdered }, { action: "link", Icon: Link2 }
                    ].map(({ action, Icon }) => (
                      <button key={action} type="button" onClick={() => handleFormatText(idx, action)} className="p-1 rounded hover:bg-gray-200 cursor-pointer">
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">Music requirement</label>
                <div className="grid grid-cols-2 gap-3">
                  {["No music", "Music required"].map((m) => (
                    <button key={m} type="button" onClick={() => handleDeliverableChange(idx, "musicRequirement", m)} className={`py-3 px-4 rounded-2xl border text-xs font-bold transition text-center cursor-pointer ${deliv.musicRequirement === m ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950" : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-900">What should creators avoid? <span className="text-[11px] text-gray-400 font-normal">(optional)</span></label>
                <input type="text" value={deliv.whatShouldAvoid || ""} onChange={(e) => handleDeliverableChange(idx, "whatShouldAvoid", e.target.value)} className="w-full mt-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-900">References <span className="text-[11px] text-gray-400 font-normal">(optional)</span></label>
                <div className="mt-1 border-2 border-dashed border-gray-300 hover:border-fuchsia-500 rounded-2xl p-6 text-center cursor-pointer bg-white transition flex flex-col items-center justify-center gap-1.5">
                  <UploadCloud size={24} className="text-gray-400" />
                  <p className="text-xs text-gray-600 font-medium">Drag and drop file here or <span className="text-fuchsia-600 underline">choose file</span></p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Action Bar */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => handleDeleteDeliverable(idx)} className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 transition cursor-pointer" title="Delete deliverable">
            <Trash2 size={16} />
          </button>
          <button type="button" onClick={() => handleDuplicateDeliverable(idx)} className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition cursor-pointer" title="Duplicate deliverable">
            <Copy size={16} />
          </button>
        </div>
        <button type="button" onClick={() => alert(`Deliverable asset #${idx + 1} saved!`)} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer">
          Save
        </button>
      </div>
    </div>
  );
}
