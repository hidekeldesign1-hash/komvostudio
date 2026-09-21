"use client";

import type { MouseEvent, ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
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
  const { ripples, createRipple, removeRipple } = useResonance();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    onClick?.(event);
  };

  const variantClass =
    variant === "primary"
      ? "border-cyan-300/20 bg-gradient-to-r from-cyan-500/90 to-indigo-600/90 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_20px_rgba(6,182,212,0.24)]"
      : "border-slate-200 bg-white text-slate-900 shadow-sm";

  return (
    <motion.button
      type={type}
      data-wave="off"
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      className={`relative isolate overflow-hidden rounded-full border transition-[border-color,opacity,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 ${variantClass} ${className}`}
      {...props}
    >
      <ResonanceContainer ripples={ripples} removeRipple={removeRipple} />
      <span className="relative z-10">{children as ReactNode}</span>
    </motion.button>
  );
}
