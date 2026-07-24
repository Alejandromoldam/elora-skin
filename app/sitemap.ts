import type { MetadataRoute } from "next";
import {
  getAllCollectionHandles,
  getAllProductHandles,
  getSiteUrl,
} from "@/lib/shopifySeo";

export const revalidate = 1800;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const [products, collections] = await Promise.all([
    getAllProductHandles(500),
    getAllCollectionHandles(250),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: { en: `${siteUrl}/`, es: `${siteUrl}/es` },
      },
    },
    {
      url: `${siteUrl}/es`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
      alternates: {
        languages: { en: `${siteUrl}/`, es: `${siteUrl}/es` },
      },
    },
    {
      url: `${siteUrl}/categorias`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/contacto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/politica-de-privacidad`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${siteUrl}/politica-de-devoluciones`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${siteUrl}/politica-de-envios`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${siteUrl}/terminos-y-condiciones`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    },
  ];

  const productEntries: MetadataRoute.Sitemap = products.flatMap((product) => {
    const lastModified = product.updatedAt ? new Date(product.updatedAt) : now;
    const languages = {
      en: `${siteUrl}/products/${product.handle}`,
      es: `${siteUrl}/es/products/${product.handle}`,
    };
    return [
      {
        url: languages.en,
        lastModified,
        changeFrequency: "daily" as const,
        priority: 0.9,
        alternates: { languages },
      },
      {
        url: languages.es,
        lastModified,
        changeFrequency: "daily" as const,
        priority: 0.85,
        alternates: { languages },
      },
    ];
  });

  const categoryEntries: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: `${siteUrl}/categorias/${collection.handle}`,
    lastModified: collection.updatedAt ? new Date(collection.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries, ...categoryEntries];
}
