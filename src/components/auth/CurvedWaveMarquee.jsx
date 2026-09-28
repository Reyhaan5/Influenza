import React, { useEffect, useRef } from "react";

export default function CurvedWaveMarquee() {
  const textPathRef1 = useRef(null);
  const textPathRef2 = useRef(null);

  useEffect(() => {
    let animId, offset1 = 0, offset2 = -500;
    const animate = () => {
      offset1 = (offset1 - 1.2) % 2400;
      offset2 = (offset2 + 0.9) % 2400;
      if (textPathRef1.current) textPathRef1.current.setAttribute("startOffset", `${offset1}px`);
      if (textPathRef2.current) textPathRef2.current.setAttribute("startOffset", `${offset2}px`);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const marqueeText1 = "✦ INFLUENZA ✦ CREATORS ✦ BRANDS ✦ RATE CARDS ✦ ESCROW ✦ SPONSORSHIPS ✦ DISCOVER ✦ COLLABORATE ".repeat(10);
  const marqueeText2 = "✦ HIGH IMPACT ✦ VERIFIED METRICS ✦ REAL DEALS ✦ SEAMLESS WORKFLOW ✦ SECURE PAYOUTS ".repeat(10);

  return (
    <div className="relative w-full h-full rounded-[28px] xl:rounded-[36px] overflow-hidden bg-[#0A0B10] flex items-center justify-center border border-zinc-800 shadow-xl select-none">
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-[18%] left-[22%] text-indigo-400 text-xs animate-ping">✦</div>
        <div className="absolute top-[32%] right-[18%] text-purple-400 text-xs animate-pulse">✦</div>
        <div className="absolute bottom-[24%] left-[30%] text-pink-400 text-xs animate-pulse">✦</div>
        <div className="absolute bottom-[15%] right-[28%] text-blue-400 text-xs animate-ping">✦</div>
      </div>
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[260px] bg-purple-600/20 rounded-full filter blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[260px] bg-indigo-600/20 rounded-full filter blur-[80px] pointer-events-none" />
      <div className="w-full h-full overflow-hidden flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" className="w-full h-full overflow-hidden block">
          <defs>
            <path id="wavePath1" d="M -600 350 C -300 120, 0 580, 300 350 C 600 120, 900 580, 1200 350 C 1500 120, 1800 580, 2100 350 C 2400 120, 2700 580, 3000 350" fill="none" />
            <path id="wavePath2" d="M -600 480 C -300 620, 0 340, 300 480 C 600 620, 900 340, 1200 480 C 1500 620, 1800 340, 2100 480 C 2400 620, 2700 340, 3000 480" fill="none" />
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4338CA" />
              <stop offset="35%" stopColor="#4F46E5" />
              <stop offset="70%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3730A3" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#4F46E5" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3730A3" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <use href="#wavePath2" stroke="url(#waveGradient2)" strokeWidth="80" strokeLinecap="round" strokeLinejoin="round" />
          <text fill="rgba(255, 255, 255, 0.35)" fontSize="22" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="4px" dy="8">
            <textPath ref={textPathRef2} href="#wavePath2" startOffset="-500px">{marqueeText2}</textPath>
          </text>
          <use href="#wavePath1" stroke="rgba(0,0,0,0.6)" strokeWidth="110" strokeLinecap="round" strokeLinejoin="round" filter="blur(12px)" />
          <use href="#wavePath1" stroke="url(#waveGradient1)" strokeWidth="94" strokeLinecap="round" strokeLinejoin="round" />
          <use href="#wavePath1" stroke="#818CF8" strokeWidth="6" strokeDasharray="16 28" fill="none" opacity="0.8" />
          <text fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="5px" dy="9" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.5))">
            <textPath ref={textPathRef1} href="#wavePath1" startOffset="0px">{marqueeText1}</textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
