import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Users, Target, Wallet } from "lucide-react";

function HeroDashboard() {
  return (
    <motion.div
      className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] border border-[var(--color-border)]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
    >

      {/* Window Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-[var(--color-border)]">
        <div className="h-3 w-3 rounded-full bg-[var(--color-danger)] opacity-80"></div>
        <div className="h-3 w-3 rounded-full bg-[var(--color-warning)] opacity-80"></div>
        <div className="h-3 w-3 rounded-full bg-[var(--color-success)] opacity-80"></div>

        <p className="ml-4 font-semibold text-[var(--color-text)]">
          Campaign Workspace
        </p>
      </div>

      {/* Campaign */}
      <div className="mt-6">
        <h3 className="text-xl font-bold text-[var(--color-text)]">
          Summer Collection Launch
        </h3>

        <p className="mt-1 text-sm text-[var(--color-text-light)]">
          Lifestyle & Fashion Campaign
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">

        <motion.div
          className="rounded-xl bg-[var(--color-background)] p-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Wallet className="text-[var(--color-primary)] mb-2" />
          <p className="text-sm text-[var(--color-text-light)]">Budget</p>
          <h4 className="font-bold text-lg text-[var(--color-text)]">₹2,50,000</h4>
        </motion.div>

        <motion.div
          className="rounded-xl bg-[var(--color-background)] p-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Target className="text-[var(--color-primary)] mb-2" />
          <p className="text-sm text-[var(--color-text-light)]">
            Match Score
          </p>
          <h4 className="font-bold text-lg text-[var(--color-text)]">96%</h4>
        </motion.div>

      </div>

      {/* Recommended Creators */}
      <div className="mt-8">

        <h4 className="font-semibold text-[var(--color-text)] mb-4">
          Recommended Creators
        </h4>

        <div className="space-y-3">
          {[
            { name: "Sarah Johnson", delay: 1.1 },
            { name: "Tech Vision", delay: 1.2 },
            { name: "FitLife", delay: 1.3 },
          ].map((creator) => (
            <motion.div
              key={creator.name}
              className="flex items-center justify-between text-[var(--color-text)]"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: creator.delay }}
            >
              <div className="flex items-center gap-3">
                <Users className="text-[var(--color-primary)]" size={18} />
                {creator.name}
              </div>

              <CheckCircle className="text-[var(--color-success)]" size={18} />
            </motion.div>
          ))}
        </div>

      </div>

    </motion.div>
  );
}

export default HeroDashboard;