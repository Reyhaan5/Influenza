import Section from "../common/Section";
import SectionHeading from "../ui/SectionHeading";
import DashboardPreview from "./DashboardPreview";

function LiveExperience() {
  return (
    <Section id="product">
      <SectionHeading
        eyebrow="Platform"
        title="See Influenza In Action"
        subtitle="Discover creators, estimate campaign pricing and manage collaborations from one intelligent workspace."
      />

      <div className="mt-20">
        <DashboardPreview />
      </div>
    </Section>
  );
}

export default LiveExperience;