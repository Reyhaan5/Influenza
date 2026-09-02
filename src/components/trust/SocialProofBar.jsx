import React from "react";
import { Users, Target, TrendingUp, LayoutGrid } from "lucide-react";
import Container from "../common/Container";

// Numbers here mirror the figures already used in HeroDashboard /
// DashboardPreview, and the niche count comes from categoryTaxonomy.js —
// kept consistent with the rest of the app rather than inventing new stats.
const stats = [
  { icon: Users, value: "128+", label: "Creators onboarded" },
  { icon: TrendingUp, value: "2.4M", label: "Combined campaign reach" },
  { icon: Target, value: "96%", label: "Avg. campaign match score" },
  { icon: LayoutGrid, value: "6", label: "Niches covered at launch" },
];

function SocialProofBar() {
  return (
    <div className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--color-border)] py-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-1.5 px-4"
            >
              <Icon size={18} className="text-[var(--color-primary)] mb-1" />
              <span className="text-2xl font-extrabold text-[var(--color-text)]">
                {value}
              </span>
              <span className="text-xs font-medium text-[var(--color-text-light)] leading-snug">
                {label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default SocialProofBar;
