import Image from "next/image";
import Link from "next/link";
import { fetchHomeCatalogSnapshot } from "@/lib/shopifyCatalog";
import { getMessages, localizePath, type Locale } from "@/lib/i18n";
import PillButton from "@/components/elora/PillButton";
import RevealOnScroll from "@/components/elora/RevealOnScroll";
import Marquee from "@/components/elora/Marquee";
import EloraBestsellers from "@/components/elora/EloraBestsellers";
import EloraCartLink from "@/components/elora/EloraCartLink";
import NewsletterForm from "@/components/elora/NewsletterForm";
import MobileNav from "@/components/elora/MobileNav";
import LangSwitcher from "@/components/elora/LangSwitcher";
import {
  PackageIcon,
  LockIcon,
  LeafIcon,
  HeartIcon,
  DropIcon,
  BubbleIcon,
  BrushIcon,
  SparkleStar,
  PetalShape,
} from "@/components/elora/Icons";

// Reviews are only shown when real, connected reviews exist. No system is
// wired yet, so the section stays hidden behind this flag instead of inventing
// testimonials.
const SHOW_REVIEWS = false;

const TRUST_ICONS = [PackageIcon, LockIcon, LeafIcon, HeartIcon];
const RITUAL_ICONS = [DropIcon, BubbleIcon, BrushIcon];

const HERO_PETALS = [
  { top: "10%", left: "4%", size: 14, duration: 13, delay: 0, tone: "blush" as const },
  { top: "24%", left: "16%", size: 10, duration: 16, delay: 2.4, tone: "blush-deep" as const },
  { top: "6%", left: "34%", size: 12, duration: 14, delay: 4.8, tone: "blush" as const },
  { top: "18%", left: "46%", size: 16, duration: 18, delay: 1.2, tone: "blush-deep" as const },
  { top: "4%", left: "60%", size: 11, duration: 15, delay: 6, tone: "blush" as const },
];

const HERO_SPARKLES = [
  { top: "8%", right: "26%", delay: 0 },
  { top: "58%", right: "6%", delay: 0.9 },
  { top: "34%", right: "44%", delay: 1.8 },
];

export default async function HomePage({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const home = t.home;
  const catalogSnapshot = await fetchHomeCatalogSnapshot(24, locale);
  const featured = catalogSnapshot.products[0] ?? null;
  const p = (path: string) => localizePath(path, locale);

  const featuredUrl = featured?.productUrl ? p(featured.productUrl) : "#bestsellers";
  const navItems = [
    { label: home.nav.skincare, href: "#bestsellers" },
    { label: home.nav.ritual, href: "#ritual" },
    { label: home.nav.contact, href: "/contacto" },
  ];

  return (
    <main className="elora-home">
      <div className="elora-bg" aria-hidden="true" />

      {/* 1 — Announcement bar --------------------------------------------- */}
      <div className="elora-strip">
        <Marquee items={home.announcement} durationSeconds={28} ariaLabel="Elora Skin" />
      </div>

      {/* 2 — Nav ------------------------------------------------------------ */}
      <header className="elora-header">
        <nav className="elora-nav">
          <Link href={p("/")} className="elora-logo notranslate" translate="no">
            Elora <span>Skin</span>
          </Link>
          <ul className="elora-nav-links">
            {navItems.map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
            <li>
              <LangSwitcher />
            </li>
          </ul>
          <div className="elora-nav-icons">
            <EloraCartLink label={t.product.bag} />
            <MobileNav items={navItems} />
          </div>
        </nav>
      </header>

      {/* 3 — Hero ------------------------------------------------------------ */}
      <section className="elora-hero" id="inicio">
        {HERO_PETALS.map((petal, index) => (
          <span
            key={`petal-${index}`}
            className="elora-petal"
            aria-hidden="true"
            style={{
              top: petal.top,
              left: petal.left,
              width: petal.size,
              height: petal.size,
              color: `var(--${petal.tone})`,
              animationDuration: `${petal.duration}s`,
              animationDelay: `${petal.delay}s`,
            }}
          >
            <PetalShape />
          </span>
        ))}
        {HERO_SPARKLES.map((sparkle, index) => (
          <span
            key={`sparkle-${index}`}
            className="elora-sparkle"
            aria-hidden="true"
            style={{ top: sparkle.top, right: sparkle.right, animationDelay: `${sparkle.delay}s` }}
          >
            <SparkleStar />
          </span>
        ))}
        <span className="elora-bubble" aria-hidden="true" />

        <div className="elora-hero-grid">
          <div className="elora-hero-copy">
            <span className="elora-eyebrow">{home.heroEyebrow}</span>
            <h1 className="elora-hero-title">
              {home.heroTitlePre} <em>{home.heroTitleEm}</em>
            </h1>
            <p className="elora-hero-lead">{home.heroLead}</p>
            <div className="elora-hero-cta">
              <PillButton href={featuredUrl}>{home.ctaShop}</PillButton>
              <PillButton href="#ritual" variant="outline">
                {home.ctaRitual}
              </PillButton>
            </div>
          </div>

          <div className="elora-hero-media">
            {featured ? (
              <Link href={featuredUrl} className="elora-hero-frame" aria-label={featured.title}>
                <Image
                  src={featured.imageUrl}
                  alt={featured.imageAlt || featured.title}
                  width={640}
                  height={800}
                  priority
                  sizes="(max-width: 980px) 80vw, 360px"
                />
              </Link>
            ) : (
              <div className="elora-hero-frame is-placeholder" aria-hidden="true">
                <div>
                  <SparkleStar className="elora-hero-frame-placeholder-icon" />
                  <p className="elora-hero-frame-placeholder-text">{home.heroComingSoon}</p>
                </div>
              </div>
            )}

            {home.chips.map((chip, index) => (
              <div key={chip} className={`elora-hero-chip c${index + 1}`}>
                <SparkleStar className="elora-hero-chip-dot" />
                {chip}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Trust bar -------------------------------------------------- */}
      <div className="elora-trust">
        <div className="elora-trust-row">
          {home.trust.map((label, index) => {
            const Icon = TRUST_ICONS[index] ?? PackageIcon;
            return (
              <div key={label} className="elora-trust-item">
                <Icon className="elora-trust-ico" />
                {label}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5 — Bestsellers (real /api/catalog data) ----------------------- */}
      <EloraBestsellers initialProducts={catalogSnapshot.products} locale={locale} />

      {/* 6 — Ritual ------------------------------------------------------ */}
      <section className="elora-section" id="ritual">
        <RevealOnScroll className="elora-section-head" as="div">
          <span className="elora-eyebrow">{home.ritualEyebrow}</span>
          <h2 className="elora-h2">
            {home.ritualTitle}
            <span className="elora-underline" />
          </h2>
          <p className="elora-section-sub">{home.ritualSub}</p>
        </RevealOnScroll>

        <div className="elora-ritual-grid">
          {home.ritualSteps.map((step, index) => {
            const Icon = RITUAL_ICONS[index] ?? DropIcon;
            return (
              <RevealOnScroll
                key={step.number}
                as="article"
                className="elora-ritual-step"
                delay={(Math.min(index + 1, 4) as 1 | 2 | 3 | 4)}
              >
                <span className="elora-ritual-number">{step.number}</span>
                <Icon className="elora-ritual-icon" />
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* 7 — Honest beauty ---------------------------------------------- */}
      <section className="elora-section elora-story" id="filosofia">
        <div className="elora-story-grid">
          <RevealOnScroll className="elora-story-visual" as="div">
            {featured ? (
              <Image
                src={featured.imageUrl}
                alt={featured.imageAlt || featured.title}
                width={720}
                height={720}
                sizes="(max-width: 980px) 90vw, 560px"
              />
            ) : null}
          </RevealOnScroll>
          <div>
            <RevealOnScroll as="span" className="elora-eyebrow">
              {home.honestEyebrow}
            </RevealOnScroll>
            <RevealOnScroll as="div" delay={1}>
              <h2>{home.honestTitle}</h2>
            </RevealOnScroll>
            <RevealOnScroll as="div" delay={2}>
              <p>{home.honestBody}</p>
            </RevealOnScroll>
            <ul className="elora-checklist">
              {home.honestList.map((item, index) => (
                <RevealOnScroll
                  key={item}
                  as="li"
                  delay={(Math.min(index + 1, 4) as 1 | 2 | 3 | 4)}
                >
                  <span className="elora-dot" aria-hidden="true">
                    ✓
                  </span>
                  {item}
                </RevealOnScroll>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {SHOW_REVIEWS ? <section className="elora-section" id="resenas" /> : null}

      {/* 8 — CTA banner + real newsletter form -------------------------- */}
      <section id="newsletter">
        <RevealOnScroll className="elora-cta" as="div">
          <div className="elora-cta-sparkles" aria-hidden="true">
            <span style={{ top: 20, left: "10%" }}>
              <SparkleStar />
            </span>
            <span style={{ top: 60, right: "14%", animationDelay: "1s" }}>
              <SparkleStar />
            </span>
            <span style={{ bottom: 24, left: "22%", animationDelay: "2s" }}>
              <SparkleStar />
            </span>
          </div>
          <h2>{home.newsTitle}</h2>
          <p>{home.newsSub}</p>
          <NewsletterForm locale={locale} />
        </RevealOnScroll>
      </section>

      {/* 9 — Footer ----------------------------------------------------- */}
      <footer className="elora-footer">
        <div className="elora-footer-grid">
          <div>
            <div className="elora-footer-logo notranslate" translate="no">Elora Skin</div>
            <p className="elora-footer-tag">{home.footerTag}</p>
          </div>
          <div>
            <h4>{home.footerShop}</h4>
            <ul>
              <li>
                <a href="#bestsellers">{home.nav.skincare}</a>
              </li>
              <li>
                <a href="/cart">{home.footerBag}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>{home.footerHelp}</h4>
            <ul>
              <li>
                <a href="/contacto">{home.nav.contact}</a>
              </li>
              <li>
                <a href="/politica-de-envios">{home.footerShipping}</a>
              </li>
              <li>
                <a href="/politica-de-devoluciones">{home.footerReturns}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>{home.footerLegal}</h4>
            <ul>
              <li>
                <a href="/politica-de-privacidad">{home.footerPrivacy}</a>
              </li>
              <li>
                <a href="/terminos-y-condiciones">{home.footerTerms}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="elora-footer-bottom">{home.footerRights}</div>
      </footer>
    </main>
  );
}
