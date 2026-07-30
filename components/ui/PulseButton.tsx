"use client";

import type { MouseEvent, ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { useSound } from "@/lib/sound";
import {
  ResonanceContainer,
  useResonance,
} from "@/components/ui/ResonanceRipple";

type PulseButtonProps = HTMLMotionProps<"button"> & {
  variant?: "glass" | "primary";
};

export function PulseButton({
  children,
  className = "",
  onClick,
  variant = "glass",
  type = "button",
  ...props
}: PulseButtonProps) {
  const { playPulse } = useSound();
  const { ripples, createRipple, removeRipple } = useResonance();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    playPulse();
    onClick?.(event);
  };

  const variantClass =
    variant === "primary"
      ? "border-cyan-300/20 bg-gradient-to-r from-cyan-500/90 to-indigo-600/90 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_20px_rgba(6,182,212,0.24)]"
      : "border-white/10 bg-slate-950/65 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_35px_rgba(0,0,0,0.25)]";

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      className={`relative isolate overflow-hidden rounded-full border backdrop-blur-xl transition-[border-color,opacity,box-shadow] duration-300 before:pointer-events-none before:absolute before:inset-x-[18%] before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/45 before:to-transparent hover:border-cyan-400/40 hover:shadow-[0_0_24px_rgba(99,102,241,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 ${variantClass} ${className}`}
      {...props}
    >
      <ResonanceContainer ripples={ripples} removeRipple={removeRipple} />
      <span className="relative z-10">{children as ReactNode}</span>
    </motion.button>
  );
}
