import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, FileText, ArrowLeft } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/footer/Footer";

export default function Terms() {
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
            <FileText size={22} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Terms of Service</h1>
            <p className="text-xs text-zinc-500 font-medium">Last updated: September 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-zinc-700 leading-relaxed font-normal">
          <section className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/50 space-y-3">
            <h2 className="text-base font-black text-zinc-950">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Influenza platform (&quot;Platform&quot;), you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
            </p>
          </section>

          <section className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/50 space-y-3">
            <h2 className="text-base font-black text-zinc-950">2. User Accounts & Authenticity</h2>
            <p>
              Creators and Brands agree to provide accurate, up-to-date information during onboarding. Any misrepresentation of follower counts, engagement stats, or brand identity may result in immediate suspension of account privileges.
            </p>
          </section>

          <section className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/50 space-y-3">
            <h2 className="text-base font-black text-zinc-950">3. Collaborations & Deliverables</h2>
            <p>
              All deliverables, deadlines, and pricing agreed upon through Influenza Collaboration Requests are binding between the Brand and Creator. Both parties agree to maintain professional communication and respect agreed review windows.
            </p>
          </section>

          <section className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/50 space-y-3">
            <h2 className="text-base font-black text-zinc-950">4. Payments & Pricing Rates</h2>
            <p>
              Deliverable rate cards are denominated in Indian Rupees (₹ INR). Pricing benchmark calculators provide market guidance, while final contracted amounts are defined upon collaboration acceptance.
            </p>
          </section>

          <section className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/50 space-y-3">
            <h2 className="text-base font-black text-zinc-950">5. Contact Information</h2>
            <p>
              For legal inquiries or dispute assistance, contact us at <a href="mailto:legal@influenza.ai" className="font-bold text-zinc-950 underline">legal@influenza.ai</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}