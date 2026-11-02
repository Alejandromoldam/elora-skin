"use client";

import { useMemo, useState } from "react";
import { trackBeginCheckout } from "@/lib/ga";
import type { Locale } from "@/lib/i18n";

type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  priceAmount: string;
  compareAtAmount: string | null;
};

type Labels = {
  oneUnit: string;
  nUnits: string;
  mostPopular: string;
  bestValue: string;
  buyNow: string;
  redirecting: string;
  error: string;
};

function units(title: string) {
  const m = title.match(/^\s*(\d+)\s/);
  return m ? Number(m[1]) : 0;
}

function money(amount: number, currency: string, locale: Locale) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

function BottleGlyph({ count }: { count: number }) {
  return (
    <span className="eg-bottles" aria-hidden="true">
      {Array.from({ length: Math.max(1, Math.min(count, 3)) }).map((_, i) => (
        <svg key={i} viewBox="0 0 16 28" fill="none">
          <path d="M6 1.5h4v4H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M5 5.5h6l1.5 3v15.5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V8.5L5 5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

export default function HomePackPicker({
  variants,
  currency,
  locale,
  labels,
  productTitle,
  fallbackUrl,
}: {
  variants: Variant[];
  currency: string;
  locale: Locale;
  labels: Labels;
  productTitle: string;
  fallbackUrl: string;
}) {
  const packs = useMemo(
    () => variants.filter((v) => units(v.title) > 0).slice(0, 3),
    [variants]
  );
  const [selected, setSelected] = useState<string>(packs[1]?.id || packs[0]?.id || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (packs.length === 0) return null;

  async function buy() {
    const v = packs.find((p) => p.id === selected);
    if (!v || !v.availableForSale) return;
    setBusy(true);
    setError(null);
    trackBeginCheckout({
      currency,
      value: Number(v.priceAmount),
      items: [{ item_id: v.id, item_name: productTitle, item_variant: v.title, currency, price: Number(v.priceAmount), quantity: 1 }],
    });
    try {
      const res = await fetch("/api/cart/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId: v.id, quantity: 1 }),
      });
      const payload = (await res.json()) as { ok: boolean; cart?: { checkoutUrl?: string } | null };
      if (res.ok && payload.ok && payload.cart?.checkoutUrl) {
        window.location.href = payload.cart.checkoutUrl;
        return;
      }
      setError(labels.error);
    } catch {
      setError(labels.error);
    }
    setBusy(false);
  }

  return (
    <div className="eg-glass eg-packs">
      <div className="eg-packs-row" role="radiogroup" aria-label={productTitle}>
        {packs.map((p, i) => {
          const n = units(p.title);
          const on = p.id === selected;
          const tag = packs.length > 2 ? (i === 1 ? labels.mostPopular : i === 2 ? labels.bestValue : null) : null;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={on}
              className={`eg-pack${on ? " is-on" : ""}`}
              onClick={() => setSelected(p.id)}
              disabled={!p.availableForSale}
            >
              {tag ? <span className="eg-pack-tag">{tag}</span> : null}
              <BottleGlyph count={n} />
              <span className="eg-pack-name">{n === 1 ? labels.oneUnit : labels.nUnits.replace("{n}", String(n))}</span>
              {p.compareAtAmount && Number(p.compareAtAmount) > Number(p.priceAmount) ? (
                <s className="eg-pack-was">{money(Number(p.compareAtAmount), currency, locale)}</s>
              ) : (
                <span className="eg-pack-was is-empty" aria-hidden="true">&nbsp;</span>
              )}
              <span className="eg-pack-price">{money(Number(p.priceAmount), currency, locale)}</span>
            </button>
          );
        })}
      </div>
      <button type="button" className="eg-btn eg-btn-wide" onClick={() => void buy()} disabled={busy}>
        {busy ? labels.redirecting : labels.buyNow}
        <span aria-hidden="true" className="eg-chev">›</span>
      </button>
      {error ? (
        <p className="eg-pack-error" role="status">
          {error} <a href={fallbackUrl}>→</a>
        </p>
      ) : null}
    </div>
  );
}
