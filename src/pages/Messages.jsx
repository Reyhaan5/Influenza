import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Section from "../components/common/Section";
import Avatar from "../components/dashboard/influencer/Avatar";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { API_URL } from "../config/api";

export default function Messages() {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchConversations = useCallback(async () => {
    const res = await axios.get(`${API_URL}/messages/conversations`, authHeader());
    setConversations(res.data.conversations || []);
    return res.data.conversations || [];
  }, []);

  // On load: open ?with=<userId> conversation, else the most recent one
  useEffect(() => {
    const otherUserId = searchParams.get("with");
    (async () => {
      const convos = await fetchConversations();
      if (otherUserId) {
        const res = await axios.post(
          `${API_URL}/messages/conversations`,
          { otherUserId },
          authHeader()
        );
        setActiveId(res.data.conversation._id);
        setConversations((prev) =>
          prev.some((c) => c._id === res.data.conversation._id)
            ? prev
            : [res.data.conversation, ...prev]
        );
      } else if (convos.length > 0) {
        setActiveId(convos[0]._id);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load history + join room whenever active conversation changes
  useEffect(() => {
    if (!activeId) return;
    axios
      .get(`${API_URL}/messages/conversations/${activeId}/messages`, authHeader())
      .then((res) => setMessages(res.data.messages || []));

    socket?.emit("joinConversation", activeId);
    socket?.emit("markRead", { conversationId: activeId });

    return () => socket?.emit("leaveConversation", activeId);
  }, [activeId, socket]);

  // Real-time listeners
  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (msg) => {
      if (msg.conversation === activeId) setMessages((prev) => [...prev, msg]);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === msg.conversation
            ? { ...c, lastMessage: msg.text, lastMessageAt: msg.createdAt }
            : c
        )
      );
    };

    const onConversationUpdated = ({ conversationId, lastMessage, lastMessageAt }) => {
      setConversations((prev) =>
        prev.map((c) => (c._id === conversationId ? { ...c, lastMessage, lastMessageAt } : c))
      );
    };

    socket.on("newMessage", onNewMessage);
    socket.on("conversationUpdated", onConversationUpdated);
    return () => {
      socket.off("newMessage", onNewMessage);
      socket.off("conversationUpdated", onConversationUpdated);
    };
  }, [socket, activeId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !activeId || !socket) return;
    socket.emit("sendMessage", { conversationId: activeId, text: text.trim() });
    setText("");
  };

  const otherParticipant = (c) => c.participants.find((p) => p._id !== user.id) || c.participants[0];

  return (
    <>
      <Navbar />
      <Section className="pt-32">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">Messages</h1>

        <div className="grid md:grid-cols-[280px_1fr] gap-5 h-[70vh] border border-[var(--color-border)] rounded-2xl overflow-hidden">
          <div className="border-r border-[var(--color-border)] overflow-y-auto bg-[var(--color-surface)]">
            {loading ? (
              <p className="p-4 text-sm text-[var(--color-text-light)]">Loading...</p>
            ) : conversations.length === 0 ? (
              <p className="p-4 text-sm text-[var(--color-text-light)]">No conversations yet.</p>
            ) : (
              conversations.map((c) => {
                const other = otherParticipant(c);
                return (
                  <button
                    key={c._id}
                    onClick={() => setActiveId(c._id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-[var(--color-border)] hover:bg-[var(--color-background)] transition ${
                      activeId === c._id ? "bg-[var(--color-background)]" : ""
                    }`}
                  >
                    <Avatar name={other?.name} size={36} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-text)] truncate">{other?.name}</p>
                      <p className="text-xs text-[var(--color-text-light)] truncate">
                        {c.lastMessage || "Say hello 👋"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="flex flex-col bg-[var(--color-background)]">
            {!activeId ? (
              <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-text-light)]">
                Select a conversation to start chatting.
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                  {messages.map((m) => {
                    const mine = (m.sender?._id || m.sender) === user.id;
                    return (
                      <div
                        key={m._id}
                        className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                          mine
                            ? "self-end bg-[var(--color-primary)] text-white rounded-br-sm"
                            : "self-start bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-bl-sm"
                        }`}
                      >
                        {m.text}
                      </div>
                    );
                  })}
                </div>

                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-2 border-t border-[var(--color-border)] p-3 bg-[var(--color-surface)]"
                >
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={connected ? "Type a message..." : "Connecting..."}
                    disabled={!connected}
                    className="flex-1 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm bg-[var(--color-background)]"
                  />
                  <button
                    type="submit"
                    disabled={!connected || !text.trim()}
                    className="p-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}