"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import type { RefObject } from "react";
import { useQuizModal } from "@/components/ui/QuizModal";

type StickyCTAProps = {
  heroRef: RefObject<HTMLElement | null>;
  ctaRef: RefObject<HTMLElement | null>;
};

const HERO_LEFT_THRESHOLD_DESKTOP = 0.55;
const HERO_LEFT_THRESHOLD_MOBILE = 0.3;
const MOBILE_BREAKPOINT = 640;
const CTA_VISIBLE_THRESHOLD = 0.08;

export function StickyCTA({ heroRef, ctaRef }: StickyCTAProps) {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { openQuiz } = useQuizModal();

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "start start"],
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const updateVisibility = () => {
    if (!heroRef.current) return;
    const h = heroProgress.get();
    const c = ctaRef.current ? ctaProgress.get() : 0;
    const threshold = isMobile ? HERO_LEFT_THRESHOLD_MOBILE : HERO_LEFT_THRESHOLD_DESKTOP;
    const leftHero = h >= threshold;
    const ctaInView = c > CTA_VISIBLE_THRESHOLD;
    setVisible(leftHero && !ctaInView);
  };

  useMotionValueEvent(heroProgress, "change", updateVisibility);
  useMotionValueEvent(ctaProgress, "change", updateVisibility);

  useEffect(() => {
    updateVisibility();
    const t1 = setTimeout(updateVisibility, 100);
    const t2 = setTimeout(updateVisibility, 400);
    const onScroll = () => requestAnimationFrame(updateVisibility);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isMobile]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 24 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{ opacity: 0, scale: 0.92, y: 8 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 18,
            mass: 0.8,
          }}
          className="fixed bottom-[7.25rem] right-3 z-[60] sm:bottom-[8rem] sm:right-4 md:bottom-8 md:right-6 md:z-40 lg:bottom-10 lg:right-8"
          aria-hidden={!visible}
        >
          <button
            type="button"
            onClick={openQuiz}
            className="inline-flex min-h-[36px] min-w-0 max-w-[calc(100vw-1.5rem)] items-center justify-center rounded-full border border-cyan-300/20 bg-gradient-to-r from-cyan-500/90 to-indigo-600/90 px-3 py-2 text-xs font-medium text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md transition-opacity duration-200 hover:opacity-90 hover:shadow-[0_0_28px_rgba(99,102,241,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-[44px] sm:px-5 sm:py-2.5 sm:text-sm md:min-h-[48px] md:px-6 md:py-3 md:text-base"
          >
            Platiquemos tu proyecto
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
