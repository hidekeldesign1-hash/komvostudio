"use client";

import type { ReactNode } from "react";
import { useId, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
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
const MOBILE_ITEM_ORDER = [1, 2, 0, 3, 4];

export function MobileBottomNav({
  items,
  activeIndex,
  onSelect,
}: MobileBottomNavProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [barWidth, setBarWidth] = useState(0);
  const orderedItems = MOBILE_ITEM_ORDER.map((itemIndex) => ({
    item: items[itemIndex],
    itemIndex,
  })).filter(({ item }) => Boolean(item));
  const activeDisplayIndex = Math.max(
    0,
    orderedItems.findIndex(({ itemIndex }) => itemIndex === activeIndex),
  );
  const gradientId = `mobile-nav-gradient-${useId().replace(/:/g, "")}`;
  const slotWidth = barWidth / orderedItems.length;
  const activeX = slotWidth * activeDisplayIndex + slotWidth / 2 - 26;
  const notchCenter =
    activeDisplayIndex * (375 / orderedItems.length) +
    375 / orderedItems.length / 2;
  const isFirst = activeDisplayIndex === 0;
  const isLast = activeDisplayIndex === orderedItems.length - 1;
  const notchHalfWidth =
    isFirst || isLast ? 38 : 48;
  const notchShoulder = notchHalfWidth * 0.66;
  const notchDepth = 34;
  const backgroundPath = isFirst
    ? [
        `M 0 ${notchDepth}`,
        `L ${notchCenter} ${notchDepth}`,
        `C ${notchCenter + notchShoulder} ${notchDepth} ${
          notchCenter + notchShoulder
        } 0 ${notchCenter + notchHalfWidth} 0`,
        "L 365 0",
        "Q 375 0 375 10",
        "L 375 96",
        "L 0 96",
        "Z",
      ].join(" ")
    : isLast
      ? [
          "M 0 18",
          "Q 0 0 10 0",
          `L ${notchCenter - notchHalfWidth} 0`,
          `C ${notchCenter - notchShoulder} 0 ${
            notchCenter - notchShoulder
          } ${notchDepth} ${notchCenter} ${notchDepth}`,
          `L 375 ${notchDepth}`,
          "L 375 96",
          "L 0 96",
          "Z",
        ].join(" ")
      : [
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
          "L 375 96",
          "L 0 96",
          "Z",
        ].join(" ");

  const renderIcon = (item: NavItem, active = false) =>
    item.id === "hero" ? (
      <Image
        src="/favicon-k.png"
        alt=""
        width={active ? 28 : 20}
        height={active ? 28 : 20}
        className={active ? "h-7 w-7 object-contain" : "h-5 w-5 object-contain"}
      />
    ) : (
      item.icon
    );

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
      className="fixed bottom-0 left-4 right-4 z-50 block md:hidden"
    >
      <div
        ref={barRef}
        className="relative h-24 max-w-none shadow-2xl shadow-black/40 backdrop-blur-lg sm:h-[104px]"
      >
        <svg
          viewBox="0 0 375 96"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
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
            className="pointer-events-none absolute -top-6 left-0 z-30 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.22)]"
            aria-hidden
          >
            {renderIcon(items[activeIndex], true)}
          </motion.div>
        )}

        <ul
          className="relative z-20 grid h-16"
          style={{
            gridTemplateColumns: `repeat(${orderedItems.length}, minmax(0, 1fr))`,
          }}
        >
          {orderedItems.map(({ item, itemIndex }) => {
            const active = activeIndex === itemIndex;
            return (
              <li key={item.id} className="min-w-0">
                <Link
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault();
                    onSelect(itemIndex);
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
                    {renderIcon(item)}
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
