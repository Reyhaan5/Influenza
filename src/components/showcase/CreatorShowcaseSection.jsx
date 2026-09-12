import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MessageSquare, User, Sparkles, Send, CheckCircle2, ChevronDown, Check, Flame, Award } from "lucide-react";
import { FaTiktok, FaInstagram } from "react-icons/fa";

export const COUNTRIES = [
  { code: "ca", dialCode: "+1", name: "Canada" },
  { code: "gb", dialCode: "+44", name: "UK" },
  { code: "us", dialCode: "+1", name: "USA" },
  { code: "au", dialCode: "+61", name: "Australia" },
  { code: "de", dialCode: "+49", name: "Germany" },
  { code: "es", dialCode: "+34", name: "Spain" },
  { code: "it", dialCode: "+39", name: "Italy" },
  { code: "fr", dialCode: "+33", name: "France" },
  { code: "jp", dialCode: "+81", name: "Japan" },
  { code: "br", dialCode: "+55", name: "Brazil" },
  { code: "nl", dialCode: "+31", name: "Netherlands" },
  { code: "se", dialCode: "+46", name: "Sweden" },
  { code: "mx", dialCode: "+52", name: "Mexico" },
  { code: "in", dialCode: "+91", name: "India" },
  { code: "ae", dialCode: "+971", name: "UAE" },
  { code: "ch", dialCode: "+41", name: "Switzerland" },
];

export function CountryFlag({ code, name, className = "w-4.5 h-3.5" }) {
  // Convert 2-letter ISO code to Twemoji hex code points for crisp waving flag SVGs
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => (0x1f1e6 - 65 + char.charCodeAt(0)).toString(16))
    .join("-");

  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codePoints}.svg`}
      alt={name || code}
      loading="lazy"
      className={`inline-block object-contain flex-shrink-0 drop-shadow-xs ${className}`}
    />
  );
}

export default function CreatorShowcaseSection() {
  const sectionRef = useRef(null);
  const [selectedTemplate, setSelectedTemplate] = useState("Product seeding template");
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);

  // Scroll linked animation setup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smooth springs for high quality feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  });

  // Country marquee on scroll translation: moves horizontally as the user scrolls
  const marqueeX = useTransform(smoothProgress, [0, 1], ["0%", "-35%"]);

  // Creator cards spread / fan-out effect on scroll:
  // Starts stacked closer together, spreads apart as user scrolls in!
  const spreadLeftX = useTransform(smoothProgress, [0.1, 0.55], [0, -90]);
  const spreadLeftRotate = useTransform(smoothProgress, [0.1, 0.55], [0, -9]);
  const spreadRightX = useTransform(smoothProgress, [0.1, 0.55], [0, 90]);
  const spreadRightRotate = useTransform(smoothProgress, [0.1, 0.55], [0, 9]);
  const centerScale = useTransform(smoothProgress, [0.1, 0.55], [0.96, 1.04]);
  const centerY = useTransform(smoothProgress, [0.1, 0.55], [0, -12]);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-[#FCFCFD] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Feature Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          
          {/* ========================================================
              CARD 1: VETTED CREATOR MARKETPLACE
             ======================================================== */}
          <div className="bg-white rounded-[32px] border border-gray-200/90 shadow-xl shadow-gray-200/50 p-6 sm:p-9 flex flex-col justify-between overflow-hidden relative group">
            
            {/* Top Info */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FFF0F5] text-[#FF1475] border border-pink-100">
                Vetted Creator Marketplace
              </span>

              <h3 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                115k+ responsive creators across 57+ countries
              </h3>

              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                Every creator has been carefully onboarded, completed our
                education program, and actively uses our mobile app; so you can
                connect with responsive talent effortlessly.
              </p>
            </div>

            {/* Visual Display Container with Country Marquee and Spreading Cards */}
            <div className="w-full bg-gradient-to-b from-[#FFF5F8] via-[#FFF0F5]/50 to-pink-50/20 rounded-2xl border border-pink-100/80 p-4 sm:p-6 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
              
              {/* --- Country Flags Marquee on Scroll --- */}
              <div className="w-full overflow-hidden relative pb-4 select-none">
                {/* Side fade masks */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#FFF5F8] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FFF5F8] to-transparent z-10 pointer-events-none" />

                <motion.div
                  style={{ x: marqueeX }}
                  className="flex items-center gap-2.5 w-max"
                >
                  {[...COUNTRIES, ...COUNTRIES, ...COUNTRIES].map((c, i) => (
                    <div
                      key={`${c.code}-${i}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] bg-white border-[1.5px] border-[#FF1475]/60 shadow-xs text-xs font-semibold text-gray-900 backdrop-blur-xs whitespace-nowrap hover:scale-105 hover:border-[#FF1475] transition-all cursor-pointer"
                    >
                      <CountryFlag code={c.code} name={c.name} className="w-4.5 h-3.5" />
                      <span className="font-bold text-gray-900 tracking-tight">{c.name}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* --- Spreading Creator Profile Cards on Scroll --- */}
              <div className="relative w-full h-[300px] flex items-center justify-center mt-2">
                
                {/* Slanted Vetted Badge Tag */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  className="absolute -top-3 left-6 sm:left-12 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-pink-300/80 shadow-md -rotate-6 select-none"
                >
                  <span className="w-4 h-4 rounded-full bg-[#FF1475] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                  <span className="text-xs font-bold text-gray-900 tracking-tight">
                    Influenza vetted creator
                  </span>
                </motion.div>

                {/* Left Spreading Card (Norguigil / Germany) */}
                <motion.div
                  style={{
                    x: spreadLeftX,
                    rotate: spreadLeftRotate,
                  }}
                  whileHover={{ scale: 1.05, zIndex: 40 }}
                  className="absolute w-[185px] sm:w-[210px] bg-white rounded-2xl border border-gray-200/90 shadow-xl p-3.5 z-10 transition-shadow select-none origin-bottom-right"
                >
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                      alt="Creator Norguigil"
                      className="w-full h-full object-cover rounded-full ring-2 ring-pink-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-xs">
                      <FaInstagram />
                    </div>
                  </div>

                  <h4 className="text-center text-sm font-bold text-gray-900 truncate">
                    Norguigil
                  </h4>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 mb-2">
                    <CountryFlag code="de" name="Germany" className="w-3.5 h-2.5" />
                    <span>Germany</span>
                  </div>

                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-pink-50 text-[10px] font-semibold text-pink-600 border border-pink-100">
                      ★ Vetted Creator
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-700">
                    <Flame size={12} className="text-[#FF1475] mr-1" />
                    33% ER
                  </div>
                </motion.div>

                {/* Right Spreading Card (Elena / Italy) */}
                <motion.div
                  style={{
                    x: spreadRightX,
                    rotate: spreadRightRotate,
                  }}
                  whileHover={{ scale: 1.05, zIndex: 40 }}
                  className="absolute w-[185px] sm:w-[210px] bg-white rounded-2xl border border-gray-200/90 shadow-xl p-3.5 z-10 transition-shadow select-none origin-bottom-left"
                >
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80"
                      alt="Creator Elena"
                      className="w-full h-full object-cover rounded-full ring-2 ring-pink-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-[9px] shadow-xs">
                      <FaTiktok />
                    </div>
                  </div>

                  <h4 className="text-center text-sm font-bold text-gray-900 truncate">
                    Elena Rossi
                  </h4>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 mb-2">
                    <CountryFlag code="it" name="Italy" className="w-3.5 h-2.5" />
                    <span>Italy</span>
                  </div>

                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[10px] font-semibold text-purple-600 border border-purple-100">
                      Top Rated
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-700 px-1">
                    <span className="flex items-center">
                      <Flame size={12} className="text-[#FF1475] mr-0.5" />
                      45% ER
                    </span>
                    <span className="text-gray-400 font-normal">5.8k Reach</span>
                  </div>
                </motion.div>

                {/* Center Hero Card (Nourishment / USA) - elevated & in front */}
                <motion.div
                  style={{
                    scale: centerScale,
                    y: centerY,
                  }}
                  whileHover={{ scale: 1.08 }}
                  className="relative w-[210px] sm:w-[230px] bg-white rounded-2xl border-2 border-pink-300 shadow-2xl p-4 z-20 select-none"
                >
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 mx-auto mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80"
                      alt="Creator Nourishment"
                      className="w-full h-full object-cover rounded-full ring-4 ring-pink-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-[11px] shadow-sm">
                      <FaTiktok />
                    </div>
                  </div>

                  <h4 className="text-center text-base font-extrabold text-gray-900">
                    Nourishment
                  </h4>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mb-2.5">
                    <CountryFlag code="us" name="USA" className="w-4 h-2.5" />
                    <span>United States</span>
                  </div>

                  {/* Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-pink-50 text-[10px] font-bold text-[#FF1475] border border-pink-200">
                      ★ Vetted Creator
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[10px] font-bold text-purple-600 border border-purple-200">
                      UGC Expert
                    </span>
                  </div>

                  {/* Stats Bar */}
                  <div className="py-2 border-t border-b border-gray-100 flex items-center justify-around text-xs font-bold text-gray-800">
                    <span className="flex items-center text-[#FF1475]">
                      <Flame size={13} className="mr-1" />
                      42% ER
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600">
                      2.6k Reach
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 mt-3">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-gray-50 hover:bg-pink-50 hover:text-pink-600 text-[11px] font-bold text-gray-700 border border-gray-200/90 transition-colors"
                    >
                      <MessageSquare size={12} />
                      Chat
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-[11px] font-bold text-gray-700 border border-gray-200/90 transition-colors"
                    >
                      <User size={12} />
                      Profile
                    </button>
                  </div>
                </motion.div>

              </div>

            </div>

          </div>

          {/* ========================================================
              CARD 2: INFLUENCER OUTREACH TOOL
             ======================================================== */}
          <div className="bg-white rounded-[32px] border border-gray-200/90 shadow-xl shadow-gray-200/50 p-6 sm:p-9 flex flex-col justify-between overflow-hidden relative group">
            
            {/* Top Info */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#E8F5FE] text-[#0284C7] border border-sky-100">
                Influencer Outreach Tool
              </span>

              <h3 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Automated outreach to 7M+ influencers
              </h3>

              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                Scale your influencer marketing with effortless, targeted
                outreach - no manual searching needed.
              </p>
            </div>

            {/* Visual Display Container for Outreach Tool */}
            <div className="w-full bg-gradient-to-b from-[#EFF8FF] via-[#E6F3FE]/60 to-sky-50/20 rounded-2xl border border-sky-100/80 p-4 sm:p-6 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
              
              {/* Floating AI Outreach Badge + Creator Stack */}
              <div className="flex items-center justify-between gap-3 w-full pb-3 select-none">
                
                {/* AI Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-pink-200 shadow-sm text-xs font-bold text-gray-900"
                >
                  <Sparkles size={14} className="text-[#FF1475]" />
                  <span>AI-powered email outreach</span>
                </motion.div>

                {/* Multi-Avatar Cluster */}
                <div className="flex items-center -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
                    alt="Influencer 1"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80"
                    alt="Influencer 2"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-[10px] ring-2 ring-white shadow-xs">
                    <FaTiktok />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-[10px] ring-2 ring-white shadow-xs">
                    <FaInstagram />
                  </div>
                </div>
              </div>

              {/* Email Outreach Composer Mockup Card */}
              <div className="w-full bg-white rounded-2xl border border-gray-200/90 shadow-2xl p-4 sm:p-5 relative mt-2">
                
                {/* Controls Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-gray-100">
                  
                  {/* Select email template */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsTemplateOpen(!isTemplateOpen)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <span>{selectedTemplate}</span>
                      <ChevronDown size={13} className="text-gray-400" />
                    </button>

                    {isTemplateOpen && (
                      <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-40">
                        {["Product seeding template", "Paid UGC collaboration", "Affiliate revenue share"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              setSelectedTemplate(t);
                              setIsTemplateOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-sky-50 hover:text-sky-700 text-gray-700 flex items-center justify-between"
                          >
                            <span>{t}</span>
                            {selectedTemplate === t && <Check size={12} className="text-sky-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Creator List + AI Auto Fill */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-200 text-[11px] font-bold text-purple-700">
                      <Sparkles size={11} />
                      AI Auto-Fill
                    </span>

                    {/* Launch Outreach Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLaunched(true);
                        setTimeout(() => setIsLaunched(false), 3000);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-all ${
                        isLaunched
                          ? "bg-emerald-600"
                          : "bg-gradient-to-r from-[#FF006E] to-[#E11D48] hover:scale-105 active:scale-95"
                      }`}
                    >
                      {isLaunched ? (
                        <>
                          <Check size={13} />
                          Outreach Sent!
                        </>
                      ) : (
                        <>
                          <Send size={12} />
                          Launch outreach
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Email Content Body */}
                <div className="pt-3.5 space-y-2.5 text-xs text-gray-700 font-sans">
                  <div className="font-semibold text-gray-900 flex items-center gap-1">
                    <span className="text-gray-400 font-medium">Subject:</span>
                    <span>[Creator] we have an exciting offer for you..</span>
                  </div>

                  <div className="pt-1 text-gray-600 space-y-2 leading-relaxed">
                    <p>
                      Hi{" "}
                      <span className="px-1.5 py-0.5 rounded-md bg-pink-100 text-[#FF1475] font-bold">
                        First name
                      </span>
                      ,
                    </p>
                    <p>
                      My name is Irina, and I'm part of the creators team at{" "}
                      <span className="px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700 font-bold">
                        Brand name
                      </span>
                      , an official Meta and TikTok Partner.
                    </p>
                    <p className="hidden sm:block text-gray-500 text-[11px]">
                      We’ve been following your recent content and would love to partner up for our new product launch campaign...
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
