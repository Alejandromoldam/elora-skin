import type { Metadata } from "next";
import HomePage from "@/components/elora/HomePage";
import { getMessages } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/shopifySeo";

const t = getMessages("en").home;
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  alternates: {
    canonical: `${siteUrl}/`,
    languages: {
      en: `${siteUrl}/`,
      es: `${siteUrl}/es`,
      "x-default": `${siteUrl}/`,
    },
  },
  openGraph: {
    title: t.metaTitle,
    description: t.metaDescription,
    siteName: "Elora Skin",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: t.metaTitle,
    description: t.metaDescription,
  },
};

export default function Home() {
  return <HomePage locale="en" />;
}
