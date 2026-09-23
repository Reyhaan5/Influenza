import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Home,
  Megaphone,
  MessageSquare,
  Compass,
  Bookmark,
  Image,
  TrendingUp,
  Building2,
  HelpCircle,
  MessageSquarePlus,
  Gift,
  Send,
  Users,
  LogOut,
  ChevronsRight,
  ChevronDown,
  Briefcase,
  UserCheck,
  Check,
  Plus,
  Sparkles,
  Handshake,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useActiveBrand } from "../../../context/BrandContext";
import { BrandIcon, BrandText } from "../../common/BrandLogo";
import Avatar from "../influencer/Avatar";

export default function BrandSidebar() {
  const [open, setOpen] = useState(true);
  const [orgOpen, setOrgOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();
  const { brands, activeBrand, setActiveBrand } = useActiveBrand();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if current route is inside organization
    if (location.pathname.startsWith("/brand-dashboard/organization")) {
      setOrgOpen(true);
    }
  }, [location.pathname]);

  // Close brand switcher on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setBrandDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSelectBrand = (brand) => {
    setActiveBrand(brand);
    setBrandDropdownOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${
        open ? "w-64" : "w-16"
      } flex flex-col justify-between z-30 select-none`}
    >
      <div>
        {/* Brand Logo / Header -> Links to Main Site */}
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50/50 transition cursor-pointer"
          title="Go to Influenza Main Site"
        >
          <BrandIcon size="h-8 w-8" />
          {open && (
            <div className="min-w-0 flex-1 flex items-center justify-between">
              <BrandText size="text-xl font-bold" />
            </div>
          )}
        </Link>

        {/* MULTI-BRAND WORKSPACE SELECTOR */}
        {open && (
          <div className="p-2 border-b border-gray-100 relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-2xl bg-gray-50/80 hover:bg-gray-100/90 border border-gray-200/70 transition text-left group cursor-pointer"
              title="Switch Active Brand Workspace"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={activeBrand?.name || user?.name || "Brand"} size={34} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-zinc-950 truncate">
                    {activeBrand?.name || user?.name || "Brand Workspace"}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate">
                    {user?.email || activeBrand?.category || "Active Brand"}
                  </p>
                </div>
              </div>
              <ChevronDown
                size={14}
                className={`text-zinc-400 group-hover:text-zinc-700 transition-transform duration-200 ${
                  brandDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {brandDropdownOpen && (
              <div className="absolute top-full left-2 right-2 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-1.5 animate-fadeIn space-y-1">
                <div className="px-2 py-1 text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center justify-between">
                  <span>Workspaces ({brands.length || 1})</span>
                  <span className="text-zinc-900 font-bold">Multi-Brand</span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {brands.length > 0 ? (
                    brands.map((b) => {
                      const isSelected = activeBrand?._id === b._id;
                      return (
                        <button
                          key={b._id}
                          type="button"
                          onClick={() => handleSelectBrand(b)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                            isSelected
                              ? "bg-zinc-100 text-zinc-950 font-bold border border-zinc-200"
                              : "text-zinc-700 hover:bg-zinc-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar name={b.name} size={22} />
                            <span className="truncate">{b.name}</span>
                          </div>
                          {isSelected && <Check size={14} className="text-zinc-950 shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-2 text-xs text-gray-500">
                      Single brand workspace active.
                    </div>
                  )}
                </div>

                <div className="pt-1 border-t border-gray-100">
                  <Link
                    to="/brand-dashboard/organization/brands"
                    onClick={() => setBrandDropdownOpen(false)}
                    className="w-full flex items-center gap-1.5 p-1.5 rounded-lg text-xs font-bold text-[#5E01CE] hover:bg-purple-50 transition"
                  >
                    <Plus size={13} />
                    <span>Manage &amp; Add Brands</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Nav Items */}
        <div className="py-2 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          {/* Dashboard */}
          <NavLink
            to="/brand-dashboard"
            end
            className={({ isActive }) =>
              `flex h-11 w-full items-center rounded-2xl px-2.5 transition-all duration-200 border ${
                isActive
                  ? "bg-white border-zinc-300 text-zinc-950 font-bold shadow-xs"
                  : "border-transparent text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950 font-medium"
              }`
            }
          >
            <div className="grid h-8 w-8 flex-shrink-0 place-content-center">
              <Home size={16} strokeWidth={2} />
            </div>
            {open && <span className="ml-1 text-sm font-semibold tracking-tight text-zinc-950 truncate">Dashboard</span>}
          </NavLink>

          {/* Campaigns */}
          <NavLink
            to="/brand-dashboard/campaigns"
            className={({ isActive }) =>
              `flex h-11 w-full items-center rounded-2xl px-2.5 transition-all duration-200 border ${
                isActive
                  ? "bg-white border-zinc-300 text-zinc-950 font-bold shadow-xs"
                  : "border-transparent text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950 font-medium"
              }`
            }
          >
            <div className="grid h-8 w-8 flex-shrink-0 place-content-center">
              <Megaphone size={16} strokeWidth={2} />
            </div>
            {open && <span className="ml-1 text-sm font-semibold tracking-tight text-zinc-950 truncate">Campaigns</span>}
          </NavLink>

          {/* Chats */}
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `flex h-11 w-full items-center rounded-2xl px-2.5 transition-all duration-200 border ${
                isActive
                  ? "bg-white border-zinc-300 text-zinc-950 font-bold shadow-xs"
                  : "border-transparent text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950 font-medium"
              }`
            }
          >
            <div className="grid h-8 w-8 flex-shrink-0 place-content-center">
              <MessageSquare size={16} strokeWidth={2} />
            </div>
            {open && <span className="ml-1 text-sm font-semibold tracking-tight text-zinc-950 truncate">Chats</span>}
          </NavLink>

          {/* Creator Discovery */}
          <NavLink
            to="/creator-discovery"
            className={({ isActive }) =>
              `flex h-11 w-full items-center rounded-2xl px-2.5 transition-all duration-200 border ${
                isActive
                  ? "bg-white border-zinc-300 text-zinc-950 font-bold shadow-xs"
                  : "border-transparent text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950 font-medium"
              }`
            }
          >
            <div className="grid h-8 w-8 flex-shrink-0 place-content-center">
              <Compass size={16} strokeWidth={2} />
            </div>
            {open && <span className="ml-1 text-sm font-semibold tracking-tight text-zinc-950 truncate">Creator Discovery</span>}
          </NavLink>

          {/* Creator Lists */}
          <NavLink
            to="/brand-dashboard/lists"
            className={({ isActive }) =>
              `flex h-11 w-full items-center rounded-2xl px-2.5 transition-all duration-200 border ${
                isActive
                  ? "bg-white border-zinc-300 text-zinc-950 font-bold shadow-xs"
                  : "border-transparent text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950 font-medium"
              }`
            }
          >
            <div className="grid h-8 w-8 flex-shrink-0 place-content-center">
              <Bookmark size={16} strokeWidth={2} />
            </div>
            {open && <span className="ml-1 text-sm font-semibold tracking-tight text-zinc-950 truncate">Creator Lists</span>}
          </NavLink>

          {/* Creative Library */}
          <NavLink
            to="/brand-dashboard/creatives"
            className={({ isActive }) =>
              `flex h-11 w-full items-center rounded-2xl px-2.5 transition-all duration-200 border ${
                isActive
                  ? "bg-white border-zinc-300 text-zinc-950 font-bold shadow-xs"
                  : "border-transparent text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950 font-medium"
              }`
            }
          >
            <div className="grid h-8 w-8 flex-shrink-0 place-content-center">
              <Image size={16} strokeWidth={2} />
            </div>
            {open && <span className="ml-1 text-sm font-semibold tracking-tight text-zinc-950 truncate">Creative Library</span>}
          </NavLink>

          {/* Requests */}
          <NavLink
            to="/collaboration-requests"
            className={({ isActive }) =>
              `flex h-11 w-full items-center rounded-2xl px-2.5 transition-all duration-200 border ${
                isActive
                  ? "bg-white border-zinc-300 text-zinc-950 font-bold shadow-xs"
                  : "border-transparent text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950 font-medium"
              }`
            }
          >
            <div className="grid h-8 w-8 flex-shrink-0 place-content-center">
              <Send size={16} strokeWidth={2} />
            </div>
            {open && <span className="ml-1 text-sm font-semibold tracking-tight text-zinc-950 truncate">Requests</span>}
          </NavLink>

          {/* Collaborations */}
          <NavLink
            to="/brand-dashboard/collaborations"
            className={({ isActive }) =>
              `flex h-11 w-full items-center rounded-2xl px-2.5 transition-all duration-200 border ${
                isActive
                  ? "bg-white border-zinc-300 text-zinc-950 font-bold shadow-xs"
                  : "border-transparent text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950 font-medium"
              }`
            }
          >
            <div className="grid h-8 w-8 flex-shrink-0 place-content-center">
              <Handshake size={16} strokeWidth={2} />
            </div>
            {open && <span className="ml-1 text-sm font-semibold tracking-tight text-zinc-950 truncate">Collaborations</span>}
          </NavLink>

          {/* Organization Dropdown */}
          <div className="pt-1">
            <button
              onClick={() => setOrgOpen(!orgOpen)}
              className={`flex h-11 w-full items-center justify-between rounded-2xl px-2.5 transition-all duration-200 border cursor-pointer ${
                location.pathname.startsWith("/brand-dashboard/organization")
                  ? "bg-white border-zinc-300 text-zinc-950 font-bold shadow-xs"
                  : "border-transparent text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950 font-medium"
              } ${open ? "pr-3" : ""}`}
            >
              <div className="flex items-center">
                <div className="grid h-8 w-8 flex-shrink-0 place-content-center">
                  <Building2 size={16} strokeWidth={2} />
                </div>
                {open && <span className="ml-1 text-sm font-semibold tracking-tight text-zinc-950">Organization</span>}
              </div>
              {open && (
                <ChevronDown
                  size={14}
                  className={`text-zinc-500 transition-transform duration-200 ${
                    orgOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* Organization Sub-menu (Brands & Team) */}
            {open && orgOpen && (
              <div className="pl-9 pr-2 py-1 space-y-0.5 animate-fadeIn">
                <NavLink
                  to="/brand-dashboard/organization/brands"
                  className={({ isActive }) =>
                    `flex items-center gap-2 py-2 px-3 rounded-xl text-xs transition ${
                      isActive
                        ? "text-zinc-950 font-bold bg-zinc-100 border border-zinc-200"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 font-medium"
                    }`
                  }
                >
                  <Briefcase size={13} />
                  <span>Brands</span>
                </NavLink>

                <NavLink
                  to="/brand-dashboard/organization/team"
                  className={({ isActive }) =>
                    `flex items-center gap-2 py-2 px-3 rounded-lg text-xs transition ${
                      isActive
                        ? "text-[#c026d3] font-bold bg-fuchsia-50/70"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium"
                    }`
                  }
                >
                  <Users size={13} />
                  <span>Team</span>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-gray-100 p-2 space-y-0.5 bg-white">
        <button
          onClick={() => alert("Thank you for your feedback!")}
          className="flex h-9 w-full items-center rounded-xl text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition cursor-pointer"
        >
          <div className="grid h-9 w-9 shrink-0 place-content-center">
            <MessageSquarePlus size={15} />
          </div>
          {open && <span className="truncate">Share feedback</span>}
        </button>

        <div className="flex h-9 w-full items-center justify-between rounded-xl text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition cursor-pointer">
          <div className="flex items-center">
            <div className="grid h-9 w-9 shrink-0 place-content-center">
              <HelpCircle size={15} />
            </div>
            {open && <span>Help</span>}
          </div>
          {open && <ChevronDown size={13} className="text-gray-400 pr-2" />}
        </div>

        <button
          onClick={() => alert("Referral link copied to clipboard!")}
          className="flex h-9 w-full items-center rounded-xl text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition cursor-pointer"
        >
          <div className="grid h-9 w-9 shrink-0 place-content-center">
            <Gift size={15} />
          </div>
          {open && <span className="truncate">Refer a business</span>}
        </button>

        <button
          onClick={handleLogout}
          className="flex h-9 w-full items-center rounded-xl text-xs text-red-600 hover:bg-red-50 transition cursor-pointer"
        >
          <div className="grid h-9 w-9 shrink-0 place-content-center">
            <LogOut size={15} />
          </div>
          {open && <span className="font-semibold">Sign out</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-8 w-full items-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition cursor-pointer"
        >
          <div className="grid h-8 w-8 shrink-0 place-content-center">
            <ChevronsRight
              size={14}
              className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </div>
          {open && <span className="text-[11px] font-medium text-gray-500">Collapse</span>}
        </button>
      </div>
    </nav>
  );
}