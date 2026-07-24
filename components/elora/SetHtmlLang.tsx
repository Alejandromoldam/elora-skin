"use client";

import { useEffect } from "react";

// El layout raíz fija <html lang="en"> (default). El subárbol /es corrige el
// atributo en cliente — patrón pragmático que evita reestructurar todo el App
// Router bajo un segmento [locale]. hreflang/metadata por ruta hacen el SEO.
export default function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = prev;
    };
  }, [lang]);
  return null;
}
