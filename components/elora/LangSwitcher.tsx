"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Selector EN/ES discreto. Calcula la ruta equivalente en el otro idioma
// a partir del prefijo /es (inglés vive en la raíz).
export default function LangSwitcher({ className }: { className?: string }) {
  const pathname = usePathname() || "/";
  const isEs = pathname === "/es" || pathname.startsWith("/es/");
  const basePath = isEs ? pathname.replace(/^\/es/, "") || "/" : pathname;
  const enHref = basePath;
  const esHref = basePath === "/" ? "/es" : `/es${basePath}`;

  return (
    <div className={`elora-lang${className ? ` ${className}` : ""}`} aria-label="Language">
      <Link
        href={enHref}
        aria-current={!isEs ? "true" : undefined}
        style={{ fontWeight: !isEs ? 700 : 400, opacity: !isEs ? 1 : 0.6 }}
      >
        EN
      </Link>
      <span aria-hidden="true" style={{ opacity: 0.4 }}>
        /
      </span>
      <Link
        href={esHref}
        aria-current={isEs ? "true" : undefined}
        style={{ fontWeight: isEs ? 700 : 400, opacity: isEs ? 1 : 0.6 }}
      >
        ES
      </Link>
    </div>
  );
}
