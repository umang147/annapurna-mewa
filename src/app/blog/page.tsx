import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrackedLink from '@/components/TrackedLink';
import { FALLBACK_BLOG_POSTS } from '@/data/blogPosts';
import { client } from '@/sanity/lib/client';
import { blogPostsQuery } from '@/sanity/lib/queries';
import {
  absoluteUrl,
  brandName,
  defaultSeoDescription,
  getBlogPostDescription,
  getBlogPostImageSource,
  getBlogPostUrl,
  isValidBlogSlug,
  SeoBlogPost,
} from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: `Dry Fruits Guide & Blog | ${brandName}`,
  description:
    'Read practical dry fruit buying guides, storage tips, nutrition notes, and gifting ideas from Annapurna Mewa.',
  alternates: {
    canonical: absoluteUrl('/blog'),
  },
  openGraph: {
    title: `Dry Fruits Guide & Blog | ${brandName}`,
    description: defaultSeoDescription,
    url: absoluteUrl('/blog'),
    siteName: brandName,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: absoluteUrl('/images/hero-optimized.jpg'),
        width: 1200,
        height: 630,
        alt: `${brandName} dry fruits guide`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Dry Fruits Guide & Blog | ${brandName}`,
    description: defaultSeoDescription,
    images: [absoluteUrl('/images/hero-optimized.jpg')],
  },
};

async function getBlogPosts(): Promise<SeoBlogPost[]> {
  const hasSanityConfig = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'yoursanityprojectid';

  if (!hasSanityConfig) {
    return FALLBACK_BLOG_POSTS;
  }

  const posts = await client.fetch<SeoBlogPost[]>(blogPostsQuery);
  return posts.length > 0 ? posts : FALLBACK_BLOG_POSTS;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export default async function BlogPage() {
  const posts = (await getBlogPosts()).filter((post) => isValidBlogSlug(post.slug) && !post.noIndex);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <section className="relative overflow-hidden bg-neutral-900 text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/images/hero-optimized.jpg"
              alt="Premium dry fruits"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
          <div className="relative max-w-5xl mx-auto text-center">
            <p className="text-brand-gold font-semibold uppercase tracking-[0.25em] text-sm mb-4">
              Annapurna Mewa Blog
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Dry Fruits Guide
            </h1>
            <p className="text-lg md:text-xl text-neutral-200 max-w-3xl mx-auto leading-relaxed">
              Practical buying guides, storage tips, nutrition notes, and gifting ideas for premium dry fruits in Bangalore and across India.
            </p>
          </div>
        </section>

        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <TrackedLink
                key={post._id || post.slug}
                href={getBlogPostUrl(post).replace(absoluteUrl('/'), '/')}
                eventName="blog_card_click"
                eventParams={{
                  blog_slug: post.slug,
                  blog_title: post.title,
                  location: 'blog_index',
                }}
                className="block group h-full"
              >
                <article className="glass rounded-2xl overflow-hidden hover-glow h-full flex flex-col">
                  <div className="relative aspect-[4/3] bg-neutral-900">
                    <Image
                      src={getBlogPostImageSource(post)}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {post.category && (
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-brand-gold">
                        {post.category}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs text-foreground/50 mb-3">
                      <CalendarDays size={14} />
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-3 group-hover:text-brand-red transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-foreground/70 leading-relaxed flex-grow">
                      {getBlogPostDescription(post)}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 text-brand-red font-semibold">
                      Read Guide <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              </TrackedLink>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
