import React from "react";
import Section from "../common/Section";
import IndustryCard from "./IndustryCard";
import { industries } from "../../constants/industries";

function TrustStrip() {
  // Split industries into two rows for the marquee
  const row1 = industries.slice(0, Math.ceil(industries.length / 2));
  const row2 = industries.slice(Math.ceil(industries.length / 2));

  return (
    <Section>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[var(--color-text)]">
          Built for Modern Marketing Teams
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-[var(--color-text-light)]">
          Whether you're launching products, scaling influencer campaigns,
          or growing brand awareness, Influenza helps marketing teams
          connect with the right creators through intelligent campaign matching.
        </p>
      </div>

      {/* Marquee CSS */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-row { overflow: hidden; }
        .marquee-track {
          display: flex;
          gap: 1rem;
          width: max-content;
        }
        .marquee-left { animation: marquee-left 25s linear infinite; }
        .marquee-right { animation: marquee-right 25s linear infinite; }
        .marquee-row:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mt-14 space-y-4">
        {/* Row 1 — scrolls left */}
        <div className="marquee-row">
          <div className="marquee-track marquee-left">
            {[...row1, ...row1, ...row1, ...row1].map((industry, i) => (
              <IndustryCard
                key={`r1-${i}`}
                icon={industry.icon}
                title={industry.title}
              />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="marquee-row">
          <div className="marquee-track marquee-right">
            {[...row2, ...row2, ...row2, ...row2].map((industry, i) => (
              <IndustryCard
                key={`r2-${i}`}
                icon={industry.icon}
                title={industry.title}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default TrustStrip;