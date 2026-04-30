import { MetadataRoute } from 'next';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { client } from '@/sanity/lib/client';
import { productsQuery } from '@/sanity/lib/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://annapurna-mewa.vercel.app';
  
  const hasSanityConfig = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'yoursanityprojectid';
  let products: any[] = [];
  
  if (hasSanityConfig) {
    products = await client.fetch(productsQuery);
  } else {
    products = MOCK_PRODUCTS;
  }

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...productUrls,
  ];
}
