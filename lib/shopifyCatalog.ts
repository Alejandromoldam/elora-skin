const DEFAULT_API_VERSION = "2025-04";

export type CatalogProduct = {
  id: string;
  title: string;
  handle: string;
  variantId?: string | null;
  descriptionShort: string;
  imageUrl: string;
  imageAlt: string;
  priceAmount: string;
  priceCurrency: string;
  availableForSale: boolean;
  productUrl: string;
  buyNowUrl: string;
  /** Galería (hasta 6 imágenes) y variantes; las usa la portada. */
  gallery?: Array<{ url: string; alt: string }>;
  variants?: Array<{ id: string; title: string; availableForSale: boolean; priceAmount: string; compareAtAmount: string | null }>;
};

export type CatalogSnapshot = {
  products: CatalogProduct[];
  hasMore: boolean;
  nextCursor: string | null;
};

type ShopifyProductsResponse = {
  data?: {
    products?: {
      pageInfo?: {
        hasNextPage?: boolean;
        endCursor?: string | null;
      };
      edges?: Array<{
        node: {
          id: string;
          title?: string | null;
          handle?: string | null;
          description?: string | null;
          descriptionHtml?: string | null;
          availableForSale?: boolean | null;
          images: {
            edges: Array<{
              node: {
                url: string;
                altText: string | null;
              };
            }>;
          };
          priceRange: {
            minVariantPrice: {
              amount?: string | null;
              currencyCode?: string | null;
            };
          };
          variants: {
            edges: Array<{
              node: {
                id: string;
                title?: string | null;
                availableForSale?: boolean | null;
                price?: { amount?: string | null } | null;
                compareAtPrice?: { amount?: string | null } | null;
              };
            }>;
          };
        };
      }>;
    };
  };
};

function compactText(value: string, maxLength = 140) {
  const clean = value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!clean) {
    return "Descripcion disponible en la ficha del producto.";
  }
  if (clean.length <= maxLength) {
    return clean;
  }
  return `${clean.slice(0, maxLength).trim()}...`;
}

function extractVariantNumericId(variantGid: string | undefined) {
  if (!variantGid) return null;
  const match = variantGid.match(/\/(\d+)(?:\?.*)?$/);
  return match?.[1] ?? null;
}

function normalizeShopifyImageUrl(
  domain: string,
  rawUrl: string | null | undefined
) {
  if (!rawUrl) {
    return "/producto-real.png";
  }

  try {
    const parsed = new URL(rawUrl);
    if (
      parsed.hostname === "cdn.shopify.com" &&
      parsed.pathname.includes("/files/")
    ) {
      const filePath = parsed.pathname.split("/files/").pop();
      if (filePath) {
        return `https://${domain}/cdn/shop/files/${filePath}${parsed.search}`;
      }
    }
    return rawUrl;
  } catch {
    return rawUrl;
  }
}

export async function fetchHomeCatalogSnapshot(
  first = 24,
  locale?: string
): Promise<CatalogSnapshot> {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token =
    process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ||
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    "";
  const version =
    process.env.SHOPIFY_API_VERSION ||
    process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ||
    DEFAULT_API_VERSION;

  if (!domain || !token || token.startsWith("atkn_")) {
    // Sin credenciales de Shopify: catálogo local de desarrollo para que la
    // landing se vea completa. Se importa dinámicamente para no cargar los
    // mocks en producción cuando las credenciales sí existen.
    const { getMockSnapshot } = await import("./mockCatalog");
    return getMockSnapshot(locale);
  }

  const endpoint = `https://${domain}/api/${version}/graphql.json`;
  const query = `
    query HomeCatalogProducts($first: Int!) {
      products(first: $first, sortKey: CREATED_AT) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            availableForSale
            images(first: 6) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price { amount }
                  compareAtPrice { amount }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    // El token puede ser público o privado (Headless). Probamos ambos
    // encabezados, igual que /api/catalog, para que la portada renderice
    // los productos desde el servidor y no dependa del navegador.
    const authHeaderOptions: Array<Record<string, string>> = [
      { "Shopify-Storefront-Private-Token": token },
      { "X-Shopify-Storefront-Access-Token": token },
    ];
    let response: Response | null = null;
    for (const authHeaders of authHeaderOptions) {
      const candidate = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ query, variables: { first } }),
        next: { revalidate: 180 },
      });
      if (candidate.ok) {
        response = candidate;
        break;
      }
    }

    if (!response) {
      return { products: [], hasMore: false, nextCursor: null };
    }

    const payload = (await response.json()) as ShopifyProductsResponse;
    const edges = payload.data?.products?.edges ?? [];
    const hasMore = payload.data?.products?.pageInfo?.hasNextPage ?? false;
    const nextCursor = payload.data?.products?.pageInfo?.endCursor ?? null;

    const products = edges.map(({ node }) => {
      const image = node.images.edges[0]?.node;
      const selectedVariant =
        node.variants.edges.find(
          ({ node: variantNode }) => variantNode?.availableForSale === true
        )?.node || node.variants.edges[0]?.node;
      const variantGid = selectedVariant?.id;
      const variantNumericId = extractVariantNumericId(variantGid);
      const handle = node.handle || "";
      const productUrl = handle ? `/products/${handle}` : "/#catalogo";
      const buyNowUrl = variantNumericId ? "/cart" : productUrl;
      const title = node.title || "Producto";
      const description = node.description || node.descriptionHtml || "";

      return {
        id: node.id,
        title,
        handle,
        variantId: variantGid || null,
        descriptionShort: compactText(description),
        imageUrl: normalizeShopifyImageUrl(domain, image?.url),
        imageAlt: image?.altText || title,
        priceAmount: node.priceRange?.minVariantPrice?.amount || "0.00",
        priceCurrency:
          node.priceRange?.minVariantPrice?.currencyCode || "USD",
        availableForSale: Boolean(node.availableForSale),
        productUrl,
        buyNowUrl,
        gallery: node.images.edges.map(({ node: img }) => ({
          url: normalizeShopifyImageUrl(domain, img.url),
          alt: img.altText || title,
        })),
        variants: node.variants.edges.map(({ node: v }) => ({
          id: v.id,
          title: v.title || "",
          availableForSale: Boolean(v.availableForSale),
          priceAmount: v.price?.amount || node.priceRange?.minVariantPrice?.amount || "0",
          compareAtAmount: v.compareAtPrice?.amount || null,
        })),
      } satisfies CatalogProduct;
    });

    return { products, hasMore, nextCursor };
  } catch {
    return { products: [], hasMore: false, nextCursor: null };
  }
}
