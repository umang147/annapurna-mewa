import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, ChevronLeft, HelpCircle, MessageCircle, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import TrackedLink from '@/components/TrackedLink';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { BLOG_GUIDES } from '@/data/internalLinks';
import { getRelatedSeoHubs, getSeoHub, SEO_HUBS } from '@/data/seoHubs';
import { client } from '@/sanity/lib/client';
import { productsQuery } from '@/sanity/lib/queries';
import {
  absoluteUrl,
  brandName,
  buildBreadcrumbJsonLd,
  jsonLdStringify,
  SeoProduct,
} from '@/lib/seo';

export const revalidate = 60;

export function generateStaticParams() {
  return SEO_HUBS.map((hub) => ({ hub: hub.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ hub: string }> }
): Promise<Metadata> {
  const { hub: slug } = await params;
  const hub = getSeoHub(slug);

  if (!hub) {
    return {
      title: `Page Not Found | ${brandName}`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const url = absoluteUrl(hub.href);

  return {
    title: hub.metaTitle,
    description: hub.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: hub.metaTitle,
      description: hub.metaDescription,
      url,
      siteName: brandName,
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: absoluteUrl('/images/hero-optimized.jpg'),
          width: 1200,
          height: 630,
          alt: hub.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: hub.metaTitle,
      description: hub.metaDescription,
      images: [absoluteUrl('/images/hero-optimized.jpg')],
    },
  };
}

async function getProducts(): Promise<SeoProduct[]> {
  const hasSanityConfig = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'yoursanityprojectid';

  if (!hasSanityConfig) {
    return MOCK_PRODUCTS;
  }

  const products = await client.fetch<SeoProduct[]>(productsQuery);
  return products.length > 0 ? products : MOCK_PRODUCTS;
}

function getHubProducts(products: SeoProduct[], keywords: string[]) {
  const normalizedKeywords = keywords.map((keyword) => keyword.toLowerCase());
  const scored = products.map((product, index) => {
    const haystack = [
      product.name,
      product.category,
      product.slug,
      product.description,
    ].filter(Boolean).join(' ').toLowerCase();
    const score = normalizedKeywords.reduce((total, keyword) => (
      haystack.includes(keyword) ? total + 1 : total
    ), 0);

    return { product, index, score };
  });

  const matchingProducts = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.product);

  return (matchingProducts.length > 0 ? matchingProducts : products).slice(0, 8);
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

function formatPriceRange(product: SeoProduct) {
  const prices = product.prices
    ?.map((price) => price.price)
    .filter((price): price is number => typeof price === 'number' && price > 0) || [];

  if (prices.length === 0) {
    return 'Ask for current price';
  }

  const lowPrice = Math.min(...prices);
  const highPrice = Math.max(...prices);

  return lowPrice === highPrice ? formatPrice(lowPrice) : `${formatPrice(lowPrice)} – ${formatPrice(highPrice)}`;
}

export default async function SeoHubPage({ params }: { params: Promise<{ hub: string }> }) {
  const { hub: slug } = await params;
  const hub = getSeoHub(slug);

  if (!hub) {
    notFound();
  }

  const products = await getProducts();
  const hubProducts = getHubProducts(products, hub.productKeywords);
  const relatedBlogs = BLOG_GUIDES.filter((guide) => hub.relatedBlogSlugs.includes(guide.slug));
  const relatedHubs = getRelatedSeoHubs(hub.relatedHubSlugs);
  const whatsappLink = `https://wa.me/917259496740?text=${encodeURIComponent(hub.ctaMessage)}`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: absoluteUrl('/') },
    { name: hub.title, url: absoluteUrl(hub.href) },
  ]);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: hub.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: hub.title,
    description: hub.metaDescription,
    url: absoluteUrl(hub.href),
    isPartOf: {
      '@type': 'WebSite',
      name: brandName,
      url: absoluteUrl('/'),
    },
    about: hub.productKeywords,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdStringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdStringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdStringify(faqJsonLd) }}
      />
      <Header />

      <main className="flex-grow">
        <section className="relative overflow-hidden bg-neutral-900 text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(226,184,77,0.22),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(209,40,33,0.22),transparent_35%)]" />
          <div className="relative max-w-6xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-brand-gold hover:text-white font-semibold mb-10 transition-colors">
              <ChevronLeft size={20} /> Back to Home
            </Link>
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
              <div>
                <p className="text-brand-gold font-semibold uppercase tracking-[0.25em] text-sm mb-4">
                  {hub.eyebrow}
                </p>
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
                  {hub.heroTitle}
                </h1>
                <p className="text-lg md:text-xl text-neutral-200 leading-relaxed max-w-3xl">
                  {hub.heroText}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <TrackedLink
                    href={whatsappLink}
                    eventName="whatsapp_inquiry_click"
                    eventParams={{
                      hub_slug: hub.slug,
                      hub_title: hub.title,
                      location: 'seo_hub_hero_cta',
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-full transition-colors"
                  >
                    <MessageCircle size={20} />
                    Ask on WhatsApp
                  </TrackedLink>
                  <TrackedLink
                    href="#products"
                    eventName="cta_click"
                    eventParams={{
                      hub_slug: hub.slug,
                      hub_title: hub.title,
                      cta_label: 'View products',
                      location: 'seo_hub_hero_secondary',
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold py-4 px-6 rounded-full border border-white/15 transition-colors"
                  >
                    View products <ArrowRight size={20} />
                  </TrackedLink>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 md:p-8 backdrop-blur-md">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold mb-4">
                  Quick answer
                </p>
                <p className="text-lg leading-8 text-neutral-100">
                  {hub.quickAnswer}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-brand-gold font-semibold uppercase tracking-[0.2em] text-xs mb-3">
                <ShoppingBag size={18} />
                Relevant products
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
                Products for {hub.title.toLowerCase()}
              </h2>
              <p className="text-foreground/70 max-w-3xl leading-relaxed">
                {hub.productIntro}
              </p>
            </div>
            <Link href="/#products" className="inline-flex items-center gap-2 text-brand-red hover:text-red-700 font-semibold">
              Full catalog <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hubProducts.map((product) => (
              <ProductCard key={product.id || product._id || product.slug} product={product} />
            ))}
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl border border-foreground/10 bg-white/60">
            <div className="px-5 py-4 border-b border-foreground/10">
              <h2 className="text-2xl font-serif font-bold text-foreground">Price reference</h2>
              <p className="mt-2 text-sm text-foreground/60">
                Product prices can change with market movement and availability. Confirm today’s rate before ordering.
              </p>
            </div>
            <div className="divide-y divide-foreground/10">
              {hubProducts.slice(0, 6).map((product) => (
                <TrackedLink
                  key={`price-${product.id || product._id || product.slug}`}
                  href={`/product/${product.slug}`}
                  eventName="product_click"
                  eventParams={{
                    product_slug: product.slug,
                    product_name: product.name,
                    product_category: product.category || '',
                    hub_slug: hub.slug,
                    location: 'seo_hub_price_reference',
                  }}
                  className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr_0.5fr] gap-2 p-5 hover:bg-brand-gold/10 transition-colors"
                >
                  <div>
                    <h3 className="font-bold text-foreground">{product.name}</h3>
                    {product.category && <p className="text-sm text-foreground/50">{product.category}</p>}
                  </div>
                  <div className="font-semibold text-foreground/80">{formatPriceRange(product)}</div>
                  <div className="text-brand-red font-semibold md:text-right">View</div>
                </TrackedLink>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6">
            {hub.sections.map((section) => (
              <div key={section.title} className="glass rounded-3xl p-6 md:p-8">
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">{section.title}</h2>
                <p className="text-lg text-foreground/75 leading-8">{section.body}</p>
                {section.bullets && section.bullets.length > 0 && (
                  <div className="mt-5 grid gap-3">
                    {section.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-3 text-foreground/75">
                        <CheckCircle2 className="mt-0.5 text-brand-gold flex-shrink-0" size={20} />
                        <p>{bullet}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="text-brand-gold" size={24} />
                <h2 className="text-3xl font-serif font-bold text-foreground">FAQs</h2>
              </div>
              <div className="space-y-4">
                {hub.faqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl bg-white/50 border border-foreground/10 p-5">
                    <h3 className="font-bold text-lg text-foreground mb-2">{faq.question}</h3>
                    <p className="text-foreground/70 leading-7">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              {relatedBlogs.length > 0 && (
                <div className="glass rounded-3xl p-6 md:p-8">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/50 mb-4">Related buying guides</h2>
                  <div className="grid gap-3">
                    {relatedBlogs.map((guide) => (
                      <Link
                        key={guide.slug}
                        href={guide.href}
                        className="rounded-2xl bg-white/50 border border-foreground/10 p-4 hover:border-brand-gold/50 transition-colors"
                      >
                        <h3 className="font-serif text-xl font-bold text-foreground">{guide.title}</h3>
                        <p className="mt-2 text-sm text-foreground/65 leading-6">{guide.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {relatedHubs.length > 0 && (
                <div className="glass rounded-3xl p-6 md:p-8">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/50 mb-4">Popular searches</h2>
                  <div className="flex flex-wrap gap-2">
                    {relatedHubs.map((relatedHub) => (
                      <Link
                        key={relatedHub.slug}
                        href={relatedHub.href}
                        className="rounded-full bg-brand-gold/15 text-brand-gold px-4 py-2 text-sm font-semibold hover:bg-brand-gold hover:text-neutral-900 transition-colors"
                      >
                        {relatedHub.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-neutral-900 text-white p-8 md:p-10 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{hub.ctaTitle}</h2>
            <p className="text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-8">{hub.ctaText}</p>
            <TrackedLink
              href={whatsappLink}
              eventName="whatsapp_inquiry_click"
              eventParams={{
                hub_slug: hub.slug,
                hub_title: hub.title,
                location: 'seo_hub_bottom_cta',
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-7 rounded-full transition-colors"
            >
              <MessageCircle size={20} />
              Ask on WhatsApp
            </TrackedLink>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
