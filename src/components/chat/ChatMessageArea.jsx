import React from "react";
import { Trash2, MessageSquare } from "lucide-react";
import Avatar from "../dashboard/influencer/Avatar";

export default function ChatMessageArea({
  activeId, activeOther, role, messages, user, onDeleteConversation, messagesEndRef
}) {
  if (!activeId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none bg-white">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3.5">
          <MessageSquare size={26} strokeWidth={1.75} className="text-gray-500" />
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-1">No conversation selected</h3>
        <p className="text-xs text-gray-500 max-w-xs">Select a conversation from the list to view messages.</p>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 py-3.5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <Avatar name={activeOther?.name} size={36} />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-bold text-gray-900 truncate">{activeOther?.name || (role === "brand" ? "Creator" : "Brand Partner")}</h2>
            <p className="text-[10px] text-gray-500 truncate">{activeOther?.email || (role === "brand" ? "Creator Collaboration" : "Brand Collaboration")}</p>
          </div>
        </div>
        <button onClick={(e) => onDeleteConversation(e, activeId)} className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer" title="Delete conversation">
          <Trash2 size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 bg-gray-50/40">
        {!messages.length ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-xs text-gray-400">
            <p>No messages yet. Send a message to start collaborating!</p>
          </div>
        ) : (
          messages.map((m) => {
            const mine = (m.sender?._id || m.sender) === user?.id;
            const time = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
            return (
              <div key={m._id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${mine ? "bg-zinc-900 text-white rounded-br-xs shadow-xs font-medium" : "bg-white border border-gray-200/90 text-gray-900 rounded-bl-xs shadow-xs"} ${m._optimistic ? "opacity-60" : ""}`}>
                  {m.text}
                </div>
                {time && <span className="text-[10px] text-gray-400 mt-1 px-1">{time}</span>}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
