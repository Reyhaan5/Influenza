import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Section from "../common/Section";

const floatingDots = [
  { top: "14%", left: "8%", duration: 4.5, delay: 0 },
  { top: "22%", right: "10%", duration: 5.5, delay: 1 },
  { bottom: "18%", left: "16%", duration: 6, delay: 0.5 },
  { bottom: "16%", right: "12%", duration: 5, delay: 1.5 },
];

function CTASection() {
  return (
    <Section id="cta" className="!py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[36px] px-6 py-16 text-center shadow-2xl md:px-12 md:py-20 lg:py-24"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, #000))",
        }}
      >
        {/* Subtle Floating Dot Decorations */}
        {floatingDots.map((dot, index) => (
          <motion.div
            key={index}
            className="pointer-events-none absolute h-3 w-3 rounded-full bg-white/10"
            style={{
              top: dot.top,
              left: dot.left,
              right: dot.right,
              bottom: dot.bottom,
            }}
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: dot.delay,
            }}
          />
        ))}

        {/* Inner Content */}
        <div className="relative z-10 mx-auto max-w-3xl text-white">
          {/* Badge */}
          <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            Built for Modern Marketing Teams
          </span>

          {/* Main Headline */}
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Ready to launch your next campaign?
          </h2>

          {/* Subtext */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Discover creators, collaborate with influencers, manage campaigns,
            and measure performance from one intelligent workspace.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-[var(--color-primary)] shadow-lg transition duration-200 hover:scale-105 hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-transparent px-7 py-4 font-semibold text-white transition duration-200 hover:bg-white/10"
            >
              Book a Demo
            </button>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

export default CTASection;
