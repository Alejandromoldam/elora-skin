import type { Metadata } from "next";
import ProductPageClient from "@/components/ProductPageClient";
import { getSiteUrl } from "@/lib/shopifySeo";
import { getMockProduct, isMockCatalogEnabled } from "@/lib/mockCatalog";

export const revalidate = 1800;

// Versión en español de la landing de producto. El contenido lo resuelve el
// cliente vía /api/product/[handle]?locale=es; aquí solo va metadata + hreflang.
export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const handle = params.handle;
  const enUrl = `${siteUrl}/products/${handle}`;
  const esUrl = `${siteUrl}/es/products/${handle}`;

  let title = "Comprar | Elora Skin";
  let description =
    "Skincare con ingredientes reales. Descubre el ritual Elora Skin.";
  let imageUrl = `${siteUrl}/producto-real.png`;

  if (isMockCatalogEnabled()) {
    const mock = getMockProduct(handle, "es");
    if (mock) {
      title = `Comprar ${mock.title}`;
      description = mock.descriptionShort;
      imageUrl = mock.imageUrl.startsWith("http")
        ? mock.imageUrl
        : `${siteUrl}${mock.imageUrl}`;
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: esUrl,
      languages: { en: enUrl, es: esUrl, "x-default": enUrl },
    },
    openGraph: {
      title: `${title} | Elora Skin`,
      description,
      type: "website",
      url: esUrl,
      images: [{ url: imageUrl, alt: "Elora Skin" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Elora Skin`,
      description,
      images: [imageUrl],
    },
  };
}

export default function ProductPageEs() {
  return <ProductPageClient locale="es" />;
}
