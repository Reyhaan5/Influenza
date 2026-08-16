import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut, Mail } from "lucide-react";
import { megaMenu } from "../../constants/navMenu";
import { ShiftingDropDown } from "../ui/ShiftingDropDown";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../dashboard/influencer/Avatar";

function AnimatedNavLink({ href, isRoute, children }) {
  const content = (
    <span className="group relative inline-block h-6 overflow-hidden">
      <span className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
        <span className="block text-base font-semibold text-[var(--color-text)]/70">{children}</span>
        <span className="block text-base font-semibold text-[var(--color-primary)]">{children}</span>
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
        className="flex items-center justify-center rounded-full ring-2 ring-transparent hover:ring-[var(--color-primary)]/30 transition-all"
        aria-label="Account menu"
      >
        <Avatar name={user.name} size={40} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl overflow-hidden py-2">
          <div className="px-4 py-2 border-b border-[var(--color-border)]">
            <p className="text-sm font-semibold text-[var(--color-text)] truncate">{user.name}</p>
            <p className="text-xs text-[var(--color-text-light)] truncate">{user.email}</p>
          </div>

          <Link
            to={dashboardPath}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-background)]"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>

          <Link
            to="/messages"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-background)]"
          >
            <Mail size={16} />
            Messages
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-background)]"
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
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl">
      <div
        className={`flex flex-col items-stretch px-6 sm:px-8 py-4 sm:py-4.5 rounded-[32px] border border-[var(--color-border)] backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "bg-white/90 shadow-xl" : "bg-white/75 shadow-md"
        }`}
      >
        <div className="flex items-center justify-between gap-8 sm:gap-12">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-[var(--color-primary)] flex-shrink-0">
            Influenza
          </Link>

          <nav className="hidden lg:flex items-center gap-4">
            <ShiftingDropDown tabs={megaMenu} />
            <AnimatedNavLink href="#faq">Contact</AnimatedNavLink>
          </nav>

          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {user ? (
              <ProfileMenu user={user} logout={logout} />
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-base font-semibold text-[var(--color-text)] border border-[var(--color-border)] rounded-full hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 text-base font-semibold text-white bg-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 text-[var(--color-text)]"
            onClick={() => setIsOpen((o) => !o)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[32rem] overflow-y-auto opacity-100 mt-5" : "max-h-0 opacity-0"}`}>
          <nav className="flex flex-col gap-6 pb-3">
            {megaMenu.map((tab) => {
              const flatItems = tab.columns.flatMap((col) => col.items);
              return (
                <div key={tab.id}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-light)]">
                    {tab.title}
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {flatItems.map((item) => {
                      if (item.isRoute) {
                        return (
                          <Link
                            key={item.title}
                            to={item.href}
                            className="text-base font-semibold text-[var(--color-text)]"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.title}
                          </Link>
                        );
                      }
                      return (
                        <a
                          key={item.title}
                          href={item.href}
                          className="text-base font-semibold text-[var(--color-text)]"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.title}
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <a
              href="#faq"
              className="text-lg font-semibold text-[var(--color-text)]"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
          </nav>

          {user ? (
            <div className="border-t border-[var(--color-border)] pt-4 mt-2">
              <div className="flex items-center gap-3 px-1 mb-4">
                <Avatar name={user.name} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text)] truncate">{user.name}</p>
                  <p className="text-xs text-[var(--color-text-light)] truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  to={user.role === "brand" ? "/brand-dashboard" : "/influencer-dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 text-sm font-medium text-[var(--color-text)]"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link
                  to="/messages"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 text-sm font-medium text-[var(--color-text)]"
                >
                  <Mail size={16} />
                  Messages
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    navigate("/");
                  }}
                  className="flex items-center gap-2.5 text-sm font-medium text-[var(--color-danger)] text-left w-full"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-4 mt-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-5 py-2.5 text-base font-semibold text-[var(--color-text)] border border-[var(--color-border)] rounded-full hover:border-[var(--color-primary)] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-5 py-2.5 text-base font-semibold text-white bg-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
