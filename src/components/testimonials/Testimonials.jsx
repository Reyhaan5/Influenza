import Section from "../common/Section";
import { testimonials } from "../../constants/testimonials";
import { Quote } from "lucide-react";

function TestimonialCard({ item }) {
  return (
    <div className="flex h-full w-[320px] shrink-0 select-none flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-200 hover:border-[var(--color-primary)]/40">
      <div>
        {/* User Info Header */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-base font-bold text-[var(--color-primary)]">
            {item.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-semibold text-[var(--color-text)]">
              {item.name}
            </h4>
            <p className="truncate text-sm text-[var(--color-text-light)]">
              {item.role} • {item.company}
            </p>
          </div>
        </div>

        {/* Quote */}
        <div className="mt-4 flex items-start gap-2.5">
          <Quote className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)] fill-[var(--color-primary)]/15" />
          <p className="text-sm leading-relaxed text-[var(--color-text-light)]">
            "{item.quote}"
          </p>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  // Duplicate arrays for a continuous, seamless loop
  const row1 = [...testimonials, ...testimonials];
  const row2 = [...testimonials, ...testimonials];

  return (
    <Section id="testimonials" className="overflow-hidden">
      {/* Marquee Keyframes & Styles */}
      <style>{`
        @keyframes marquee-scroll-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-marquee-left {
          animation: marquee-scroll-left 40s linear infinite;
        }

        .animate-marquee-right {
          animation: marquee-scroll-right 40s linear infinite;
        }

        .marquee-row:hover .animate-marquee-left,
        .marquee-row:hover .animate-marquee-right,
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Section Heading */}
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <span className="inline-flex items-center rounded-full bg-[var(--color-primary)]/10 px-5 py-2 text-sm font-semibold text-[var(--color-primary)]">
          Community Love
        </span>

        <h2 className="mt-6 text-4xl font-bold tracking-tight text-[var(--color-text)] lg:text-5xl">
          What Our Users Say
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-light)]">
          Discover how leading marketing teams and content creators scale authentic
          partnerships, streamline campaigns, and track real ROI with Influenza.
        </p>
      </div>

      {/* Marquee Container with edge gradients */}
      <div className="relative w-full space-y-6 overflow-hidden py-4">
        {/* Left & Right gradient fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--color-background)] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--color-background)] to-transparent sm:w-28" />

        {/* Row 1: Scrolling Left */}
        <div className="marquee-row overflow-hidden">
          <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused]">
            {row1.map((item, index) => (
              <div key={`row1-${item.id}-${index}`} className="mr-6 shrink-0">
                <TestimonialCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="marquee-row overflow-hidden">
          <div className="flex w-max animate-marquee-right hover:[animation-play-state:paused]">
            {row2.map((item, index) => (
              <div key={`row2-${item.id}-${index}`} className="mr-6 shrink-0">
                <TestimonialCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Testimonials;
