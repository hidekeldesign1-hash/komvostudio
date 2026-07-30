"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

const nodes = [
  { title: "Cliente", detail: "Punto de partida", icon: "◎" },
  { title: "Análisis", detail: "Datos y contexto", icon: "◇" },
  { title: "Branding", detail: "Identidad y mensaje", icon: "◆" },
  { title: "Landing", detail: "Experiencia digital", icon: "▱" },
  { title: "Publicidad", detail: "Meta / Google", icon: "◉" },
  { title: "CRM", detail: "WhatsApp", icon: "⌁" },
  { title: "Ventas", detail: "Conversión", icon: "↗" },
];

export function SystemDiagram() {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const isConnected = (index: number) =>
    activeNode === null || Math.abs(index - activeNode) <= 1;

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-black py-20 text-white sm:py-24 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_42%_50%,rgba(6,182,212,0.1),transparent_38%),radial-gradient(circle_at_68%_50%,rgba(37,99,235,0.09),transparent_40%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <motion.p
            variants={fadeInUp}
            className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-400 sm:text-xs"
          >
            Ecosistema Komvos
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-bold tracking-[-0.035em] sm:text-4xl lg:text-5xl"
          >
            Un sistema digital conectado
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base"
          >
            Cada punto comparte información con el siguiente para convertir una necesidad
            del mercado en una oportunidad comercial medible.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="relative hidden min-h-[270px] items-center md:flex"
          onMouseLeave={() => setActiveNode(null)}
        >
          <svg
            viewBox="0 0 1000 120"
            className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 overflow-visible"
            aria-hidden
          >
            <defs>
              <filter id="system-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="system-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.14" />
                <stop offset="50%" stopColor="#6366F1" stopOpacity="0.62" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.16" />
              </linearGradient>
            </defs>
            <line
              x1="70"
              y1="60"
              x2="930"
              y2="60"
              stroke="url(#system-line)"
              strokeWidth="1"
              strokeDasharray="4 7"
            />
            <motion.line
              x1="70"
              y1="60"
              x2="930"
              y2="60"
              stroke="#06B6D4"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.35 }}
              viewport={viewportOnce}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
            <motion.circle
              cx="70"
              cy="60"
              r="4"
              fill="#67E8F9"
              filter="url(#system-glow)"
              animate={{ x: [0, 860], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
            />
          </svg>

          <div className="relative z-10 grid w-full grid-cols-7 gap-3">
            {nodes.map((node, index) => (
              <motion.button
                key={node.title}
                type="button"
                onMouseEnter={() => setActiveNode(index)}
                animate={{
                  opacity: isConnected(index) ? 1 : 0.38,
                  scale: activeNode === index ? 1.06 : 1,
                  y: activeNode === index ? -5 : 0,
                }}
                transition={{ duration: 0.22 }}
                className="group flex min-h-[132px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0d0d0d]/90 px-3 text-center shadow-2xl backdrop-blur-md outline-none hover:border-cyan-500/60 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] focus-visible:border-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-400/30"
              >
                <span className="mb-3 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-xl text-transparent" aria-hidden>
                  {node.icon}
                </span>
                <span className="text-xs font-semibold text-white lg:text-sm">{node.title}</span>
                <span className="mt-1.5 text-[9px] leading-tight text-white/40 lg:text-[10px]">
                  {node.detail}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative mx-auto max-w-md space-y-3 md:hidden"
        >
          <div
            className="absolute bottom-5 left-5 top-5 w-px bg-gradient-to-b from-cyan-400/70 via-indigo-500/40 to-purple-500/70"
            aria-hidden
          />
          {nodes.map((node, index) => (
            <motion.li
              key={node.title}
              variants={fadeInUp}
              className="relative grid grid-cols-[40px_1fr] items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3"
            >
              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/40 bg-[#0a0a0a] text-cyan-400">
                {node.icon}
              </span>
              <span>
                <span className="block text-sm font-semibold">{node.title}</span>
                <span className="mt-0.5 block text-[11px] text-white/40">{node.detail}</span>
              </span>
              {index < nodes.length - 1 && (
                <span className="sr-only">Conecta con {nodes[index + 1].title}</span>
              )}
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
