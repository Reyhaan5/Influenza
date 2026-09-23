import React from "react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
}) {
  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-sm flex items-center gap-4 hover:border-zinc-300 transition-all">
      <div className="p-3 rounded-2xl bg-zinc-100/90 border border-zinc-200/80 text-zinc-900 flex-shrink-0 flex items-center justify-center">
        {/* If Icon is standard JSX element, render directly; otherwise render as a React component */}
        {React.isValidElement(Icon) ? Icon : Icon && <Icon size={20} className="text-zinc-900" />}
      </div>

      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          {label}
        </p>

        <p className="font-black text-2xl text-zinc-950 mt-0.5">
          {value}

          {suffix && (
            <span className="text-xs font-medium text-zinc-400 block sm:inline sm:ml-2">
              {suffix}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}