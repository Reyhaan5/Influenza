import React from "react";
import HeroContent from "./HeroContent";
import HeroButtons from "./HeroButtons";
import HeroDashboard from "./HeroDashboard";
import Section from "../common/Section";
import BackgroundGlow from "./BackgroundGlow";

function Hero() {
  return (
    <Section className="relative overflow-hidden pt-40">

      <BackgroundGlow />
    
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Content */}

        <div>

          <HeroContent />

          <HeroButtons />

        </div>

        {/* Right Dashboard */}

        <HeroDashboard />

      </div>

    </Section>
  );
}

export default Hero;