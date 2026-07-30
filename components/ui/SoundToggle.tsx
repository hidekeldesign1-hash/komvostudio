"use client";

import { useSound } from "@/lib/sound";

type SoundToggleProps = {
  className?: string;
};

export function SoundToggle({ className = "" }: SoundToggleProps) {
  const { enabled, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Desactivar sonido" : "Activar sonido"}
      title={enabled ? "Sonido activado" : "Sonido desactivado"}
      className={`group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-950/50 text-xs text-foreground-secondary backdrop-blur-xl transition-colors hover:border-cyan-400/40 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${className}`}
    >
      <span className="relative flex h-4 w-4 items-center justify-center gap-[2px]" aria-hidden>
        {[7, 13, 9].map((height, index) => (
          <span
            key={height}
            className={`w-px rounded-full bg-current transition-opacity ${
              enabled ? "animate-pulse opacity-100" : "opacity-35"
            }`}
            style={{ height, animationDelay: `${index * 120}ms` }}
          />
        ))}
      </span>
    </button>
  );
}
