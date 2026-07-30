"use client";

import { useEffect } from "react";

const TARGETS = 'button:not([data-wave="off"]), a[href][class*="rounded-full"]';

type Box = { left: number; top: number; right: number; bottom: number };

/**
 * Recorta la onda contra los contenedores con scroll/overflow del botón para
 * que no se desborde cuando el botón está parcialmente oculto.
 */
function clipToAncestors(target: HTMLElement, rect: DOMRect): Box {
  const box: Box = {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
  };

  let node = target.parentElement;
  while (node && node !== document.body) {
    const style = getComputedStyle(node);
    if (/(auto|scroll|hidden|clip)/.test(`${style.overflowX} ${style.overflowY}`)) {
      const bounds = node.getBoundingClientRect();
      box.left = Math.max(box.left, bounds.left);
      box.top = Math.max(box.top, bounds.top);
      box.right = Math.min(box.right, bounds.right);
      box.bottom = Math.min(box.bottom, bounds.bottom);
    }
    node = node.parentElement;
  }

  return box;
}

/**
 * Replica el pulso del quiz sobre los botones de la landing sin tocar sus
 * clases: la onda vive en una capa propia sobre el botón, así un re-render de
 * React no puede reescribir el className y descolocarla.
 */
export function GlobalButtonWave() {
  useEffect(() => {
    const createWave = (target: HTMLElement, clientX?: number, clientY?: number) => {
      // Las opciones del quiz ya generan su propio pulso.
      if (target.closest(".quiz-shell") || target.hasAttribute("disabled")) return;

      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const box = clipToAncestors(target, rect);
      const clipWidth = box.right - box.left;
      const clipHeight = box.bottom - box.top;
      if (clipWidth <= 0 || clipHeight <= 0) return;

      // Sin coordenadas válidas (teclado) la onda nace del centro del botón.
      const hasPointer =
        typeof clientX === "number" &&
        typeof clientY === "number" &&
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;
      const originX = hasPointer ? clientX : rect.left + rect.width / 2;
      const originY = hasPointer ? clientY : rect.top + rect.height / 2;

      const style = getComputedStyle(target);
      const clip = document.createElement("div");
      clip.className = "global-button-wave-clip";
      clip.setAttribute("aria-hidden", "true");
      clip.style.left = `${box.left}px`;
      clip.style.top = `${box.top}px`;
      clip.style.width = `${clipWidth}px`;
      clip.style.height = `${clipHeight}px`;
      clip.style.borderTopLeftRadius = style.borderTopLeftRadius;
      clip.style.borderTopRightRadius = style.borderTopRightRadius;
      clip.style.borderBottomLeftRadius = style.borderBottomLeftRadius;
      clip.style.borderBottomRightRadius = style.borderBottomRightRadius;

      const size = Math.max(rect.width, rect.height) * 2;
      const wave = document.createElement("span");
      wave.className = "global-button-wave";
      wave.style.left = `${originX - box.left}px`;
      wave.style.top = `${originY - box.top}px`;
      wave.style.width = `${size}px`;
      wave.style.height = `${size}px`;

      clip.appendChild(wave);
      document.body.appendChild(clip);

      let done = false;
      const cleanup = () => {
        if (done) return;
        done = true;
        window.clearTimeout(timer);
        window.removeEventListener("scroll", cleanup, true);
        clip.remove();
      };

      // Si el layout se mueve durante la animación la capa quedaría desfasada.
      const timer = window.setTimeout(cleanup, 1200);
      window.addEventListener("scroll", cleanup, true);
      wave.addEventListener("animationend", cleanup, { once: true });
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
