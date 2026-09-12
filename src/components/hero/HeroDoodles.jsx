import React from "react";
import { motion } from "framer-motion";

export function ReachDoodle() {
  return (
    <div className="absolute -top-10 -left-4 sm:-left-10 lg:-left-16 flex flex-col items-center pointer-events-none select-none z-10 hidden sm:flex">
      <span className="font-handwriting text-lg md:text-xl text-[#3B82F6] font-bold tracking-wide -rotate-6">
        reach + authority
      </span>
      <svg
        className="w-14 h-10 text-[#3B82F6] -rotate-6 mt-1"
        viewBox="0 0 70 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 5 C 25 15, 38 28, 48 42"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="4 2"
        />
        <path
          d="M38 43 L 50 44 L 46 32"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function ShortFormDoodle() {
  return (
    <div className="absolute -top-12 left-1/3 sm:left-[36%] flex flex-col items-center pointer-events-none select-none z-10 hidden sm:flex">
      <span className="font-handwriting text-lg md:text-xl text-[#FF1475] font-bold tracking-wide -rotate-3">
        short-form video
      </span>
      <svg
        className="w-10 h-8 text-[#FF1475] -rotate-3 mt-0.5"
        viewBox="0 0 50 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 5 C 20 18, 25 25, 28 35"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M20 30 L 29 36 L 33 26"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function StickyNoteDoodle() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 3 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{ scale: 1.05, rotate: 0 }}
      className="absolute -top-14 -right-4 sm:-right-8 lg:-right-20 z-20 pointer-events-auto select-none hidden md:block"
    >
      {/* Tape on top */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/75 backdrop-blur-xs border border-white/60 shadow-xs rotate-1 z-30 pointer-events-none rounded-[2px]" />

      {/* Yellow sticky body */}
      <div className="w-44 lg:w-48 bg-[#FEF08A] text-[#1E293B] p-3.5 sm:p-4 rounded-md shadow-xl border border-yellow-300/80 rotate-2 transition-transform duration-200">
        <h4 className="font-handwriting text-base font-bold text-gray-800 tracking-wider uppercase mb-1.5 border-b border-yellow-300/90 pb-1">
          Pay How You Want
        </h4>
        <ul className="space-y-1 font-handwriting text-sm font-semibold">
          <li className="flex items-center gap-1.5 text-[#E11D48]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
            flat fee
          </li>
          <li className="flex items-center gap-1.5 text-[#EA580C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
            commission
          </li>
          <li className="flex items-center gap-1.5 text-[#2563EB]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            retainers
          </li>
          <li className="flex items-center gap-1.5 text-[#16A34A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
            performance
          </li>
        </ul>
      </div>
    </motion.div>
  );
}

export function CommissionDoodle() {
  return (
    <div className="absolute -bottom-8 -right-4 sm:-right-8 lg:-right-20 flex flex-col items-center pointer-events-none select-none z-10 hidden lg:flex">
      <svg
        className="w-14 h-8 text-[#475569] -rotate-12 mb-0.5"
        viewBox="0 0 60 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 25 C 38 10, 20 8, 8 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 5 L 6 12 L 14 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-handwriting text-base text-[#475569] font-bold tracking-wide -rotate-3 text-center max-w-[130px] leading-tight">
        commission-based sales
      </span>
    </div>
  );
}
