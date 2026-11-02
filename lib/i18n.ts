// i18n mínima y explícita: dos locales, mensajes en JSON planos.
// Inglés vive en la raíz (/), español bajo /es. Agregar un idioma nuevo
// (ej. alemán) = crear messages/de.json + rutas app/de/* espejo.

import en from "@/messages/en.json";
import es from "@/messages/es.json";

export type Locale = "en" | "es";

export const LOCALES: Locale[] = ["en", "es"];
export const DEFAULT_LOCALE: Locale = "en";

export type Messages = typeof en;

const MESSAGES: Record<Locale, Messages> = { en, es };

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
}

/** Prefija una ruta interna con el locale cuando no es el default. */
export function localizePath(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

/** Locale de formateo de moneda por idioma de la página. */
export function currencyLocale(_locale: Locale): string {
  // Precios en USD: formato "$29.00" en ambos idiomas para que la cifra sea
  // idéntica a la del checkout y se lea igual en EE. UU. y Latinoamérica.
  return "en-US";
}
