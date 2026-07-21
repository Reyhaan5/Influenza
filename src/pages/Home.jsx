import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/hero/Hero";
import TrustStrip from "../components/trust/TrustStrip";

import HowItWorks from "../components/howItWorks/HowItWorks";
import LiveExperience from "../components/product/LiveExperience";
import FAQ from "../components/FAQ/FAQ";
import Footer from "../components/footer/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustStrip />

      {/* TEMPORARY — dashboard preview links, remove once nav is finalized */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <Link
          to="/influencer-dashboard"
          className="px-5 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold shadow-lg hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          View Influencer Dashboard
        </Link>
        <Link
          to="/brand-dashboard"
          className="px-5 py-3 rounded-xl bg-[var(--color-primary-hover)] text-white font-semibold shadow-lg hover:bg-[var(--color-primary)] transition-colors"
        >
          View Brand Dashboard
        </Link>
      </div>
      <HowItWorks />
      <LiveExperience />
      <FAQ />
      <Footer />
    </>
  );
}

export default Home;