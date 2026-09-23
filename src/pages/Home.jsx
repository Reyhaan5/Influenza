import Navbar from "../components/layout/Navbar";
import Hero from "../components/hero/Hero";
import CreatorShowcaseSection from "../components/showcase/CreatorShowcaseSection";
import TrustStrip from "../components/trust/TrustStrip";
import HowItWorks from "../components/howItWorks/HowItWorks";
import CTASection from "../components/cta/CTASection";
import Footer from "../components/footer/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <CreatorShowcaseSection />
      <TrustStrip />
      <HowItWorks />
      <CTASection />
      <Footer />
    </>
  );
}

export default Home;
