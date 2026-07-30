"use client";

import type { ReactNode } from "react";
import { useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
};

type MobileBottomNavProps = {
  items: NavItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

const spring = { type: "spring", stiffness: 350, damping: 25 } as const;

export function MobileBottomNav({
  items,
  activeIndex,
  onSelect,
}: MobileBottomNavProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [barWidth, setBarWidth] = useState(0);
  const gradientId = `mobile-nav-gradient-${useId().replace(/:/g, "")}`;
  const slotWidth = barWidth / items.length;
  const activeX = slotWidth * activeIndex + slotWidth / 2 - 26;
  const notchCenter =
    activeIndex * (375 / items.length) + 375 / items.length / 2;
  const notchHalfWidth =
    activeIndex === 0 || activeIndex === items.length - 1 ? 36 : 48;
  const notchShoulder = notchHalfWidth * 0.66;
  const notchDepth = 34;
  const backgroundPath = [
    "M 0 18",
    "Q 0 0 10 0",
    `L ${notchCenter - notchHalfWidth} 0`,
    `C ${notchCenter - notchShoulder} 0 ${
      notchCenter - notchShoulder
    } ${notchDepth} ${notchCenter} ${notchDepth}`,
    `C ${notchCenter + notchShoulder} ${notchDepth} ${
      notchCenter + notchShoulder
    } 0 ${notchCenter + notchHalfWidth} 0`,
    "L 365 0",
    "Q 375 0 375 10",
    "L 375 54",
    "Q 375 64 365 64",
    "L 10 64",
    "Q 0 64 0 54",
    "Z",
  ].join(" ");

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const updateWidth = () => setBarWidth(bar.getBoundingClientRect().width);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Navegación principal móvil"
      className="fixed bottom-8 left-4 right-4 z-50 block sm:bottom-10 md:hidden"
    >
      <div
        ref={barRef}
        className="relative h-16 max-w-none shadow-2xl shadow-black/40 backdrop-blur-lg"
      >
        <svg
          viewBox="0 0 375 64"
          preserveAspectRatio="none"
          className="absolute inset-0 h-16 w-full overflow-visible"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.32" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.28" />
            </linearGradient>
          </defs>
          <motion.path
            initial={false}
            animate={{ d: backgroundPath }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            fill="rgba(2, 6, 23, 0.88)"
            stroke={`url(#${gradientId})`}
            strokeWidth="1"
          />
        </svg>

        {barWidth > 0 && (
          <motion.div
            initial={false}
            animate={{ x: activeX }}
            transition={spring}
            className="pointer-events-none absolute -top-6 left-0 z-30 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-cyan-200/25 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            aria-hidden
          >
            {items[activeIndex]?.icon}
          </motion.div>
        )}

        <ul
          className="relative z-20 grid h-full"
          style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        >
          {items.map((item, index) => {
            const active = activeIndex === index;
            return (
              <li key={item.id} className="min-w-0">
                <Link
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault();
                    onSelect(index);
                  }}
                  aria-current={active ? "page" : undefined}
                  className="flex h-full min-w-0 flex-col items-center justify-end gap-1 pb-2 pt-6 text-center text-white/45 outline-none transition-colors hover:text-white focus-visible:text-cyan-300"
                >
                  <span
                    className={`flex h-5 items-center transition-opacity ${
                      active ? "opacity-0" : "opacity-100"
                    }`}
                    aria-hidden
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`max-w-full truncate text-[9px] font-medium ${
                      active ? "text-cyan-300" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
