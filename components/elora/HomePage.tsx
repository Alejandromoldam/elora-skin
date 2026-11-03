import Image from "next/image";
import Link from "next/link";
import { fetchHomeCatalogSnapshot } from "@/lib/shopifyCatalog";
import { getMessages, localizePath, type Locale } from "@/lib/i18n";
import { getProductLandingContent } from "@/lib/productContent";
import { moneyWithCode } from "@/lib/money";
import EloraCartLink from "@/components/elora/EloraCartLink";
import MobileNav from "@/components/elora/MobileNav";
import LangSwitcher from "@/components/elora/LangSwitcher";
import HomePackPicker from "@/components/elora/HomePackPicker";
import BubbleBackground from "@/components/elora/BubbleBackground";
import HeroCarousel, { type HeroSlide } from "@/components/elora/HeroCarousel";

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
  if (kind === "lashes")
    return (<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 15c3.5 4 7.5 6 12 6s8.5-2 12-6" {...s} /><path d="M7 18.4 5 21.5M11 20.3l-1.2 3.4M16 21v3.6M21 20.3l1.2 3.4M25 18.4l2 3.1" {...s} /><path d="M23 4v7m0-7-2.6 2.6M23 4l2.6 2.6" {...s} /></svg>);
  if (kind === "volume")
    return (<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 17c3.5 4 7.5 6 12 6s8.5-2 12-6" {...s} /><path d="M6.5 20 4 23.5M10 21.8l-1.6 3.8M14 22.8l-.6 4M18 22.8l.6 4M22 21.8l1.6 3.8M25.5 20l2.5 3.5" {...s} /><path d="M12 5.5v5M9.5 8h5M21.5 9v3.5M19.75 10.75h3.5" {...s} /></svg>);
  if (kind === "hydrate")
    return (<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 4c4 5.5 7 9.4 7 13a7 7 0 0 1-14 0c0-3.6 3-7.5 7-13Z" {...s} /></svg>);
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
  const howToImg = gallery.find((g) => /how to use|modo de/i.test(g.alt)) ?? null;

  const money0 = (amount: string, currency: string) => moneyWithCode(amount, currency);
  const productSlides: HeroSlide[] = catalog.products.slice(0, 6).map((prod) => {
    const content = getProductLandingContent(prod.handle, locale);
    const img = prod.gallery?.[0] ?? { url: prod.imageUrl, alt: prod.imageAlt };
    return {
      key: prod.id,
      eyebrow: content?.hero?.eyebrow,
      titlePre: content?.hero?.titlePre ?? prod.title,
      titleEm: content?.hero?.titleEm ?? "",
      lead: content?.hero?.lead ?? prod.descriptionShort,
      cta: `${home.heroShop} – ${money0(prod.priceAmount, prod.priceCurrency)}`,
      href: p(prod.productUrl),
      image: img,
    };
  });
  // Un slide por producto, en orden de lanzamiento: la imagen y el título
  // siempre corresponden al mismo producto. Sin productos, slide de marca.
  const brandSlide: HeroSlide = {
    key: "brand",
    eyebrow: home.brandEyebrow,
    titlePre: home.brandTitlePre,
    titleEm: home.brandTitleEm,
    lead: home.brandLead,
    cta: home.brandCta,
    href: "#shop",
    image: null,
  };
  const heroSlides: HeroSlide[] = productSlides.length ? productSlides : [brandSlide];

  // Con varios productos, la portada es una vitrina: beneficios y pasos de uso
  // viven en la landing de cada producto.
  const multi = catalog.products.length > 1;
  const navItems = [
    { label: home.nav.skincare, href: multi ? "#shop" : productUrl },
    ...(multi ? [] : [{ label: home.nav.ritual, href: "#how-to" }]),
    { label: home.nav.contact, href: "/contacto" },
  ];

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

        {/* Hero: carrusel (marca + un slide por producto) */}
        <HeroCarousel
          slides={heroSlides}
          labels={{ prev: home.heroPrev, next: home.heroNext, goTo: home.heroGoTo }}
        />

        {/* Confianza */}
        <section className="eg-glass eg-trust" aria-label="Trust">
          <div><TruckIcon /><span>{home.trust[0]}</span></div>
          <div><ShieldIcon /><span>{home.trust[1]}</span></div>
          <div><LeafLine /><span>{home.trust[2]}</span></div>
        </section>

        {/* Tienda: con varios productos, vitrina; con uno solo, sus packs */}
        {multi ? (
          <section id="shop" className="eg-shop" aria-labelledby="eg-shop-title">
            <h2 className="eg-h2" id="eg-shop-title"><span>{home.shopTitle}</span></h2>
            <div className="eg-shop-grid">
              {catalog.products.map((prod) => {
                const content = getProductLandingContent(prod.handle, locale);
                const img = prod.gallery?.[0] ?? (prod.imageUrl ? { url: prod.imageUrl, alt: prod.imageAlt } : null);
                const from = Math.min(...(prod.variants?.length ? prod.variants.map((v) => Number(v.priceAmount)) : [Number(prod.priceAmount)]));
                const tagline = content?.tagline ?? prod.descriptionShort;
                return (
                  <a key={prod.id} href={p(prod.productUrl)} className="eg-glass eg-card">
                    <span className="eg-card-media">
                      {img ? <Image src={img.url} alt={img.alt} width={640} height={640} sizes="(max-width: 700px) 46vw, 360px" /> : null}
                    </span>
                    <span className="eg-card-body">
                      <span className="eg-card-title">{content?.hero?.eyebrow?.split("·").pop()?.trim() || prod.title}</span>
                      {tagline ? <span className="eg-card-tag">{tagline}</span> : null}
                      <span className="eg-card-foot">
                        <span className="eg-card-price">{home.shopFrom.replace("{price}", money0(String(from), prod.priceCurrency))}</span>
                        <span className="eg-card-cta" aria-hidden="true">›</span>
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </section>
        ) : featured?.variants?.length ? (
          <section id="shop" aria-label={featured.title}>
            <HomePackPicker
              variants={featured.variants}
              currency={featured.priceCurrency}
              locale={locale}
              productTitle={featured.title}
              fallbackUrl={productUrl}
              labels={{
                oneUnit: pt.oneUnit,
                nUnits: pt.nUnits,
                oneTube: pt.oneTube,
                nTubes: pt.nTubes,
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
        {!multi && benefits.length ? (
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
        {multi ? null : (
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
        )}

        {/* Footer */}
        <footer className="eg-footer">
          <span className="eg-footer-logo notranslate" translate="no"><b>Elora</b> Skin</span>
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
