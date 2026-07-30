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
                "radial-gradient(circle, rgba(236, 72, 153, 0.45) 0%, rgba(139, 92, 246, 0.3) 40%, rgba(59, 130, 246, 0) 70%)",
              border: "1px solid rgba(236, 72, 153, 0.5)",
              boxShadow:
                "0 0 30px rgba(236, 72, 153, 0.24), inset 0 0 26px rgba(139, 92, 246, 0.18)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
