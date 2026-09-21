"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useBookingModal } from "@/components/ui/BookingModal";

export function Hero() {
  const { openBooking } = useBookingModal();

  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-[100svh] items-center overflow-hidden pt-8 md:pt-24 lg:pt-16"
    >
      {/* Desktop: gradiente a la derecha del hero */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block" aria-hidden>
        <Image
          src="/Gradient.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-contain object-[92%_center] opacity-95"
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-0">
        <div className="lg:col-span-5">
          <h1 className="font-display text-[clamp(2.25rem,4.4vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[#1D1D1F]">
            Páginas web y automatización por WhatsApp para tu negocio.
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[#6E6E73]">
            Creamos tu sitio web profesional y conectamos sistemas automáticos para que recibas
            clientes, respondas preguntas y agendes citas sin estar pegado al teléfono.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={openBooking} className="btn-primary-glow">
              Hablar con Komvos
            </button>
            <a href="#solucion" className="btn-secondary">
              Ver cómo funciona
            </a>
          </div>
          <p className="mt-8 text-[13px] text-[#6E6E73]">
            Diseño web · WhatsApp Business · Google Calendar
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-7"
        >
          {/* Mobile: gradiente totalmente detrás de la imagen de dispositivos */}
          <div
            className="pointer-events-none absolute inset-[-18%_-8%] z-0 lg:hidden"
            aria-hidden
          >
            <Image
              src="/Gradient.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-contain object-center opacity-95"
            />
          </div>

          <div className="relative z-10 mx-auto aspect-[16/10] w-full max-w-[640px] lg:max-w-none">
            <Image
              src="/Hero-devices.png"
              alt="MacBook con página web profesional y celular con automatización de WhatsApp"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="origin-center scale-[1.22] object-contain object-center drop-shadow-[0_8px_24px_rgba(0,0,0,0.1)] lg:scale-[1.28]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
