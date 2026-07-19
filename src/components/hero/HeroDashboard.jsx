import React from "react";
import { CheckCircle, Users, Target, Wallet } from "lucide-react";

function HeroDashboard() {
  return (
    <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] border border-[var(--color-border)]">

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

        <div className="rounded-xl bg-[var(--color-background)] p-4">
          <Wallet className="text-[var(--color-primary)] mb-2" />
          <p className="text-sm text-[var(--color-text-light)]">Budget</p>
          <h4 className="font-bold text-lg text-[var(--color-text)]">₹2,50,000</h4>
        </div>

        <div className="rounded-xl bg-[var(--color-background)] p-4">
          <Target className="text-[var(--color-primary)] mb-2" />
          <p className="text-sm text-[var(--color-text-light)]">
            Match Score
          </p>
          <h4 className="font-bold text-lg text-[var(--color-text)]">96%</h4>
        </div>

      </div>

      {/* Recommended Creators */}
      <div className="mt-8">

        <h4 className="font-semibold text-[var(--color-text)] mb-4">
          Recommended Creators
        </h4>

        <div className="space-y-3">

          <div className="flex items-center justify-between text-[var(--color-text)]">
            <div className="flex items-center gap-3">
              <Users className="text-[var(--color-primary)]" size={18} />
              Sarah Johnson
            </div>

            <CheckCircle className="text-[var(--color-success)]" size={18} />
          </div>

          <div className="flex items-center justify-between text-[var(--color-text)]">
            <div className="flex items-center gap-3">
              <Users className="text-[var(--color-primary)]" size={18} />
              Tech Vision
            </div>

            <CheckCircle className="text-[var(--color-success)]" size={18} />
          </div>

          <div className="flex items-center justify-between text-[var(--color-text)]">
            <div className="flex items-center gap-3">
              <Users className="text-[var(--color-primary)]" size={18} />
              FitLife
            </div>

            <CheckCircle className="text-[var(--color-success)]" size={18} />
          </div>

        </div>

      </div>

    </div>
  );
}

export default HeroDashboard;