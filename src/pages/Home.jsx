import Navbar from "../components/layout/Navbar";
import Hero from "../components/hero/Hero";
import TrustStrip from "../components/trust/TrustStrip";
import StatsCounter from "../components/stats/StatsCounter";
import HowItWorks from "../components/howItWorks/HowItWorks";
import LiveExperience from "../components/product/LiveExperience";
import Testimonials from "../components/testimonials/Testimonials";
import FAQ from "../components/FAQ/FAQ";
import CTASection from "../components/cta/CTASection";
import Footer from "../components/footer/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustStrip />
      <StatsCounter />
      <HowItWorks />
      <LiveExperience />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </>
  );
}

export default Home;