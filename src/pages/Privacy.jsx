import React from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/footer/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-950 transition mb-8"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-900">
            <Lock size={22} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-zinc-500 font-medium">Last updated: September 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-zinc-700 leading-relaxed font-normal">
          <section className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/50 space-y-3">
            <h2 className="text-base font-black text-zinc-950">1. Information We Collect</h2>
            <p>
              We collect information provided directly by you when creating an account, onboarding as a creator or brand, connecting social media channels, or initiating collaboration messages.
            </p>
          </section>

          <section className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/50 space-y-3">
            <h2 className="text-base font-black text-zinc-950">2. How We Use Information</h2>
            <p>
              Your profile data is used to calculate rate benchmarks, display public discovery cards to matching brands, facilitate chat communications, and generate collaboration contracts.
            </p>
          </section>

          <section className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/50 space-y-3">
            <h2 className="text-base font-black text-zinc-950">3. Data Security & Storage</h2>
            <p>
              All user passwords, authentication tokens, and private chat histories are encrypted in transit and stored with robust database protections. We never sell your personal data to third-party ad brokers.
            </p>
          </section>

          <section className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/50 space-y-3">
            <h2 className="text-base font-black text-zinc-950">4. Your Data Rights</h2>
            <p>
              You have full right to request account deletion, modify rate card information, or disconnect linked social channels at any time via your account settings.
            </p>
          </section>

          <section className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/50 space-y-3">
            <h2 className="text-base font-black text-zinc-950">5. Contact Privacy Team</h2>
            <p>
              Reach out to our privacy officer directly at <a href="mailto:privacy@influenza.ai" className="font-bold text-zinc-950 underline">privacy@influenza.ai</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}