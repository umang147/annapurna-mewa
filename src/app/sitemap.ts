import { MetadataRoute } from 'next';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { FALLBACK_BLOG_POSTS } from '@/data/blogPosts';
import { SEO_HUBS } from '@/data/seoHubs';
import { TRUST_PAGE_LINKS } from '@/data/trustPages';
import { client } from '@/sanity/lib/client';
import { blogPostsQuery, productsQuery } from '@/sanity/lib/queries';
import { isValidBlogSlug, isValidProductSlug, SeoBlogPost, SeoProduct, siteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hasSanityConfig = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'yoursanityprojectid';
  let products: SeoProduct[] = [];
  let posts: SeoBlogPost[] = [];
  
  if (hasSanityConfig) {
    products = await client.fetch(productsQuery);
    posts = await client.fetch(blogPostsQuery);
  } else {
    products = MOCK_PRODUCTS;
  }

  if (posts.length === 0) {
    posts = FALLBACK_BLOG_POSTS;
  }

  const productUrls = products
    .filter((product) => isValidProductSlug(product.slug))
    .map((product) => ({
      url: `${siteUrl}/product/${encodeURIComponent(product.slug)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  const blogUrls = [
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...posts
      .filter((post) => isValidBlogSlug(post.slug))
      .filter((post) => !post.noIndex)
      .map((post) => ({
        url: `${siteUrl}/blog/${encodeURIComponent(post.slug)}`,
        lastModified: new Date(post.updatedAt || post.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
  ];

  const hubUrls = SEO_HUBS.map((hub) => ({
    url: `${siteUrl}${hub.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const trustUrls = TRUST_PAGE_LINKS.map((page) => ({
    url: `${siteUrl}${page.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.55,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...hubUrls,
    ...trustUrls,
    ...productUrls,
    ...blogUrls,
  ];
}
