import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  TrendingUp,
  Search,
  Send,
  Mail,
  Camera,
  Settings,
  LogOut,
  ChevronsRight,
  ChevronDown,
  User,
  PenSquare,
  Power,
  UserCog,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import Avatar from "./Avatar";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: Home, to: "/influencer-dashboard" },
  { key: "account", label: "My Account", icon: UserCog, to: "/account" },
  { key: "insider-rate", label: "Insider Rate", icon: TrendingUp, to: "/insider-rate" },
  { key: "opportunities", label: "Opportunities", icon: Search, to: "/opportunities" },
  { key: "requests", label: "Invitations", icon: Send, to: "/collaboration-requests" },
  { key: "inbox", label: "Inbox", icon: Mail, to: "/messages" },
  { key: "collaborations", label: "Collaborations", icon: Camera, comingSoon: true },
];

export default function InfluencerSidebar() {
  const [open, setOpen] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 ease-in-out ${
        open ? "w-64" : "w-16"
      } flex flex-col`}
    >
      {/* Account Profile Header Dropdown */}
      <div className="relative border-b border-[var(--color-border)]" ref={accountRef}>
        <button
          onClick={() => setAccountOpen((o) => !o)}
          className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-[var(--color-background)] transition-colors"
        >
          <Avatar name={user?.name} size={36} />
          {open && (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--color-text)] truncate">
                  {user?.name || "Creator"}
                </p>
                <p className="text-xs text-[var(--color-text-light)] truncate">
                  {user?.email}
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`flex-shrink-0 text-[var(--color-text-light)] transition-transform duration-200 ${
                  accountOpen ? "rotate-180" : ""
                }`}
              />
            </>
          )}
        </button>

        {accountOpen && (
          <div
            className={`absolute z-20 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl py-2 overflow-hidden ${
              open ? "left-3 right-3 top-full mt-1" : "left-full top-2 ml-2 w-56"
            }`}
          >
            {/* Opens Dashboard */}
            <Link
              to="/influencer-dashboard"
              onClick={() => setAccountOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-background)]"
            >
              <User size={16} className="text-[var(--color-primary)]" />
              Your Profile
            </Link>

            {/* Edit Profile -> Redirects to Account Settings page */}
            <Link
              to="/account?tab=account-settings"
              onClick={() => setAccountOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-background)]"
            >
              <UserCog size={16} className="text-[var(--color-primary)]" />
              Edit Profile
            </Link>

            <button
              disabled
              title="Coming soon"
              className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm font-medium text-[var(--color-text-light)]/60 cursor-not-allowed"
            >
              <PenSquare size={16} />
              Edit Templates
              <span className="ml-auto text-[9px] font-bold uppercase tracking-wide bg-[var(--color-background)] px-1.5 py-0.5 rounded-full">
                Soon
              </span>
            </button>

            <div className="border-t border-[var(--color-border)] my-1" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
            >
              <Power size={16} />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Navigation Links */}
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

      {/* Footer Actions */}
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

      {/* Collapse Toggle */}
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
            <span className="text-sm font-medium text-[var(--color-text-light)]">Collapse</span>
          )}
        </div>
      </button>
    </nav>
  );
}