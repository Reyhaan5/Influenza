import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "../common/Button";
import { Link } from "react-router-dom";

function HeroButtons() {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <Link to="/signup">
        <Button
          className="
            bg-gradient-to-r
            from-[var(--color-primary)]
            to-[var(--color-primary-hover)]
            text-white
            px-7
            py-3.5
            shadow-lg
            hover:shadow-xl
          "
        >
          Get Started
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </Link>

      <Link to="/pricing-calculator">
        <Button
          variant="secondary"
          className="px-7 py-3.5 flex items-center gap-2"
        >
          <Sparkles size={18} className="text-[var(--color-primary)]" />
          Calculate InfluRate™
        </Button>
      </Link>
    </div>
  );
}

export default HeroButtons;