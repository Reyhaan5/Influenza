import React from "react";
import { ShieldCheck, Sparkles, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const QUALITY_CONFIGS = {
  excellent: {
    label: "Authentic / High Quality",
    tier: "Excellent Quality",
    icon: Sparkles,
    bg: "bg-teal-500/10 text-teal-600 border-teal-500/30",
    darkBg: "dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/40",
    dot: "bg-teal-500",
  },
  good: {
    label: "Verified Quality",
    tier: "Good Quality",
    icon: ShieldCheck,
    bg: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    darkBg: "dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/40",
    dot: "bg-blue-500",
  },
  average: {
    label: "Moderate Engagement",
    tier: "Average Quality",
    icon: AlertTriangle,
    bg: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    darkBg: "dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/40",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low Interaction Risk",
    tier: "Low Quality",
    icon: ShieldAlert,
    bg: "bg-red-500/10 text-red-600 border-red-500/30",
    darkBg: "dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/40",
    dot: "bg-red-500",
  },
};

export function QualityPill({
  quality = "good",
  showIcon = true,
  size = "md",
  className,
}) {
  const normalizedKey = String(quality || "").toLowerCase();
  const config = QUALITY_CONFIGS[normalizedKey] || QUALITY_CONFIGS.good;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full border transition-colors",
        config.bg,
        config.darkBg,
        sizeClasses[size] || sizeClasses.md,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dot)} />
      {showIcon && <IconComponent size={size === "sm" ? 12 : 14} />}
      <span>{config.tier}</span>
    </span>
  );
}

export default QualityPill;
