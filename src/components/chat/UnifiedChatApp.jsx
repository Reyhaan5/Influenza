import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import api from "../../config/api";
import ChatSidebar from "./ChatSidebar";
import ChatMessageArea from "./ChatMessageArea";
import ChatInput from "./ChatInput";

export default function UnifiedChatApp({ role = "influencer" }) {
  const { user } = useAuth();
  const { socket, connected, error: socketError } = useSocket();
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [brands, setBrands] = useState([]);

  const messagesEndRef = useRef(null);
  const tempIdRef = useRef(0);

  useEffect(() => {
    if (role === "brand") {
      api.get("/brand/brands").then((res) => setBrands(res.data.brands || [])).catch(() => {});
    }
  }, [role]);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get("/messages/conversations");
      const convos = res.data.conversations || [];
      setConversations(convos);
      return convos;
    } catch (err) {
      console.error("Error fetching conversations:", err);
      return [];
    }
  }, []);

  const withParam = searchParams.get("with");
  useEffect(() => {
    (async () => {
      const convos = await fetchConversations();
      if (withParam) {
        try {
          const res = await api.post("/messages/conversations", { otherUserId: withParam });
          setActiveId(res.data.conversation._id);
          setConversations((prev) => prev.some((c) => c._id === res.data.conversation._id) ? prev : [res.data.conversation, ...prev]);
        } catch (err) {
          console.error("Failed to start conversation with user:", err);
        }
      } else if (convos.length > 0 && !activeId) {
        setActiveId(convos[0]._id);
      }
      setLoading(false);
    })();
  }, [withParam, fetchConversations]);

  useEffect(() => {
    if (!activeId) return;
    api.get(`/messages/conversations/${activeId}/messages`)
      .then((res) => setMessages(res.data.messages || []))
      .catch((err) => console.error("Error loading messages:", err));

    socket?.emit("joinConversation", activeId);
    socket?.emit("markRead", { conversationId: activeId });
    return () => socket?.emit("leaveConversation", activeId);
  }, [activeId, socket]);

  useEffect(() => {
    if (!socket || !activeId) return;
    const handleReconnect = () => {
      socket.emit("joinConversation", activeId);
      socket.emit("markRead", { conversationId: activeId });
    };
    socket.on("connect", handleReconnect);
    return () => socket.off("connect", handleReconnect);
  }, [socket, activeId]);

  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (msg) => {
      if (msg.conversation === activeId) {
        setMessages((prev) => {
          const senderMatch = (msg.sender?._id || msg.sender) === user?.id;
          return senderMatch ? [...prev.filter((m) => !m._optimistic || m.text !== msg.text), msg] : [...prev, msg];
        });
      }
      setConversations((prev) => prev.map((c) => c._id === msg.conversation ? { ...c, lastMessage: msg.text, lastMessageAt: msg.createdAt } : c));
    };

    const onConversationUpdated = ({ conversationId, lastMessage, lastMessageAt }) => {
      setConversations((prev) => prev.some((c) => c._id === conversationId) ? prev.map((c) => c._id === conversationId ? { ...c, lastMessage, lastMessageAt } : c) : (fetchConversations(), prev));
    };

    const onConversationDeleted = ({ conversationId }) => {
      setConversations((prev) => prev.filter((c) => c._id !== conversationId));
      setActiveId((prev) => prev === conversationId ? (setMessages([]), null) : prev);
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

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !activeId || !socket) return;

    tempIdRef.current += 1;
    setMessages((prev) => [...prev, { _id: `_temp_${tempIdRef.current}`, _optimistic: true, conversation: activeId, sender: user.id, text: trimmed, createdAt: new Date().toISOString() }]);
    setText("");
    socket.emit("sendMessage", { conversationId: activeId, text: trimmed });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMarkAllRead = () => { if (activeId && socket) socket.emit("markRead", { conversationId: activeId }); };

  const handleDeleteConversation = async (e, conversationId) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Delete this conversation? All messages will be permanently removed.")) return;

    setDeletingId(conversationId);
    try {
      await api.delete(`/messages/conversations/${conversationId}`);
      setConversations((prev) => prev.filter((c) => c._id !== conversationId));
      if (activeId === conversationId) { setActiveId(null); setMessages([]); }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete conversation.");
    } finally {
      setDeletingId(null);
    }
  };

  const activeConvo = conversations.find((c) => c._id === activeId);
  const activeOther = activeConvo ? (activeConvo.participants?.find((p) => p._id !== user?.id) || activeConvo.participants?.[0]) : null;

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <ChatSidebar
        role={role} conversations={conversations} activeId={activeId} setActiveId={setActiveId}
        loading={loading} deletingId={deletingId} onDeleteConversation={handleDeleteConversation}
        onMarkAllRead={handleMarkAllRead} brands={brands} user={user}
      />
      <div className="flex-1 flex flex-col h-full bg-white">
        <ChatMessageArea
          activeId={activeId} activeOther={activeOther} role={role} messages={messages}
          user={user} onDeleteConversation={handleDeleteConversation} messagesEndRef={messagesEndRef}
        />
        {activeId && (
          <ChatInput text={text} setText={setText} handleSend={handleSend} connected={connected} socketError={socketError} />
        )}
      </div>
    </div>
  );
}
