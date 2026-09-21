"use client";

import Image from "next/image";
import { useBookingModal } from "@/components/ui/BookingModal";

const PILLARS = [
  {
    title: "Presencia que convierte",
    description: "Una web clara, rápida y orientada a generar conversaciones reales.",
  },
  {
    title: "Atención 24/7",
    description: "WhatsApp responde, califica y agenda aunque tu equipo esté ocupado.",
  },
  {
    title: "Operación ordenada",
    description: "Citas, recordatorios y leads llegan sincronizados a tu flujo de trabajo.",
  },
];

export function Solution() {
  const { openBooking } = useBookingModal();

  return (
    <section id="solucion" className="relative z-10 scroll-mt-24 py-12 md:py-16">
      <div className="section-shell">
        <div className="relative overflow-hidden rounded-3xl border border-[#D2D2D7]/60 px-6 py-9 shadow-[0_4px_16px_rgba(0,0,0,0.08)] sm:px-10 sm:py-12 lg:px-14">
          <Image
            src="/gradient-2.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-white/25" aria-hidden />

          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <h2 className="font-display max-w-2xl text-3xl font-semibold tracking-[-0.035em] text-[#1D1D1F] sm:text-4xl lg:text-5xl">
                Un ecosistema digital conectado que vende y atiende por ti 24/7.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#1D1D1F]/75 sm:text-base">
                Conectamos tu página, WhatsApp, agenda y seguimiento en un solo sistema para que
                captar y atender clientes deje de depender del azar.
              </p>
            </div>
            <div className="lg:col-span-5 lg:flex lg:justify-end">
              <button type="button" onClick={openBooking} className="btn-primary-glow">
                Hablar con Komvos
              </button>
            </div>
          </div>

          <ul className="relative mt-12 grid gap-4 sm:grid-cols-3">
            {PILLARS.map((pillar) => (
              <li
                key={pillar.title}
                className="rounded-2xl border border-white/50 bg-white/55 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-md"
              >
                <h3 className="font-display text-base font-semibold text-[#1D1D1F]">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6E6E73]">{pillar.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
