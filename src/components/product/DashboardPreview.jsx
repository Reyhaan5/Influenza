import GlassCard from "../ui/GlassCard";
import Badge from "../ui/Badge";
import StatusChip from "../ui/StatusChip";
import ProgressBar from "../ui/ProgressBar";
import MetricCard from "../ui/MetricCard";

function DashboardPreview() {
  return (
    <GlassCard className="overflow-hidden p-10 lg:p-12">

      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-[var(--color-accent)] pb-8 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h3 className="text-3xl font-bold text-[var(--color-text)]">
            Summer Collection Launch
          </h3>

          <p className="mt-2 text-lg text-[var(--color-text-light)]">
            Campaign Dashboard
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge>Featured Campaign</Badge>

          <StatusChip
            label="Campaign Live"
            color="green"
          />
        </div>

      </div>

      {/* Dashboard */}
      <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">

        {/* Left */}
        <div className="space-y-10">

          <ProgressBar
            label="Audience Match"
            value={94}
          />

          <ProgressBar
            label="Campaign Health"
            value={87}
            color="green"
          />

          <ProgressBar
            label="Creator Compatibility"
            value={91}
          />

        </div>

        {/* Right */}
        <div className="grid grid-cols-2 gap-6">

          <MetricCard
            title="Reach"
            value="2.4M"
            change="+18%"
          />

          <MetricCard
            title="Creators"
            value="128"
            change="+12"
          />

          <MetricCard
            title="Budget"
            value="₹1.8L"
          />

          <MetricCard
            title="Engagement"
            value="7.2%"
            change="+1.6%"
          />

        </div>

      </div>

    </GlassCard>
  );
}

export default DashboardPreview;