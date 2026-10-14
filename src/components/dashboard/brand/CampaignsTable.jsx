import React from "react";
import { Folder, Trash2, AlignLeft, RefreshCw } from "lucide-react";
import { API_URL } from "../../../config/api";

const EMPTY_MESSAGES = {
  active: { title: "No campaigns yet", desc: "Start your first campaign to manage everything in one place." },
  drafts: { title: "No drafts yet", desc: "Drafts of unfinished campaigns will appear here." },
  closed: { title: "No closed campaigns yet", desc: "Once you complete a campaign, you'll see it here." },
};

export default function CampaignsTable({
  activeTab, campaigns, loading, openCreateWizard, openFinishBrief,
  handleDelete, handleCloseCampaign, handleReopenCampaign, formatDate
}) {
  if (loading) {
    return (
      <div className="py-24 text-center text-gray-400 text-xs flex items-center justify-center gap-2">
        <RefreshCw size={16} className="animate-spin text-gray-400" />
        <span>Loading campaigns...</span>
      </div>
    );
  }

  if (!campaigns.length) {
    const { title, desc } = EMPTY_MESSAGES[activeTab] || EMPTY_MESSAGES.active;
    return (
      <div>
        <div className="border-b border-gray-100 bg-gray-50/60 px-6 py-3.5 flex items-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
          <span>Campaigns Overview</span>
        </div>
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4 border border-gray-100">
            <Folder size={28} strokeWidth={1.5} className="text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-xs text-gray-500 mb-6">{desc}</p>
          <button onClick={openCreateWizard} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer">
            + New campaign
          </button>
        </div>
      </div>
    );
  }

  const renderBrandAvatar = (c) => {
    const logo = c.brandEntity?.logo;
    const name = c.brandEntity?.name || "Brand";
    if (logo) {
      const src = logo.startsWith("http") ? logo : `${API_URL}${logo}`;
      return <img src={src} alt={name} className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0" onError={(e) => { e.target.style.display = "none"; }} />;
    }
    return (
      <div className={`w-9 h-9 rounded-full ${activeTab === "closed" ? "bg-gray-400" : "bg-amber-500"} text-white font-bold flex items-center justify-center text-xs shrink-0`}>
        {name.substring(0, 3).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/75 text-gray-500 font-semibold uppercase text-[11px]">
            <th className="py-3.5 px-5">Campaign</th>
            {activeTab === "active" && (
              <>
                <th className="py-3.5 px-4 text-center">Applications</th>
                <th className="py-3.5 px-4 text-center">Hired / Goal</th>
                <th className="py-3.5 px-4 text-center">Chats</th>
                <th className="py-3.5 px-4 text-center">Creative for review</th>
                <th className="py-3.5 px-4 text-center">Completed deals</th>
              </>
            )}
            {activeTab === "drafts" && <th className="py-3.5 px-6">Date of creation ⌵</th>}
            {activeTab === "closed" && (
              <>
                <th className="py-3.5 px-6">Completed</th>
                <th className="py-3.5 px-6">Total spent</th>
              </>
            )}
            {activeTab === "active" && <th className="py-3.5 px-4">Launched ⌵</th>}
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {campaigns.map((c) => {
            const brandName = c.brandEntity?.name || "Brand";
            const targetCount = c.targetCreatorsCount || 3;

            return (
              <tr key={c._id} className="hover:bg-gray-50/70 transition-colors">
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    {renderBrandAvatar(c)}
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{c.title || "Untitled Draft"}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {c.product?.name ? `${c.product.name} · ` : ""}{brandName} · {c.campaignType || (activeTab === "drafts" ? "Influencer Posts" : "User-Generated Content")}
                      </p>
                    </div>
                  </div>
                </td>

                {activeTab === "active" && (
                  <>
                    <td className="py-4 px-4 text-center font-medium text-gray-700">0</td>
                    <td className="py-4 px-4 text-center font-medium text-gray-700">0 / {targetCount}</td>
                    <td className="py-4 px-4 text-center font-medium text-gray-700">0</td>
                    <td className="py-4 px-4 text-center font-medium text-gray-700">0</td>
                    <td className="py-4 px-4 text-center font-medium text-gray-700">0</td>
                    <td className="py-4 px-4 text-gray-600 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Active
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openFinishBrief(c)} className="text-xs font-semibold text-zinc-900 hover:text-black px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">Edit</button>
                        <button onClick={(e) => handleCloseCampaign(c._id, e)} className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">Close</button>
                        <button onClick={(e) => handleDelete(c._id, e)} className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 cursor-pointer" title="Delete campaign"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </>
                )}

                {activeTab === "drafts" && (
                  <>
                    <td className="py-4.5 px-6 text-gray-700 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                    <td className="py-4.5 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Draft
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-5">
                        <button onClick={() => openFinishBrief(c)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-black cursor-pointer">
                          <AlignLeft size={14} /><span>Finish brief</span>
                        </button>
                        <button onClick={(e) => handleDelete(c._id, e)} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-red-600 cursor-pointer">
                          <Trash2 size={14} /><span>Delete brief</span>
                        </button>
                      </div>
                    </td>
                  </>
                )}

                {activeTab === "closed" && (
                  <>
                    <td className="py-4.5 px-6 text-gray-700 whitespace-nowrap">{formatDate(c.updatedAt || c.createdAt)}</td>
                    <td className="py-4.5 px-6 text-gray-700 font-medium">$0.00</td>
                    <td className="py-4.5 px-6 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />Closed
                      </span>
                    </td>
                    <td className="py-4.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={(e) => handleReopenCampaign(c._id, e)} className="text-xs text-zinc-900 hover:text-black font-semibold hover:underline cursor-pointer">Reopen</button>
                        <button onClick={(e) => handleDelete(c._id, e)} className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 cursor-pointer" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
