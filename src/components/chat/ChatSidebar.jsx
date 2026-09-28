import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, CheckCheck, FolderClosed, ThumbsUp, Trash2 } from "lucide-react";
import Avatar from "../dashboard/influencer/Avatar";

const STATUS_ITEMS = ["Application", "Content creation", "Review", "Posting", "Completed"];
const ATTENTION_ITEMS = [
  { label: "Awaiting response", dotColor: "bg-[#b91c1c]" },
  { label: "Overdue Content", dotColor: "bg-[#a16207]" },
  { label: "Reimbursement pending", dotColor: "bg-[#a16207]" },
];

export default function ChatSidebar({
  role, conversations, activeId, setActiveId, loading, deletingId,
  onDeleteConversation, onMarkAllRead, brands = [], user
}) {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const brandRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (brandRef.current && !brandRef.current.contains(e.target)) setBrandDropdownOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target)) setStatusDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const brandList = useMemo(() => {
    if (brands.length > 0) return brands;
    return [{ _id: "default-brand", name: user?.company || user?.name || (role === "brand" ? "My Brand" : "Collabs") }];
  }, [brands, user, role]);

  const filteredBrandList = useMemo(() => {
    return brandSearch.trim() ? brandList.filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase())) : brandList;
  }, [brandList, brandSearch]);

  const toggleBrand = (name) => setSelectedBrands((p) => p.includes(name) ? p.filter((b) => b !== name) : [...p, name]);
  const toggleStatus = (s) => setSelectedStatuses((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);

  const otherParticipant = (c) => c.participants?.find((p) => p._id !== user?.id) || c.participants?.[0];

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const other = otherParticipant(c);
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = other?.name?.toLowerCase().includes(q) || other?.email?.toLowerCase().includes(q) || c.lastMessage?.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedBrands.length > 0) {
        const bm = selectedBrands.some((b) => c.brand?.name?.toLowerCase() === b.toLowerCase() || c.brand?._id === b || c.brandName?.toLowerCase() === b.toLowerCase());
        if (c.brand && !bm) return false;
      }
      if (selectedStatuses.length > 0) {
        const sm = selectedStatuses.some((s) => c.status?.toLowerCase() === s.toLowerCase() || c.collaborationStage?.toLowerCase() === s.toLowerCase());
        if (c.status && !sm) return false;
      }
      return true;
    });
  }, [conversations, searchQuery, selectedBrands, selectedStatuses, user?.id]);

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col h-full bg-white shrink-0">
      <div className="p-3 border-b border-gray-100 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1" ref={brandRef}>
            <button type="button" onClick={() => { setBrandDropdownOpen(!brandDropdownOpen); setStatusDropdownOpen(false); }} className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition cursor-pointer bg-white ${selectedBrands.length ? "border-black text-black" : "border-gray-200 text-gray-800 hover:border-gray-300"}`}>
              <span className="truncate">{selectedBrands.length === 1 ? selectedBrands[0] : selectedBrands.length > 1 ? `${selectedBrands.length} Selected` : role === "brand" ? "Brand" : "Partners"}</span>
              <ChevronDown size={14} className={`text-gray-700 transition-transform duration-200 ${brandDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {brandDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-2.5">
                <div className="relative mb-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search" value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} autoFocus className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-gray-800" />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5 py-0.5">
                  {!filteredBrandList.length ? <p className="text-xs text-gray-400 py-1.5 px-2">No partners found</p> : filteredBrandList.map((b) => (
                    <label key={b._id || b.name} className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer text-xs font-medium text-gray-800">
                      <input type="checkbox" checked={selectedBrands.includes(b.name)} onChange={() => toggleBrand(b.name)} className="w-4 h-4 rounded border-gray-300 text-black accent-black cursor-pointer" />
                      <span className="truncate">{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button type="button" onClick={() => setSearchOpen(!searchOpen)} className={`w-9 h-9 rounded-full border flex items-center justify-center text-gray-700 hover:bg-gray-50 transition cursor-pointer shrink-0 ${searchOpen ? "border-black bg-gray-50 text-black" : "border-gray-200"}`} title="Search chats">
            <Search size={14} />
          </button>
        </div>

        {searchOpen && (
          <input type="text" placeholder={role === "brand" ? "Search by creator name..." : "Search by brand name..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
        )}

        <div className="relative" ref={statusRef}>
          <button type="button" onClick={() => { setStatusDropdownOpen(!statusDropdownOpen); setBrandDropdownOpen(false); }} className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition cursor-pointer bg-white ${selectedStatuses.length ? "border-black text-black" : "border-gray-200 text-gray-800 hover:border-gray-300"}`}>
            <span className="truncate">{selectedStatuses.length === 1 ? selectedStatuses[0] : selectedStatuses.length > 1 ? `${selectedStatuses.length} Statuses` : "Status"}</span>
            <ChevronDown size={14} className={`text-gray-700 transition-transform duration-200 ${statusDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {statusDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-60 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-2.5">
              <div className="space-y-1">
                {STATUS_ITEMS.map((s) => (
                  <label key={s} className="flex items-center gap-2.5 px-2 py-1 hover:bg-gray-50 rounded-lg cursor-pointer text-xs font-medium text-gray-800">
                    <input type="checkbox" checked={selectedStatuses.includes(s)} onChange={() => toggleStatus(s)} className="w-4 h-4 rounded border-gray-300 text-black accent-black cursor-pointer" />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
              <hr className="my-2 border-gray-100" />
              <p className="text-xs font-bold text-gray-700 mb-1 px-2">Needs attention</p>
              <div className="space-y-0.5">
                {ATTENTION_ITEMS.map(({ label, dotColor }) => (
                  <button key={label} type="button" onClick={() => toggleStatus(label)} className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-left cursor-pointer ${selectedStatuses.includes(label) ? "bg-gray-100 font-bold text-black" : "text-gray-800 hover:bg-gray-50"}`}>
                    <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
                    <span className="truncate">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500">
          <button onClick={onMarkAllRead} className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium cursor-pointer">
            <CheckCheck size={13} className="text-gray-500" /><span>Mark all as read</span>
          </button>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer" title="Folders"><FolderClosed size={14} /></button>
            <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer" title="Reactions"><ThumbsUp size={14} /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">Loading chats...</div>
        ) : !filteredConversations.length ? (
          <div className="h-full flex items-center justify-center p-6 text-center text-xs text-gray-400 font-medium">No collabs yet</div>
        ) : (
          filteredConversations.map((c) => {
            const other = otherParticipant(c);
            const isSelected = activeId === c._id;
            const time = c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
            return (
              <div key={c._id} onClick={() => setActiveId(c._id)} className={`group w-full p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${isSelected ? "bg-gray-50 border-l-2 border-zinc-950 font-bold" : "hover:bg-gray-50"}`}>
                <div className="relative shrink-0">
                  <Avatar name={other?.name} size={36} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-xs truncate ${isSelected ? "text-gray-950 font-bold" : "text-gray-900 font-semibold"}`}>{other?.name || (role === "brand" ? "Creator" : "Brand Representative")}</p>
                    {time && <span className="text-[10px] text-gray-400 shrink-0">{time}</span>}
                  </div>
                  <p className="text-[11px] text-gray-500 truncate font-normal">{c.lastMessage || "Started a collaboration conversation"}</p>
                </div>
                <button onClick={(e) => onDeleteConversation(e, c._id)} disabled={deletingId === c._id} className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-red-600 transition cursor-pointer" title="Delete chat">
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
