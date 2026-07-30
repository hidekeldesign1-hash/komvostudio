"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

const steps = [
  {
    number: "01",
    title: "Conocemos tu negocio",
    description:
      "Entendemos qué haces, a quién atiendes y qué necesitas mejorar.",
  },
  {
    number: "02",
    title: "Creamos tu página y mensajes",
    description:
      "Diseñamos una comunicación clara para que las personas entiendan tu servicio y te contacten.",
  },
  {
    number: "03",
    title: "Lanzamos tu presencia digital",
    description:
      "Publicamos tu página y activamos la publicidad inicial.",
  },
  {
    number: "04",
    title: "Ajustamos y mejoramos",
    description:
      "Revisamos qué funciona mejor y hacemos mejoras para atraer mejores clientes.",
  },
];

export function Process() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 65%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="proceso"
      className="relative scroll-mt-20 overflow-hidden border-t border-border py-20 sm:scroll-mt-24 sm:py-24 lg:py-32"
    >
      <div
        className="pointer-events-none absolute left-0 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mb-14 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-10"
        >
          <div className="lg:col-span-8">
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-500 dark:text-cyan-400 sm:text-xs"
            >
              Nuestro proceso
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="max-w-3xl text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl"
            >
              De la idea a una presencia que trabaja por tu negocio
            </motion.h2>
          </div>
          <motion.p
            variants={fadeInUp}
            className="max-w-xl text-sm leading-relaxed text-foreground-secondary sm:text-base lg:col-span-4"
          >
            Un camino claro, colaborativo y sin procesos innecesarios. Siempre sabrás
            qué estamos haciendo y por qué.
          </motion.p>
        </motion.div>

        <div ref={timelineRef} className="relative mx-auto max-w-5xl">
          <div
            className="absolute bottom-8 left-[19px] top-8 w-px bg-border-strong sm:left-[27px]"
            aria-hidden
          >
            <motion.div
              style={{ scaleY: lineScale, transformOrigin: "top" }}
              className="h-full w-full bg-gradient-to-b from-cyan-500 via-indigo-500 to-purple-600"
            />
          </div>

          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="space-y-6 sm:space-y-8"
          >
            {steps.map((step) => (
              <motion.li
                key={step.number}
                variants={fadeInUp}
                className="relative grid grid-cols-[40px_1fr] gap-4 sm:grid-cols-[56px_1fr] sm:gap-6"
              >
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/50 bg-background text-[10px] font-bold tracking-wider text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)] dark:text-cyan-400 sm:h-14 sm:w-14 sm:text-xs">
                  {step.number}
                </div>

                <motion.div
                  whileHover={{ x: 6 }}
                  className="group rounded-2xl border border-black/10 bg-surface p-6 shadow-soft transition-[border-color,box-shadow] hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] dark:border-white/10 dark:bg-surface-elevated sm:p-8"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {step.title}
                    </h3>
                    <span className="hidden bg-gradient-to-r from-cyan-400/30 to-indigo-500/30 bg-clip-text text-4xl font-bold tabular-nums text-transparent sm:block">
                      {step.number}
                    </span>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground-secondary sm:text-base">
                    {step.description}
                  </p>
                </motion.div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
