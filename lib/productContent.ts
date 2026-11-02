// Contenido editorial de la landing de cada producto (por handle de Shopify).
// Shopify aporta título, precios, variantes e imágenes; aquí vive el copy de
// venta que no cabe bien en la descripción: beneficios, ingredientes, pasos y FAQ.
// Para un producto nuevo basta con agregar su handle aquí; si no existe, la
// página muestra la descripción de Shopify sin secciones extra.

import type { Locale } from "@/lib/i18n";

export type BenefitIcon = "pores" | "blackheads" | "oil" | "gentle" | "glow" | "hydrate";

// Tema visual propio de cada producto: tiñe el fondo, las burbujas y los
// acentos secundarios con los tonos de su empaque. Los botones de compra
// mantienen el frambuesa de la marca para no romper la identidad.
export type ProductTheme = {
  /** Tonos de las burbujas (grados HSL). */
  hues: number[];
  /** Acento secundario: etiquetas, viñetas, miniaturas. */
  accent: string;
  /** Versión suave del acento para fondos de íconos y chips. */
  accentSoft: string;
  /** Dos neblinas de color para el fondo. */
  mist: [string, string];
};

export const PRODUCT_THEMES: Record<string, ProductTheme> = {
  // Sérum EELHOE: caja blanca con línea azul real -> rosa lechoso con
  // neblina azul lavanda y acentos azul pervinca.
  "pore-refining-serum": {
    hues: [338, 226, 250, 300, 205],
    accent: "#4f6fc4",
    accentSoft: "rgba(118, 146, 226, 0.16)",
    mist: ["rgba(186, 204, 255, 0.55)", "rgba(255, 214, 230, 0.6)"],
  },
};

export function getProductTheme(handle: string): ProductTheme | null {
  return PRODUCT_THEMES[handle] ?? null;
}

export type ProductLandingContent = {
  tagline: string;
  highlights: string[];
  benefitsTitle: string;
  benefits: Array<{ icon: BenefitIcon; title: string; text: string }>;
  ingredientsTitle: string;
  ingredients: Array<{ name: string; tag: string; text: string }>;
  howToTitle: string;
  howTo: Array<{ title: string; text: string }>;
  howToTip: string;
  faq: Array<{ q: string; a: string }>;
  finalTitle: string;
  finalText: string;
};

const CONTENT: Record<string, Record<Locale, ProductLandingContent>> = {
  "pore-refining-serum": {
    en: {
      tagline: "Smoother skin. Less visible pores.",
      highlights: [
        "Visibly refines the look of pores",
        "Lifts blackheads with gentle PHA exfoliation",
        "Helps balance oil and shine",
        "Gentle enough for sensitive skin",
      ],
      benefitsTitle: "Why you'll love it",
      benefits: [
        { icon: "pores", title: "Refines pores", text: "Clears the buildup that makes pores look bigger, for a smoother, more even surface." },
        { icon: "blackheads", title: "Clears blackheads", text: "Lactobionic acid gently loosens congestion without scrubbing or stinging." },
        { icon: "oil", title: "Balances oil", text: "Helps regulate the water-oil balance so skin looks less shiny through the day." },
        { icon: "gentle", title: "Gentle on skin", text: "A PHA formula designed to be kind to sensitive and reactive skin." },
      ],
      ingredientsTitle: "The hero ingredient",
      ingredients: [
        { name: "Lactobionic Acid", tag: "PHA exfoliant", text: "A gentle polyhydroxy acid that exfoliates the surface and loosens pore buildup, with less irritation than classic acids." },
      ],
      howToTitle: "Your 1-minute ritual",
      howTo: [
        { title: "Cleanse", text: "Start with clean, dry skin." },
        { title: "Apply 4–5 drops", text: "Smooth over face and neck, focusing on areas with visible pores." },
        { title: "Pat & glow", text: "Pat gently until absorbed, then follow with moisturizer." },
      ],
      howToTip: "Use morning and night. Always finish with SPF during the day.",
      faq: [
        { q: "Is it suitable for sensitive skin?", a: "Yes. Lactobionic acid is a PHA, one of the gentlest exfoliating acids. As with any new skincare, do a patch test before first use." },
        { q: "When will I see results?", a: "Skin can feel smoother after the first uses. For visibly refined pores, use it consistently, morning and night, for 4 weeks or more." },
        { q: "Can I use it with retinol or vitamin C?", a: "Yes. A simple routine is this serum in the morning and retinol at night. When combining actives, introduce them gradually." },
        { q: "How long does one bottle last?", a: "Each 30 ml bottle lasts about 4–6 weeks with twice-daily use. That's why most customers choose the 2- or 3-bottle pack." },
        { q: "How long does shipping take?", a: "Shipping is free and tracked. Orders ship within 1–3 business days and usually arrive in 2–3 weeks." },
        { q: "What if it's not right for me?", a: "Write to us and we'll help you. You can read the details in our Returns policy." },
      ],
      finalTitle: "Ready for smoother skin?",
      finalText: "Choose your pack and start your ritual today. Free tracked shipping on every order.",
    },
    es: {
      tagline: "Piel más lisa. Poros menos visibles.",
      highlights: [
        "Afina visiblemente la apariencia de los poros",
        "Ayuda con los puntos negros con exfoliación PHA suave",
        "Ayuda a equilibrar la grasa y los brillos",
        "Suave incluso para piel sensible",
      ],
      benefitsTitle: "Por qué te va a encantar",
      benefits: [
        { icon: "pores", title: "Afina los poros", text: "Limpia la acumulación que hace ver los poros más grandes, para una piel más lisa y uniforme." },
        { icon: "blackheads", title: "Menos puntos negros", text: "El ácido lactobiónico afloja la congestión sin frotar ni arder." },
        { icon: "oil", title: "Equilibra la grasa", text: "Ayuda a regular el balance agua-grasa para que la piel brille menos durante el día." },
        { icon: "gentle", title: "Suave con tu piel", text: "Una fórmula PHA pensada para pieles sensibles y reactivas." },
      ],
      ingredientsTitle: "El ingrediente estrella",
      ingredients: [
        { name: "Ácido lactobiónico", tag: "Exfoliante PHA", text: "Un polihidroxiácido suave que exfolia la superficie y afloja la acumulación en los poros, con menos irritación que los ácidos clásicos." },
      ],
      howToTitle: "Tu ritual de 1 minuto",
      howTo: [
        { title: "Limpia", text: "Empieza con la piel limpia y seca." },
        { title: "Aplica 4–5 gotas", text: "Distribuye en rostro y cuello, sobre todo donde ves los poros." },
        { title: "Toques suaves", text: "Da toquecitos hasta que se absorba y luego aplica tu hidratante." },
      ],
      howToTip: "Úsalo mañana y noche. De día, termina siempre con protector solar.",
      faq: [
        { q: "¿Sirve para piel sensible?", a: "Sí. El ácido lactobiónico es un PHA, de los ácidos exfoliantes más suaves. Como con cualquier producto nuevo, haz una prueba en una zona pequeña antes del primer uso." },
        { q: "¿Cuándo veré resultados?", a: "La piel se puede sentir más lisa desde los primeros usos. Para ver los poros más afinados, úsalo de forma constante, mañana y noche, durante 4 semanas o más." },
        { q: "¿Lo puedo usar con retinol o vitamina C?", a: "Sí. Una rutina sencilla es este sérum en la mañana y el retinol en la noche. Al combinar activos, introdúcelos poco a poco." },
        { q: "¿Cuánto dura un frasco?", a: "Cada frasco de 30 ml dura unas 4–6 semanas usándolo dos veces al día. Por eso la mayoría elige el pack de 2 o 3 frascos." },
        { q: "¿Cuánto tarda el envío?", a: "El envío es gratis y con seguimiento. Los pedidos salen en 1–3 días hábiles y suelen llegar en 2–3 semanas." },
        { q: "¿Y si no es para mí?", a: "Escríbenos y te ayudamos. Puedes ver los detalles en nuestra política de devoluciones." },
      ],
      finalTitle: "¿Lista para una piel más lisa?",
      finalText: "Elige tu pack y empieza tu ritual hoy. Envío gratis con seguimiento en todos los pedidos.",
    },
  },
};

export function getProductLandingContent(
  handle: string,
  locale: Locale
): ProductLandingContent | null {
  return CONTENT[handle]?.[locale] ?? CONTENT[handle]?.en ?? null;
}
