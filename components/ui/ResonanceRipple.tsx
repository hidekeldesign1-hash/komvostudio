"use client";

import { useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

export function useResonance() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    setRipples((current) => [
      ...current,
      {
        id: performance.now() + Math.random(),
        x,
        y,
        size,
      },
    ]);

    navigator.vibrate?.(8);
  };

  const removeRipple = (id: number) => {
    setRipples((current) => current.filter((ripple) => ripple.id !== id));
  };

  return { ripples, createRipple, removeRipple };
}

type ResonanceContainerProps = {
  ripples: Ripple[];
  removeRipple: (id: number) => void;
};

export function ResonanceContainer({
  ripples,
  removeRipple,
}: ResonanceContainerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.75 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => removeRipple(ripple.id)}
            style={{
              position: "absolute",
              top: ripple.y - ripple.size / 2,
              left: ripple.x - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, rgba(129, 140, 248, 0.2) 40%, rgba(255, 255, 255, 0) 70%)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              boxShadow:
                "0 0 28px rgba(56, 189, 248, 0.18), inset 0 0 24px rgba(129, 140, 248, 0.12)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
