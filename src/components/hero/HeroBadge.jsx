import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function HeroBadge() {
  return (
    <motion.div
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        px-4
        py-2
        shadow-sm
      "
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <Sparkles
        size={16}
        className="text-[var(--color-primary)]"
      />

      <span className="text-sm font-semibold text-[var(--color-primary-hover)]">
        Campaign Intelligence Platform
      </span>
    </motion.div>
  );
}

export default HeroBadge;