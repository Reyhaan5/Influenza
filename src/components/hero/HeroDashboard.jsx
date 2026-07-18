import { CheckCircle, Users, Target, Wallet } from "lucide-react";

function HeroDashboard() {
  return (
    <div className="rounded-[24px] bg-[var(--color-surface)] p-6 shadow-xl border border-[var(--color-accent)]">

      {/* Window Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-[var(--color-accent)]">
        <div className="h-3 w-3 rounded-full bg-red-400"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
        <div className="h-3 w-3 rounded-full bg-green-400"></div>

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
          <h4 className="font-bold text-lg">₹2,50,000</h4>
        </div>

        <div className="rounded-xl bg-[var(--color-background)] p-4">
          <Target className="text-[var(--color-primary)] mb-2" />
          <p className="text-sm text-[var(--color-text-light)]">
            Match Score
          </p>
          <h4 className="font-bold text-lg">96%</h4>
        </div>

      </div>

      {/* Recommended Creators */}
      <div className="mt-8">

        <h4 className="font-semibold text-[var(--color-text)] mb-4">
          Recommended Creators
        </h4>

        <div className="space-y-3">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="text-[var(--color-primary)]" size={18} />
              Sarah Johnson
            </div>

            <CheckCircle className="text-green-500" size={18} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="text-[var(--color-primary)]" size={18} />
              Tech Vision
            </div>

            <CheckCircle className="text-green-500" size={18} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="text-[var(--color-primary)]" size={18} />
              FitLife
            </div>

            <CheckCircle className="text-green-500" size={18} />
          </div>

        </div>

      </div>

    </div>
  );
}

export default HeroDashboard;