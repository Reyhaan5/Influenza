import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Sparkles } from "lucide-react";
import BrandLogo from "../common/BrandLogo";

const SOCIAL_LINKS = [
  { href: "https://instagram.com", title: "Instagram", icon: <img src="/Instagram.svg" alt="Instagram" className="w-4 h-4 object-contain" /> },
  { href: "https://linkedin.com", title: "LinkedIn", icon: <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-4 h-4 object-contain" /> },
  {
    href: "https://x.com", title: "Twitter / X",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
  },
  {
    href: "https://github.com", title: "GitHub",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
  },
];

const NAV_SECTIONS = [
  {
    title: "Platform",
    links: [
      { to: "/creator-discovery", label: "Creator Discovery" },
      { to: "/content-gallery", label: "Portfolio Gallery" },
      { to: "/pricing-calculator", label: "Rate Calculator" },
      { to: "/opportunities", label: "Campaign Feed" },
      { to: "/creator-onboarding", label: "Creator Onboarding" },
    ],
  },
  {
    title: "Workspaces",
    links: [
      { to: "/brand-dashboard", label: "Brand Dashboard" },
      { to: "/influencer-dashboard", label: "Influencer Studio" },
      { to: "/collaborations", label: "Collaborations Hub" },
      { to: "/messages", label: "Direct Messages" },
      { to: "/insider-rate", label: "Pricing Intelligence" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/terms", label: "Terms of Service" },
      { to: "/privacy", label: "Privacy Policy" },
      { href: "mailto:hello@influenza.ai", label: "Contact Support" },
    ],
  },
];

const BOTTOM_LINKS = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/pricing-calculator", label: "Pricing Calculator" },
  { to: "/creator-discovery", label: "Creator Discovery" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-zinc-200 bg-white">
      <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <BrandLogo to="/" size="text-3xl sm:text-4xl" iconSize="h-9 w-9" />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-600 font-medium">
              The transparent workspace connecting brands with authentic creators.
              Deliver accurate rate intelligence, seamless communication, and end-to-end collaboration tracking.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-zinc-100 border border-zinc-200/80 px-3.5 py-1.5 text-xs font-bold text-zinc-900">
              <Sparkles size={13} className="text-[#FF1475]" />
              <span>Built for Creators & Growing Brands</span>
            </div>

            <div className="mt-7 flex gap-3">
              {SOCIAL_LINKS.map(({ href, title, icon }) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={title}
                  aria-label={title}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50/80 text-zinc-700 shadow-xs transition hover:bg-zinc-100 hover:text-zinc-950 hover:-translate-y-0.5"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {NAV_SECTIONS.map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">{title}</h3>
              <ul className="mt-5 space-y-3 text-sm font-medium">
                {links.map(({ to, href, label }) => (
                  <li key={label}>
                    {to ? (
                      <Link to={to} className="text-zinc-600 hover:text-zinc-950 transition">{label}</Link>
                    ) : (
                      <a href={href} className="text-zinc-600 hover:text-zinc-950 transition">{label}</a>
                    )}
                  </li>
                ))}
              </ul>
              {title === "Company" && (
                <div className="mt-7 space-y-2.5 pt-5 border-t border-zinc-100 text-xs font-medium text-zinc-500">
                  <a href="mailto:influenzaryzentechnologies@gmail.com" className="flex items-center gap-2.5 hover:text-zinc-950 transition">
                    <Mail size={14} className="text-zinc-700" />
                    <span>influenzaryzentechnologies@gmail.com</span>
                  </a>
                  <div className="flex items-center gap-2.5">
                    <MapPin size={14} className="text-zinc-700" />
                    <span>Mumbai, India</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-zinc-200/80 pt-8 text-xs font-medium text-zinc-500 sm:flex-row">
          <div>
            © 2026 Influenza. All rights reserved.
            <span className="ml-2 font-semibold text-zinc-700">Made with ❤️ in India</span>
          </div>
          <div className="flex flex-wrap gap-6 text-xs font-medium">
            {BOTTOM_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className="hover:text-zinc-950 transition">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}