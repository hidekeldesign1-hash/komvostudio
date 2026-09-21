"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBookingModal } from "@/components/ui/BookingModal";

type NavLink = {
  href: string;
  id: string;
  label: string;
  short: string;
  icon: ReactNode;
};

const LINKS: NavLink[] = [
  {
    href: "/#solucion",
    id: "solucion",
    label: "Solución",
    short: "Solución",
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M12 3 4.5 7.5v9L12 21l7.5-4.5v-9L12 3Z" strokeLinejoin="round" />
        <path d="M12 12 4.5 7.5M12 12l7.5-4.5M12 12v9" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/#servicios",
    id: "servicios",
    label: "Servicios",
    short: "Servicios",
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3.5" y="4.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="4.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="12.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="12.5" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/#proceso",
    id: "proceso",
    label: "Proceso",
    short: "Proceso",
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <circle cx="6" cy="7" r="2.2" />
        <circle cx="18" cy="7" r="2.2" />
        <circle cx="12" cy="17" r="2.2" />
        <path d="M8 7h8M7.5 9l3.5 6M16.5 9l-3.5 6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/#faq",
    id: "faq",
    label: "FAQ",
    short: "FAQ",
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.5 9.5a2.5 2.5 0 0 1 4.6 1.2c0 1.5-2.1 2-2.1 3.3" strokeLinecap="round" />
        <circle cx="12" cy="16.8" r="0.7" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("solucion");
  const pathname = usePathname();
  const { openBooking } = useBookingModal();
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return;

    const sectionIds = LINKS.map((link) => link.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <>
      {/* Desktop: top dock */}
      <header className="fixed inset-x-0 top-0 z-50 hidden pt-3 sm:pt-4 md:block">
        <div className="section-shell flex items-center justify-center">
          <div
            className={`nav-dock relative w-full max-w-4xl transition-shadow duration-200 ${
              scrolled ? "shadow-[0_12px_40px_rgba(0,0,0,0.12)]" : ""
            }`}
          >
            <Link
              href="/"
              className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D1D1F] transition hover:opacity-90"
              aria-label="Komvos, inicio"
            >
              <Image
                src="/favicon-k-white.png"
                alt=""
                width={18}
                height={18}
                className="h-4 w-4 object-contain"
                priority
              />
            </Link>

            <nav
              className="pointer-events-none absolute inset-y-0 left-1/2 flex -translate-x-1/2 items-center"
              aria-label="Principal"
            >
              <div className="pointer-events-auto flex items-center gap-0.5">
                {LINKS.map((link, index) => {
                  const active = onHome && activeId === link.id;
                  return (
                    <div key={link.href} className="flex items-center">
                      {index === LINKS.length - 1 && (
                        <span className="mx-1 hidden h-5 w-px bg-[#D2D2D7] lg:block" aria-hidden />
                      )}
                      <a
                        href={link.href}
                        className={`nav-tab ${active ? "nav-tab-active" : ""}`}
                        aria-current={active ? "page" : undefined}
                      >
                        <span className={`h-3.5 w-3.5 ${active ? "text-[#1D1D1F]" : "text-[#86868B]"}`}>
                          {link.icon}
                        </span>
                        {link.label}
                      </a>
                    </div>
                  );
                })}
              </div>
            </nav>

            <div className="relative z-10 ml-auto flex items-center pl-1">
              <button
                type="button"
                onClick={openBooking}
                className="rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(6,182,212,0.28)] transition hover:opacity-95"
              >
                Hablar con Komvos
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile: bottom floating dock */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1.75rem,calc(env(safe-area-inset-bottom)+1rem))] pt-2 md:hidden"
        aria-label="Navegación móvil"
      >
        <div className="nav-dock mx-auto max-w-md gap-0 rounded-full px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1D1D1F]"
            aria-label="Komvos, inicio"
          >
            <Image
              src="/favicon-k-white.png"
              alt=""
              width={18}
              height={18}
              className="h-4 w-4 object-contain"
              priority
            />
          </Link>

          <div className="flex min-w-0 flex-1 items-center justify-evenly px-0.5">
            {LINKS.map((link) => {
              const active = onHome && activeId === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-w-0 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 transition ${
                    active ? "bg-[#F5F5F7] text-[#1D1D1F]" : "text-[#6E6E73]"
                  }`}
                >
                  <span className={`h-5 w-5 ${active ? "text-[#1D1D1F]" : "text-[#86868B]"}`}>{link.icon}</span>
                  <span className="max-w-[4.2rem] truncate text-[10px] font-medium leading-none">{link.short}</span>
                </a>
              );
            })}
          </div>

          <button
            type="button"
            onClick={openBooking}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_4px_12px_rgba(6,182,212,0.35)]"
            aria-label="Hablar con Komvos"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path
                d="M5 18.5 6.2 15A7.5 7.5 0 1 1 12 19.5a7.4 7.4 0 0 1-3.2-.7L5 18.5Z"
                strokeLinejoin="round"
              />
              <path d="M9 11.5h6M9 14h4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
}
