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
      <HowItWorks />
      <LiveExperience />
      <FAQ />
      <Footer />
    </>
  );
}

export default Home;