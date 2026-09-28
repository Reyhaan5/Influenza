import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";

export default function FilterDropdown({ label, value, options, onChange, isPremium, customRender }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options?.find((o) => o.value === value);
  const displayLabel = selectedOption?.value ? selectedOption.label : label;
  const hasActiveValue = !!value;

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
          hasActiveValue
            ? "border-black bg-black text-white font-semibold shadow-sm"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        {isPremium && (
          <span className="absolute -top-2.5 right-2 px-1.5 py-0.2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-[9px] font-extrabold rounded-full shadow-sm uppercase tracking-tight">
            Premium
          </span>
        )}
        <span>{displayLabel}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""} ${hasActiveValue ? "text-white" : "text-gray-400"}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 min-w-[170px] bg-white border border-gray-200 rounded-2xl shadow-xl z-40 py-1.5 overflow-hidden animate-fadeIn">
          {customRender ? (
            customRender(() => setOpen(false))
          ) : (
            options?.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-3.5 py-2 text-xs transition flex items-center justify-between cursor-pointer ${
                  value === opt.value ? "bg-gray-100 font-bold text-black" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <CheckCircle2 size={13} className="text-black" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
