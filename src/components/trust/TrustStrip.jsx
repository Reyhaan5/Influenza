import Section from "../common/Section";
import IndustryCard from "./IndustryCard";
import { industries } from "../../constants/industries";

function TrustStrip() {
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

      <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {industries.map((industry) => (
          <IndustryCard
            key={industry.id}
            icon={industry.icon}
            title={industry.title}
          />
        ))}
      </div>
    </Section>
  );
}

export default TrustStrip;