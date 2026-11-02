"use client";

import { useEffect, useRef } from "react";

// Fondo de burbujas de agua con profundidad de campo: dos capas (lejana muy
// difuminada y cercana suave) para que se sientan detrás del contenido y no
// distraigan. Borde con interferencia de película fina (como el jabón real),
// reflejos especulares y movimiento lento con rebote suave en los bordes.
// Móvil: pocas burbujas, DPR limitado, pausa fuera de pantalla y respeta
// "reducir movimiento".

type Bubble = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  hue: number;
  wobble: number;
  far: boolean;
};

const DEFAULT_HUES = [338, 322, 300, 352, 20]; // rosa, frambuesa, lila, coral, durazno

function makeBubble(w: number, h: number, anywhere: boolean, hues: number[], far: boolean): Bubble {
  const scale = far ? 0.13 : 0.09;
  const r = (far ? 26 : 12) + Math.random() ** 1.5 * (Math.min(w, 1000) * scale);
  const speed = far ? 0.55 : 1;
  return {
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : h + r + Math.random() * h * 0.25,
    r,
    vx: (Math.random() - 0.5) * 0.14 * speed,
    vy: -(0.1 + Math.random() * 0.22) * speed,
    phase: Math.random() * Math.PI * 2,
    hue: hues[Math.floor(Math.random() * hues.length)],
    wobble: 0.25 + Math.random() * 0.45,
    far,
  };
}

function drawBubble(ctx: CanvasRenderingContext2D, b: Bubble, t: number) {
  const { x, y, r } = b;
  const drift = Math.sin(t * 0.00045 + b.phase) * 26;
  const a = b.far ? 0.55 : 0.8; // opacidad global por capa

  // Cuerpo casi transparente con ligera tinta lechosa
  const body = ctx.createRadialGradient(x - r * 0.2, y - r * 0.25, r * 0.05, x, y, r);
  body.addColorStop(0, `rgba(255, 255, 255, ${0.05 * a})`);
  body.addColorStop(0.7, `hsla(${b.hue + drift}, 70%, 94%, ${0.08 * a})`);
  body.addColorStop(0.9, `hsla(${b.hue + 25 + drift}, 75%, 88%, ${0.22 * a})`);
  body.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Película fina: el color del borde cambia alrededor de la circunferencia
  const segments = 6;
  ctx.lineWidth = Math.max(1, r * 0.05);
  ctx.lineCap = "round";
  for (let i = 0; i < segments; i += 1) {
    const start = (i / segments) * Math.PI * 2 + t * 0.00008 + b.phase;
    const end = start + (Math.PI * 2) / segments + 0.02;
    const hue = b.hue + drift + i * 38;
    ctx.strokeStyle = `hsla(${hue}, 80%, 86%, ${(0.16 + 0.12 * Math.sin(i + b.phase)) * a})`;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.955, start, end);
    ctx.stroke();
  }

  // Contorno muy fino y luminoso
  ctx.lineWidth = Math.max(0.6, r * 0.012);
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 * a})`;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.99, 0, Math.PI * 2);
  ctx.stroke();

  // Reflejo especular (ventana de luz) arriba-izquierda
  ctx.save();
  ctx.translate(x - r * 0.36, y - r * 0.4);
  ctx.rotate(-0.65);
  const spec = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.3);
  spec.addColorStop(0, `rgba(255, 255, 255, ${0.8 * a})`);
  spec.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = spec;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.26, r * 0.11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Reflejo secundario curvo abajo-derecha
  ctx.lineWidth = Math.max(0.8, r * 0.035);
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.22 * a})`;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.8, 0.12 * Math.PI, 0.4 * Math.PI);
  ctx.stroke();
}

export default function BubbleBackground({ hues = DEFAULT_HUES }: { hues?: number[] }) {
  const farRef = useRef<HTMLCanvasElement | null>(null);
  const nearRef = useRef<HTMLCanvasElement | null>(null);
  const huesKey = hues.join(",");

  useEffect(() => {
    const farCanvas = farRef.current;
    const nearCanvas = nearRef.current;
    if (!farCanvas || !nearCanvas) return;
    const farCtx = farCanvas.getContext("2d");
    const nearCtx = nearCanvas.getContext("2d");
    if (!farCtx || !nearCtx) return;
    const palette = huesKey.split(",").map(Number).filter((n) => !Number.isNaN(n));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let bubbles: Bubble[] = [];
    let raf = 0;
    let running = true;
    const pointer = { x: -9999, y: -9999 };

    function sizeCanvas(c: HTMLCanvasElement, cx: CanvasRenderingContext2D, dpr: number) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      // La capa lejana va muy difuminada: basta con baja resolución.
      sizeCanvas(farCanvas!, farCtx!, 0.75);
      sizeCanvas(nearCanvas!, nearCtx!, Math.min(window.devicePixelRatio || 1, 1.5));
      const farCount = w < 640 ? 6 : w < 1100 ? 8 : 10;
      const nearCount = w < 640 ? 5 : w < 1100 ? 7 : 9;
      const far = bubbles.filter((b) => b.far).slice(0, farCount);
      const near = bubbles.filter((b) => !b.far).slice(0, nearCount);
      while (far.length < farCount) far.push(makeBubble(w, h, true, palette, true));
      while (near.length < nearCount) near.push(makeBubble(w, h, true, palette, false));
      bubbles = [...far, ...near];
    }

    function step(t: number) {
      farCtx!.clearRect(0, 0, w, h);
      nearCtx!.clearRect(0, 0, w, h);
      for (const b of bubbles) {
        b.vx += Math.sin(t * 0.0007 * b.wobble + b.phase) * 0.0025;
        b.x += b.vx;
        b.y += b.vy;

        if (!b.far) {
          const dx = b.x - pointer.x;
          const dy = b.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          const reach = b.r + 80;
          if (dist < reach && dist > 0.1) {
            const push = (1 - dist / reach) * 0.4;
            b.vx += (dx / dist) * push;
            b.vy += (dy / dist) * push * 0.5;
          }
        }

        if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.6; }
        if (b.x + b.r > w) { b.x = w - b.r; b.vx = -Math.abs(b.vx) * 0.6; }
        b.vx *= 0.986;
        const base = b.far ? -0.09 : -0.16;
        b.vy += (base - b.vy) * 0.008;

        if (b.y + b.r < -20) Object.assign(b, makeBubble(w, h, false, palette, b.far));

        drawBubble(b.far ? farCtx! : nearCtx!, b, t);
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
  }, [huesKey]);

  return (
    <>
      <canvas ref={farRef} className="eg-bubbles is-far" aria-hidden="true" />
      <canvas ref={nearRef} className="eg-bubbles is-near" aria-hidden="true" />
    </>
  );
}
