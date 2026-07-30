"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { HeroCanvas } from "@/components/HeroCanvas";

type HeroProps = {
  canvasPaused?: boolean;
};

export const Hero = forwardRef<HTMLElement, HeroProps>(function Hero(
  { canvasPaused = false },
  ref,
) {
  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#050505] px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-36"
    >
      <HeroCanvas paused={canvasPaused} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(6,182,212,0.12),transparent_32%),radial-gradient(circle_at_62%_55%,rgba(99,102,241,0.12),transparent_38%),linear-gradient(to_bottom,transparent_70%,#050505_100%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10 xl:gap-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="lg:col-span-6 xl:col-span-7"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75 shadow-sm backdrop-blur-md sm:text-xs"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="text-cyan-400"
              aria-hidden
            >
              ◆
            </motion.span>
            Marketing Studio &amp; Web Design
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="max-w-4xl text-4xl font-bold leading-[1.04] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl xl:text-7xl"
          >
            Convertimos tu presencia digital en una razón para{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              elegirte.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            Diseñamos páginas web y campañas con estrategia, claridad y una imagen
            profesional que genera confianza antes de la primera conversación.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#contacto"
                className="group inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:w-auto sm:text-base"
              >
                Platiquemos tu proyecto
                <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#portfolio"
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-cyan-400/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:w-auto sm:text-base"
              >
                Ver evidencia de trabajo
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-white/55 sm:text-sm"
          >
            <span>✓ Estrategia clara</span>
            <span>✓ Diseño a medida</span>
            <span>✓ Acompañamiento directo</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 36, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:col-span-6 xl:col-span-5"
        >
          <div className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-cyan-500/20 via-indigo-500/15 to-purple-600/20 blur-3xl" aria-hidden />
          <div className="overflow-hidden rounded-[1.75rem] border border-white/40 bg-black/90 p-2 shadow-2xl shadow-black/25 dark:border-white/10">
            <div className="overflow-hidden rounded-[1.35rem] bg-[#111114]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex gap-1.5" aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[9px] uppercase tracking-[0.18em] text-white/45">
                  komvos / proyecto
                </span>
              </div>

              <div className="grid min-h-[420px] grid-cols-12 bg-[radial-gradient(circle_at_72%_28%,rgba(6,182,212,0.16),transparent_36%),radial-gradient(circle_at_55%_60%,rgba(99,102,241,0.12),transparent_42%)] p-5 sm:p-7">
                <div className="col-span-8 flex flex-col justify-center">
                  <span className="mb-4 h-2 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" />
                  <p className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                    Una marca clara.
                    <br />
                    Una web que convence.
                  </p>
                  <p className="mt-4 max-w-[250px] text-xs leading-relaxed text-white/50 sm:text-sm">
                    Experiencias digitales diseñadas para hacer fácil la decisión de contactarte.
                  </p>
                  <div className="mt-7 flex gap-2">
                    <span className="rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-[10px] font-semibold text-white">
                      Comenzar proyecto
                    </span>
                    <span className="rounded-full border border-white/15 px-4 py-2 text-[10px] text-white/70">
                      Ver trabajo
                    </span>
                  </div>
                </div>
                <div className="col-span-4 flex items-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-3 shadow-xl backdrop-blur"
                  >
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-[#d2b48c] via-[#846a4b] to-[#29231d]" />
                    <div className="mt-3 h-1.5 w-4/5 rounded-full bg-white/25" />
                    <div className="mt-2 h-1.5 w-1/2 rounded-full bg-white/10" />
                  </motion.div>
                </div>
              </div>
              <div className="grid grid-cols-3 border-t border-white/10">
                {["Estrategia", "Diseño", "Conversión"].map((label, index) => (
                  <div
                    key={label}
                    className="border-r border-white/10 px-3 py-4 text-center last:border-r-0"
                  >
                    <span className="block text-sm font-semibold text-white">0{index + 1}</span>
                    <span className="mt-1 block text-[9px] uppercase tracking-wider text-white/35">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
