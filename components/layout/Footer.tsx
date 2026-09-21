"use client";

import Image from "next/image";
import Link from "next/link";
import { useBookingModal } from "@/components/ui/BookingModal";

const SOLUTIONS = [
  { href: "/#servicios", label: "Páginas Web Profesionales" },
  { href: "/#servicios", label: "Automatización WhatsApp" },
  { href: "/#servicios", label: "Integración Google Calendar" },
  { href: "/#servicios", label: "Sistemas a Medida" },
];

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/#proceso", label: "Proceso" },
  { href: "/#faq", label: "Preguntas Frecuentes" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const { openBooking } = useBookingModal();

  return (
    <footer className="relative z-10 border-t border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-4 md:gap-10">
        {/* Marca */}
        <div className="space-y-5 md:col-span-2">
          <Link href="/" className="inline-flex items-center" aria-label="Komvos, inicio">
            <Image
              src="/logo-komvos-black.png"
              alt="Komvos"
              width={140}
              height={36}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            Diseño web profesional y sistemas de automatización para modernizar la atención y ventas
            de tu negocio.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden />
            Sistemas e Integraciones Operativas
          </div>
        </div>

        {/* Soluciones */}
        <div className="space-y-3">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-900">Soluciones</p>
          <ul className="space-y-2.5">
            {SOLUTIONS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Komvos */}
        <div className="space-y-3">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-900">Komvos</p>
          <ul className="space-y-2.5">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={openBooking}
                className="text-sm text-slate-500 transition-colors hover:text-cyan-600"
              >
                Agendar Llamada
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal bar */}
      <div className="mx-auto max-w-7xl border-t border-slate-200 px-6 pb-8 pt-6">
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 md:flex-row">
          <p suppressHydrationWarning>
            © {year} Komvos Marketing Studio. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <Link href="/privacidad" className="transition-colors hover:text-slate-900">
              Aviso de Privacidad
            </Link>
            <span className="text-slate-300" aria-hidden>
              |
            </span>
            <Link href="/terminos" className="transition-colors hover:text-slate-900">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
