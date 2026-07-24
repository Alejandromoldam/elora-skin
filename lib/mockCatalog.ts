// Catálogo local de desarrollo: productos ficticios de Elora Skin.
// Se usa SOLO cuando no hay credenciales de Shopify configuradas (.env.local).
// Cuando el dueño suba los productos reales a Shopify, esta capa deja de
// activarse sola — la interfaz pública es la misma que la de shopifyCatalog.

import type { CatalogProduct, CatalogSnapshot } from "./shopifyCatalog";

export type MockProduct = {
  id: string;
  title: string;
  handle: string;
  descriptionShort: string;
  descriptionLong: string;
  priceAmount: string;
  compareAtAmount: string | null;
  priceCurrency: string;
  availableForSale: boolean;
  imageUrl: string;
  imageAlt: string;
  gallery: { url: string; altText: string }[];
  benefits: string[];
  ingredients: string[];
  usage: string[];
};

const CURRENCY = "COP";

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "mock/serum-glow-ritual",
    title: "Sérum Glow Ritual",
    handle: "serum-glow-ritual",
    descriptionShort:
      "Sérum ligero con niacinamida y ácido hialurónico que ilumina y empareja el tono desde la primera semana.",
    descriptionLong:
      "El corazón del ritual Elora. Una textura acuosa que se absorbe en segundos y trabaja en tres frentes: hidratación profunda, luminosidad inmediata y tono más parejo con el uso constante. Formulado para clima tropical: cero sensación pegajosa, apto para piel sensible y compatible con maquillaje.",
    priceAmount: "95000",
    compareAtAmount: "119000",
    priceCurrency: CURRENCY,
    availableForSale: true,
    imageUrl: "/mock/serum-1.svg",
    imageAlt: "Sérum Glow Ritual de Elora Skin",
    gallery: [
      { url: "/mock/serum-1.svg", altText: "Frasco del sérum" },
      { url: "/mock/serum-2.svg", altText: "Textura del sérum" },
      { url: "/mock/serum-3.svg", altText: "Aplicación del sérum" },
    ],
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
  {
    id: "mock/limpiador-nube-rosa",
    title: "Limpiador Nube Rosa",
    handle: "limpiador-nube-rosa",
    descriptionShort:
      "Gel-espuma suave que retira impurezas y maquillaje sin resecar ni tensar la piel.",
    descriptionLong:
      "El primer paso del ritual. Su espuma tipo nube limpia a fondo respetando la barrera de la piel: retira polvo, grasa y maquillaje ligero, y deja la piel suave — nunca 'rechinando'. Con pH balanceado y extracto de avena calmante.",
    priceAmount: "62000",
    compareAtAmount: null,
    priceCurrency: CURRENCY,
    availableForSale: true,
    imageUrl: "/mock/limpiador-1.svg",
    imageAlt: "Limpiador Nube Rosa de Elora Skin",
    gallery: [
      { url: "/mock/limpiador-1.svg", altText: "Envase del limpiador" },
      { url: "/mock/limpiador-2.svg", altText: "Espuma del limpiador" },
    ],
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
  {
    id: "mock/crema-velo-de-seda",
    title: "Crema Velo de Seda",
    handle: "crema-velo-de-seda",
    descriptionShort:
      "Hidratante ligera que sella el ritual con acabado sedoso, ideal bajo maquillaje.",
    descriptionLong:
      "La capa final que lo asegura todo. Textura gel-crema que hidrata por 24 horas con acabado velo: ni brillo ni pesadez, perfecta como base de maquillaje. Con ceramidas que refuerzan la barrera y escualano vegetal.",
    priceAmount: "78000",
    compareAtAmount: "89000",
    priceCurrency: CURRENCY,
    availableForSale: true,
    imageUrl: "/mock/crema-1.svg",
    imageAlt: "Crema Velo de Seda de Elora Skin",
    gallery: [
      { url: "/mock/crema-1.svg", altText: "Tarro de la crema" },
      { url: "/mock/crema-2.svg", altText: "Textura de la crema" },
    ],
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
  {
    id: "mock/bruma-petalos-frescos",
    title: "Bruma Pétalos Frescos",
    handle: "bruma-petalos-frescos",
    descriptionShort:
      "Bruma facial refrescante para fijar el glow y reactivar la hidratación durante el día.",
    descriptionLong:
      "El toque final (y el retoque de medio día). Una bruma finísima con agua de rosas y glicerina que refresca, fija el maquillaje y devuelve el glow en segundos. Cabe en cualquier bolso.",
    priceAmount: "48000",
    compareAtAmount: null,
    priceCurrency: CURRENCY,
    availableForSale: false,
    imageUrl: "/mock/bruma-1.svg",
    imageAlt: "Bruma Pétalos Frescos de Elora Skin",
    gallery: [
      { url: "/mock/bruma-1.svg", altText: "Spray de la bruma" },
    ],
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
];

export function isMockCatalogEnabled(): boolean {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token =
    process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ||
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    "";
  return !domain || !token || token.startsWith("atkn_");
}

export function getMockSnapshot(): CatalogSnapshot {
  const products: CatalogProduct[] = MOCK_PRODUCTS.map((p) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    variantId: null,
    descriptionShort: p.descriptionShort,
    imageUrl: p.imageUrl,
    imageAlt: p.imageAlt,
    priceAmount: p.priceAmount,
    priceCurrency: p.priceCurrency,
    availableForSale: p.availableForSale,
    productUrl: `/products/${p.handle}`,
    buyNowUrl: `/products/${p.handle}`,
  }));
  return { products, hasMore: false, nextCursor: null };
}

export function getMockProduct(handle: string): MockProduct | null {
  return MOCK_PRODUCTS.find((p) => p.handle === handle) ?? null;
}
