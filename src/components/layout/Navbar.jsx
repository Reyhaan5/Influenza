import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { navigationLinks } from "../../constants/navigation";

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

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
          {/* Logo - Scaled to text-2xl */}
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-[var(--color-primary)] flex-shrink-0">
            Influenza
          </Link>

          {/* Desktop Nav Links - Expanded gaps */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <AnimatedNavLink key={link.id} href={link.href} isRoute={link.isRoute}>
                {link.label}
              </AnimatedNavLink>
            ))}
          </nav>

          {/* Desktop Action Buttons - Enlarged padding and font sizes */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
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
            <Link to="/login" className="w-full text-center px-5 py-3 text-base font-semibold text-[var(--color-text)] border border-[var(--color-border)] rounded-full">
              Sign In
            </Link>
            <Link to="/signup" className="w-full text-center px-5 py-3 text-base font-semibold text-white bg-[var(--color-primary)] rounded-full">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;