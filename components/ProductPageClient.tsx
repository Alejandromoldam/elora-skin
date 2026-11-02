"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useParams } from "next/navigation";
import { getMessages, localizePath, currencyLocale, type Locale } from "@/lib/i18n";
import LangSwitcher from "@/components/elora/LangSwitcher";
import PillButton from "@/components/elora/PillButton";
import RevealOnScroll from "@/components/elora/RevealOnScroll";
import EloraCartLink from "@/components/elora/EloraCartLink";
import { LightningIcon } from "@/components/elora/Icons";
import { trackAddToCart, trackBeginCheckout, trackViewItem } from "@/lib/ga";
import { getProductLandingContent, getProductTheme, type BenefitIcon } from "@/lib/productContent";
import BubbleBackground from "@/components/elora/BubbleBackground";

type ProductImage = {
  url: string;
  altText: string;
};

type ProductVideoSource = {
  url: string;
  mimeType: string;
};

type ProductVideo = {
  sources: ProductVideoSource[];
  previewImageUrl: string | null;
  alt: string;
};

type ProductVariant = {
  id: string;
  title: string;
  sku: string | null;
  quantityAvailable: number | null;
  availableForSale: boolean;
  priceAmount: string;
  priceCurrency: string;
  compareAtAmount?: string | null;
};

type ProductPayload = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  vendor: string;
  productType: string;
  priceAmount: string;
  priceCurrency: string;
  selectedVariantId: string | null;
  selectedVariantSku: string | null;
  selectedVariantInventory: number | null;
  variants: ProductVariant[];
  images: ProductImage[];
  videos: ProductVideo[];
  productUrl: string;
  buyNowUrl: string;
  // Contenido editorial de la landing por producto. Hoy lo llena el catálogo
  // local de desarrollo; con Shopify real puede venir de metafields.
  benefits?: string[];
  ingredients?: string[];
  usage?: string[];
};

type ProductApiResponse = {
  ok: boolean;
  error: string | null;
  product?: ProductPayload;
};

type RelatedCatalogProduct = {
  id: string;
  title: string;
  handle: string;
  variantId?: string | null;
  descriptionShort: string;
  imageUrl: string;
  imageAlt: string;
  priceAmount: string;
  priceCurrency: string;
  availableForSale: boolean;
  productUrl: string;
};

type CatalogApiResponse = {
  ok: boolean;
  error: string | null;
  products: RelatedCatalogProduct[];
};

type CartApiResponse = {
  ok: boolean;
  error: string | null;
  cart: {
    id: string;
    checkoutUrl: string;
    totalQuantity: number;
  } | null;
};

type LocalCartLine = {
  id: string;
  merchandiseId?: string;
  quantity: number;
  title: string;
  variantTitle: string;
  imageUrl: string;
  imageAlt: string;
  unitPriceAmount: string;
  unitPriceCurrency: string;
  lineTotalAmount: string;
  lineTotalCurrency: string;
  availableForSale: boolean;
  productUrl: string;
};

type LocalCartPayload = {
  lines: LocalCartLine[];
};

const LOCAL_CART_STORAGE_KEY = "sf_local_cart_v1";
const LOCAL_CART_EVENT = "sf-local-cart-updated";
const CART_DRAWER_EVENT = "sf-cart-drawer-visibility";
const LOCAL_CART_EVENT_SOURCE = "product-detail";

type TrustSignalIconType =
  | "shield"
  | "truck"
  | "spark"
  | "support"
  | "lock"
  | "badge";

const TRUST_SIGNAL_ICONS: TrustSignalIconType[] = [
  "shield",
  "truck",
  "spark",
  "support",
  "lock",
  "badge",
];

function formatMoney(amount: string, currencyCode: string, intlLocale = "en-US") {
  const value = Number(amount);
  if (Number.isNaN(value)) {
    return `${amount} ${currencyCode}`;
  }
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(value);
}

function extractVariantNumericId(variantGid: string | undefined) {
  if (!variantGid) return null;
  const match = variantGid.match(/\/(\d+)(?:\?.*)?$/);
  return match?.[1] ?? null;
}

function getPriceNumber(amount: string) {
  const value = Number(amount);
  return Number.isFinite(value) ? value : 0;
}

function getLineTotalAmount(unitPriceAmount: string, quantity: number) {
  return (getPriceNumber(unitPriceAmount) * Math.max(1, quantity)).toFixed(2);
}

function shuffleProducts<T>(items: T[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shortenTitle(title: string, maxLength = 38) {
  const normalized = title.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}

function TrustSignalIcon({
  icon,
  className = "",
}: {
  icon: TrustSignalIconType;
  className?: string;
}) {
  if (icon === "shield") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
        <path d="M12 3 4.8 6.1V11c0 4.9 3 8.4 7.2 10 4.2-1.6 7.2-5.1 7.2-10V6.1L12 3Z" stroke="currentColor" strokeWidth="1.7" />
        <path d="m8.7 12.1 2.1 2 4.5-4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === "truck") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
        <path d="M3 7.5h11v7.3H3V7.5Zm11 2.2h3l3 3v2.1h-6V9.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <circle cx="7.4" cy="16.9" r="1.4" fill="currentColor" />
        <circle cx="17.5" cy="16.9" r="1.4" fill="currentColor" />
      </svg>
    );
  }
  if (icon === "spark") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
        <path d="M12 3.8 14.3 9l5.2 2.3-5.2 2.3L12 18.8l-2.3-5.2-5.2-2.3L9.7 9 12 3.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === "support") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
        <path d="M4 11a8 8 0 0 1 16 0v4.5a2 2 0 0 1-2 2h-2.3v-5.7H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 11h4.3v5.7H6a2 2 0 0 1-2-2V11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === "lock") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
        <rect x="5.4" y="10.3" width="13.2" height="10.2" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8.8 10.3V8.5A3.2 3.2 0 0 1 12 5.3a3.2 3.2 0 0 1 3.2 3.2v1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m8.9 12 1.9 1.9 4.3-4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProductPage({ locale = "en" }: { locale?: Locale }) {
  const pt = getMessages(locale).product;
  const bt = getMessages(locale).bestsellers;
  const intlLocale = currencyLocale(locale);
  const params = useParams<{ handle: string }>();
  const handle = params?.handle || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductPayload | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedCatalogProduct[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [relatedError, setRelatedError] = useState<string | null>(null);
  const [addingRelatedId, setAddingRelatedId] = useState<string | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const trackedViewProductIdRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadProduct() {
      if (!handle) return;
      setLoading(true);
      setError(null);
      setCartMessage(null);
      try {
        const response = await fetch(`/api/product/${handle}?locale=${locale}`, { cache: "no-store" });
        const payload = (await response.json()) as ProductApiResponse;
        if (!active) return;
        if (!response.ok || !payload.ok || !payload.product) {
          setError(payload.error || "No se pudo cargar el producto.");
          setProduct(null);
          return;
        }
        setProduct(payload.product);
        setSelectedVariantId(payload.product.selectedVariantId || payload.product.variants[0]?.id || "");
        setQuantity(1);
        setActiveImage(0);
      } catch {
        if (!active) return;
        setError("Error de conexion al cargar el producto.");
        setProduct(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadProduct();
    return () => { active = false; };
  }, [handle]);

  const currentImage = useMemo(() => {
    if (!product?.images?.length) {
      return { url: "/producto-real.png", altText: "Producto Elora Skin" };
    }
    return product.images[Math.min(activeImage, product.images.length - 1)];
  }, [activeImage, product]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    return product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  }, [product, selectedVariantId]);

  const descriptionHtml = useMemo(() => {
    const rich = product?.descriptionHtml?.trim() || "";
    if (rich) return rich;
    const plain = product?.description?.trim() || "";
    if (!plain) return "<p>Este producto no tiene descripcion publica todavia.</p>";
    return plain.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean).map((b) => `<p>${escapeHtml(b).replace(/\n/g, "<br />")}</p>`).join("");
  }, [product]);

  const maxQuantity = useMemo(() => {
    if (!selectedVariant?.availableForSale) return 1;
    if (selectedVariant.quantityAvailable === null) return 99;
    return Math.max(1, selectedVariant.quantityAvailable);
  }, [selectedVariant]);

  useEffect(() => {
    setQuantity((c) => Math.max(1, Math.min(c, maxQuantity)));
  }, [maxQuantity]);

  const inventoryText = useMemo(() => {
    if (selectedVariant?.availableForSale === true) return pt.available;
    if (selectedVariant?.availableForSale === false) return pt.soldOut;
    if (product?.availableForSale === true) return pt.available;
    if (product?.availableForSale === false) return pt.soldOut;
    if ((product?.variants?.length || 0) > 0) return "En stock";
    return "Agotado";
  }, [product, selectedVariant]);

  useEffect(() => {
    if (!product?.id || trackedViewProductIdRef.current === product.id) return;
    trackViewItem({
      currency: selectedVariant?.priceCurrency || product.priceCurrency,
      value: getPriceNumber(selectedVariant?.priceAmount || product.priceAmount),
      items: [{ item_id: selectedVariant?.id || product.id, item_name: product.title, item_variant: selectedVariant?.title || undefined, currency: selectedVariant?.priceCurrency || product.priceCurrency, price: getPriceNumber(selectedVariant?.priceAmount || product.priceAmount), quantity: 1 }],
    });
    trackedViewProductIdRef.current = product.id;
  }, [product?.id, product?.title, product?.priceAmount, product?.priceCurrency, selectedVariant?.id, selectedVariant?.title, selectedVariant?.priceAmount, selectedVariant?.priceCurrency]);

  function trackBuyNowIntent() {
    if (!product) return;
    const safeQty = Math.max(1, Math.min(quantity, maxQuantity));
    const baseAmount = getPriceNumber(selectedVariant?.priceAmount || product.priceAmount);
    const currency = selectedVariant?.priceCurrency || product.priceCurrency;
    trackBeginCheckout({ currency, value: baseAmount * safeQty, items: [{ item_id: selectedVariant?.id || product.id, item_name: product.title, item_variant: selectedVariant?.title || undefined, currency, price: baseAmount, quantity: safeQty }] });
  }

  useEffect(() => {
    const sync = () => setCartDrawerOpen(window.location.hash === "#carrito");
    const onDrawer = (e: Event) => {
      const ce = e as CustomEvent<{ open?: boolean }>;
      if (typeof ce.detail?.open === "boolean") setCartDrawerOpen(ce.detail.open);
      else sync();
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener(CART_DRAWER_EVENT, onDrawer as EventListener);
    return () => { window.removeEventListener("hashchange", sync); window.removeEventListener(CART_DRAWER_EVENT, onDrawer as EventListener); };
  }, []);

  useEffect(() => {
    let active = true;
    async function loadRelated() {
      if (!product?.id) { setRelatedProducts([]); setRelatedError(null); return; }
      setLoadingRelated(true); setRelatedError(null);
      try {
        const res = await fetch(`/api/catalog?locale=${locale}`, { cache: "no-store" });
        const payload = (await res.json()) as CatalogApiResponse;
        if (!active) return;
        if (!res.ok || !payload.ok) { setRelatedProducts([]); setRelatedError(payload.error || "Error al cargar relacionados."); return; }
        const candidates = (payload.products || []).filter((i) => i.id !== product.id && i.handle !== product.handle);
        const randomized = shuffleProducts(candidates);
        setRelatedProducts(randomized.slice(0, randomized.length >= 4 ? (Math.random() < 0.5 ? 3 : 4) : randomized.length));
      } catch { if (!active) return; setRelatedProducts([]); setRelatedError("Error de conexion."); }
      finally { if (active) setLoadingRelated(false); }
    }
    void loadRelated();
    return () => { active = false; };
  }, [product?.handle, product?.id]);

  function syncLocalCartLine(options: { lineId: string; merchandiseId?: string; quantityToAdd: number; title: string; variantTitle: string; imageUrl: string; imageAlt: string; unitPriceAmount: string; unitPriceCurrency: string; availableForSale: boolean; productUrl: string; }) {
    const raw = window.localStorage.getItem(LOCAL_CART_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as LocalCartPayload) : { lines: [] };
    const currentLines = Array.isArray(parsed?.lines) ? parsed.lines : [];
    const existing = currentLines.find((l) => l.id === options.lineId);
    const nextLines = existing
      ? currentLines.map((l) => l.id !== options.lineId ? l : { ...l, quantity: l.quantity + options.quantityToAdd, lineTotalAmount: getLineTotalAmount(l.unitPriceAmount, l.quantity + options.quantityToAdd) })
      : [...currentLines, { id: options.lineId, merchandiseId: options.merchandiseId, quantity: options.quantityToAdd, title: options.title, variantTitle: options.variantTitle, imageUrl: options.imageUrl, imageAlt: options.imageAlt, unitPriceAmount: options.unitPriceAmount, unitPriceCurrency: options.unitPriceCurrency, lineTotalAmount: getLineTotalAmount(options.unitPriceAmount, options.quantityToAdd), lineTotalCurrency: options.unitPriceCurrency, availableForSale: options.availableForSale, productUrl: options.productUrl }];
    window.localStorage.setItem(LOCAL_CART_STORAGE_KEY, JSON.stringify({ lines: nextLines }));
    window.dispatchEvent(new CustomEvent(LOCAL_CART_EVENT, { detail: { quantity: nextLines.reduce((a, l) => a + l.quantity, 0), source: LOCAL_CART_EVENT_SOURCE, openDrawer: true } }));
  }

  async function addToCart() {
    if (!product || !selectedVariant?.id) { setCartMessage("No hay variante valida."); return; }
    if (!selectedVariant.availableForSale) { setCartMessage("Esta variante esta agotada."); return; }
    setAddingToCart(true); setCartMessage(null);
    const safeQty = Math.max(1, Math.min(quantity, maxQuantity));
    try {
      const res = await fetch("/api/cart/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ merchandiseId: selectedVariant.id, quantity: safeQty }) });
      const payload = (await res.json()) as CartApiResponse;
      if (!res.ok || !payload.ok || !payload.cart?.id) { setCartMessage(payload.error || "No se pudo agregar al carrito."); return; }
      syncLocalCartLine({ lineId: selectedVariant.id, merchandiseId: selectedVariant.id, quantityToAdd: safeQty, title: product.title, variantTitle: selectedVariant.title || "Variante", imageUrl: currentImage.url, imageAlt: currentImage.altText, unitPriceAmount: selectedVariant.priceAmount, unitPriceCurrency: selectedVariant.priceCurrency, availableForSale: selectedVariant.availableForSale, productUrl: product.productUrl });
      trackAddToCart({ currency: selectedVariant.priceCurrency, value: getPriceNumber(selectedVariant.priceAmount) * safeQty, items: [{ item_id: selectedVariant.id, item_name: product.title, item_variant: selectedVariant.title || undefined, currency: selectedVariant.priceCurrency, price: getPriceNumber(selectedVariant.priceAmount), quantity: safeQty }] });
      setCartMessage(safeQty > 1 ? `Se agregaron ${safeQty} unidades al carrito.` : "Producto agregado al carrito correctamente.");
    } catch { setCartMessage("No se pudo conectar con Shopify."); }
    finally { setAddingToCart(false); }
  }

  async function addRelatedToCart(related: RelatedCatalogProduct) {
    if (!related.availableForSale) { setCartMessage("Este producto esta agotado."); return; }
    if (!related.variantId) { setCartMessage("No se encontro variante valida."); return; }
    setAddingRelatedId(related.id); setCartMessage(null);
    try {
      const res = await fetch("/api/cart/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ merchandiseId: related.variantId, quantity: 1 }) });
      const payload = (await res.json()) as CartApiResponse;
      if (!res.ok || !payload.ok || !payload.cart?.id) { setCartMessage(payload.error || "No se pudo agregar al carrito."); return; }
      syncLocalCartLine({ lineId: related.variantId, merchandiseId: related.variantId, quantityToAdd: 1, title: related.title, variantTitle: "Variante seleccionada", imageUrl: related.imageUrl, imageAlt: related.imageAlt, unitPriceAmount: related.priceAmount, unitPriceCurrency: related.priceCurrency, availableForSale: related.availableForSale, productUrl: related.productUrl });
      trackAddToCart({ currency: related.priceCurrency, value: getPriceNumber(related.priceAmount), items: [{ item_id: related.variantId, item_name: related.title, item_variant: "Variante seleccionada", currency: related.priceCurrency, price: getPriceNumber(related.priceAmount), quantity: 1 }] });
      setCartMessage(`"${related.title}" fue agregado al carrito correctamente.`);
    } catch { setCartMessage("No se pudo conectar con Shopify."); }
    finally { setAddingRelatedId(null); }
  }

  const landing = useMemo(
    () => (product ? getProductLandingContent(product.handle, locale) : null),
    [product, locale]
  );
  const theme = useMemo(() => getProductTheme(handle), [handle]);
  const [buyingNow, setBuyingNow] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const touchStartX = useRef<number | null>(null);

  // Packs: si las variantes son "1 Bottle / 2 Bottles / 3 Bottles" se muestran
  // como tarjetas con precio por unidad y ahorro frente al precio unitario.
  const packs = useMemo(() => {
    if (!product?.variants?.length) return [];
    const base = product.variants.find((v) => parseUnits(v.title) === 1);
    const basePrice = base ? getPriceNumber(base.priceAmount) : 0;
    return product.variants.map((v, index) => {
      const units = parseUnits(v.title);
      const price = getPriceNumber(v.priceAmount);
      const reference = v.compareAtAmount
        ? getPriceNumber(v.compareAtAmount)
        : basePrice && units > 1
          ? basePrice * units
          : 0;
      const saving = reference > price ? reference - price : 0;
      const isLast = index === product.variants.length - 1;
      const badge =
        units > 1 && product.variants.length > 2
          ? isLast
            ? pt.bestValue
            : index === 1
              ? pt.mostPopular
              : null
          : null;
      const label = units > 0
        ? units === 1
          ? pt.oneUnit
          : pt.nUnits.replace("{n}", String(units))
        : v.title;
      return { variant: v, units, price, reference, saving, badge, label };
    });
  }, [product, pt]);

  const usesPacks = packs.length > 1 && packs.every((p) => p.units > 0);
  const selectedPack = packs.find((p) => p.variant.id === selectedVariant?.id) || null;
  const effectiveQty = usesPacks ? 1 : Math.max(1, Math.min(quantity, maxQuantity));

  useEffect(() => {
    if (usesPacks) setQuantity(1);
  }, [usesPacks]);

  function money(amount: number | string, currency?: string) {
    return formatMoney(
      String(amount),
      currency || selectedVariant?.priceCurrency || product?.priceCurrency || "USD",
      intlLocale
    );
  }

  async function buyNow() {
    if (!product || !selectedVariant?.id || !selectedVariant.availableForSale) return;
    trackBuyNowIntent();
    setBuyingNow(true);
    setCartMessage(null);
    try {
      const res = await fetch("/api/cart/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId: selectedVariant.id, quantity: effectiveQty }),
      });
      const payload = (await res.json()) as CartApiResponse;
      if (!res.ok || !payload.ok || !payload.cart?.checkoutUrl) {
        setCartMessage(payload.error || pt.addError);
        setBuyingNow(false);
        return;
      }
      window.location.href = payload.cart.checkoutUrl;
    } catch {
      setCartMessage(pt.addError);
      setBuyingNow(false);
    }
  }

  function goToImage(delta: number) {
    if (!product?.images?.length) return;
    const total = product.images.length;
    setActiveImage((c) => (c + delta + total) % total);
  }

  function scrollToPacks() {
    document.getElementById("elx-buy")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Imagen de "cómo se usa" de la galería (se detecta por su texto alternativo).
  const howToImage = product?.images.find((img) => /how to use|modo de|cómo se usa/i.test(img.altText)) ?? null;

  const priceNow = selectedPack ? selectedPack.price : getPriceNumber(selectedVariant?.priceAmount || product?.priceAmount || "0");
  const priceWas = selectedPack && selectedPack.saving > 0 ? selectedPack.reference : 0;

  return (
    <main
      className={`elora-shop elx relative min-h-[100svh]${theme ? " has-theme" : ""}`}
      style={theme ? ({ "--p-accent": theme.accent, "--p-accent-soft": theme.accentSoft, "--p-mist-1": theme.mist[0], "--p-mist-2": theme.mist[1] } as CSSProperties) : undefined}
    >
      <div className="elora-bg" aria-hidden="true">
        <span className="eg-ribbon r1" />
        <span className="eg-ribbon r2" />
        <BubbleBackground hues={theme?.hues} />
      </div>

      <header className="elx-top">
        <div className="elx-wrap elx-top-inner">
          <Link href={localizePath("/", locale)} className="elx-logo notranslate" translate="no" aria-label="Elora Skin">
            Elora <em>Skin</em>
          </Link>
          <div className="flex items-center gap-4">
            <LangSwitcher />
            <EloraCartLink label={pt.bag} />
          </div>
        </div>
      </header>

      <div className="elx-wrap pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4 sm:pt-8 lg:pb-24">
        {loading ? (
          <div className="elx-hero">
            <div className="elora-shop-skeleton aspect-square w-full rounded-3xl" />
            <div>
              <div className="elora-shop-skeleton h-8 w-3/4" />
              <div className="elora-shop-skeleton mt-4 h-5 w-1/2" />
              <div className="elora-shop-skeleton mt-8 h-40" />
            </div>
          </div>
        ) : null}

        {!loading && error ? (
          <div className="elora-shop-panel p-8 text-center">
            <p className="text-[#b3244f]">{error}</p>
            <Link href={localizePath("/", locale)} className="elora-pill elora-shop-cta-sm mt-4">
              <span className="elora-pill-label">{pt.back}</span>
            </Link>
          </div>
        ) : null}

        {!loading && !error && product ? (
          <>
            {/* ───────── HERO: galería + compra ───────── */}
            <section className="elx-hero">
              <div className="elx-gallery">
                <div
                  className="elx-main-media"
                  onTouchStart={(e) => { touchStartX.current = e.touches[0]?.clientX ?? null; }}
                  onTouchEnd={(e) => {
                    const start = touchStartX.current;
                    const end = e.changedTouches[0]?.clientX ?? null;
                    touchStartX.current = null;
                    if (start === null || end === null || Math.abs(end - start) < 40) return;
                    goToImage(end < start ? 1 : -1);
                  }}
                >
                  <Image src={currentImage.url} alt={currentImage.altText} width={1200} height={1200} priority sizes="(min-width: 1024px) 50vw, 100vw" className="elx-main-img" />
                  {product.images.length > 1 ? (
                    <>
                      <button type="button" className="elx-arrow is-prev" onClick={() => goToImage(-1)} aria-label="Previous image">‹</button>
                      <button type="button" className="elx-arrow is-next" onClick={() => goToImage(1)} aria-label="Next image">›</button>
                      <div className="elx-dots" aria-hidden="true">
                        {product.images.map((img, i) => <span key={`${img.url}-dot`} className={i === activeImage ? "is-on" : ""} />)}
                      </div>
                    </>
                  ) : null}
                </div>
                {product.images.length > 1 ? (
                  <div className="elx-thumbs">
                    {product.images.map((image, index) => (
                      <button key={`${image.url}-${index}`} type="button" onClick={() => setActiveImage(index)} className={index === activeImage ? "elx-thumb is-active" : "elx-thumb"} aria-label={image.altText}>
                        <Image src={image.url} alt="" width={200} height={200} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="elx-info" id="elx-buy">
                <p className="elx-eyebrow notranslate" translate="no">{product.vendor || "Elora Skin"}</p>
                <h1 className="elx-title">{product.title}</h1>
                {landing?.tagline ? <p className="elx-tagline">{landing.tagline}</p> : null}

                <div className="elx-price-row">
                  <span className="elx-price">{money(priceNow)}</span>
                  {priceWas ? <span className="elx-was">{money(priceWas)}</span> : null}
                  {selectedPack && selectedPack.saving > 0 ? <span className="elx-save">{pt.save.replace("{amount}", money(selectedPack.saving))}</span> : null}
                </div>

                {landing?.highlights?.length ? (
                  <ul className="elx-highlights">
                    {landing.highlights.map((h) => (
                      <li key={h}><CheckGlyph />{h}</li>
                    ))}
                  </ul>
                ) : null}

                {usesPacks ? (
                  <fieldset className="elx-packs">
                    <legend className="elx-label">{pt.packTitle}</legend>
                    {packs.map((p) => {
                      const active = p.variant.id === selectedVariant?.id;
                      return (
                        <label key={p.variant.id} className={`elx-pack${active ? " is-active" : ""}${p.badge ? " has-badge" : ""}`}>
                          <input type="radio" name="pack" value={p.variant.id} checked={active} onChange={() => setSelectedVariantId(p.variant.id)} disabled={!p.variant.availableForSale} />
                          <span className="elx-radio" aria-hidden="true" />
                          <span className="elx-pack-main">
                            <span className="elx-pack-name">{p.label}</span>
                            {p.units > 1 ? <span className="elx-pack-sub">{pt.perUnit.replace("{price}", money(p.price / p.units))}</span> : null}
                          </span>
                          <span className="elx-pack-price">
                            <strong>
                              {p.saving > 0 ? <s className="elx-pack-was">{money(p.reference)}</s> : null}
                              {money(p.price)}
                            </strong>
                            {p.saving > 0 ? <span className="elx-pack-save">{pt.save.replace("{amount}", money(p.saving))}</span> : null}
                          </span>
                          {p.badge ? <span className="elx-pack-badge">{p.badge}</span> : null}
                        </label>
                      );
                    })}
                  </fieldset>
                ) : (
                  <>
                    {product.variants.length > 1 ? (
                      <div className="mt-5">
                        <label className="elx-label">{pt.eyebrow}</label>
                        <select value={selectedVariant?.id || ""} onChange={(e) => setSelectedVariantId(e.target.value)} className="elora-shop-select mt-2">
                          {product.variants.map((v) => <option key={v.id} value={v.id}>{v.title} - {money(v.priceAmount, v.priceCurrency)}</option>)}
                        </select>
                      </div>
                    ) : null}
                    <div className="mt-5">
                      <p className="elx-label">{pt.quantity}</p>
                      <div className="elora-shop-qty mt-2">
                        <button type="button" onClick={() => setQuantity((c) => Math.max(1, c - 1))} className="elora-shop-qty-btn" aria-label="-">-</button>
                        <span className="elora-shop-qty-value">{quantity}</span>
                        <button type="button" onClick={() => setQuantity((c) => Math.min(maxQuantity, c + 1))} className="elora-shop-qty-btn" aria-label="+">+</button>
                      </div>
                    </div>
                  </>
                )}

                {cartMessage ? <div className="elora-shop-msg mt-4" role="status">{cartMessage}</div> : null}

                <div className="elx-ctas">
                  <PillButton onClick={() => void buyNow()} disabled={buyingNow || !selectedVariant?.availableForSale} className="elora-shop-cta elx-cta-main">
                    {!selectedVariant?.availableForSale ? pt.soldOut : buyingNow ? pt.redirecting : `${pt.buyNow} · ${money(priceNow * effectiveQty)}`}
                  </PillButton>
                  <PillButton onClick={() => void addToCart()} disabled={addingToCart || !selectedVariant?.availableForSale} variant="outline" className="elora-shop-cta">
                    {addingToCart ? pt.adding : pt.addToBag}
                  </PillButton>
                </div>

                <p className="elx-delivery">
                  <TrustSignalIcon icon="truck" className="h-5 w-5" />
                  <span>{pt.deliveryLine}</span>
                </p>

                <ul className="elx-assure">
                  <li><TrustSignalIcon icon="truck" className="h-4 w-4" />{pt.shippingLine}</li>
                  <li><TrustSignalIcon icon="lock" className="h-4 w-4" />{pt.secureLine}</li>
                </ul>

                {landing ? (
                  <details className="elx-details">
                    <summary>{pt.details}</summary>
                    <div className="product-description-rich mt-3 text-sm" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                  </details>
                ) : (
                  <div className="product-description-rich mt-6 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                )}
              </div>
            </section>

            {/* ───────── Trust strip ───────── */}
            <section className="elx-trust">
              {pt.trustSignals.slice(0, 4).map((title, index) => (
                <div key={title} className="elx-trust-item">
                  <span className="elx-trust-ico"><TrustSignalIcon icon={TRUST_SIGNAL_ICONS[index] ?? "shield"} className="h-5 w-5" /></span>
                  <span>{title}</span>
                </div>
              ))}
            </section>

            {landing ? (
              <>
                {/* ───────── Beneficios ───────── */}
                <RevealOnScroll as="section" className="elx-section">
                  <div className="elx-head">
                    <p className="elx-eyebrow">{pt.knowEyebrow}</p>
                    <h2 className="elx-h2">{landing.benefitsTitle}</h2>
                  </div>
                  <div className="elx-benefits">
                    {landing.benefits.map((b) => (
                      <article key={b.title} className="elx-benefit">
                        <span className="elx-benefit-ico"><BenefitGlyph icon={b.icon} /></span>
                        <h3>{b.title}</h3>
                        <p>{b.text}</p>
                      </article>
                    ))}
                  </div>
                </RevealOnScroll>

                {/* ───────── Qué esperar ───────── */}
                <RevealOnScroll as="section" className="elx-section">
                  <div className="elx-head">
                    <p className="elx-eyebrow">{pt.expectEyebrow}</p>
                    <h2 className="elx-h2">{landing.expectTitle}</h2>
                  </div>
                  <ol className="elx-timeline">
                    {landing.expect.map((e) => (
                      <li key={e.when} className="elx-tl-item">
                        <span className="elx-tl-dot" aria-hidden="true" />
                        <span className="elx-tl-when">{e.when}</span>
                        <p>{e.text}</p>
                      </li>
                    ))}
                  </ol>
                </RevealOnScroll>

                {/* ───────── Ingredientes ───────── */}
                <RevealOnScroll as="section" className="elx-section elx-split">
                  {product.images[2] || product.images[0] ? (
                    <div className="elx-split-media">
                      <Image src={(product.images[2] || product.images[0]).url} alt={(product.images[2] || product.images[0]).altText} width={900} height={900} className="h-full w-full object-cover" />
                    </div>
                  ) : null}
                  <div>
                    <p className="elx-eyebrow">{pt.ingredientsEyebrow}</p>
                    <h2 className="elx-h2 text-left">{landing.ingredientsTitle}</h2>
                    <div className="elx-ingredients">
                      {landing.ingredients.map((ing) => (
                        <article key={ing.name} className="elx-ingredient">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <h3>{ing.name}</h3>
                            <span className="elx-tag">{ing.tag}</span>
                          </div>
                          <p>{ing.text}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </RevealOnScroll>

                {/* ───────── Comparativa ───────── */}
                <RevealOnScroll as="section" className="elx-section">
                  <div className="elx-head">
                    <h2 className="elx-h2">{landing.compareTitle}</h2>
                  </div>
                  <div className="elx-compare" role="table" aria-label={landing.compareTitle}>
                    <div className="elx-cmp-row is-head" role="row">
                      <span role="columnheader" />
                      <span role="columnheader" className="is-us">{landing.compareUs}</span>
                      <span role="columnheader">{landing.compareThem}</span>
                    </div>
                    {landing.compareRows.map((row) => (
                      <div key={row.label} className="elx-cmp-row" role="row">
                        <span role="rowheader">{row.label}</span>
                        <span role="cell" className={`is-us ${row.us ? "yes" : "no"}`} aria-label={row.us ? pt.compareYes : pt.compareNo}>{row.us ? "✓" : "—"}</span>
                        <span role="cell" className={row.them ? "yes" : "no"} aria-label={row.them ? pt.compareYes : pt.compareNo}>{row.them ? "✓" : "—"}</span>
                      </div>
                    ))}
                  </div>
                </RevealOnScroll>

                {/* ───────── Cómo se usa ───────── */}
                <RevealOnScroll as="section" className="elx-section">
                  <div className="elx-head">
                    <p className="elx-eyebrow">{pt.howToEyebrow}</p>
                    <h2 className="elx-h2">{landing.howToTitle}</h2>
                  </div>
                  {howToImage ? (
                    <div className="elx-howto-img">
                      <Image src={howToImage.url} alt={howToImage.altText} width={1200} height={1200} sizes="(min-width: 900px) 760px, 100vw" className="h-auto w-full" />
                    </div>
                  ) : null}
                  <ol className="elx-steps">
                    {landing.howTo.map((step, i) => (
                      <li key={step.title} className="elx-step">
                        <span className="elx-step-n">{i + 1}</span>
                        <h3>{step.title}</h3>
                        <p>{step.text}</p>
                      </li>
                    ))}
                  </ol>
                  <p className="elx-tip">{landing.howToTip}</p>
                </RevealOnScroll>

                {/* ───────── FAQ ───────── */}
                <RevealOnScroll as="section" className="elx-section elx-faq-wrap">
                  <div className="elx-head">
                    <p className="elx-eyebrow">{pt.faqEyebrow}</p>
                    <h2 className="elx-h2">{pt.faqTitle}</h2>
                  </div>
                  <div className="elx-faq">
                    {landing.faq.map((item, i) => {
                      const open = openFaq === i;
                      return (
                        <div key={item.q} className={`elx-faq-item${open ? " is-open" : ""}`}>
                          <button type="button" onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open}>
                            <span>{item.q}</span>
                            <span className="elx-faq-sign" aria-hidden="true">{open ? "−" : "+"}</span>
                          </button>
                          {open ? <p>{item.a}</p> : null}
                        </div>
                      );
                    })}
                  </div>
                </RevealOnScroll>

                {/* ───────── CTA final ───────── */}
                <RevealOnScroll as="section" className="elx-final">
                  <h2 className="elx-h2">{landing.finalTitle}</h2>
                  <p>{landing.finalText}</p>
                  <PillButton onClick={scrollToPacks} className="elx-final-btn">{pt.chooseMyPack}</PillButton>
                </RevealOnScroll>
              </>
            ) : null}

            {/* ───────── Relacionados (solo si hay) ───────── */}
            {!loadingRelated && relatedProducts.length > 0 ? (
              <RevealOnScroll as="section" className="elx-section">
                <div className="elx-head">
                  <p className="elx-eyebrow">{pt.recommendedEyebrow}</p>
                  <h2 className="elx-h2">{pt.recommendedTitle}</h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {relatedProducts.map((related) => (
                    <article key={related.id} className="elora-shop-card flex flex-col p-4">
                      <Link href={localizePath(`/products/${related.handle}`, locale)} className="elora-shop-media block overflow-hidden">
                        <Image src={related.imageUrl} alt={related.imageAlt} width={700} height={700} className="aspect-square w-full object-cover" />
                      </Link>
                      <h3 className="elora-shop-card-title mt-4 line-clamp-2 text-base font-semibold">{related.title}</h3>
                      <p className="elora-shop-price mt-2 text-lg">{money(related.priceAmount, related.priceCurrency)}</p>
                      <div className="mt-4">
                        <PillButton onClick={() => void addRelatedToCart(related)} disabled={addingRelatedId === related.id || !related.availableForSale || !related.variantId} className="elora-shop-cta elora-shop-cta-sm">
                          {addingRelatedId === related.id ? pt.adding : pt.addToBag}
                        </PillButton>
                      </div>
                    </article>
                  ))}
                </div>
              </RevealOnScroll>
            ) : null}
            {relatedError ? null : null}
          </>
        ) : null}
      </div>

      {!loading && !error && product ? (
        <div className={`elora-shop-stickybar elx-sticky fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 lg:hidden${cartDrawerOpen ? " is-hidden" : ""}`}>
          <div className="mx-auto flex w-full max-w-7xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="elora-shop-muted truncate text-xs font-medium">{selectedPack ? selectedPack.label : shortenTitle(product.title, 34)}</p>
              <p className="elora-shop-price text-base">{money(priceNow * effectiveQty)}</p>
            </div>
            <PillButton onClick={() => void buyNow()} disabled={buyingNow || !selectedVariant?.availableForSale} className="elora-shop-cta-sm shrink-0">
              {buyingNow ? "..." : pt.buyNow}
            </PillButton>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function parseUnits(title: string | undefined) {
  const match = (title || "").match(/^\s*(\d+)\s/);
  return match ? Number(match[1]) : 0;
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="elx-check">
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.14" />
      <path d="m6.2 10.2 2.5 2.4 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BenefitGlyph({ icon }: { icon: BenefitIcon }) {
  const common = { stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (icon === "pores") {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M4 12h6m0 0-2.5-2.5M10 12l-2.5 2.5M28 12h-6m0 0 2.5-2.5M22 12l2.5 2.5" {...common} />
        <path d="M12 18c0 3 1.8 6 4 6s4-3 4-6" {...common} />
        <path d="M6 18h20" {...common} />
      </svg>
    );
  }
  if (icon === "blackheads") {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="12" cy="7" r="1.2" fill="currentColor" />
        <circle cx="16" cy="5" r="1.2" fill="currentColor" />
        <circle cx="20" cy="7" r="1.2" fill="currentColor" />
        <path d="M5 14h22" {...common} />
        <path d="M13 14c0 4 1.3 9 3 9s3-5 3-9" {...common} />
      </svg>
    );
  }
  if (icon === "oil") {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 4c3 4.2 5 7.2 5 9.7a5 5 0 0 1-10 0C11 11.2 13 8.2 16 4Z" {...common} />
        <path d="M5 22c3.6-2.4 7.3-2.4 11 0s7.4 2.4 11 0" {...common} />
        <path d="M8 27h.01M13 27h.01M18 27h.01M23 27h.01" {...common} strokeWidth={2.4} />
      </svg>
    );
  }
  if (icon === "gentle") {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M7 25C7 14 14 7 26 6c-1 12-8 19-19 19Z" {...common} />
        <path d="M7 25 18 14" {...common} />
      </svg>
    );
  }
  if (icon === "hydrate") {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 4c4 5.5 7 9.4 7 13a7 7 0 0 1-14 0c0-3.6 3-7.5 7-13Z" {...common} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 5 18.6 13.4 27 16l-8.4 2.6L16 27l-2.6-8.4L5 16l8.4-2.6L16 5Z" {...common} />
    </svg>
  );
}
