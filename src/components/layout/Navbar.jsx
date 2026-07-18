import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../common/Button";
import Container from "../common/Container";
import { navigationLinks } from "../../constants/navigation";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
  className={`
    fixed
    top-4
    left-0
    w-full
    z-50
    transition-all
    duration-300
  `}
>
      <Container>
      <nav
  className={`
    h-20
    flex
    items-center
    justify-between
    rounded-2xl
    px-8
    transition-all
    duration-300
    ${
      scrolled
        ? "bg-white/80 backdrop-blur-xl shadow-xl border border-[#D6C6E1]"
        : "bg-transparent"
    }
  `}
>

          {/* Logo */}
          <div className="text-3xl font-extrabold tracking-tight text-[#8B5FBF] cursor-pointer select-none">
            Influenza
          </div>

          {/* Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="font-medium text-[#4A4A4A] hover:text-[#8B5FBF] transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">
                  Sign In
              </Button>
          </Link>
            <Link to="/signup">
              <Button>
                  Get Started
              </Button>
          </Link>
          </div>

        </nav>
      </Container>
    </header>
  );
}

export default Navbar;