import React from "react";
import { motion } from "framer-motion";
import HeroBadge from "./HeroBadge";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function HeroContent() {
  return (
    <motion.div
      className="max-w-2xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <HeroBadge />
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="mt-8 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-[var(--color-text)]"
      >
        Find the Right Creators.
        <br />
        <span
          className="bg-gradient-to-r from-[var(--color-primary)] via-[#5BB8F5] to-[var(--color-primary)] bg-[length:200%_auto] bg-clip-text text-transparent"
          style={{
            animation: "gradient-shift 3s ease-in-out infinite",
          }}
        >
          Build Better Campaigns.
        </span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="mt-8 text-lg leading-8 text-[var(--color-text)]/85"
      >
        Influenza helps brands discover, evaluate and collaborate with
        creators through audience intelligence, pricing intelligence and
        campaign matching—making every partnership more relevant,
        measurable and effective.
      </motion.p>

      {/* Gradient animation keyframes */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
      `}</style>
    </motion.div>
  );
}

export default HeroContent;