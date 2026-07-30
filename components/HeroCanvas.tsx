"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  cyan: boolean;
};

const CYAN = "6, 182, 212";
const INDIGO = "99, 102, 241";
const MOBILE_BREAKPOINT = 768;
const POINTER_RADIUS = 170;

type HeroCanvasProps = {
  paused?: boolean;
};

export function HeroCanvas({ paused = false }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    if (paused) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let isVisible = true;
    let isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const pointer = { x: -1000, y: -1000, active: false };

    const createParticles = () => {
      const count = isMobile
        ? Math.min(360, Math.max(220, Math.floor((width * height) / 2400)))
        : Math.min(1600, Math.max(1000, Math.floor((width * height) / 1000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.13,
        vy: (Math.random() - 0.5) * 0.13,
        radius: Math.random() * 0.8 + 0.55,
        cyan: Math.random() > 0.52,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nextMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      isMobile = nextMobile;
      createParticles();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      const nearby: Particle[] = [];

      for (const particle of particles) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distanceSquared = dx * dx + dy * dy;

        if (pointer.active && distanceSquared < POINTER_RADIUS * POINTER_RADIUS) {
          const distance = Math.sqrt(distanceSquared) || 1;
          const force = (1 - distance / POINTER_RADIUS) * 0.018;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
          if (nearby.length < (isMobile ? 18 : 34)) nearby.push(particle);
        }

        particle.vx += (Math.random() - 0.5) * 0.0015;
        particle.vy += (Math.random() - 0.5) * 0.0015;
        particle.vx *= 0.997;
        particle.vy *= 0.997;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -4) particle.x = width + 4;
        if (particle.x > width + 4) particle.x = -4;
        if (particle.y < -4) particle.y = height + 4;
        if (particle.y > height + 4) particle.y = -4;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${particle.cyan ? CYAN : INDIGO}, ${
          particle.cyan ? 0.56 : 0.42
        })`;
        context.fill();
      }

      for (let index = 0; index < nearby.length; index += 1) {
        const first = nearby[index];
        for (let next = index + 1; next < nearby.length; next += 1) {
          const second = nearby[next];
          const dx = first.x - second.x;
          const dy = first.y - second.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared > 2800) continue;

          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.strokeStyle = `rgba(${first.cyan ? CYAN : INDIGO}, ${
            (1 - Math.sqrt(distanceSquared) / 53) * 0.16
          })`;
          context.lineWidth = 0.5;
          context.stroke();
        }
      }
    };

    const tick = () => {
      if (isVisible && !document.hidden) draw();
      animationFrame = window.requestAnimationFrame(tick);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.01 },
    );

    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);

    if (reducedMotion.matches) {
      draw();
    } else {
      animationFrame = window.requestAnimationFrame(tick);
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [paused]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-55"
      aria-hidden
    />
  );
}
