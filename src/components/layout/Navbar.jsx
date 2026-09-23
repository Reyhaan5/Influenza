import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut, MessageSquare } from "lucide-react";
import { megaMenu } from "../../constants/navMenu";
import { ShiftingDropDown } from "../ui/ShiftingDropDown";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../dashboard/influencer/Avatar";
import BrandLogo from "../common/BrandLogo";
import ArrowFillButton from "../common/ArrowFillButton";

function AnimatedNavLink({ href, isRoute, children }) {
  const content = (
    <span className="group relative inline-block h-6 overflow-hidden">
      <span className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
        <span className="block text-sm font-bold text-zinc-700">{children}</span>
        <span className="block text-sm font-bold text-[#FF1475]">{children}</span>
      </span>
    </span>
  );
  return isRoute ? (
    <Link to={href} className="inline-block">{content}</Link>
  ) : (
    <a href={href} className="inline-block">{content}</a>
  );
}

function ProfileMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const dashboardPath = user.role === "brand" ? "/brand-dashboard" : "/influencer-dashboard";

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center rounded-full ring-2 ring-transparent hover:ring-pink-400/40 transition-all cursor-pointer"
        aria-label="Account menu"
      >
        <Avatar name={user.name} size={40} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden py-2 z-50">
          <div className="px-4 py-2.5 border-b border-zinc-100 bg-zinc-50/50">
            <p className="text-sm font-bold text-zinc-950 truncate">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>

          <Link
            to={dashboardPath}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
          >
            <LayoutDashboard size={16} className="text-zinc-500" />
            Dashboard
          </Link>

          <Link
            to="/messages"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
          >
            <MessageSquare size={16} className="text-zinc-500" />
            Messages
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl xl:max-w-7xl">
      <div
        className={`flex flex-col items-stretch px-5 sm:px-7 py-2.5 sm:py-3 rounded-3xl sm:rounded-full border border-zinc-200/90 backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "bg-white/95 shadow-xl shadow-zinc-900/5" : "bg-white/90 shadow-md shadow-zinc-900/5"
        }`}
      >
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <BrandLogo to="/" size="text-2xl sm:text-3xl" iconSize="h-8 w-8" />

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <ShiftingDropDown tabs={megaMenu} />
            <AnimatedNavLink href="#cta">Contact</AnimatedNavLink>
          </nav>

          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            {user ? (
              <ProfileMenu user={user} logout={logout} />
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-bold text-zinc-900 hover:text-[#FF1475] transition-colors"
                >
                  Sign In
                </Link>
                <ArrowFillButton
                  btnText="Get Started"
                  to="/signup"
                  size="sm"
                  bgColor="#FF1475"
                  textColor="#ffffff"
                  fillBgColor="#ffffff"
                  fillTextColor="#FF1475"
                  className="shadow-sm shadow-pink-500/25"
                />
              </>
            )}
          </div>

          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 text-zinc-800"
            onClick={() => setIsOpen((o) => !o)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-128 overflow-y-auto opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
          <nav className="flex flex-col gap-4 pb-3">
            {megaMenu.map((tab) => {
              if (!tab.columns) {
                return (
                  <Link
                    key={tab.id}
                    to={tab.href}
                    className="text-base font-bold text-zinc-900"
                    onClick={() => setIsOpen(false)}
                  >
                    {tab.title}
                  </Link>
                );
              }

              const flatItems = tab.columns.flatMap((col) => col.items);
              return (
                <div key={tab.id}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
                    {tab.title}
                  </p>
                  <div className="flex flex-col gap-2">
                    {flatItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="text-sm font-semibold text-zinc-800 hover:text-[#FF1475]"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            <a
              href="#cta"
              className="text-base font-bold text-zinc-900"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
          </nav>

          {user ? (
            <div className="border-t border-zinc-200 pt-4 mt-2">
              <div className="flex items-center gap-3 px-1 mb-4">
                <Avatar name={user.name} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-950 truncate">{user.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  to={user.role === "brand" ? "/brand-dashboard" : "/influencer-dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                >
                  <LayoutDashboard size={16} className="text-zinc-500" />
                  Dashboard
                </Link>
                <Link
                  to="/messages"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                >
                  <MessageSquare size={16} className="text-zinc-500" />
                  Messages
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    navigate("/");
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 text-left w-full cursor-pointer"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 mt-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-2.5 text-sm font-bold text-zinc-900 border border-zinc-200 bg-white hover:bg-zinc-50 rounded-2xl transition-all"
              >
                Sign In
              </Link>
              <ArrowFillButton
                btnText="Get Started Free"
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full justify-center"
                bgColor="#FF1475"
                fillBgColor="#ffffff"
                fillTextColor="#FF1475"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
