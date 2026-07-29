import React from "react";
import { Plus, Copy, Zap, Clock } from "lucide-react";

export default function GlassProfileCard({
  name = "Berat Berkay",
  role = "Developer",
  status = "Available for work",
  time = "9:59AM",
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  badgeText = "Currently High on Creativity",
  onHireMe,
  onCopyEmail,
}) {
  return (
    <div className="relative max-w-sm w-full mx-auto rounded-[32px] overflow-hidden bg-gradient-to-b from-zinc-800/80 via-zinc-900/90 to-zinc-950 border border-white/10 shadow-2xl backdrop-blur-xl text-white p-6 pb-0 flex flex-col items-center">
      <div
        className="absolute -bottom-10 inset-x-0 h-32 blur-2xl pointer-events-none"
        style={{ backgroundColor: "var(--color-primary)", opacity: 0.25 }}
      />

      <div className="w-full flex items-center justify-between text-xs text-gray-400 mb-6 px-1">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--color-success)", boxShadow: "0 0 8px var(--color-success)" }}
          />
          <span className="font-medium text-gray-300">{status}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{time}</span>
        </div>
      </div>

      <div className="relative w-48 h-48 rounded-3xl overflow-hidden shadow-lg border border-white/10 mb-6">
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      </div>

      <h3 className="text-2xl font-bold tracking-tight text-white">{name}</h3>
      <p className="text-sm text-gray-400 mt-1 mb-6 font-medium">{role}</p>

      <div className="w-full grid grid-cols-2 gap-3 mb-6 relative z-10">
        <button
          onClick={onHireMe}
          className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-zinc-700/60 hover:bg-zinc-600/80 text-white font-semibold text-sm border border-white/10 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Hire Me
        </button>

        <button
          onClick={onCopyEmail}
          className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-zinc-700/60 hover:bg-zinc-600/80 text-white font-semibold text-sm border border-white/10 transition-all duration-200"
        >
          <Copy className="w-4 h-4" />
          Copy Email
        </button>
      </div>

      <div
        className="w-[calc(100%+3rem)] -mx-6 py-3 font-bold text-sm flex items-center justify-center gap-2 rounded-b-[32px]"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "#fff",
          boxShadow: "0 -4px 16px color-mix(in srgb, var(--color-primary) 40%, transparent)",
        }}
      >
        <Zap className="w-4 h-4 fill-white" />
        <span>{badgeText}</span>
      </div>
    </div>
  );
}