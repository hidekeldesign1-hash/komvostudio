"use client";

import { useEffect } from "react";

const TARGETS = 'button:not([data-wave="off"]), a[href][class*="rounded-full"]';

/**
 * Replica el pulso del quiz sobre los botones de la landing sin reemplazar
 * sus clases, colores, bordes ni dimensiones.
 */
export function GlobalButtonWave() {
  useEffect(() => {
    const createWave = (target: HTMLElement, clientX?: number, clientY?: number) => {
      // Las opciones del quiz ya generan su propio pulso.
      if (target.closest(".quiz-shell") || target.hasAttribute("disabled")) return;

      const rect = target.getBoundingClientRect();
      const wave = document.createElement("span");
      const size = Math.max(rect.width, rect.height) * 2;
      const x = clientX == null ? rect.width / 2 : clientX - rect.left;
      const y = clientY == null ? rect.height / 2 : clientY - rect.top;

      target.classList.add("global-button-wave-host");
      if (getComputedStyle(target).position === "static") {
        target.classList.add("global-button-wave-positioned");
      }
      wave.className = "global-button-wave";
      wave.setAttribute("aria-hidden", "true");
      wave.style.setProperty("--wave-x", `${x}px`);
      wave.style.setProperty("--wave-y", `${y}px`);
      wave.style.setProperty("--wave-size", `${size}px`);
      target.appendChild(wave);

      wave.addEventListener(
        "animationend",
        () => {
          wave.remove();
          if (!target.querySelector(".global-button-wave")) {
            target.classList.remove(
              "global-button-wave-host",
              "global-button-wave-positioned",
            );
          }
        },
        { once: true },
      );
    };

    const onPointerDown = (event: PointerEvent) => {
      const origin = event.target;
      if (!(origin instanceof Element)) return;
      const target = origin.closest<HTMLElement>(TARGETS);
      if (target) createWave(target, event.clientX, event.clientY);
    };

    const onClick = (event: MouseEvent) => {
      // Los clics disparados con teclado no producen pointerdown.
      if (event.detail !== 0) return;
      const origin = event.target;
      if (!(origin instanceof Element)) return;
      const target = origin.closest<HTMLElement>(TARGETS);
      if (target) createWave(target);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
