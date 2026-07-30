"use client";

import { useEffect, useRef, useState } from "react";
import { DesktopNav } from "@/components/DesktopNav";
import {
  MobileBottomNav,
  type NavItem,
} from "@/components/MobileBottomNav";

const iconClassName = "h-[18px] w-[18px]";

const navItems: NavItem[] = [
  {
    id: "hero",
    label: "Inicio",
    href: "#hero",
    icon: (
      <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 11.5 12 4l9 7.5V20H7v-6h10v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "servicios",
    label: "Servicios",
    href: "#servicios",
    icon: (
      <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    id: "portfolio",
    label: "Proyectos",
    href: "#portfolio",
    icon: (
      <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 7.5h16v11H4zM8 7.5V5h8v2.5M4 12h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "proceso",
    label: "Proceso",
    href: "#proceso",
    icon: (
      <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6 5h12M6 12h12M6 19h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="6" cy="5" r="2" fill="currentColor" />
        <circle cx="18" cy="12" r="2" fill="currentColor" />
        <circle cx="10" cy="19" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "contacto",
    label: "Contacto",
    href: "#contacto",
    icon: (
      <svg className={iconClassName} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 5h14v11H9l-4 3V5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m8 9 4 3 4-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isManualClicking = useRef(false);
  const manualUnlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelect = (index: number) => {
    const item = navItems[index];
    const section = document.getElementById(item.id);

    isManualClicking.current = true;
    setActiveIndex(index);
    if (manualUnlockTimer.current) clearTimeout(manualUnlockTimer.current);

    section?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", item.href);

    manualUnlockTimer.current = setTimeout(() => {
      isManualClicking.current = false;
    }, 800);
  };

  useEffect(() => {
    let animationFrame = 0;

    const updateActiveSection = () => {
      if (isManualClicking.current) return;

      const marker = window.innerHeight * 0.38;
      let nextIndex = 0;

      navItems.forEach((item, index) => {
        const section = document.getElementById(item.id);
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top <= marker) nextIndex = index;
      });

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8
      ) {
        nextIndex = navItems.length - 1;
      }
      setActiveIndex(nextIndex);
    };

    const handleScroll = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (manualUnlockTimer.current) clearTimeout(manualUnlockTimer.current);
    };
  }, []);

  return (
    <>
      <MobileBottomNav
        items={navItems}
        activeIndex={activeIndex}
        onSelect={handleSelect}
      />
      <DesktopNav
        items={navItems}
        activeIndex={activeIndex}
        onSelect={handleSelect}
      />
    </>
  );
}
