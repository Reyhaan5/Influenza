import {
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";

import {
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";

function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-[var(--color-accent)] bg-gradient-to-b from-white via-[#faf8fd] to-[var(--color-background)]">

      {/* Background Glow */}

      <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#8B5FBF]/10 blur-[120px]" />

      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#61398F]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">

        {/* CTA */}

        <div className="rounded-[36px] border border-[var(--color-accent)] bg-white/70 p-12 text-center shadow-xl backdrop-blur-xl">

          <span className="inline-flex rounded-full bg-[#8B5FBF]/10 px-4 py-2 text-sm font-semibold text-[#8B5FBF]">
            Built for Modern Marketing Teams
          </span>

          <h2 className="mt-6 text-4xl font-bold text-[var(--color-text)]">
            Ready to launch your next campaign?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-light)]">
            Discover creators, collaborate with influencers,
            manage campaigns and measure performance from
            one intelligent workspace.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <button className="flex items-center gap-2 rounded-xl bg-[#8B5FBF] px-7 py-4 font-semibold text-white transition hover:scale-105 hover:shadow-xl">
              Get Started
              <ArrowRight size={18} />
            </button>

            <button className="rounded-xl border border-[var(--color-accent)] bg-white px-7 py-4 font-semibold text-[var(--color-text)] transition hover:border-[#8B5FBF] hover:text-[#8B5FBF]">
              Book a Demo
            </button>

          </div>

        </div>

        {/* Main Footer */}

        <div className="mt-24 grid gap-14 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand */}

          <div className="lg:col-span-2">

            <h2 className="text-4xl font-bold text-[var(--color-primary)]">
              Influenza
            </h2>

            <p className="mt-6 max-w-md leading-8 text-[var(--color-text-light)]">
              The modern workspace for brands to discover,
              evaluate and collaborate with creators across
              every stage of influencer marketing.
            </p>

            <div className="mt-6 inline-flex rounded-full bg-[#8B5FBF]/10 px-4 py-2 text-sm font-semibold text-[#8B5FBF]">
              ★ Trusted by growing brands
            </div>

            {/* Social */}

            <div className="mt-8 flex gap-4">

              {[
                FaInstagram,
                FaLinkedinIn,
                FaXTwitter,
                FaGithub,
              ].map((Icon, index) => (
                <button
                  key={index}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-accent)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#8B5FBF] hover:text-white hover:shadow-xl"
                >
                  <Icon size={18} />
                </button>
              ))}

            </div>

          </div>

          {/* Platform */}

          <div>

            <h3 className="font-semibold text-[var(--color-text)]">
              Platform
            </h3>

            <ul className="mt-6 space-y-4">

              {[
                "Creator Discovery",
                "Campaign Workspace",
                "Analytics",
                "Pricing",
              ].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer text-[var(--color-text-light)] transition hover:translate-x-1 hover:text-[#8B5FBF]"
                >
                  {item}
                </li>
              ))}

            </ul>

          </div>

          {/* Resources */}

          <div>

            <h3 className="font-semibold text-[var(--color-text)]">
              Resources
            </h3>

            <ul className="mt-6 space-y-4">

              {[
                "Blog",
                "Documentation",
                "Help Center",
                "API",
              ].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer text-[var(--color-text-light)] transition hover:translate-x-1 hover:text-[#8B5FBF]"
                >
                  {item}
                </li>
              ))}

            </ul>

          </div>

          {/* Company */}

          <div>

            <h3 className="font-semibold text-[var(--color-text)]">
              Company
            </h3>

            <ul className="mt-6 space-y-4">

              {[
                "About",
                "Careers",
                "Roadmap",
                "Contact",
              ].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer text-[var(--color-text-light)] transition hover:translate-x-1 hover:text-[#8B5FBF]"
                >
                  {item}
                </li>
              ))}

            </ul>

            <div className="mt-10 space-y-4">

              <div className="flex items-center gap-3 text-[var(--color-text-light)]">
                <Mail size={18} />
                hello@influenza.ai
              </div>

              <div className="flex items-center gap-3 text-[var(--color-text-light)]">
                <MapPin size={18} />
                Mumbai, India
              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-20 flex flex-col items-center justify-between gap-5 border-t border-[var(--color-accent)] pt-8 text-sm text-[var(--color-text-light)] lg:flex-row">

          <div>
            © 2026 Influenza. All rights reserved.
            <span className="ml-2">
              Made with ❤️ in India
            </span>
          </div>

          <div className="flex gap-8">

            {[
              "Privacy",
              "Terms",
              "Cookies",
              "Security",
            ].map((item) => (
              <span
                key={item}
                className="cursor-pointer transition hover:text-[#8B5FBF]"
              >
                {item}
              </span>
            ))}

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;