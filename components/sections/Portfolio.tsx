"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { GlassCard } from "@/components/ui/GlassCard";

const projects = [
  {
    name: "Presencia que inspira confianza",
    type: "Web corporativa",
    result: "Imagen 100% profesional",
    image: "/komvos-web-profesional.png",
    position: "center 50%",
  },
  {
    name: "Campaña enfocada en conversaciones",
    type: "Landing de conversión",
    result: "Diseñada para generar contactos",
    image: "/komvos-publicidad-contactos.png",
    position: "center 50%",
  },
  {
    name: "Visibilidad para negocios locales",
    type: "Estrategia digital",
    result: "Más fácil de encontrar y elegir",
    image: "/komvos-visibilidad-analitica.png",
    position: "center 50%",
  },
];

export function Portfolio() {
  return (
    <section
      id="portfolio"
      className="relative scroll-mt-20 overflow-hidden border-t border-border bg-[#111114] py-20 text-white sm:scroll-mt-24 sm:py-24 lg:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(6,182,212,0.14),transparent_28%),radial-gradient(circle_at_82%_70%,rgba(99,102,241,0.12),transparent_34%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10"
        >
          <div className="lg:col-span-8">
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400 sm:text-xs"
            >
              Evidencia de trabajo
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="max-w-3xl text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl"
            >
              Proyectos pensados para generar confianza y clientes
            </motion.h2>
          </div>
          <motion.p
            variants={fadeInUp}
            className="max-w-xl text-sm leading-relaxed text-white/60 sm:text-base lg:col-span-4"
          >
            Cada solución combina estrategia, diseño y mensajes claros para que tu negocio
            se vea tan profesional como el trabajo que entrega.
          </motion.p>
        </motion.div>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.li
              key={project.name}
              variants={fadeInUp}
              className="min-h-full"
            >
              <GlassCard className="border-white/10 shadow-xl shadow-black/10 hover:shadow-[0_0_28px_rgba(129,140,248,0.14)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`Vista previa: ${project.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ objectPosition: project.position }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between p-5 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-xs font-semibold text-white">Explorar solución</span>
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur"
                      aria-hidden
                    >
                      ↗
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-800/50 bg-cyan-950/40 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-cyan-400">
                      {project.type}
                    </span>
                    <span className="rounded-full border border-indigo-800/50 bg-indigo-950/40 px-3 py-1 text-[10px] font-semibold text-indigo-300">
                      {project.result}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                    {project.name}
                  </h3>
                </div>
              </GlassCard>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="mt-10 flex justify-center"
        >
          <Link
            href="#contacto"
            className="inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-cyan-500/60 hover:bg-cyan-950/20"
          >
            Quiero una solución para mi negocio
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
