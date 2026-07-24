// Catálogo local de desarrollo: productos ficticios de Elora Skin en USD,
// con contenido editorial en inglés y español. Se usa SOLO cuando no hay
// credenciales de Shopify configuradas (.env.local). Con credenciales reales
// esta capa se apaga sola — la interfaz pública es la misma que la real.

import type { CatalogProduct, CatalogSnapshot } from "./shopifyCatalog";
import type { Locale } from "./i18n";

type LocalizedText = {
  title: string;
  descriptionShort: string;
  descriptionLong: string;
  imageAlt: string;
  galleryAlts: string[];
  benefits: string[];
  ingredients: string[];
  usage: string[];
};

export type MockProductBase = {
  id: string;
  handle: string;
  priceAmount: string;
  compareAtAmount: string | null;
  priceCurrency: string;
  availableForSale: boolean;
  imageUrl: string;
  gallery: string[];
  text: Record<Locale, LocalizedText>;
};

export type MockProduct = Omit<MockProductBase, "text" | "gallery"> & {
  gallery: { url: string; altText: string }[];
} & LocalizedText;

const CURRENCY = "USD";

const PRODUCTS: MockProductBase[] = [
  {
    id: "mock/serum-glow-ritual",
    handle: "serum-glow-ritual",
    priceAmount: "39.90",
    compareAtAmount: "49.90",
    priceCurrency: CURRENCY,
    availableForSale: true,
    imageUrl: "/mock/serum-1.svg",
    gallery: ["/mock/serum-1.svg", "/mock/serum-2.svg", "/mock/serum-3.svg"],
    text: {
      en: {
        title: "Glow Ritual Serum",
        descriptionShort:
          "Lightweight serum with niacinamide and hyaluronic acid that brightens and evens your tone from week one.",
        descriptionLong:
          "The heart of the Elora ritual. A watery texture that absorbs in seconds and works on three fronts: deep hydration, instant luminosity, and a more even tone with consistent use. Made for warm climates: zero sticky feel, gentle on sensitive skin, and makeup-friendly.",
        imageAlt: "Elora Skin Glow Ritual Serum",
        galleryAlts: ["Serum bottle", "Serum texture", "Applying the serum"],
        benefits: [
          "Brightens and evens tone within 2-4 weeks of consistent use",
          "Deep hydration without a greasy feel",
          "Minimizes the look of pores",
          "Gentle on sensitive skin — fragrance free",
        ],
        ingredients: [
          "Niacinamide 10% — evens tone and balances oil",
          "Triple-weight hyaluronic acid — layered hydration",
          "Zinc PCA — calms and rebalances",
        ],
        usage: [
          "Apply 3-4 drops to clean skin, morning and night",
          "Pat gently until absorbed — don't rub",
          "Seal with your moisturizer; in the morning, finish with sunscreen",
        ],
      },
      es: {
        title: "Sérum Glow Ritual",
        descriptionShort:
          "Sérum ligero con niacinamida y ácido hialurónico que ilumina y empareja el tono desde la primera semana.",
        descriptionLong:
          "El corazón del ritual Elora. Una textura acuosa que se absorbe en segundos y trabaja en tres frentes: hidratación profunda, luminosidad inmediata y tono más parejo con el uso constante. Formulado para clima cálido: cero sensación pegajosa, apto para piel sensible y compatible con maquillaje.",
        imageAlt: "Sérum Glow Ritual de Elora Skin",
        galleryAlts: ["Frasco del sérum", "Textura del sérum", "Aplicación del sérum"],
        benefits: [
          "Ilumina y empareja el tono en 2-4 semanas de uso constante",
          "Hidratación profunda sin sensación grasa",
          "Minimiza la apariencia de poros",
          "Apto para piel sensible — sin fragancia añadida",
        ],
        ingredients: [
          "Niacinamida 10% — uniforma el tono y regula el sebo",
          "Ácido hialurónico de triple peso molecular — hidratación en capas",
          "Zinc PCA — calma y equilibra",
        ],
        usage: [
          "Aplica 3-4 gotas sobre el rostro limpio, mañana y noche",
          "Da golpecitos suaves hasta absorber — no frotes",
          "Sella con tu crema hidratante; de día, termina con protector solar",
        ],
      },
    },
  },
  {
    id: "mock/limpiador-nube-rosa",
    handle: "limpiador-nube-rosa",
    priceAmount: "24.90",
    compareAtAmount: null,
    priceCurrency: CURRENCY,
    availableForSale: true,
    imageUrl: "/mock/limpiador-1.svg",
    gallery: ["/mock/limpiador-1.svg", "/mock/limpiador-2.svg"],
    text: {
      en: {
        title: "Pink Cloud Cleanser",
        descriptionShort:
          "Gentle gel-foam that lifts away impurities and makeup without drying or tightening your skin.",
        descriptionLong:
          "Step one of the ritual. Its cloud-like foam cleanses deeply while respecting your skin barrier: it removes dust, oil, and light makeup, leaving skin soft — never squeaky. With balanced pH and soothing oat extract.",
        imageAlt: "Elora Skin Pink Cloud Cleanser",
        galleryAlts: ["Cleanser bottle", "Cleanser foam"],
        benefits: [
          "Cleanses deeply without drying",
          "Respects your skin's natural barrier (balanced pH)",
          "Removes light makeup in one step",
          "Soft-skin feel, never tight",
        ],
        ingredients: [
          "Gentle coconut-derived surfactants",
          "Colloidal oat extract — soothes skin",
          "Vegetable glycerin — locks in moisture",
        ],
        usage: [
          "Dampen your face with warm water",
          "Massage a small amount in circles for 30-60 seconds",
          "Rinse and follow with your serum",
        ],
      },
      es: {
        title: "Limpiador Nube Rosa",
        descriptionShort:
          "Gel-espuma suave que retira impurezas y maquillaje sin resecar ni tensar la piel.",
        descriptionLong:
          "El primer paso del ritual. Su espuma tipo nube limpia a fondo respetando la barrera de la piel: retira polvo, grasa y maquillaje ligero, y deja la piel suave — nunca 'rechinando'. Con pH balanceado y extracto de avena calmante.",
        imageAlt: "Limpiador Nube Rosa de Elora Skin",
        galleryAlts: ["Envase del limpiador", "Espuma del limpiador"],
        benefits: [
          "Limpia a fondo sin resecar",
          "Respeta la barrera natural de la piel (pH balanceado)",
          "Retira maquillaje ligero en un solo paso",
          "Sensación de piel suave, nunca tirante",
        ],
        ingredients: [
          "Surfactantes suaves derivados de coco",
          "Extracto de avena coloidal — calma la piel",
          "Glicerina vegetal — retiene la humedad",
        ],
        usage: [
          "Humedece el rostro con agua tibia",
          "Masajea una pequeña cantidad en círculos por 30-60 segundos",
          "Enjuaga y continúa con tu sérum",
        ],
      },
    },
  },
  {
    id: "mock/crema-velo-de-seda",
    handle: "crema-velo-de-seda",
    priceAmount: "32.90",
    compareAtAmount: "38.90",
    priceCurrency: CURRENCY,
    availableForSale: true,
    imageUrl: "/mock/crema-1.svg",
    gallery: ["/mock/crema-1.svg", "/mock/crema-2.svg"],
    text: {
      en: {
        title: "Silk Veil Cream",
        descriptionShort:
          "Light moisturizer that seals your ritual with a silky finish — perfect under makeup.",
        descriptionLong:
          "The final layer that locks it all in. A gel-cream texture that hydrates for 24 hours with a veil-like finish: no shine, no heaviness, perfect as a makeup base. With barrier-restoring ceramides and plant-based squalane.",
        imageAlt: "Elora Skin Silk Veil Cream",
        galleryAlts: ["Cream jar", "Cream texture"],
        benefits: [
          "Long-lasting hydration with a silky finish",
          "Strengthens your skin barrier (ceramides)",
          "Works beautifully as a makeup base",
          "Non-comedogenic",
        ],
        ingredients: [
          "Ceramides NP + AP — repair the barrier",
          "Plant-based squalane — lightweight emollient",
          "Panthenol (pro-vitamin B5) — calms and softens",
        ],
        usage: [
          "Apply a thin layer as the last step of your ritual, morning and night",
          "In the morning, wait 1 minute before sunscreen or makeup",
        ],
      },
      es: {
        title: "Crema Velo de Seda",
        descriptionShort:
          "Hidratante ligera que sella el ritual con acabado sedoso, ideal bajo maquillaje.",
        descriptionLong:
          "La capa final que lo asegura todo. Textura gel-crema que hidrata por 24 horas con acabado velo: ni brillo ni pesadez, perfecta como base de maquillaje. Con ceramidas que refuerzan la barrera y escualano vegetal.",
        imageAlt: "Crema Velo de Seda de Elora Skin",
        galleryAlts: ["Tarro de la crema", "Textura de la crema"],
        benefits: [
          "Hidratación de larga duración con acabado sedoso",
          "Refuerza la barrera de la piel (ceramidas)",
          "Funciona como base de maquillaje",
          "No comedogénica",
        ],
        ingredients: [
          "Ceramidas NP + AP — reparan la barrera",
          "Escualano vegetal — emoliente ligero",
          "Pantenol (pro-vitamina B5) — calma y suaviza",
        ],
        usage: [
          "Aplica una capa fina como último paso del ritual, mañana y noche",
          "De día, espera 1 minuto antes del protector solar o maquillaje",
        ],
      },
    },
  },
  {
    id: "mock/bruma-petalos-frescos",
    handle: "bruma-petalos-frescos",
    priceAmount: "19.90",
    compareAtAmount: null,
    priceCurrency: CURRENCY,
    availableForSale: false,
    imageUrl: "/mock/bruma-1.svg",
    gallery: ["/mock/bruma-1.svg"],
    text: {
      en: {
        title: "Fresh Petals Mist",
        descriptionShort:
          "Refreshing face mist that sets your glow and re-activates hydration throughout the day.",
        descriptionLong:
          "The finishing touch (and the midday pick-me-up). An ultra-fine mist with rose water and glycerin that refreshes, sets makeup, and brings back the glow in seconds. Fits in any bag.",
        imageAlt: "Elora Skin Fresh Petals Mist",
        galleryAlts: ["Mist spray bottle"],
        benefits: [
          "Refreshes and revives your glow in seconds",
          "Sets makeup without caking",
          "Bag-sized for touch-ups anywhere",
        ],
        ingredients: [
          "Rose water — tones and refreshes",
          "Vegetable glycerin — express hydration",
        ],
        usage: [
          "Shake and mist from 20 cm away, eyes closed",
          "Use over makeup or any time of day",
        ],
      },
      es: {
        title: "Bruma Pétalos Frescos",
        descriptionShort:
          "Bruma facial refrescante para fijar el glow y reactivar la hidratación durante el día.",
        descriptionLong:
          "El toque final (y el retoque de medio día). Una bruma finísima con agua de rosas y glicerina que refresca, fija el maquillaje y devuelve el glow en segundos. Cabe en cualquier bolso.",
        imageAlt: "Bruma Pétalos Frescos de Elora Skin",
        galleryAlts: ["Spray de la bruma"],
        benefits: [
          "Refresca y reactiva el glow en segundos",
          "Fija el maquillaje sin cuartearlo",
          "Formato de bolso para retoques",
        ],
        ingredients: [
          "Agua de rosas — tonifica y refresca",
          "Glicerina vegetal — hidratación express",
        ],
        usage: [
          "Agita y rocía a 20 cm del rostro, con ojos cerrados",
          "Úsala después del maquillaje o en cualquier momento del día",
        ],
      },
    },
  },
];

function resolveLocale(locale?: string): Locale {
  return locale === "es" ? "es" : "en";
}

export function isMockCatalogEnabled(): boolean {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token =
    process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ||
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    "";
  return !domain || !token || token.startsWith("atkn_");
}

export function getMockSnapshot(locale?: string): CatalogSnapshot {
  const loc = resolveLocale(locale);
  const prefix = loc === "es" ? "/es" : "";
  const products: CatalogProduct[] = PRODUCTS.map((p) => ({
    id: p.id,
    title: p.text[loc].title,
    handle: p.handle,
    variantId: null,
    descriptionShort: p.text[loc].descriptionShort,
    imageUrl: p.imageUrl,
    imageAlt: p.text[loc].imageAlt,
    priceAmount: p.priceAmount,
    priceCurrency: p.priceCurrency,
    availableForSale: p.availableForSale,
    productUrl: `${prefix}/products/${p.handle}`,
    buyNowUrl: `${prefix}/products/${p.handle}`,
  }));
  return { products, hasMore: false, nextCursor: null };
}

export function getMockProduct(handle: string, locale?: string): MockProduct | null {
  const base = PRODUCTS.find((p) => p.handle === handle);
  if (!base) return null;
  const loc = resolveLocale(locale);
  const { text, gallery, ...rest } = base;
  return {
    ...rest,
    ...text[loc],
    gallery: gallery.map((url, i) => ({
      url,
      altText: text[loc].galleryAlts[i] ?? text[loc].title,
    })),
  };
}
