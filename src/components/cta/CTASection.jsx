import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Section from "../common/Section";
import ArrowFillButton from "../common/ArrowFillButton";

function CTASection() {
  return (
    <Section id="cta" className="!py-20 relative">
      {/* Keyframes for revolving border beam */}
      <style>{`
        @keyframes revolve-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-revolve {
          animation: revolve-border 6s linear infinite;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative max-w-5xl mx-auto"
      >
        {/* Revolving ambient background blur behind the border */}
        <div className="absolute -inset-1.5 rounded-[40px] overflow-hidden pointer-events-none blur-xl opacity-45">
          <div
            className="absolute inset-[-150%] w-[400%] h-[400%] animate-revolve"
            style={{
              background:
                "conic-gradient(from 0deg, #FF1475 0%, #8D64ED 25%, #6366F1 50%, #8D64ED 75%, #FF1475 100%)",
            }}
          />
        </div>

        {/* 2px Revolving Border wrapper */}
        <div className="relative rounded-[36px] p-[2.5px] overflow-hidden shadow-2xl">
          {/* Revolving conic beam */}
          <div
            className="absolute inset-[-150%] w-[400%] h-[400%] animate-revolve pointer-events-none"
            style={{
              background:
                "conic-gradient(from 0deg, #FF1475 0%, #8D64ED 25%, #6366F1 50%, #8D64ED 75%, #FF1475 100%)",
            }}
          />

          {/* Inner Clean Card */}
          <div className="relative rounded-[33.5px] bg-white px-6 py-14 sm:px-12 sm:py-20 text-center overflow-hidden z-10">
            {/* Subtle background texture / light radial glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="relative z-10 mx-auto max-w-2xl">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 border border-pink-200/80 px-4 py-1.5 text-xs sm:text-sm font-bold text-[#FF1475] shadow-xs">
                <Sparkles size={14} className="text-[#FF1475]" />
                Built for Modern Brands & Creators
              </span>

              {/* Main Headline */}
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 leading-tight">
                Ready to launch your next{" "}
                <span className="bg-gradient-to-r from-[#FF1475] to-purple-600 bg-clip-text text-transparent">
                  campaign?
                </span>
              </h2>

              {/* Subtext */}
              <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-zinc-600 leading-relaxed font-medium">
                Discover verified creators, run seamless collaborations, manage campaigns,
                and scale authentic UGC content from one powerful workspace.
              </p>

              {/* Action Buttons with Animated ArrowFillButton */}
              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
                <ArrowFillButton
                  btnText="Get Started Free"
                  to="/signup"
                  size="lg"
                  bgColor="#FF1475"
                  textColor="#ffffff"
                  fillBgColor="#ffffff"
                  fillTextColor="#FF1475"
                  className="w-full sm:w-auto shadow-lg shadow-pink-500/25"
                />

                <Link
                  to="/creator-discovery"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 px-8 py-3.5 sm:py-4 font-bold text-sm sm:text-base text-zinc-800 shadow-sm transition-all hover:border-zinc-300 active:scale-95"
                >
                  Explore Creators
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

export default CTASection;

