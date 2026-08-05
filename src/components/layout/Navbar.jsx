import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { navigationLinks } from "../../constants/navigation";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../dashboard/influencer/Avatar";

function AnimatedNavLink({ href, isRoute, children }) {
  const content = (
    <span className="group relative inline-block overflow-hidden h-6">
      <span className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
        <span className="block text-[var(--color-text)]/70 text-base font-semibold">{children}</span>
        <span className="block text-[var(--color-primary)] text-base font-semibold">{children}</span>
      </span>
    </span>
  );
  return isRoute ? (
    <Link to={href} className="inline-block">{content}</Link>
  ) : (
    <a href={href} className="inline-block">{content}</a>
  );
}

function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dashboardPath = user.role === "brand" ? "/brand-dashboard" : "/influencer-dashboard";

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
      >
        <Avatar name={user.name} size={32} />
        <span className="text-sm font-semibold text-[var(--color-text)] max-w-[7rem] truncate">
          {user.name?.split(" ")[0]}
        </span>
      </button>

      <div
        className={`absolute right-0 top-full mt-2 w-52 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-xl overflow-hidden transition-all duration-200 origin-top-right ${
          open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
        }`}
      >
        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <p className="text-sm font-bold text-[var(--color-text)] truncate">{user.name}</p>
          <p className="text-xs text-[var(--color-text-light)] truncate">{user.email}</p>
        </div>

        <Link
          to={dashboardPath}
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors"
        >
          <LayoutDashboard size={16} />
          Dashboard
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardPath = user?.role === "brand" ? "/brand-dashboard" : "/influencer-dashboard";

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl">
      <div
        className={`flex flex-col items-stretch px-6 sm:px-8 py-4 sm:py-4.5 rounded-[32px] border border-[var(--color-border)] backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "bg-white/90 shadow-xl" : "bg-white/75 shadow-md"
        }`}
      >
        <div className="flex items-center justify-between gap-8 sm:gap-12">
          {/* Logo */}
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-[var(--color-primary)] flex-shrink-0">
            Influenza
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <AnimatedNavLink key={link.id} href={link.href} isRoute={link.isRoute}>
                {link.label}
              </AnimatedNavLink>
            ))}
          </nav>

          {/* Desktop Action Area */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {loading ? (
              <div className="w-32 h-9" /> // avoid layout flash while auth resolves
            ) : user ? (
              <UserMenu user={user} logout={logout} />
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

          {/* Mobile Menu Toggle Button */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 text-[var(--color-text)]"
            onClick={() => setIsOpen((o) => !o)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100 mt-5" : "max-h-0 opacity-0"}`}>
          <nav className="flex flex-col items-center gap-5 pb-3">
            {navigationLinks.map((link) =>
              link.isRoute ? (
                <Link key={link.id} to={link.href} className="text-[var(--color-text)] text-lg font-semibold" onClick={() => setIsOpen(false)}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.id} href={link.href} className="text-[var(--color-text)] text-lg font-semibold" onClick={() => setIsOpen(false)}>
                  {link.label}
                </a>
              )
            )}
          </nav>

          <div className="flex flex-col gap-3 mt-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-1 py-2">
                  <Avatar name={user.name} size={40} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--color-text)] truncate">{user.name}</p>
                    <p className="text-xs text-[var(--color-text-light)] truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  to={dashboardPath}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-5 py-3 text-base font-semibold text-[var(--color-text)] border border-[var(--color-border)] rounded-full"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-center px-5 py-3 text-base font-semibold text-white bg-[var(--color-danger)] rounded-full"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="w-full text-center px-5 py-3 text-base font-semibold text-[var(--color-text)] border border-[var(--color-border)] rounded-full">
                  Sign In
                </Link>
                <Link to="/signup" className="w-full text-center px-5 py-3 text-base font-semibold text-white bg-[var(--color-primary)] rounded-full">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;