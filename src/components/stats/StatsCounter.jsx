import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Section from "../common/Section";

const stats = [
  {
    value: "500+",
    label: "Verified Creators",
  },
  {
    value: "100+",
    label: "Brands Trust Us",
  },
  {
    value: "1M+",
    label: "Audience Reach",
  },
  {
    value: "50K+",
    label: "Campaigns Matched",
  },
];

function StatsCounter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <Section id="stats">
      {/* Centered Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl lg:text-5xl">
          Trusted by Growing Brands
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[var(--color-text-light)] leading-relaxed">
          Empowering creators and brands to collaborate seamlessly with measurable impact and proven results.
        </p>
      </div>

      {/* Stats Grid: 2x2 on mobile, 4-col on desktop */}
      <div
        ref={ref}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
              duration: 0.5,
              delay: index * 0.15,
              ease: "easeOut",
            }}
            className="flex flex-col items-center justify-center p-6 sm:p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-3xl sm:text-4xl lg:text-4xl font-bold text-[var(--color-primary)]">
              {stat.value}
            </span>
            <span className="mt-2 text-sm sm:text-base font-normal text-[var(--color-text-light)] text-center">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export default StatsCounter;
