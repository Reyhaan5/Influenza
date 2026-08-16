import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Wallet,
  TrendingUp,
  Search,
  Send,
  Mail,
  Camera,
  Settings,
  LogOut,
  ChevronsRight,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: Home, to: "/influencer-dashboard" },
  { key: "insider-rate", label: "Insider Rate", icon: TrendingUp, to: "/insider-rate" },
  { key: "opportunities", label: "Opportunities", icon: Search, to: "/opportunities" },
  { key: "requests", label: "Invitations", icon: Send, to: "/collaboration-requests" },
  { key: "inbox", label: "Inbox", icon: Mail, to: "/messages" },
  { key: "collaborations", label: "Collaborations", icon: Camera, comingSoon: true },
];

export default function InfluencerSidebar() {
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 ease-in-out ${
        open ? "w-64" : "w-16"
      } flex flex-col`}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--color-border)]">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white font-black text-sm">
          IZ
        </div>
        {open && (
          <div className="min-w-0">
            <p className="font-extrabold text-[var(--color-primary)] leading-tight truncate">
              Influenza
            </p>
            <p className="text-xs text-[var(--color-text-light)] truncate">
              {user?.name || "Creator"}
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.to && location.pathname === item.to;
          const Icon = item.icon;

          if (item.comingSoon) {
            return (
              <div
                key={item.key}
                className="relative flex h-11 w-full items-center rounded-xl text-[var(--color-text-light)]/50 cursor-not-allowed select-none"
                title={open ? undefined : `${item.label} - coming soon`}
              >
                <div className="grid h-11 w-11 flex-shrink-0 place-content-center">
                  <Icon className="h-4 w-4" />
                </div>
                {open && (
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {item.label}
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-[var(--color-background)] px-1.5 py-0.5 rounded-full">
                      Soon
                    </span>
                  </span>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.key}
              to={item.to}
              className={`flex h-11 w-full items-center rounded-xl transition-colors duration-200 ${
                isActive
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary-hover)] border-l-2 border-[var(--color-primary)]"
                  : "text-[var(--color-text-light)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
              }`}
            >
              <div className="grid h-11 w-11 flex-shrink-0 place-content-center">
                <Icon className="h-4 w-4" />
              </div>
              {open && <span className="text-sm font-semibold">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer: settings + logout */}
      <div className="border-t border-[var(--color-border)] px-2 py-2 space-y-1">
        <div
          className="flex h-11 w-full items-center rounded-xl text-[var(--color-text-light)]/50 cursor-not-allowed"
          title={open ? undefined : "Settings - coming soon"}
        >
          <div className="grid h-11 w-11 flex-shrink-0 place-content-center">
            <Settings className="h-4 w-4" />
          </div>
          {open && (
            <span className="flex items-center gap-2 text-sm font-medium">
              Settings
              <span className="text-[10px] font-bold uppercase tracking-wide bg-[var(--color-background)] px-1.5 py-0.5 rounded-full">
                Soon
              </span>
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex h-11 w-full items-center rounded-xl text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
        >
          <div className="grid h-11 w-11 flex-shrink-0 place-content-center">
            <LogOut className="h-4 w-4" />
          </div>
          {open && <span className="text-sm font-semibold">Sign out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="border-t border-[var(--color-border)] hover:bg-[var(--color-background)] transition-colors"
      >
        <div className="flex items-center px-2 py-3">
          <div className="grid h-9 w-9 place-content-center">
            <ChevronsRight
              className={`h-4 w-4 text-[var(--color-text-light)] transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
          {open && (
            <span className="text-sm font-medium text-[var(--color-text-light)]">
              Collapse
            </span>
          )}
        </div>
      </button>
    </nav>
  );
}