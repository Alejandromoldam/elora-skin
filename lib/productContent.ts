// Contenido editorial de la landing de cada producto (por handle de Shopify).
// Shopify aporta título, precios, variantes e imágenes; aquí vive el copy de
// venta que no cabe bien en la descripción: beneficios, ingredientes, pasos y FAQ.
// Para un producto nuevo basta con agregar su handle aquí; si no existe, la
// página muestra la descripción de Shopify sin secciones extra.

import type { Locale } from "@/lib/i18n";

export type BenefitIcon = "pores" | "blackheads" | "oil" | "gentle" | "glow" | "hydrate" | "lashes" | "volume";

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
  // Sérum de pestañas: caja rosa y tubo oro rosa -> rosa empolvado con
  // neblina durazno-champán y acentos rosa antiguo.
  "eyelash-boost-serum": {
    hues: [345, 18, 332, 8, 300],
    accent: "#a5556b",
    accentSoft: "rgba(205, 128, 146, 0.17)",
    mist: ["rgba(255, 208, 188, 0.55)", "rgba(255, 196, 216, 0.6)"],
  },
};

export function getProductTheme(handle: string): ProductTheme | null {
  return PRODUCT_THEMES[handle] ?? null;
}

export type ProductLandingContent = {
  /** Diapositiva del carrusel de portada. */
  hero?: { eyebrow: string; titlePre: string; titleEm: string; lead: string };
  tagline: string;
  highlights: string[];
  benefitsTitle: string;
  benefits: Array<{ icon: BenefitIcon; title: string; text: string }>;
  /** Sustituye la etiqueta "Ingredients" cuando la sección habla de la fórmula. */
  ingredientsEyebrow?: string;
  ingredientsTitle: string;
  ingredients: Array<{ name: string; tag: string; text: string }>;
  howToTitle: string;
  howTo: Array<{ title: string; text: string }>;
  howToTip: string;
  faq: Array<{ q: string; a: string }>;
  expectTitle: string;
  expect: Array<{ when: string; text: string }>;
  compareTitle: string;
  compareUs: string;
  compareThem: string;
  compareRows: Array<{ label: string; us: boolean; them: boolean }>;
  finalTitle: string;
  finalText: string;
};

const CONTENT: Record<string, Record<Locale, ProductLandingContent>> = {
  "pore-refining-serum": {
    en: {
      hero: { eyebrow: "New · Pore Refining Serum", titlePre: "Smoother skin,", titleEm: "less visible pores.", lead: "A gentle lactobionic acid serum that clears pore buildup and smooths texture." },
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
        { q: "How long does one bottle last?", a: "Each 30 ml bottle lasts about 4–6 weeks with twice-daily use. That's why the 2- and 3-bottle packs are the best value." },
        { q: "How long does shipping take?", a: "Shipping is free and tracked. Orders ship within 1–3 business days and usually arrive in 2–3 weeks." },
        { q: "What if it's not right for me?", a: "Write to us and we'll help you. You can read the details in our Returns policy." },
      ],
      expectTitle: "What to expect",
      expect: [
        { when: "First use", text: "Skin feels softer and smoother to the touch." },
        { when: "2 weeks", text: "Texture looks more even and less congested." },
        { when: "4+ weeks", text: "Pores look visibly refined with daily use." },
      ],
      compareTitle: "Why a gentle PHA serum",
      compareUs: "Elora PHA serum",
      compareThem: "Harsh scrubs & strong acids",
      compareRows: [
        { label: "Suitable for sensitive skin", us: true, them: false },
        { label: "Daily use, morning and night", us: true, them: false },
        { label: "No stinging or redness", us: true, them: false },
        { label: "Works on pore buildup", us: true, them: true },
      ],
      finalTitle: "Ready for smoother skin?",
      finalText: "Choose your pack and start your ritual today. Free tracked shipping on every order.",
    },
    es: {
      hero: { eyebrow: "Nuevo · Sérum refinador de poros", titlePre: "Piel más lisa,", titleEm: "poros menos visibles.", lead: "Un sérum suave con ácido lactobiónico que limpia los poros y alisa la textura." },
      tagline: "Piel más lisa. Poros menos visibles.",
      highlights: [
        "Afina visiblemente la apariencia de los poros",
        "Ayuda a reducir los puntos negros con exfoliación PHA suave",
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
        { q: "¿Cuánto dura un frasco?", a: "Cada frasco de 30 ml dura unas 4–6 semanas usándolo dos veces al día. Por eso los packs de 2 y 3 frascos son los que más rinden." },
        { q: "¿Cuánto tarda el envío?", a: "El envío es gratis y con seguimiento. Los pedidos salen en 1–3 días hábiles y suelen llegar en 2–3 semanas." },
        { q: "¿Y si no es para mí?", a: "Escríbenos y te ayudamos. Puedes ver los detalles en nuestra política de devoluciones." },
      ],
      expectTitle: "Qué esperar",
      expect: [
        { when: "Primer uso", text: "La piel se siente más suave y lisa al tacto." },
        { when: "2 semanas", text: "La textura se ve más uniforme y menos congestionada." },
        { when: "4+ semanas", text: "Los poros se ven visiblemente más finos con el uso diario." },
      ],
      compareTitle: "Por qué un sérum PHA suave",
      compareUs: "Sérum PHA Elora",
      compareThem: "Exfoliantes fuertes",
      compareRows: [
        { label: "Apto para piel sensible", us: true, them: false },
        { label: "Uso diario, mañana y noche", us: true, them: false },
        { label: "Sin ardor ni enrojecimiento", us: true, them: false },
        { label: "Actúa sobre la acumulación en los poros", us: true, them: true },
      ],
      finalTitle: "¿Lista para una piel más lisa?",
      finalText: "Elige tu pack y empieza tu ritual hoy. Envío gratis con seguimiento en todos los pedidos.",
    },
  },
  "eyelash-boost-serum": {
    en: {
      hero: { eyebrow: "New · Eyelash Boost Serum", titlePre: "Longer-looking lashes,", titleEm: "one swipe a night.", lead: "A nourishing lash and brow serum for a fuller, more defined look, no extensions needed." },
      tagline: "Longer-looking, fuller-looking lashes.",
      highlights: [
        "Lashes look longer and fuller with nightly use",
        "Nourishes and conditions lashes and brows",
        "Precision brush, one swipe per eye",
        "Lightweight, no sticky feel",
      ],
      benefitsTitle: "Why you'll love it",
      benefits: [
        { icon: "lashes", title: "Longer-looking lashes", text: "Conditioned lashes look longer and more defined, even before mascara." },
        { icon: "volume", title: "Fuller-looking lashes", text: "Helps lashes look thicker and fuller from root to tip." },
        { icon: "hydrate", title: "Nourishes lashes & brows", text: "Keeps lashes and brows soft and conditioned, so they look healthier." },
        { icon: "gentle", title: "Gentle daily use", text: "A light formula made for a simple nightly ritual at the lash line." },
      ],
      ingredientsEyebrow: "The formula",
      ingredientsTitle: "Made for your nightly ritual",
      ingredients: [
        { name: "Precision brush", tag: "Applicator", text: "A fine brush draws a thin line right at the base of the lashes, like a liner. One swipe per eye is enough." },
        { name: "Lightweight texture", tag: "Comfort", text: "Absorbs quickly with no sticky or heavy feel, so you can apply it and go to sleep." },
        { name: "Lashes & brows", tag: "Two in one", text: "Use the same tube along sparse brows for a fuller, more groomed look." },
      ],
      howToTitle: "Your 10-second ritual",
      howTo: [
        { title: "Clean lashes", text: "Remove makeup and start with clean, dry lashes." },
        { title: "Apply at the lash line", text: "Draw one thin line along the upper lash line, like a liner." },
        { title: "Use nightly", text: "Repeat every night. Consistency is what makes the difference." },
      ],
      howToTip: "Apply only at the lash line, not inside the eye. Let it dry before going to bed.",
      faq: [
        { q: "When will I see results?", a: "Lashes feel softer from the first nights. For a longer, fuller look, use it every night for 4 to 8 weeks or more." },
        { q: "Can I use it with lash extensions or contact lenses?", a: "Remove contact lenses before applying and wait until it's dry to put them back in. With extensions, check with your lash artist first." },
        { q: "Can I use it on my brows?", a: "Yes. Apply a thin layer along the brows once a day for a fuller, more groomed look." },
        { q: "Is it suitable for sensitive eyes?", a: "Apply only at the lash line and avoid contact with the eye. As with any new product, do a patch test first and stop using it if you notice irritation." },
        { q: "How long does one tube last?", a: "Each 3 ml tube lasts about 6–8 weeks with nightly use. That's why the 2- and 3-tube packs are the best value." },
        { q: "How long does shipping take?", a: "Shipping is free and tracked. Orders ship within 1–3 business days and usually arrive in 2–3 weeks." },
        { q: "What if it's not right for me?", a: "Write to us and we'll help you. You can read the details in our Returns policy." },
      ],
      expectTitle: "What to expect",
      expect: [
        { when: "First nights", text: "Lashes feel softer and conditioned." },
        { when: "4 weeks", text: "Lashes look more defined and fuller." },
        { when: "8+ weeks", text: "A longer, fuller look with nightly use." },
      ],
      compareTitle: "Why a lash serum",
      compareUs: "Elora lash serum",
      compareThem: "Lash extensions",
      compareRows: [
        { label: "No salon visits", us: true, them: false },
        { label: "Your own natural lashes", us: true, them: false },
        { label: "No glue near your eyes", us: true, them: false },
        { label: "Fuller-looking lashes", us: true, them: true },
      ],
      finalTitle: "Ready for your longest-looking lashes?",
      finalText: "Choose your pack and start your nightly ritual today. Free tracked shipping on every order.",
    },
    es: {
      hero: { eyebrow: "Nuevo · Sérum para pestañas", titlePre: "Pestañas más largas,", titleEm: "un trazo cada noche.", lead: "Un sérum nutritivo para pestañas y cejas que las hace ver más llenas y definidas, sin extensiones." },
      tagline: "Pestañas que se ven más largas y llenas.",
      highlights: [
        "Pestañas que se ven más largas y llenas con el uso diario",
        "Nutre y acondiciona pestañas y cejas",
        "Pincel de precisión, un solo trazo por ojo",
        "Textura ligera que no se siente pegajosa",
      ],
      benefitsTitle: "Por qué te va a encantar",
      benefits: [
        { icon: "lashes", title: "Se ven más largas", text: "Las pestañas acondicionadas se ven más largas y definidas, incluso antes de la máscara." },
        { icon: "volume", title: "Se ven más llenas", text: "Ayuda a que las pestañas se vean más gruesas y con más volumen de raíz a punta." },
        { icon: "hydrate", title: "Nutre pestañas y cejas", text: "Las mantiene suaves y acondicionadas para que se vean más sanas." },
        { icon: "gentle", title: "Uso diario suave", text: "Una fórmula ligera para un ritual sencillo cada noche en la línea de las pestañas." },
      ],
      ingredientsEyebrow: "La fórmula",
      ingredientsTitle: "Pensado para tu ritual de noche",
      ingredients: [
        { name: "Pincel de precisión", tag: "Aplicador", text: "Un pincel fino traza una línea delgada justo en la base de las pestañas, como un delineador. Basta un trazo por ojo." },
        { name: "Textura ligera", tag: "Comodidad", text: "Se absorbe rápido y no se siente pesada ni pegajosa, así que lo aplicas y te vas a dormir." },
        { name: "Pestañas y cejas", tag: "Dos en uno", text: "Usa el mismo tubo en las cejas escasas para que se vean más llenas y definidas." },
      ],
      howToTitle: "Tu ritual de 10 segundos",
      howTo: [
        { title: "Limpia las pestañas", text: "Retira el maquillaje y empieza con las pestañas limpias y secas." },
        { title: "Aplica en la línea", text: "Traza una línea delgada sobre la línea de las pestañas superiores, como un delineador." },
        { title: "Úsalo cada noche", text: "Repite todas las noches. La constancia es lo que marca la diferencia." },
      ],
      howToTip: "Aplícalo solo en la línea de las pestañas, no dentro del ojo. Deja que se seque antes de dormir.",
      faq: [
        { q: "¿Cuándo veré resultados?", a: "Las pestañas se sienten más suaves desde las primeras noches. Para que se vean más largas y llenas, úsalo cada noche durante 4 a 8 semanas o más." },
        { q: "¿Lo puedo usar con extensiones o lentes de contacto?", a: "Retira los lentes antes de aplicarlo y espera a que se seque para volver a ponerlos. Si tienes extensiones, consulta primero con tu especialista." },
        { q: "¿Sirve para las cejas?", a: "Sí. Aplica una capa delgada sobre las cejas una vez al día para que se vean más llenas y definidas." },
        { q: "¿Sirve para ojos sensibles?", a: "Aplícalo solo en la línea de las pestañas y evita el contacto con el ojo. Como con cualquier producto nuevo, haz primero una prueba y suspende el uso si notas irritación." },
        { q: "¿Cuánto dura un tubo?", a: "Cada tubo de 3 ml dura unas 6–8 semanas usándolo cada noche. Por eso los packs de 2 y 3 tubos son los que más rinden." },
        { q: "¿Cuánto tarda el envío?", a: "El envío es gratis y con seguimiento. Los pedidos salen en 1–3 días hábiles y suelen llegar en 2–3 semanas." },
        { q: "¿Y si no es para mí?", a: "Escríbenos y te ayudamos. Puedes ver los detalles en nuestra política de devoluciones." },
      ],
      expectTitle: "Qué esperar",
      expect: [
        { when: "Primeras noches", text: "Las pestañas se sienten más suaves y acondicionadas." },
        { when: "4 semanas", text: "Las pestañas se ven más definidas y llenas." },
        { when: "8+ semanas", text: "Un look más largo y lleno con el uso diario." },
      ],
      compareTitle: "Por qué un sérum de pestañas",
      compareUs: "Sérum de pestañas Elora",
      compareThem: "Extensiones de pestañas",
      compareRows: [
        { label: "Sin citas en el salón", us: true, them: false },
        { label: "Tus propias pestañas naturales", us: true, them: false },
        { label: "Sin pegamento cerca de los ojos", us: true, them: false },
        { label: "Pestañas que se ven más llenas", us: true, them: true },
      ],
      finalTitle: "¿Lista para unas pestañas que se vean más largas?",
      finalText: "Elige tu pack y empieza tu ritual de noche hoy. Envío gratis con seguimiento en todos los pedidos.",
    },
  },
};

export function getProductLandingContent(
  handle: string,
  locale: Locale
): ProductLandingContent | null {
  return CONTENT[handle]?.[locale] ?? CONTENT[handle]?.en ?? null;
}
