import Section from "../common/Section";
import StepCard from "./StepCard";
import { howItWorksSteps } from "../../constants/howItWorks";

function HowItWorks() {
  return (
    <Section id="how-it-works">
      {/* Heading */}

      <div className="text-center max-w-3xl mx-auto">

        <h2 className="text-4xl font-bold text-[var(--color-text)]">
          How Influenza Works
        </h2>

        <p className="mt-5 text-lg text-[var(--color-text-light)]">
          A streamlined workflow that helps marketing teams discover,
          evaluate and collaborate with the right creators from a
          single intelligent workspace.
        </p>

      </div>

      {/* Cards */}

      <div className="mt-20 grid gap-8 lg:grid-cols-3">

        {howItWorksSteps.map((step) => (
          <StepCard
            key={step.id}
            icon={step.icon}
            title={step.title}
            description={step.description}
          />
        ))}

      </div>
    </Section>
  );
}

export default HowItWorks;