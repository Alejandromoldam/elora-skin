import Image from "next/image";
import Link from "next/link";
import { fetchHomeCatalogSnapshot } from "@/lib/shopifyCatalog";
import { getMessages, localizePath, type Locale } from "@/lib/i18n";
import { getProductLandingContent } from "@/lib/productContent";
import EloraCartLink from "@/components/elora/EloraCartLink";
import MobileNav from "@/components/elora/MobileNav";
import LangSwitcher from "@/components/elora/LangSwitcher";
import HomePackPicker from "@/components/elora/HomePackPicker";
import BubbleBackground from "@/components/elora/BubbleBackground";

// Portada "Glow": fondo rosa iridiscente, tarjetas de vidrio y acentos
// frambuesa. Mobile-first: el hero mantiene texto + producto lado a lado.

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3.2v2.8h-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="6.5" cy="17.2" r="1.7" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.8" cy="17.2" r="1.7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 4.8 6.1V11c0 4.9 3 8.4 7.2 10 4.2-1.6 7.2-5.1 7.2-10V6.1L12 3Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="m8.7 12.1 2.1 2 4.5-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LeafLine() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19C5 10.5 10.5 5 20 4.5 19.5 14 14 19 5 19Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M5 19 14 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function BenefitIcon({ kind }: { kind: string }) {
  const s = { stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "pores")
    return (<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M9 6v4M7 8h4M23 6v4M21 8h4" {...s} /><path d="M4 15h24" {...s} /><path d="M11 15c0 4.5 2.2 8 5 8s5-3.5 5-8" {...s} /></svg>);
  if (kind === "blackheads")
    return (<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="12" cy="6" r="1.1" fill="currentColor" /><circle cx="16" cy="4" r="1.1" fill="currentColor" /><circle cx="20" cy="6" r="1.1" fill="currentColor" /><circle cx="14" cy="9.5" r="1.1" fill="currentColor" /><circle cx="18" cy="9.5" r="1.1" fill="currentColor" /><path d="M4 15h24" {...s} /><path d="M11 15c0 4.5 2.2 8 5 8s5-3.5 5-8" {...s} /></svg>);
  if (kind === "oil")
    return (<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 4c3.4 4.6 5.6 7.9 5.6 10.6a5.6 5.6 0 0 1-11.2 0C10.4 11.9 12.6 8.6 16 4Z" {...s} /><path d="M5 24c3.6 2.6 7.3 3.4 11 3.4s7.4-.8 11-3.4" {...s} /></svg>);
  return (<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M6 26C6 14.5 13 7 26 6c-1 13-8.5 20-20 20Z" {...s} /><path d="M6 26 18 14" {...s} /></svg>);
}

export default async function HomePage({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const home = t.home;
  const pt = t.product;
  const catalog = await fetchHomeCatalogSnapshot(24, locale);
  const featured = catalog.products[0] ?? null;
  const p = (path: string) => localizePath(path, locale);
  const productUrl = featured?.productUrl ? p(featured.productUrl) : "#";
  const landing = featured ? getProductLandingContent(featured.handle, locale) : null;
  const gallery = featured?.gallery ?? [];
  const heroImg = gallery[0] ?? (featured ? { url: featured.imageUrl, alt: featured.imageAlt } : null);
  const howToImg = gallery.find((g) => /how to use|modo de/i.test(g.alt)) ?? null;
  const priceLabel = featured
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: featured.priceCurrency, maximumFractionDigits: 0 }).format(Number(featured.priceAmount))
    : "";

  const navItems = [
    { label: home.nav.skincare, href: productUrl },
    { label: home.nav.ritual, href: "#how-to" },
    { label: home.nav.contact, href: "/contacto" },
  ];

  const emWords = home.heroTitleEm.split(" ");
  const swooshLast = emWords.pop() ?? "";
  const swooshHead = emWords.length ? `${emWords.join(" ")} ` : "";
  const benefits = landing?.benefits ?? [];
  const steps = home.ritualSteps;

  return (
    <main className="eg">
      <div className="eg-bg" aria-hidden="true">
        <span className="eg-ribbon r1" />
        <span className="eg-ribbon r2" />
        <span className="eg-ribbon r3" />
        <BubbleBackground />
      </div>

      <div className="eg-shell">
        {/* Barra superior */}
        <div className="eg-topbar">
          <TruckIcon />
          <span>{home.announcement[0]}</span>
        </div>

        {/* Header */}
        <header className="eg-header">
          <div className="eg-header-left">
            <MobileNav items={navItems} />
            <nav className="eg-links" aria-label="Main">
              {navItems.map((i) => (
                <a key={i.label} href={i.href}>{i.label}</a>
              ))}
            </nav>
          </div>
          <Link href={p("/")} className="eg-logo notranslate" translate="no">
            <b>Elora</b> Skin
          </Link>
          <div className="eg-header-right">
            <span className="eg-lang"><LangSwitcher /></span>
            <EloraCartLink label={pt.bag} />
          </div>
        </header>

        {/* Hero */}
        <section className="eg-hero">
          <div className="eg-hero-copy">
            <h1 className="eg-h1">
              {home.heroTitlePre}{" "}
              {swooshHead}
              <span className="eg-swoosh">{swooshLast}</span>
            </h1>
            <p className="eg-lead">{home.heroLead}</p>
            <a className="eg-btn" href={productUrl}>
              {home.ctaShop}{priceLabel ? ` – ${priceLabel}` : ""}
              <span aria-hidden="true" className="eg-chev">›</span>
            </a>
          </div>
          <div className="eg-hero-media">
            {heroImg ? (
              <Link href={productUrl} className="eg-hero-frame" aria-label={featured?.title}>
                <Image src={heroImg.url} alt={heroImg.alt} width={720} height={720} priority sizes="(max-width: 700px) 46vw, 520px" />
              </Link>
            ) : (
              <div className="eg-hero-frame is-empty" aria-hidden="true" />
            )}
            <span className="eg-podium" aria-hidden="true" />
          </div>
        </section>

        {/* Confianza */}
        <section className="eg-glass eg-trust" aria-label="Trust">
          <div><TruckIcon /><span>{home.trust[0]}</span></div>
          <div><ShieldIcon /><span>{home.trust[1]}</span></div>
          <div><LeafLine /><span>{home.trust[2]}</span></div>
        </section>

        {/* Packs */}
        {featured?.variants?.length ? (
          <section aria-label={featured.title}>
            <HomePackPicker
              variants={featured.variants}
              currency={featured.priceCurrency}
              locale={locale}
              productTitle={featured.title}
              fallbackUrl={productUrl}
              labels={{
                oneUnit: pt.oneUnit,
                nUnits: pt.nUnits,
                mostPopular: pt.mostPopular,
                bestValue: pt.bestValue,
                buyNow: pt.buyNow,
                redirecting: pt.redirecting,
                error: pt.addError,
              }}
            />
          </section>
        ) : null}

        {/* Beneficios */}
        {benefits.length ? (
          <section className="eg-benefits" aria-label={landing?.benefitsTitle}>
            {benefits.map((b) => (
              <a key={b.title} href={productUrl} className="eg-glass eg-benefit">
                <span className="eg-benefit-ico"><BenefitIcon kind={b.icon} /></span>
                <span className="eg-benefit-title">{b.title}</span>
              </a>
            ))}
          </section>
        ) : null}

        {/* Cómo se usa */}
        <section className="eg-howto" id="how-to">
          <h2 className="eg-h2"><span>{home.ritualTitle}</span></h2>
          <ol className="eg-steps">
            {steps.map((step, i) => (
              <li key={step.title} className="eg-step">
                <span
                  className={`eg-step-img${howToImg ? "" : " is-empty"}`}
                  style={howToImg ? { backgroundImage: `url("${howToImg.url}")`, backgroundPosition: `${[1, 50, 99][i]}% 26%` } : undefined}
                  role="img"
                  aria-label={step.title}
                />
                <span className="eg-step-label">
                  <span className="eg-step-n">{i + 1}</span>
                  {step.title}
                </span>
                {i < steps.length - 1 ? <span className="eg-step-arrow" aria-hidden="true">›</span> : null}
              </li>
            ))}
          </ol>
        </section>

        {/* Footer */}
        <footer className="eg-footer">
          <span className="eg-footer-logo notranslate" translate="no">Elora Skin</span>
          <nav className="eg-footer-links" aria-label="Footer">
            <a href="/contacto">{home.footerHelp}</a>
            <a href="/politica-de-envios">{home.footerShipping}</a>
            <a href="/politica-de-devoluciones">{home.footerReturns}</a>
            <a href="/politica-de-privacidad">{home.footerPrivacy}</a>
            <a href="/terminos-y-condiciones">{home.footerTerms}</a>
          </nav>
          <span className="eg-footer-rights">{home.footerRights}</span>
        </footer>
      </div>
    </main>
  );
}
