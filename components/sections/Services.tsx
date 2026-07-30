"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { GlassCard } from "@/components/ui/GlassCard";

const services = [
  {
    title: "Presencia profesional en internet",
    description:
      "Creamos páginas web claras y bien estructuradas para que tu negocio se vea serio, confiable y fácil de contactar.",
    icon: "◆",
    image: "/komvos-web-profesional.png",
    imagePosition: "50%",
    label: "Web & marca",
    className: "md:col-span-6 lg:col-span-4 lg:row-span-2",
  },
  {
    title: "Anuncios que traen clientes",
    description:
      "Diseñamos y gestionamos publicidad para que personas interesadas te escriban o te llamen, no solo para que vean tu marca.",
    icon: "◇",
    image: "/komvos-publicidad-contactos.png",
    imagePosition: "50%",
    label: "Publicidad",
    className: "md:col-span-3 lg:col-span-2",
  },
  {
    title: "Tu negocio visible para las personas correctas",
    description:
      "Te ayudamos a que tu negocio aparezca frente a quienes realmente pueden convertirse en clientes.",
    icon: "○",
    image: "/komvos-visibilidad-analitica.png",
    imagePosition: "50%",
    label: "Visibilidad",
    className: "md:col-span-3 lg:col-span-2",
  },
];

export function Services() {
  return (
    <section
      id="servicios"
      className="relative scroll-mt-20 overflow-hidden border-t border-border bg-surface py-20 sm:scroll-mt-24 sm:py-24 lg:py-32 dark:bg-background"
    >
      {/* Separador: línea con gradiente */}
      <div
        className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mb-12 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-10"
        >
          <div className="lg:col-span-8">
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-500 dark:text-cyan-400 sm:text-xs"
            >
              Servicios
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="max-w-3xl text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl"
            >
              Un sistema digital, no piezas desconectadas
            </motion.h2>
          </div>
          <motion.p
            variants={fadeInUp}
            className="max-w-xl text-sm leading-relaxed text-foreground-secondary sm:text-base lg:col-span-4"
          >
            Estrategia, diseño y adquisición trabajando juntos para convertir atención en
            oportunidades reales para tu negocio.
          </motion.p>
        </motion.div>
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid auto-rows-[minmax(270px,auto)] grid-cols-1 gap-5 md:grid-cols-6"
        >
          {services.map((service) => (
            <motion.li
              key={service.title}
              variants={fadeInUp}
              className={`min-h-[290px] ${service.className}`}
            >
              <GlassCard className="min-h-[290px] hover:shadow-[0_0_28px_rgba(56,189,248,0.12)]">
                <div className="absolute inset-0">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    className="object-cover opacity-45 transition-transform duration-700 group-hover:scale-[1.03] dark:opacity-35"
                    style={{ objectPosition: `center ${service.imagePosition}` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/10 dark:from-[#101012] dark:via-[#101012]/85 dark:to-[#101012]/10" />
                </div>

                <div className="relative z-10 flex h-full min-h-[290px] flex-col justify-end p-6 sm:p-8">
                  <div className="mb-auto flex items-center justify-between">
                    <span className="rounded-full border border-cyan-800/50 bg-cyan-950/40 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-400 backdrop-blur">
                      {service.label}
                    </span>
                    <span className="text-xl text-cyan-400" aria-hidden>
                      {service.icon}
                    </span>
                  </div>
                  <h3 className="mt-16 max-w-md text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground-secondary sm:text-base">
                    {service.description}
                  </p>
                </div>
              </GlassCard>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
