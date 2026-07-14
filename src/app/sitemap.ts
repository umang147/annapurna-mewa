import { MetadataRoute } from 'next';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { client } from '@/sanity/lib/client';
import { productsQuery } from '@/sanity/lib/queries';
import { isValidProductSlug, SeoProduct, siteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hasSanityConfig = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'yoursanityprojectid';
  let products: SeoProduct[] = [];
  
  if (hasSanityConfig) {
    products = await client.fetch(productsQuery);
  } else {
    products = MOCK_PRODUCTS;
  }

  const productUrls = products
    .filter((product) => isValidProductSlug(product.slug))
    .map((product) => ({
      url: `${siteUrl}/product/${encodeURIComponent(product.slug)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...productUrls,
  ];
}
