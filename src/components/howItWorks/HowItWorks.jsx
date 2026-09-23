import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Building2, User } from "lucide-react";
import Section from "../common/Section";
import ArrowFillButton from "../common/ArrowFillButton";
import { brandSteps, creatorSteps } from "../../constants/howItWorks";

const Pin = ({ color = "#8D64ED", className = "" }) => (
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

export default function HowItWorks() {
  const [activeRole, setActiveRole] = useState("brand"); // "brand" | "creator"
  const currentSteps = activeRole === "brand" ? brandSteps : creatorSteps;

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
    // Reset pins array length
    pinRefs.current = pinRefs.current.slice(0, currentSteps.length);
    const timer = setTimeout(updatePath, 150);
    window.addEventListener("resize", updatePath);
    return () => {
      window.removeEventListener("resize", updatePath);
      clearTimeout(timer);
    };
  }, [activeRole, currentSteps.length, updatePath]);

  return (
    <Section id="how-it-works" className="!py-16 sm:!py-20">
      <div
        className="relative overflow-hidden rounded-[36px] bg-white border border-zinc-200/90 shadow-xl shadow-zinc-900/5 px-6 py-14 sm:px-10 sm:py-18"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 39px, rgba(0,0,0,0.03) 39px, rgba(0,0,0,0.03) 40px)",
        }}
      >
        {/* Soft ambient background glows */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-pink-100/40 blur-[100px] -z-10" />
        <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-purple-100/40 blur-[100px] -z-10" />

        {/* Section Heading */}
        <div className="relative z-20 text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-pink-50 border border-pink-200/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF1475] shadow-xs"
          >
            <Sparkles size={13} className="text-[#FF1475]" />
            Streamlined 4-Step Workflow
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950"
          >
            How <span className="bg-gradient-to-r from-[#FF1475] to-purple-600 bg-clip-text text-transparent">Influenza</span> Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-3.5 text-sm sm:text-base text-zinc-600 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Discover verified talent, structure transparent deliverables in ₹, collaborate effortlessly, and track performance from a unified workspace.
          </motion.p>

          {/* Interactive Role Switcher Pill */}
          <div className="mt-8 inline-flex items-center p-1.5 bg-zinc-100/85 rounded-2xl border border-zinc-200 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveRole("brand")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeRole === "brand"
                  ? "bg-zinc-950 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <Building2 size={16} />
              <span>For Brands</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole("creator")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeRole === "creator"
                  ? "bg-[#FF1475] text-white shadow-sm shadow-pink-500/25"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <User size={16} />
              <span>For Creators</span>
            </button>
          </div>
        </div>

        {/* Pinned Zigzag Timeline with dynamic Arrow & connector line */}
        <div ref={containerRef} className="relative max-w-4xl mx-auto py-4">
          {/* Dynamic Curved Dashed Connector Line with Arrow head */}
          {pathD && (
            <svg className="pointer-events-none absolute inset-0 h-full w-full z-10 overflow-visible">
              <defs>
                <marker
                  id="timeline-arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#FF1475" />
                </marker>
              </defs>
              <path
                d={pathD}
                fill="none"
                stroke="rgba(0, 0, 0, 0.22)"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                markerEnd="url(#timeline-arrow)"
              />
            </svg>
          )}

          {/* Stepped Cards List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="relative z-20 flex flex-col space-y-7 md:space-y-6"
            >
              {currentSteps.map((step, idx) => {
                const isEven = idx % 2 === 1; // 0: Left, 1: Right, 2: Left, 3: Right
                const IconComponent = step.icon;

                return (
                  <div
                    key={step.id}
                    className={`flex w-full ${
                      isEven ? "justify-end md:pr-10" : "justify-start md:pl-10"
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.45, delay: idx * 0.08 }}
                      className={`relative w-full max-w-[340px] sm:max-w-[390px] transition-transform duration-300 hover:z-40 hover:scale-105 ${step.rotate} hover:rotate-0`}
                    >
                      {/* Pin element anchored at top center */}
                      <div
                        ref={(el) => (pinRefs.current[idx] = el)}
                        className="relative z-30 mx-auto -mb-3.5 flex h-9 w-9 items-center justify-center cursor-pointer"
                      >
                        <Pin color={step.color} className="drop-shadow-md" />
                      </div>

                      {/* Outer Card Body */}
                      <div
                        className="rounded-[26px] p-6 sm:p-7 border bg-white backdrop-blur-md transition-all duration-300 shadow-xl group"
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: `${step.color}50`,
                          boxShadow: `0 14px 30px -10px rgba(0,0,0,0.08), 0 0 20px -4px ${step.color}20`,
                        }}
                      >
                        {/* Header Row: Step Number & Tag */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-3xl sm:text-4xl font-black tracking-tight"
                            style={{ color: step.color }}
                          >
                            {step.number}
                          </span>

                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-600 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-full shadow-2xs">
                            {step.tag}
                          </span>
                        </div>

                        {/* Icon & Title */}
                        <div className="mt-3 flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: `${step.color}15`,
                              color: step.color,
                            }}
                          >
                            <IconComponent size={20} />
                          </div>

                          <h3 className="text-lg font-black text-zinc-950 tracking-tight">
                            {step.title}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-600 font-medium">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative z-20 mt-14 pt-8 border-t border-zinc-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left max-w-4xl mx-auto"
        >
          <div>
            <h4 className="text-sm sm:text-base font-black text-zinc-950">
              {activeRole === "brand" ? "Ready to launch your brand campaign?" : "Ready to start receiving brand deals?"}
            </h4>
            <p className="text-xs text-zinc-500 mt-0.5 font-medium">
              {activeRole === "brand" ? "Connect with verified UGC & social media creators in minutes." : "Set your custom rates in ₹ and showcase your content publicly."}
            </p>
          </div>

          <ArrowFillButton
            to={activeRole === "brand" ? "/signup?role=brand" : "/signup?role=influencer"}
            btnText={activeRole === "brand" ? "Start Hiring" : "Join as Creator"}
            size="md"
            bgColor="#FF1475"
            textColor="#ffffff"
            fillBgColor="#ffffff"
            fillTextColor="#FF1475"
            className="shadow-lg shadow-pink-500/20"
          />
        </motion.div>
      </div>
    </Section>
  );
}