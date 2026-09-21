"use client";

import Image from "next/image";
import { useBookingModal } from "@/components/ui/BookingModal";

export function FinalCTA() {
  const { openBooking } = useBookingModal();

  return (
    <section id="contacto" className="relative z-10 scroll-mt-24 py-12 md:py-16">
      <div className="section-shell">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#D2D2D7]/50 px-6 py-12 text-center shadow-[0_4px_16px_rgba(0,0,0,0.1)] sm:px-10 sm:py-14 lg:px-16">
          <Image
            src="/gradient-3.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-[#1D1D1F]/45" aria-hidden />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
              ¿Listo para que tu negocio capte y atienda 24/7?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
              Agenda una llamada y te mostramos la ruta más clara para tu web, automatizaciones o sistema completo.
            </p>
            <button type="button" onClick={openBooking} className="btn-primary-glow mt-8">
              Hablar con Komvos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
