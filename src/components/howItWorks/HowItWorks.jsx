import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Section from "../common/Section";
import FlowButton from "../common/FlowButton";
import { howItWorksSteps } from "../../constants/howItWorks";

const Pin = ({ color = "#1E9DF1", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill={color}
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

function HowItWorks() {
  const containerRef = useRef(null);
  const pinRefs = useRef([]);
  const [pathD, setPathD] = useState("");

  const updatePath = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const points = pinRefs.current
      .filter(Boolean)
      .map((pin) => {
        const rect = pin.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
      });

    if (points.length < 2) return;

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const midY = (p1.y + p2.y) / 2;
      d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
    }
    setPathD(d);
  }, []);

  useEffect(() => {
    updatePath();
    window.addEventListener("resize", updatePath);
    const timer = setTimeout(updatePath, 200);
    return () => {
      window.removeEventListener("resize", updatePath);
      clearTimeout(timer);
    };
  }, [updatePath]);

  return (
    <Section id="how-it-works" className="!py-12">
      <div
        className="relative overflow-hidden rounded-[36px] bg-[#0A0E14] border border-white/10 shadow-2xl px-6 py-16 md:px-12 md:py-24"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 39px, rgba(255,255,255,0.04) 39px, rgba(255,255,255,0.04) 40px)",
        }}
      >
        {/* Glow ambient lights */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-[var(--color-primary)]/10 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-[var(--color-primary)]/10 blur-[120px]" />

        {/* Section Heading */}
        <div className="relative z-20 text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm shadow-sm"
          >
            <Sparkles size={14} className="text-[var(--color-primary)]" />
            Streamlined Workflow
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            How <span className="text-[var(--color-primary)]">Influenza</span> Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed"
          >
            A 5-step intelligent workflow engineered for modern marketing teams to discover,
            evaluate, and collaborate with verified creators.
          </motion.p>
        </div>

        {/* Zigzag Timeline Container */}
        <div ref={containerRef} className="relative max-w-4xl mx-auto py-6">
          {/* Dynamic Curved Dashed Connector Line */}
          {pathD && (
            <svg className="pointer-events-none absolute inset-0 h-full w-full z-10 overflow-visible">
              <path
                d={pathD}
                fill="none"
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>
          )}

          {/* Stepped Cards List */}
          <div className="relative z-20 flex flex-col space-y-8 md:space-y-6">
            {howItWorksSteps.map((step, idx) => {
              const isEven = idx % 2 === 1; // 0: Left, 1: Right, 2: Left, 3: Right, 4: Left

              return (
                <div
                  key={step.id}
                  className={`flex w-full ${
                    isEven ? "justify-end md:pr-10" : "justify-start md:pl-10"
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`relative w-full max-w-[340px] sm:max-w-[380px] transition-transform duration-300 hover:z-40 hover:scale-105 ${step.rotate} hover:rotate-0`}
                  >
                    {/* Pin element anchored at top center */}
                    <div
                      ref={(el) => (pinRefs.current[idx] = el)}
                      className="relative z-30 mx-auto -mb-3.5 flex h-9 w-9 items-center justify-center cursor-pointer"
                    >
                      <Pin color={step.color} className="drop-shadow-lg" />
                    </div>

                    {/* Outer Card Body */}
                    <div
                      className="rounded-[26px] p-6 sm:p-7 border transition-all duration-300 shadow-2xl"
                      style={{
                        backgroundColor: "#11161D",
                        borderColor: `${step.color}40`,
                        boxShadow: `0 14px 35px -10px rgba(0,0,0,0.6), 0 0 24px -6px ${step.color}25`,
                      }}
                    >
                      {/* Step Number */}
                      <span
                        className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                        style={{ color: step.color }}
                      >
                        {step.number}
                      </span>

                      {/* Title */}
                      <h3 className="mt-3 text-xl font-bold text-white tracking-tight">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2.5 text-sm leading-relaxed text-neutral-400">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-20 mt-16 text-center max-w-xl mx-auto"
        >
          <p className="text-sm text-neutral-400 mb-5">
            Ready to launch your campaign with top creators?
          </p>
          <FlowButton
            to="/signup"
            text="Get Started Free"
            className="px-8 py-3.5 text-sm font-semibold"
          />
        </motion.div>
      </div>
    </Section>
  );
}

export default HowItWorks;