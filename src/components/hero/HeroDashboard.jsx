import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Users, Target, Wallet } from "lucide-react";

const STATS = [
  { icon: Wallet, label: "Budget", val: "₹2,50,000", delay: 0.8 },
  { icon: Target, label: "Match Score", val: "96%", delay: 1.0 },
];

const CREATORS = [
  { name: "Sarah Johnson", delay: 1.1 },
  { name: "Tech Vision", delay: 1.2 },
  { name: "FitLife", delay: 1.3 },
];

export default function HeroDashboard() {
  return (
    <motion.div
      className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] border border-[var(--color-border)]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
    >
      {/* Window Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-[var(--color-border)]">
        {["danger", "warning", "success"].map((c) => (
          <div key={c} className={`h-3 w-3 rounded-full bg-[var(--color-${c})] opacity-80`} />
        ))}
        <p className="ml-4 font-semibold text-[var(--color-text)]">Campaign Workspace</p>
      </div>

      {/* Campaign */}
      <div className="mt-6">
        <h3 className="text-xl font-bold text-[var(--color-text)]">Summer Collection Launch</h3>
        <p className="mt-1 text-sm text-[var(--color-text-light)]">Lifestyle & Fashion Campaign</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {STATS.map(({ icon: Icon, label, val, delay }) => (
          <motion.div
            key={label}
            className="rounded-xl bg-[var(--color-background)] p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay }}
          >
            <Icon className="text-[var(--color-primary)] mb-2" />
            <p className="text-sm text-[var(--color-text-light)]">{label}</p>
            <h4 className="font-bold text-lg text-[var(--color-text)]">{val}</h4>
          </motion.div>
        ))}
      </div>

      {/* Recommended Creators */}
      <div className="mt-8">
        <h4 className="font-semibold text-[var(--color-text)] mb-4">Recommended Creators</h4>
        <div className="space-y-3">
          {CREATORS.map(({ name, delay }) => (
            <motion.div
              key={name}
              className="flex items-center justify-between text-[var(--color-text)]"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay }}
            >
              <div className="flex items-center gap-3">
                <Users className="text-[var(--color-primary)]" size={18} />
                {name}
              </div>
              <CheckCircle className="text-[var(--color-success)]" size={18} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}