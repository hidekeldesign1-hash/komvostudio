"use client";

import { Hero } from "@/components/sections/Hero";
import { TrustBanner } from "@/components/sections/TrustBanner";
import { Agitation } from "@/components/sections/Agitation";
import { Solution } from "@/components/sections/Solution";
import { BentoServices } from "@/components/sections/BentoServices";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ParticlesBackground } from "@/components/ui/ParticlesBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-transparent">
      <ParticlesBackground />
      <div className="relative z-10">
        <Hero />
        <TrustBanner />
        <Agitation />
        <Solution />
        <BentoServices />
        <HowItWorks />
        <FAQ />
        <FinalCTA />
      </div>
    </div>
  );
}
