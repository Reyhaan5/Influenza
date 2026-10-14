// src/components/auth/AuthShared.jsx
import React from "react";
import { Building2, Tv } from "lucide-react";

export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "bg-zinc-200", text: "" };
  let score = (password.length >= 8 ? 1 : 0) + (/[A-Z]/.test(password) ? 1 : 0) + (/[0-9]/.test(password) ? 1 : 0) + (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
  const map = {
    1: { label: "Weak", color: "bg-rose-500", text: "text-rose-600" },
    2: { label: "Fair", color: "bg-amber-500", text: "text-amber-600" },
    3: { label: "Good", color: "bg-blue-500", text: "text-blue-600" },
    4: { label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" },
  };
  return { score, ...(map[score] || { label: "Very Weak", color: "bg-rose-400", text: "text-rose-500" }) };
}

export const DEMO_LOGINS = [
  { label: "Brand 1: Luxe", email: "brand1@demo.com", role: "brand", Icon: Building2, color: "text-purple-600", hoverBg: "hover:bg-purple-50/40", hoverBorder: "hover:border-purple-300", hoverText: "group-hover:text-purple-700" },
  { label: "Brand 2: Apex", email: "brand2@demo.com", role: "brand", Icon: Building2, color: "text-purple-600", hoverBg: "hover:bg-purple-50/40", hoverBorder: "hover:border-purple-300", hoverText: "group-hover:text-purple-700" },
  { label: "Creator 1: Aarav", email: "creator1@demo.com", role: "creator", Icon: Tv, color: "text-indigo-600", hoverBg: "hover:bg-indigo-50/40", hoverBorder: "hover:border-indigo-300", hoverText: "group-hover:text-indigo-700" },
  { label: "Creator 2: Priya", email: "creator2@demo.com", role: "creator", Icon: Tv, color: "text-indigo-600", hoverBg: "hover:bg-indigo-50/40", hoverBorder: "hover:border-indigo-300", hoverText: "group-hover:text-indigo-700" },
];
