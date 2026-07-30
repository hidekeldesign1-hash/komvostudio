"use client";

import Image from "next/image";
import Link from "next/link";
import type { NavItem } from "@/components/MobileBottomNav";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { useQuizModal } from "@/components/ui/QuizModal";

type DesktopNavProps = {
  items: NavItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function DesktopNav({
  items,
  activeIndex,
  onSelect,
}: DesktopNavProps) {
  const { openQuiz } = useQuizModal();
  const navigationItems = items.slice(0, -1);
  const contactItem = items.at(-1);

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed left-1/2 top-6 z-50 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-slate-950/90 px-3 py-2 shadow-2xl shadow-black/30 backdrop-blur-md md:flex"
    >
      <Link
        href="#hero"
        onClick={(event) => {
          event.preventDefault();
          onSelect(0);
        }}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 shadow-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        aria-label="Komvos, inicio"
      >
        <Image
          src="/favicon-k.png"
          alt=""
          width={24}
          height={24}
          className="h-6 w-6 object-contain"
        />
      </Link>

      <ul className="flex items-center gap-1 lg:gap-2">
        {navigationItems.map((item, index) => {
          const active = activeIndex === index;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  onSelect(index);
                }}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-xs font-medium transition-colors lg:px-4 lg:text-sm ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <span className="h-6 w-px bg-white/10" aria-hidden />
      <SoundToggle className="h-9 w-9 border-white/10 text-white/55" />
      {contactItem && (
        <button
          type="button"
          onClick={openQuiz}
          className="whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-xs font-medium text-slate-950 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 lg:text-sm"
        >
          Hablemos
        </button>
      )}
    </nav>
  );
}
