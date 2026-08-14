import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Megaphone, Search, Users, Send } from "lucide-react";

const links = [
  { to: "/brand-dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/brand-dashboard/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/brand-dashboard/search", label: "Search Creators", icon: Search },
  { to: "/collaboration-requests", label: "Requests", icon: Send },
  { to: "/brand-dashboard/collaborations", label: "Collaborations", icon: Users },
];

export default function BrandNav() {
  return (
    <div className="flex flex-wrap gap-2 mb-8 border-b border-[var(--color-border)] pb-4">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              isActive
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-text)] hover:bg-[var(--color-background)]"
            }`
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </div>
  );
}