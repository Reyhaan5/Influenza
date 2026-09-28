import React from "react";
import {
  Film,
  Camera,
  Info,
  MessageSquare,
  UploadCloud,
  Trash2,
  Copy,
  Plus,
  Lightbulb,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link2,
} from "lucide-react";
import {
  FORMAT_OPTIONS,
  PRIMARY_CONTENT_TYPES,
  EXTRA_CONTENT_TYPES,
} from "./wizardConstants";

export default function StepDeliverables({
  deliverables = [],
  handleDeliverableChange,
  handleAddDeliverable,
  handleDeleteDeliverable,
  handleDuplicateDeliverable,
  handleFormatText,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-extrabold text-gray-950">Deliverables</h3>
        <p className="text-xs text-gray-500 mt-1">
          Add a separate asset for every creative that you want creators to deliver.
        </p>
      </div>

      {/* List of Deliverable Cards */}
      {deliverables.map((deliv, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-sm space-y-6 relative"
        >
          {/* 1. Media type */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1">Media type</label>
            <p className="text-xs text-gray-500 mb-2">
              Select the type of creative asset you want for this campaign.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDeliverableChange(idx, "mediaType", "Video")}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  deliv.mediaType === "Video"
                    ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Film size={15} /> Video
              </button>
              <button
                type="button"
                onClick={() => handleDeliverableChange(idx, "mediaType", "Photo")}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  deliv.mediaType === "Photo"
                    ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Camera size={15} /> Photo
              </button>
            </div>
          </div>

          {/* 2. Posting to social media */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1">
              Posting to social media
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Specify if the content requested should be posted by Creators on their channels.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDeliverableChange(idx, "postingType", "Posting")}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  deliv.postingType === "Posting"
                    ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                }`}
              >
                Posting <Info size={13} className="text-gray-400" />
              </button>
              <button
                type="button"
                onClick={() => handleDeliverableChange(idx, "postingType", "No posting")}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  deliv.postingType === "No posting"
                    ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                }`}
              >
                No posting <Info size={13} className="text-gray-400" />
              </button>
            </div>

            <div className="mt-2.5 p-3 rounded-2xl bg-emerald-50/60 border-l-4 border-emerald-500 text-emerald-950 text-[11px] leading-relaxed flex items-start gap-2">
              <MessageSquare size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                To post a campaign (like an affiliate or TikTok shop), at least one creative must
                include a posting. Subsequent creatives can be without posting.
              </span>
            </div>
          </div>

          {/* 3. Brand Tag Input */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="text-xs font-bold text-gray-900">Should the Creator tag your Brand?</label>
              <span className="text-[11px] text-gray-400">(optional)</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-1.5">Add your Brand handle.</p>
            <input
              type="text"
              value={deliv.brandTag || ""}
              onChange={(e) => handleDeliverableChange(idx, "brandTag", e.target.value)}
              placeholder="Example: @brand"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>

          {/* 4. Hashtags Input */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="text-xs font-bold text-gray-900">Should the Creator add any hashtags?</label>
              <span className="text-[11px] text-gray-400">(optional)</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-1.5">
              Write the hashtags that you would like the creator to add.
            </p>
            <input
              type="text"
              value={deliv.hashtags || ""}
              onChange={(e) => handleDeliverableChange(idx, "hashtags", e.target.value)}
              placeholder="Example: #PlanCalm"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>

          {/* Number of Photos (Photo media type only) */}
          {deliv.mediaType === "Photo" && (
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">Number of Photos</label>
              <p className="text-[11px] text-gray-500 mb-2">How many photos should each creator produce for you?</p>
              <div className="flex items-center border border-gray-200 rounded-xl max-w-[140px] bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    handleDeliverableChange(idx, "numberOfPhotos", Math.max(1, (deliv.numberOfPhotos || 1) - 1))
                  }
                  className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                >
                  —
                </button>
                <span className="flex-1 text-center text-xs font-bold text-gray-900">
                  {deliv.numberOfPhotos || 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleDeliverableChange(idx, "numberOfPhotos", (deliv.numberOfPhotos || 1) + 1)
                  }
                  className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* 5. Placement */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1">Placement</label>
            <p className="text-[11px] text-gray-500 mb-2">
              Choose where the content is required to be posted once it is ready.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {["Stories", "Feed", "Reels"].map((pl) => (
                <button
                  key={pl}
                  type="button"
                  onClick={() => handleDeliverableChange(idx, "placement", pl)}
                  className={`py-3 px-3 rounded-2xl border text-xs font-bold transition text-center ${
                    deliv.placement === pl
                      ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {pl}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Format (Dimensions) */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1">Format</label>
            <p className="text-[11px] text-gray-500 mb-2">
              Select the desired dimensions for the image / video content.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FORMAT_OPTIONS.map((fmt) => {
                const isSelected = deliv.format === fmt.id;
                const IconComponent = fmt.icon;
                return (
                  <div
                    key={fmt.id}
                    onClick={() => handleDeliverableChange(idx, "format", fmt.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col items-center justify-center text-center min-h-[85px] ${
                      isSelected
                        ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950 font-bold"
                        : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <IconComponent size={20} className="mb-1 text-gray-700" />
                    <span className="text-xs whitespace-pre-line leading-tight">{fmt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Video Length & Raw Options */}
          {deliv.mediaType === "Video" && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">Video length</label>
                <p className="text-[11px] text-gray-500 mb-2">Select the duration of your creative asset</p>
                <div className="flex items-center gap-3 max-w-xs">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="5"
                      value={deliv.videoMinLength || 15}
                      onChange={(e) =>
                        handleDeliverableChange(idx, "videoMinLength", Number(e.target.value))
                      }
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-center pr-9 bg-white"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-gray-400">
                      sec
                    </span>
                  </div>
                  <span className="text-gray-400 font-bold">—</span>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="10"
                      value={deliv.videoMaxLength || 60}
                      onChange={(e) =>
                        handleDeliverableChange(idx, "videoMaxLength", Number(e.target.value))
                      }
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-center pr-9 bg-white"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-gray-400">
                      sec
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">Raw / Ready to use</label>
                <p className="text-[11px] text-gray-500 mb-2">
                  Let the creators know if you need the final version of the video, raw footage, or both!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {["Raw footage", "Ready to use Ad", "Ready to use Ad + Raw footage"].map((option) => {
                    const isSelected = deliv.rawOrReady === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleDeliverableChange(idx, "rawOrReady", option)}
                        className={`p-3 rounded-2xl border text-[11px] font-bold transition flex items-center justify-center gap-1 text-center ${
                          isSelected
                            ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                            : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span>{option}</span>
                        <Info size={12} className="text-gray-400 flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Type Details */}
              {deliv.rawOrReady && (
                <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1">Content type</label>
                    <p className="text-[11px] text-gray-500 mb-3">
                      Specify what type of video you need for your campaign.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {PRIMARY_CONTENT_TYPES.map((ct) => (
                        <div
                          key={ct}
                          onClick={() => handleDeliverableChange(idx, "contentType", ct)}
                          className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs font-medium ${
                            deliv.contentType === ct
                              ? "border-fuchsia-600 bg-fuchsia-50/40 ring-1 ring-fuchsia-600 font-bold text-gray-950"
                              : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                          }`}
                        >
                          <span>{ct}</span>
                          <Info size={13} className="text-gray-400" />
                        </div>
                      ))}

                      {deliv.showExtraContentTypes &&
                        EXTRA_CONTENT_TYPES.map((ct) => (
                          <div
                            key={ct}
                            onClick={() => handleDeliverableChange(idx, "contentType", ct)}
                            className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs font-medium ${
                              deliv.contentType === ct
                                ? "border-fuchsia-600 bg-fuchsia-50/40 ring-1 ring-fuchsia-600 font-bold text-gray-950"
                                : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                            }`}
                          >
                            <span>{ct}</span>
                            <Info size={13} className="text-gray-400" />
                          </div>
                        ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeliverableChange(
                          idx,
                          "showExtraContentTypes",
                          !deliv.showExtraContentTypes
                        )
                      }
                      className="mt-3 text-xs font-bold text-fuchsia-700 hover:underline"
                    >
                      {deliv.showExtraContentTypes ? "See less options" : "See 6 more options"}
                    </button>
                  </div>

                  {/* Creator Guide */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">
                      Give a step-by-step guide for the creator
                    </label>
                    <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-fuchsia-500 bg-white">
                      <textarea
                        rows={8}
                        value={deliv.creatorGuide || ""}
                        onChange={(e) => handleDeliverableChange(idx, "creatorGuide", e.target.value)}
                        className="w-full p-3.5 text-xs text-gray-900 font-mono focus:outline-none resize-none leading-relaxed"
                      />
                      <div className="bg-gray-50 border-t border-gray-200 px-3 py-2 flex items-center gap-1.5 text-gray-600">
                        <button type="button" onClick={() => handleFormatText(idx, "left")} className="p-1 rounded hover:bg-gray-200"><AlignLeft size={15} /></button>
                        <button type="button" onClick={() => handleFormatText(idx, "center")} className="p-1 rounded hover:bg-gray-200"><AlignCenter size={15} /></button>
                        <button type="button" onClick={() => handleFormatText(idx, "right")} className="p-1 rounded hover:bg-gray-200"><AlignRight size={15} /></button>
                        <div className="h-4 w-[1px] bg-gray-300 mx-1" />
                        <button type="button" onClick={() => handleFormatText(idx, "bold")} className="p-1 rounded hover:bg-gray-200 font-bold"><Bold size={15} /></button>
                        <button type="button" onClick={() => handleFormatText(idx, "italic")} className="p-1 rounded hover:bg-gray-200 italic"><Italic size={15} /></button>
                        <button type="button" onClick={() => handleFormatText(idx, "underline")} className="p-1 rounded hover:bg-gray-200 underline"><Underline size={15} /></button>
                        <button type="button" onClick={() => handleFormatText(idx, "strike")} className="p-1 rounded hover:bg-gray-200 line-through"><Strikethrough size={15} /></button>
                        <div className="h-4 w-[1px] bg-gray-300 mx-1" />
                        <button type="button" onClick={() => handleFormatText(idx, "bullet")} className="p-1 rounded hover:bg-gray-200"><List size={15} /></button>
                        <button type="button" onClick={() => handleFormatText(idx, "numbered")} className="p-1 rounded hover:bg-gray-200"><ListOrdered size={15} /></button>
                        <button type="button" onClick={() => handleFormatText(idx, "link")} className="p-1 rounded hover:bg-gray-200"><Link2 size={15} /></button>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-indigo-700 flex items-center gap-1">
                    <Lightbulb size={13} className="flex-shrink-0" />
                    <span>If your brief needs clips, list them here so creators know exactly what to deliver</span>
                  </p>

                  {/* Hooks and B-Rolls */}
                  <div className="border border-gray-200 rounded-2xl p-4 bg-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                      <Film size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-gray-950">Request hooks, b-rolls and more</h4>
                        <span className="bg-pink-100 text-pink-700 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">New</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                        Get clips such as different hooks, b-rolls, or scene variations. Mix, match, and test new ad variants.
                      </p>
                    </div>

                    <div
                      onClick={() =>
                        handleDeliverableChange(
                          idx,
                          "requestHooksAndBRolls",
                          !deliv.requestHooksAndBRolls
                        )
                      }
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition flex-shrink-0 ${
                        deliv.requestHooksAndBRolls ? "bg-fuchsia-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                          deliv.requestHooksAndBRolls ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Music Requirement */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1">Music</label>
                    <p className="text-[11px] text-gray-500 mb-2">Do you want the Creator to add music?</p>
                    <div className="grid grid-cols-2 gap-3">
                      {["No music", "Music required"].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => handleDeliverableChange(idx, "musicRequirement", m)}
                          className={`py-3 px-4 rounded-2xl border text-xs font-bold transition text-center ${
                            deliv.musicRequirement === m
                              ? "border-fuchsia-600 bg-fuchsia-50/20 ring-2 ring-fuchsia-600 text-gray-950"
                              : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Avoid */}
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-xs font-bold text-gray-900">What should creators avoid?</label>
                      <span className="text-[11px] text-gray-400">(optional)</span>
                    </div>
                    <input
                      type="text"
                      value={deliv.whatShouldAvoid || ""}
                      onChange={(e) => handleDeliverableChange(idx, "whatShouldAvoid", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                  </div>

                  {/* References */}
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-xs font-bold text-gray-900">References</label>
                      <span className="text-[11px] text-gray-400">(optional)</span>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 hover:border-fuchsia-500 rounded-2xl p-6 text-center cursor-pointer bg-white transition flex flex-col items-center justify-center gap-1.5">
                      <UploadCloud size={24} className="text-gray-400" />
                      <p className="text-xs text-gray-600 font-medium">
                        Drag and drop file here or <span className="text-fuchsia-600 underline">choose file</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Bar */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDeleteDeliverable(idx)}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                title="Delete deliverable"
              >
                <Trash2 size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDuplicateDeliverable(idx)}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition"
                title="Duplicate deliverable"
              >
                <Copy size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => alert(`Deliverable asset #${idx + 1} saved!`)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      ))}

      {/* Add Deliverable */}
      <button
        type="button"
        onClick={handleAddDeliverable}
        className="w-full py-3.5 px-4 rounded-2xl border border-gray-200 hover:border-fuchsia-400 bg-white hover:bg-fuchsia-50/30 text-xs font-bold text-gray-800 transition flex items-center justify-center gap-2 shadow-sm"
      >
        <Plus size={16} className="text-fuchsia-600" /> Add Deliverable
      </button>
    </div>
  );
}
