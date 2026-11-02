"use client";

import { useEffect, useRef } from "react";

// Fondo animado de burbujas de agua iridiscentes: suben despacio, se mecen,
// rebotan suavemente en los bordes y se apartan del dedo/cursor.
// Pensado para móvil: pocas burbujas, DPR limitado, se pausa fuera de pantalla
// y respeta "reducir movimiento" (dibuja un solo cuadro estático).

type Bubble = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  hue: number;
  wobble: number;
};

const HUES = [338, 322, 300, 352, 20]; // rosa, frambuesa, lila, coral, durazno

function makeBubble(w: number, h: number, anywhere: boolean): Bubble {
  const r = 10 + Math.random() ** 1.6 * (Math.min(w, 900) * 0.11);
  return {
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : h + r + Math.random() * h * 0.3,
    r,
    vx: (Math.random() - 0.5) * 0.18,
    vy: -(0.12 + Math.random() * 0.32) * (40 / (r + 20) + 0.4),
    phase: Math.random() * Math.PI * 2,
    hue: HUES[Math.floor(Math.random() * HUES.length)],
    wobble: 0.25 + Math.random() * 0.5,
  };
}

function drawBubble(ctx: CanvasRenderingContext2D, b: Bubble, t: number) {
  const { x, y, r } = b;
  const shift = Math.sin(t * 0.0006 + b.phase) * 20;

  // Cuerpo: centro casi transparente, borde iridiscente
  const body = ctx.createRadialGradient(x - r * 0.25, y - r * 0.3, r * 0.1, x, y, r);
  body.addColorStop(0, "rgba(255, 255, 255, 0.04)");
  body.addColorStop(0.62, `hsla(${b.hue + shift}, 90%, 92%, 0.08)`);
  body.addColorStop(0.86, `hsla(${b.hue + 40 + shift}, 85%, 82%, 0.28)`);
  body.addColorStop(0.97, `hsla(${b.hue - 30 + shift}, 90%, 88%, 0.55)`);
  body.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Contorno fino con brillo
  ctx.lineWidth = Math.max(0.8, r * 0.025);
  ctx.strokeStyle = `hsla(${b.hue + 60 + shift}, 80%, 96%, 0.45)`;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.985, 0, Math.PI * 2);
  ctx.stroke();

  // Reflejo especular arriba-izquierda
  ctx.save();
  ctx.translate(x - r * 0.38, y - r * 0.42);
  ctx.rotate(-0.7);
  const spec = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.32);
  spec.addColorStop(0, "rgba(255, 255, 255, 0.85)");
  spec.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = spec;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.3, r * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Reflejo secundario abajo-derecha (la "ventana" del agua)
  ctx.lineWidth = Math.max(0.8, r * 0.05);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
  ctx.beginPath();
  ctx.arc(x, y, r * 0.78, 0.15 * Math.PI, 0.42 * Math.PI);
  ctx.stroke();
}

export default function BubbleBackground({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let bubbles: Bubble[] = [];
    let raf = 0;
    let running = true;
    const pointer = { x: -9999, y: -9999 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 640 ? 11 : w < 1100 ? 15 : 20;
      if (bubbles.length === 0) bubbles = Array.from({ length: count }, () => makeBubble(w, h, true));
      else if (bubbles.length > count) bubbles = bubbles.slice(0, count);
      else while (bubbles.length < count) bubbles.push(makeBubble(w, h, true));
    }

    function step(t: number) {
      ctx!.clearRect(0, 0, w, h);
      for (const b of bubbles) {
        // Deriva + balanceo
        b.vx += Math.sin(t * 0.0008 * b.wobble + b.phase) * 0.0035;
        b.x += b.vx;
        b.y += b.vy;

        // Se aparta suavemente del dedo / cursor
        const dx = b.x - pointer.x;
        const dy = b.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        const reach = b.r + 90;
        if (dist < reach && dist > 0.1) {
          const push = (1 - dist / reach) * 0.6;
          b.vx += (dx / dist) * push;
          b.vy += (dy / dist) * push * 0.6;
        }

        // Rebote suave en los bordes laterales
        if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.7; }
        if (b.x + b.r > w) { b.x = w - b.r; b.vx = -Math.abs(b.vx) * 0.7; }

        // Fricción para que todo vuelva a la calma
        b.vx *= 0.985;
        const base = -(0.12 + 0.32 * (40 / (b.r + 20) + 0.4)) * 0.6;
        b.vy += (base - b.vy) * 0.01;

        // Al salir por arriba, renace abajo
        if (b.y + b.r < -10) Object.assign(b, makeBubble(w, h, false));

        drawBubble(ctx!, b, t);
      }
      if (running && !reduce) raf = requestAnimationFrame(step);
    }

    function onMove(e: PointerEvent) { pointer.x = e.clientX; pointer.y = e.clientY; }
    function onLeave() { pointer.x = -9999; pointer.y = -9999; }
    function onVisibility() {
      running = document.visibilityState === "visible";
      cancelAnimationFrame(raf);
      if (running && !reduce) raf = requestAnimationFrame(step);
    }

    resize();
    raf = requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className={`eg-bubbles ${className}`.trim()} aria-hidden="true" />;
}
