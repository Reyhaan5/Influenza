import React from "react";
import { Send, Paperclip, Smile } from "lucide-react";

export default function ChatInput({ text, setText, handleSend, connected, socketError }) {
  return (
    <form onSubmit={handleSend} className="p-3.5 border-t border-gray-200 bg-white flex items-center gap-2.5 shrink-0">
      <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 focus-within:bg-white transition">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={socketError ? `Connection issue: ${socketError}` : connected ? "Type a message..." : "Connecting chat server..."}
          disabled={!connected}
          className="flex-1 bg-transparent text-xs text-gray-900 focus:outline-none placeholder-gray-400"
        />
        <button type="button" className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer" title="Attach file"><Paperclip size={15} /></button>
        <button type="button" className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer" title="Emoji"><Smile size={15} /></button>
      </div>
      <button type="submit" disabled={!connected || !text.trim()} className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white disabled:opacity-40 transition shadow-xs cursor-pointer">
        <Send size={15} />
      </button>
    </form>
  );
}
