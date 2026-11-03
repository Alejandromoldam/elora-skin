"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type HeroSlide = {
  key: string;
  eyebrow?: string;
  titlePre: string;
  titleEm: string;
  lead: string;
  cta: string;
  href: string;
  image: { url: string; alt: string } | null;
};

const INTERVAL_MS = 5500;

function Title({ pre, em }: { pre: string; em: string }) {
  const words = em.trim().split(" ");
  const last = words.pop() ?? "";
  const head = words.length ? `${words.join(" ")} ` : "";
  return (
    <>
      {pre}{" "}
      {head}
      <span className="eg-swoosh">{last}</span>
    </>
  );
}

export default function HeroCarousel({ slides, labels }: { slides: HeroSlide[]; labels: { prev: string; next: string; goTo: string } }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const total = slides.length;

  const go = useCallback((n: number) => setIndex(((n % total) + total) % total), [total]);

  useEffect(() => {
    if (total < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [total, paused]);

  if (total === 0) return null;
  const slide = slides[index];

  return (
    <section
      className="eg-hero eg-hero-carousel"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null; setPaused(true); }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX ?? null;
        touchX.current = null;
        setPaused(false);
        if (start === null || end === null || Math.abs(end - start) < 40) return;
        go(index + (end < start ? 1 : -1));
      }}
    >
      <div className="eg-hero-copies" aria-live="polite">
        {slides.map((s, i) => {
          const on = i === index;
          const Heading = i === 0 ? "h1" : "h2";
          return (
            <div key={`copy-${s.key}`} className={`eg-hero-copy${on ? " is-active" : ""}`} aria-hidden={!on}>
              {s.eyebrow ? <p className="eg-hero-eyebrow">{s.eyebrow}</p> : null}
              <Heading className="eg-h1"><Title pre={s.titlePre} em={s.titleEm} /></Heading>
              <p className="eg-lead">{s.lead}</p>
              <a className="eg-btn" href={s.href} tabIndex={on ? 0 : -1}>
                {s.cta}
                <span aria-hidden="true" className="eg-chev">›</span>
              </a>
            </div>
          );
        })}
      </div>

      <div className="eg-hero-media">
        <div className="eg-hero-stack">
          {slides.map((s, i) =>
            // Si dos slides comparten la misma foto, no se repite el cambio.
            s.image && slides.findIndex((o) => o.image?.url === s.image?.url) === i ? (
              <Link
                key={s.key}
                href={slide.image?.url === s.image?.url ? slide.href : s.href}
                className={`eg-hero-frame${s.image?.url === slide.image?.url ? " is-active" : ""}`}
                aria-hidden={s.image?.url !== slide.image?.url}
                tabIndex={s.image?.url === slide.image?.url ? 0 : -1}
              >
                <Image src={s.image.url} alt={s.image.alt} width={720} height={720} priority={i === 0} sizes="(max-width: 700px) 46vw, 520px" />
              </Link>
            ) : null
          )}
        </div>
        <span className="eg-podium" aria-hidden="true"><span className="eg-podium-top" /></span>
        <span className="eg-streak s1" aria-hidden="true" />
        <span className="eg-streak s2" aria-hidden="true" />
        <span className="eg-twinkle t1" aria-hidden="true" />
        <span className="eg-twinkle t2" aria-hidden="true" />
        <span className="eg-twinkle t3" aria-hidden="true" />
      </div>

      {total > 1 ? (
        <div className="eg-hero-dots" role="tablist">
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={labels.goTo.replace("{n}", String(i + 1))}
              className={i === index ? "is-on" : ""}
              onClick={() => go(i)}
            >
              <span style={i === index && !paused ? { animationDuration: `${INTERVAL_MS}ms` } : undefined} />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
