import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import {
  Search,
  ChevronDown,
  CheckCheck,
  FolderClosed,
  ThumbsUp,
  Send,
  Trash2,
  MessageSquare,
  Paperclip,
  Smile,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import BrandDashboardLayout from "../components/layout/BrandDashBoardLayout";
import Avatar from "../components/dashboard/influencer/Avatar";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { API_URL } from "../config/api";

export default function BrandChats() {
  const { user } = useAuth();
  const { socket, connected, error: socketError } = useSocket();
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Filters
  const [brands, setBrands] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");

  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const brandRef = useRef(null);
  const statusRef = useRef(null);
  const messagesEndRef = useRef(null);
  const tempIdRef = useRef(0);

  const token = localStorage.getItem("token");
  const authHeader = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (brandRef.current && !brandRef.current.contains(e.target)) {
        setBrandDropdownOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const brandList = useMemo(() => {
    if (brands.length > 0) return brands;
    const defaultName = user?.company || user?.name || "ryzwnn";
    return [{ _id: "default-brand", name: defaultName }];
  }, [brands, user]);

  const filteredBrandList = useMemo(() => {
    if (!brandSearch.trim()) return brandList;
    return brandList.filter((b) =>
      b.name.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [brandList, brandSearch]);

  const toggleBrand = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName]
    );
  };

  const toggleStatus = (statusName) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusName)
        ? prev.filter((s) => s !== statusName)
        : [...prev, statusName]
    );
  };

  // Fetch Brands and Campaigns for Filters
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [brandsRes, campRes] = await Promise.allSettled([
          axios.get(`${API_URL}/brand/brands`, authHeader),
          axios.get(`${API_URL}/brand/campaigns`, authHeader),
        ]);
        if (brandsRes.status === "fulfilled") {
          setBrands(brandsRes.value.data.brands || []);
        }
        if (campRes.status === "fulfilled") {
          setCampaigns(campRes.value.data.campaigns || []);
        }
      } catch (err) {
        console.error("Error fetching filters metadata:", err);
      }
    };
    fetchMetadata();
  }, [authHeader]);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/messages/conversations`, authHeader);
      const convos = res.data.conversations || [];
      setConversations(convos);
      return convos;
    } catch (err) {
      console.error("Error fetching conversations:", err);
      return [];
    }
  }, [authHeader]);

  // Handle URL query ?with=<userId>
  const withParam = searchParams.get("with");
  useEffect(() => {
    (async () => {
      const convos = await fetchConversations();
      if (withParam) {
        try {
          const res = await axios.post(
            `${API_URL}/messages/conversations`,
            { otherUserId: withParam },
            authHeader
          );
          setActiveId(res.data.conversation._id);
          setConversations((prev) =>
            prev.some((c) => c._id === res.data.conversation._id)
              ? prev
              : [res.data.conversation, ...prev]
          );
        } catch (err) {
          console.error("Failed to start conversation with user:", err);
        }
      }
      setLoading(false);
    })();
  }, [withParam, fetchConversations, authHeader]);

  // Load message history & join socket room
  useEffect(() => {
    if (!activeId) return;
    axios
      .get(`${API_URL}/messages/conversations/${activeId}/messages`, authHeader)
      .then((res) => setMessages(res.data.messages || []))
      .catch((err) => console.error("Error loading messages:", err));

    socket?.emit("joinConversation", activeId);
    socket?.emit("markRead", { conversationId: activeId });

    return () => socket?.emit("leaveConversation", activeId);
  }, [activeId, socket, authHeader]);

  // Re-join room on reconnect
  useEffect(() => {
    if (!socket || !activeId) return;
    const handleReconnect = () => {
      socket.emit("joinConversation", activeId);
      socket.emit("markRead", { conversationId: activeId });
    };
    socket.on("connect", handleReconnect);
    return () => socket.off("connect", handleReconnect);
  }, [socket, activeId]);

  // Real-time message events
  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (msg) => {
      if (msg.conversation === activeId) {
        setMessages((prev) => {
          const senderMatch = (msg.sender?._id || msg.sender) === user?.id;
          if (senderMatch) {
            const withoutOptimistic = prev.filter(
              (m) => !m._optimistic || m.text !== msg.text
            );
            return [...withoutOptimistic, msg];
          }
          return [...prev, msg];
        });
      }
      setConversations((prev) =>
        prev.map((c) =>
          c._id === msg.conversation
            ? { ...c, lastMessage: msg.text, lastMessageAt: msg.createdAt }
            : c
        )
      );
    };

    const onConversationUpdated = ({ conversationId, lastMessage, lastMessageAt }) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c._id === conversationId);
        if (exists) {
          return prev.map((c) =>
            c._id === conversationId ? { ...c, lastMessage, lastMessageAt } : c
          );
        }
        fetchConversations();
        return prev;
      });
    };

    const onConversationDeleted = ({ conversationId }) => {
      setConversations((prev) => prev.filter((c) => c._id !== conversationId));
      setActiveId((prevActiveId) => {
        if (prevActiveId !== conversationId) return prevActiveId;
        setMessages([]);
        return null;
      });
    };

    socket.on("newMessage", onNewMessage);
    socket.on("conversationUpdated", onConversationUpdated);
    socket.on("conversationDeleted", onConversationDeleted);
    return () => {
      socket.off("newMessage", onNewMessage);
      socket.off("conversationUpdated", onConversationUpdated);
      socket.off("conversationDeleted", onConversationDeleted);
    };
  }, [socket, activeId, user?.id, fetchConversations]);

  // Send message
  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !activeId || !socket) return;

    tempIdRef.current += 1;
    const optimisticMsg = {
      _id: `_temp_${tempIdRef.current}`,
      _optimistic: true,
      conversation: activeId,
      sender: user?.id,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setText("");

    socket.emit("sendMessage", { conversationId: activeId, text: trimmed });
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const otherParticipant = (c) =>
    c.participants?.find((p) => p._id !== user?.id) || c.participants?.[0];

  const handleDeleteConversation = async (e, conversationId) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      "Delete this conversation? This removes all messages for both parties."
    );
    if (!confirmed) return;

    setDeletingId(conversationId);
    try {
      await axios.delete(`${API_URL}/messages/conversations/${conversationId}`, authHeader);
      setConversations((prev) => prev.filter((c) => c._id !== conversationId));
      if (activeId === conversationId) {
        setActiveId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete conversation.");
    } finally {
      setDeletingId(null);
    }
  };

  // Mark all as read action
  const handleMarkAllRead = () => {
    if (activeId && socket) {
      socket.emit("markRead", { conversationId: activeId });
    }
  };

  // Filtered conversations list
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const other = otherParticipant(c);
      if (searchQuery.trim()) {
        const name = other?.name?.toLowerCase() || "";
        const email = other?.email?.toLowerCase() || "";
        const last = c.lastMessage?.toLowerCase() || "";
        const q = searchQuery.toLowerCase();
        if (!name.includes(q) && !email.includes(q) && !last.includes(q)) {
          return false;
        }
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        const brandMatch = selectedBrands.some(
          (b) =>
            c.brand?.name?.toLowerCase() === b.toLowerCase() ||
            c.brand?._id === b ||
            c.brandName?.toLowerCase() === b.toLowerCase()
        );
        if (c.brand && !brandMatch) return false;
      }

      // Status filter
      if (selectedStatuses.length > 0) {
        const statusMatch = selectedStatuses.some(
          (s) =>
            c.status?.toLowerCase() === s.toLowerCase() ||
            c.collaborationStage?.toLowerCase() === s.toLowerCase()
        );
        if (c.status && !statusMatch) return false;
      }

      return true;
    });
  }, [conversations, searchQuery, selectedBrands, selectedStatuses, user?.id]);

  const activeConvo = conversations.find((c) => c._id === activeId);
  const activeOther = activeConvo ? otherParticipant(activeConvo) : null;

  return (
    <BrandDashboardLayout noPadding={true}>
      <div className="flex h-screen w-full bg-white overflow-hidden">
        {/* LEFT COLUMN: CHATS / INBOX LIST (Width ~300px) */}
        <div className="w-80 border-r border-gray-200 flex flex-col h-full bg-white shrink-0">
          {/* Top Filters Header */}
          <div className="p-3 border-b border-gray-100 space-y-2.5">
            {/* Row 1: Brand Dropdown Pill + Circular Search Button */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1" ref={brandRef}>
                <button
                  type="button"
                  onClick={() => {
                    setBrandDropdownOpen(!brandDropdownOpen);
                    setStatusDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition cursor-pointer bg-white ${
                    selectedBrands.length > 0
                      ? "border-black text-black"
                      : "border-gray-200 text-gray-800 hover:border-gray-300"
                  }`}
                >
                  <span className="truncate">
                    {selectedBrands.length === 1
                      ? selectedBrands[0]
                      : selectedBrands.length > 1
                      ? `${selectedBrands.length} Brands`
                      : "Brand"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-700 transition-transform duration-200 ${
                      brandDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Brand Dropdown Menu (Screenshot 1) */}
                {brandDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-2.5 animate-fadeIn">
                    {/* Search inside Dropdown */}
                    <div className="relative mb-2">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Search"
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        autoFocus
                        className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-gray-800 placeholder-gray-400"
                      />
                    </div>

                    {/* Brands Checkbox List */}
                    <div className="max-h-48 overflow-y-auto space-y-0.5 py-0.5">
                      {filteredBrandList.length === 0 ? (
                        <p className="text-xs text-gray-400 py-1.5 px-2">No brands found</p>
                      ) : (
                        filteredBrandList.map((b) => (
                          <label
                            key={b._id || b.name}
                            className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer text-xs font-medium text-gray-800 transition"
                          >
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(b.name)}
                              onChange={() => toggleBrand(b.name)}
                              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-0 focus:outline-none cursor-pointer accent-black"
                            />
                            <span className="truncate">{b.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Circular Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center text-gray-700 hover:bg-gray-50 transition cursor-pointer shrink-0 ${
                  searchOpen ? "border-black bg-gray-50 text-black" : "border-gray-200"
                }`}
                title="Search chats"
              >
                <Search size={14} />
              </button>
            </div>

            {/* Expandable Search Input */}
            {searchOpen && (
              <div className="relative animate-fadeIn">
                <input
                  type="text"
                  placeholder="Search by creator name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
            )}

            {/* Row 2: Status Dropdown Pill */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1" ref={statusRef}>
                <button
                  type="button"
                  onClick={() => {
                    setStatusDropdownOpen(!statusDropdownOpen);
                    setBrandDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition cursor-pointer bg-white ${
                    selectedStatuses.length > 0
                      ? "border-black text-black"
                      : "border-gray-200 text-gray-800 hover:border-gray-300"
                  }`}
                >
                  <span className="truncate">
                    {selectedStatuses.length === 1
                      ? selectedStatuses[0]
                      : selectedStatuses.length > 1
                      ? `${selectedStatuses.length} Statuses`
                      : "Status"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-700 transition-transform duration-200 ${
                      statusDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Status Dropdown Menu (Screenshot 2) */}
                {statusDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-60 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-2.5 animate-fadeIn">
                    {/* Primary Stages Checkboxes */}
                    <div className="space-y-1">
                      {["Application", "Content creation", "Review", "Posting", "Completed"].map((status) => (
                        <label
                          key={status}
                          className="flex items-center gap-2.5 px-2 py-1 hover:bg-gray-50 rounded-lg cursor-pointer text-xs font-medium text-gray-800 transition"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes(status)}
                            onChange={() => toggleStatus(status)}
                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-0 focus:outline-none cursor-pointer accent-black"
                          />
                          <span>{status}</span>
                        </label>
                      ))}
                    </div>

                    {/* Divider */}
                    <hr className="my-2 border-gray-100" />

                    {/* Needs Attention Subheader */}
                    <div className="px-2 py-0.5">
                      <p className="text-xs font-bold text-gray-700 mb-1">Needs attention</p>
                    </div>

                    {/* Needs Attention Bullet Items */}
                    <div className="space-y-0.5">
                      {[
                        { label: "Awaiting response", dotColor: "bg-[#b91c1c]" },
                        { label: "Overdue Content", dotColor: "bg-[#a16207]" },
                        { label: "Reimbursement pending", dotColor: "bg-[#a16207]" },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => toggleStatus(item.label)}
                          className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium transition text-left cursor-pointer ${
                            selectedStatuses.includes(item.label)
                              ? "bg-gray-100 font-bold text-black"
                              : "text-gray-800 hover:bg-gray-50"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${item.dotColor} shrink-0`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Row 3: Action Buttons (Mark all as read + icon controls) */}
            <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500">
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium transition cursor-pointer"
              >
                <CheckCheck size={13} className="text-gray-500" />
                <span>Mark all as read</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                  title="Folders"
                >
                  <FolderClosed size={14} />
                </button>
                <button
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                  title="Feedback / Reactions"
                >
                  <ThumbsUp size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Conversations List Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="py-20 text-center text-xs text-gray-400">Loading chats...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="h-full flex items-center justify-center p-6 text-center text-xs text-gray-400 font-medium">
                No collabs yet
              </div>
            ) : (
              filteredConversations.map((c) => {
                const other = otherParticipant(c);
                const isSelected = activeId === c._id;
                const formattedTime = c.lastMessageAt
                  ? new Date(c.lastMessageAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                return (
                  <div
                    key={c._id}
                    onClick={() => setActiveId(c._id)}
                    className={`group w-full p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-fuchsia-50/60 border-l-2 border-[#c026d3]"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar name={other?.name} size={36} />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p
                          className={`text-xs font-bold truncate ${
                            isSelected ? "text-[#c026d3]" : "text-gray-900"
                          }`}
                        >
                          {other?.name || "Creator"}
                        </p>
                        {formattedTime && (
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {formattedTime}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-gray-500 truncate">
                        {c.lastMessage || "Started a collaboration conversation"}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleDeleteConversation(e, c._id)}
                      disabled={deletingId === c._id}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-red-600 transition"
                      title="Delete chat"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT OR EMPTY STATE */}
        <div className="flex-1 flex flex-col h-full bg-white">
          {!activeId ? (
            /* EMPTY STATE: Matches Screenshot 1 */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3.5">
                <MessageSquare size={26} strokeWidth={1.75} className="text-gray-500" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                No conversation selected
              </h3>
              <p className="text-xs text-gray-500 max-w-xs">
                Select a conversation from the list to view messages.
              </p>
            </div>
          ) : (
            /* SELECTED CHAT VIEW */
            <>
              {/* Chat Top Header */}
              <div className="px-6 py-3.5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <Avatar name={activeOther?.name} size={36} />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xs font-bold text-gray-900 truncate">
                      {activeOther?.name || "Creator"}
                    </h2>
                    <p className="text-[10px] text-gray-500 truncate">
                      {activeOther?.email || "Creator Collaboration"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleDeleteConversation(e, activeId)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Delete conversation"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 bg-gray-50/40">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-xs text-gray-400">
                    <p>No messages yet. Send a message to start collaborating!</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const mine = (m.sender?._id || m.sender) === user?.id;
                    const messageTime = m.createdAt
                      ? new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "";

                    return (
                      <div
                        key={m._id}
                        className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            mine
                              ? "bg-[#c026d3] text-white rounded-br-xs shadow-xs"
                              : "bg-white border border-gray-200/90 text-gray-800 rounded-bl-xs shadow-xs"
                          } ${m._optimistic ? "opacity-60" : ""}`}
                        >
                          {m.text}
                        </div>
                        {messageTime && (
                          <span className="text-[10px] text-gray-400 mt-1 px-1">
                            {messageTime}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSend}
                className="p-3.5 border-t border-gray-200 bg-white flex items-center gap-2.5 shrink-0"
              >
                <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:border-[#c026d3] focus-within:bg-white transition">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={
                      socketError
                        ? `Connection issue: ${socketError}`
                        : connected
                        ? "Type a message..."
                        : "Connecting chat server..."
                    }
                    disabled={!connected}
                    className="flex-1 bg-transparent text-xs text-gray-900 focus:outline-none placeholder-gray-400"
                  />
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Attach file"
                  >
                    <Paperclip size={15} />
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Emoji"
                  >
                    <Smile size={15} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!connected || !text.trim()}
                  className="p-2.5 rounded-xl bg-[#c026d3] hover:bg-[#a21caf] text-white disabled:opacity-40 transition shadow-xs cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </BrandDashboardLayout>
  );
}