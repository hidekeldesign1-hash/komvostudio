"use client";

import type { PropsWithChildren } from "react";
import { AnimatePresence, motion } from "framer-motion";

type LiquidConnectProps = PropsWithChildren<{
  active: boolean;
  connectionId: string;
  className?: string;
  connectsToNext?: boolean;
}>;

export function LiquidConnect({
  active,
  connectionId,
  className = "",
  connectsToNext = true,
  children,
}: LiquidConnectProps) {
  return (
    <div className={`relative rounded-xl ${className}`}>
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              layoutId={`liquid-selection-${connectionId}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="pointer-events-none absolute -inset-2 rounded-xl border border-cyan-400/35 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.1),rgba(129,140,248,0.06),transparent_68%)] shadow-[0_0_22px_rgba(56,189,248,0.1)]"
              aria-hidden
            />
            {connectsToNext && (
              <motion.svg
                viewBox="0 0 32 32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute left-1/2 top-[calc(100%+0.5rem)] z-20 h-8 w-8 -translate-x-1/2 overflow-visible"
                aria-hidden
              >
                <defs>
                  <linearGradient
                    id={`liquid-gradient-${connectionId}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#818CF8" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M16 0 C16 10 9 13 16 20 C21 25 16 28 16 32"
                  fill="none"
                  stroke={`url(#liquid-gradient-${connectionId})`}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
                <motion.circle
                  cx="16"
                  cy="4"
                  r="2"
                  fill="#E0F2FE"
                  animate={{ cy: [3, 29], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                />
              </motion.svg>
            )}
          </>
        )}
      </AnimatePresence>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
