"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

type CinematicIntroProps = {
  onComplete: () => void;
};

type IntroParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  strand: number;
  radius: number;
  cyan: boolean;
};

type DustParticle = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speedY: number;
  twinkle: number;
  color: string;
};

const CYAN = "6, 182, 212";
const INDIGO = "99, 102, 241";
const DUST_COLORS = ["56, 189, 248", "129, 140, 248", "255, 255, 255"];
const LINE_REVEAL_START_MS = 3000;
const LINE_REVEAL_END_MS = 4600;
const MESSAGE_REVEAL_MS = 4600;

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [isExiting, setIsExiting] = useState(false);
  const reducedMotion = useReducedMotion();

  const requestExit = useCallback(() => {
    if (phase < 3 || isExiting) return;
    setIsExiting(true);
  }, [isExiting, phase]);

  useEffect(() => {
    if (reducedMotion) {
      const reducedTimer = window.setTimeout(() => setPhase(3), 100);
      return () => window.clearTimeout(reducedTimer);
    }

    const networkTimer = window.setTimeout(() => setPhase(2), 1000);
    const messageTimer = window.setTimeout(() => setPhase(3), MESSAGE_REVEAL_MS);

    return () => {
      window.clearTimeout(networkTimer);
      window.clearTimeout(messageTimer);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (phase < 3) return;

    const handleWheel = () => requestExit();
    const handleTouch = () => requestExit();
    const handleKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Enter", "Escape"].includes(event.key)) {
        requestExit();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("keydown", handleKey);
    };
  }, [phase, requestExit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let animationFrame = 0;
    let particles: IntroParticle[] = [];
    let dustParticles: DustParticle[] = [];
    let width = 0;
    let height = 0;
    let strandCount = 8;
    let isMobile = false;
    let time = 0;
    const startedAt = performance.now();

    const createParticles = () => {
      isMobile = window.innerWidth < 768;
      const count = isMobile
        ? 520
        : Math.min(1500, Math.max(1100, Math.floor((width * height) / 1050)));
      strandCount = isMobile ? 7 : 8;

      particles = Array.from({ length: count }, (_, index) => {
        const strand = index % strandCount;
        const pointsPerStrand = Math.ceil(count / strandCount);
        const progress = Math.min(
          1,
          Math.floor(index / strandCount) / Math.max(1, pointsPerStrand - 1),
        );
        const targetX = width * progress;
        const targetY = isMobile
          ? height * (0.1 + (strand / (strandCount - 1)) * 0.8)
          : height / 2 + (strand - (strandCount - 1) / 2) * height * 0.035;

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          targetX,
          targetY,
          strand,
          radius: Math.random() * 0.75 + 0.25,
          cyan: Math.random() > 0.48,
        };
      });

      const dustCount = isMobile ? 48 : 72;
      dustParticles = Array.from({ length: dustCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        speedY: Math.random() * 0.4 - 0.2,
        twinkle: Math.random() * Math.PI * 2,
        color: DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)],
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    };

    const draw = (now: number) => {
      const elapsed = now - startedAt;
      const attraction = Math.min(1, Math.max(0, (elapsed - 1000) / 1500));
      const lineRevealRaw = Math.min(
        1,
        Math.max(
          0,
          (elapsed - LINE_REVEAL_START_MS) /
            (LINE_REVEAL_END_MS - LINE_REVEAL_START_MS),
        ),
      );
      const lineReveal =
        lineRevealRaw * lineRevealRaw * (3 - 2 * lineRevealRaw);
      time += 0.01;
      context.clearRect(0, 0, width, height);

      for (const dust of dustParticles) {
        dust.y += dust.speedY;
        if (dust.y < -3) dust.y = height + 3;
        if (dust.y > height + 3) dust.y = -3;

        const twinkleOpacity =
          dust.opacity * (0.65 + Math.sin(time * 1.4 + dust.twinkle) * 0.35);
        context.beginPath();
        context.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${dust.color}, ${twinkleOpacity})`;
        context.fill();
      }

      if (lineReveal > 0) {
        const step = isMobile ? 5 : 4;

        for (let strand = 0; strand < strandCount; strand += 1) {
          const direction = strand % 2 === 0 ? 1 : -1;
          const speed = 0.65 + strand * 0.06;
          const frequency = 0.006 + strand * 0.0003;
          const amplitude = height * (isMobile ? 0.035 : 0.045);
          const centerY = isMobile
            ? height * (0.1 + (strand / (strandCount - 1)) * 0.8)
            : height / 2 +
              (strand - (strandCount - 1) / 2) * height * 0.035;

          context.beginPath();
          for (let x = -50; x <= width + 50; x += step) {
            const y =
              centerY +
              Math.sin(x * frequency + time * speed * direction) * amplitude;
            if (x === -50) context.moveTo(x, y);
            else context.lineTo(x, y);
          }

          const color = strand % 2 === 0 ? CYAN : INDIGO;
          const revealGlow = Math.pow(
            Math.sin(Math.PI * lineReveal),
            0.65,
          );

          context.strokeStyle = `rgba(${color}, ${
            revealGlow * 0.16
          })`;
          context.lineWidth = 3;
          context.shadowColor = `rgba(${color}, ${revealGlow * 0.475})`;
          context.shadowBlur = 21 * revealGlow;
          context.stroke();

          context.strokeStyle = `rgba(${color}, ${lineReveal * 0.34})`;
          context.lineWidth = strand % 3 === 0 ? 0.8 : 0.55;
          context.shadowColor = `rgba(${color}, ${
            lineReveal * 0.22 + revealGlow * 0.325
          })`;
          context.shadowBlur = lineReveal * 5 + revealGlow * 10;
          context.stroke();
        }
        context.shadowBlur = 0;
      }

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];

        if (attraction > 0) {
          const direction = particle.strand % 2 === 0 ? 1 : -1;
          const speed = 18 + particle.strand * 1.2;
          const xOffset = time * speed * direction;
          const flowingTargetX =
            ((particle.targetX + xOffset) % width + width) % width;
          let deltaX = flowingTargetX - particle.x;
          if (Math.abs(deltaX) > width / 2) {
            deltaX -= Math.sign(deltaX) * width;
          }
          const waveSpeed = 0.65 + particle.strand * 0.06;
          const waveFrequency = 0.006 + particle.strand * 0.0003;
          const organicWave =
            Math.sin(
              particle.x * waveFrequency +
                time * waveSpeed * direction,
            ) *
            height *
            (isMobile ? 0.035 : 0.045) *
            attraction;
          particle.vx += deltaX * 0.00115 * attraction;
          particle.vy +=
            (particle.targetY + organicWave - particle.y) * 0.00115 * attraction;
        } else {
          particle.vx += (Math.random() - 0.5) * 0.006;
          particle.vy += (Math.random() - 0.5) * 0.006;
        }

        particle.vx *= attraction > 0 ? 0.92 : 0.995;
        particle.vy *= attraction > 0 ? 0.92 : 0.995;
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0) particle.x += width;
        if (particle.x > width) particle.x -= width;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${particle.cyan ? CYAN : INDIGO}, ${
          0.24 + attraction * (particle.cyan ? 0.42 : 0.5)
        })`;
        context.fill();
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.visualViewport?.addEventListener("resize", resize, { passive: true });
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      particles = [];
      dustParticles = [];
      context.clearRect(0, 0, width, height);
    };
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Introducción de Komvos"
      initial={{ opacity: 1, scale: 1 }}
      animate={isExiting ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
      transition={{ duration: reducedMotion ? 0.1 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (isExiting) onComplete();
      }}
      onClick={requestExit}
      className="fixed inset-0 z-[100] flex w-screen max-w-none cursor-pointer items-center justify-center overflow-hidden bg-black"
    >
      <motion.canvas
        ref={canvasRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.9 }}
        className="pointer-events-none absolute inset-0 h-full w-screen max-w-none"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08),transparent_42%),radial-gradient(circle_at_70%_40%,rgba(37,99,235,0.07),transparent_36%)]"
        aria-hidden
      />

      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -18 }}
            className="relative z-10 mx-auto max-w-5xl px-6 text-center"
          >
            <p className="text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              Toda gran empresa comienza con una{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                conexión.
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase >= 3 && (
          <motion.button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              requestExit();
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ x: "-50%" }}
            transition={{ delay: reducedMotion ? 0 : 0.5, duration: 0.5 }}
            className="absolute bottom-8 left-1/2 z-20 rounded-full px-5 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/55 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 sm:bottom-10 sm:text-xs"
          >
            <span className="flex flex-col items-center gap-3">
              Scroll para conectar
              <motion.span
                animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="bg-gradient-to-b from-cyan-400 to-indigo-400 bg-clip-text text-lg text-transparent"
                aria-hidden
              >
                ↓
              </motion.span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
