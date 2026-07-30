"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import { CinematicIntro } from "@/components/CinematicIntro";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { SystemDiagram } from "@/components/sections/SystemDiagram";
import { Portfolio } from "@/components/sections/Portfolio";
import { Process } from "@/components/sections/Process";
import { CTA } from "@/components/sections/CTA";

const StickyCTA = dynamic(() => import("@/components/ui/StickyCTA").then((mod) => ({ default: mod.StickyCTA })), {
  ssr: false,
});

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const [isIntroActive, setIsIntroActive] = useState(true);

  useEffect(() => {
    if (!isIntroActive) return;

    const elements = [document.documentElement, document.body];
    const classes = ["overflow-hidden", "h-screen"];
    const existingClasses = elements.map((element) =>
      classes.filter((className) => element.classList.contains(className)),
    );

    elements.forEach((element) => element.classList.add(...classes));

    return () => {
      elements.forEach((element, elementIndex) => {
        classes.forEach((className) => {
          if (!existingClasses[elementIndex].includes(className)) {
            element.classList.remove(className);
          }
        });
      });
    };
  }, [isIntroActive]);

  return (
    <MotionConfig reducedMotion="user">
      {isIntroActive && (
        <CinematicIntro onComplete={() => setIsIntroActive(false)} />
      )}
      <div aria-hidden={isIntroActive} inert={isIntroActive}>
        <Hero ref={heroRef} canvasPaused={isIntroActive} />
        <Services />
        <SystemDiagram />
        <Portfolio />
        <Process />
        <CTA ref={ctaRef} />
        <StickyCTA heroRef={heroRef} ctaRef={ctaRef} />
      </div>
    </MotionConfig>
  );
}
