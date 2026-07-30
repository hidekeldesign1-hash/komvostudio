"use client";

import type { MouseEvent, PropsWithChildren } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ResonanceContainer,
  useResonance,
} from "@/components/ui/ResonanceRipple";

type GlassCardProps = PropsWithChildren<{
  className?: string;
  contentClassName?: string;
  resonance?: boolean;
}>;

export function GlassCard({
  children,
  className = "",
  contentClassName = "",
  resonance = true,
}: GlassCardProps) {
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const normalizedX = useMotionValue(0);
  const normalizedY = useMotionValue(0);
  const lightOpacity = useSpring(0, { stiffness: 220, damping: 28 });
  const { ripples, createRipple, removeRipple } = useResonance();
  const smoothX = useSpring(normalizedX, { stiffness: 180, damping: 22 });
  const smoothY = useSpring(normalizedY, { stiffness: 180, damping: 22 });
  const rotateX = useTransform(
    smoothY,
    [-0.5, 0.5],
    reducedMotion ? [0, 0] : [4, -4],
  );
  const rotateY = useTransform(
    smoothX,
    [-0.5, 0.5],
    reducedMotion ? [0, 0] : [-4, 4],
  );
  const halo = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, rgba(56, 189, 248, 0.15), rgba(129, 140, 248, 0.08) 34%, transparent 60%)`;
  const spectralBorder = useMotionTemplate`radial-gradient(160px circle at ${mouseX}px ${mouseY}px, rgba(103, 232, 249, 0.95), rgba(129, 140, 248, 0.72) 38%, rgba(168, 85, 247, 0.35) 62%, transparent 76%)`;

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    normalizedX.set(x / rect.width - 0.5);
    normalizedY.set(y / rect.height - 0.5);
    lightOpacity.set(1);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onClick={resonance ? createRipple : undefined}
      onMouseLeave={() => {
        normalizedX.set(0);
        normalizedY.set(0);
        lightOpacity.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={`group relative h-full transform-gpu overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-xl transition-[border-color,box-shadow] duration-500 ${className}`}
    >
      <motion.div
        style={{ background: halo, opacity: lightOpacity }}
        className="pointer-events-none absolute inset-0 z-10"
        aria-hidden
      />
      <motion.div
        style={{
          background: spectralBorder,
          opacity: lightOpacity,
          padding: 1,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
        aria-hidden
      />
      <div className={`relative z-10 h-full ${contentClassName}`}>{children}</div>
      {resonance && (
        <ResonanceContainer ripples={ripples} removeRipple={removeRipple} />
      )}
    </motion.div>
  );
}
