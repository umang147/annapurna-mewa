import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, ChevronLeft, Clock, HelpCircle, Lightbulb, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrackedLink from '@/components/TrackedLink';
import { FALLBACK_BLOG_POSTS } from '@/data/blogPosts';
import { getRelatedBlogGuides } from '@/data/internalLinks';
import { client } from '@/sanity/lib/client';
import { blogPostBySlugQuery, blogPostSlugsQuery } from '@/sanity/lib/queries';
import {
  absoluteUrl,
  brandName,
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  estimateReadingTime,
  getBlogPostDescription,
  getBlogPostImage,
  getBlogPostImageSource,
  getBlogPostTitle,
  getBlogPostUrl,
  isValidBlogSlug,
  jsonLdStringify,
  ProductPriceOption,
  SeoBlogPost,
} from '@/lib/seo';

export const revalidate = 60;

async function getBlogPost(slug: string): Promise<SeoBlogPost | null> {
  const hasSanityConfig = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'yoursanityprojectid';

  if (hasSanityConfig) {
    const post = await client.fetch<SeoBlogPost | null>(blogPostBySlugQuery, { slug });
    if (post) {
      return post;
    }
  }

  return FALLBACK_BLOG_POSTS.find((post) => post.slug === slug) || null;
}

async function getBlogSlugs(): Promise<string[]> {
  const hasSanityConfig = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'yoursanityprojectid';
  const fallbackSlugs = FALLBACK_BLOG_POSTS.map((post) => post.slug);

  if (!hasSanityConfig) {
    return fallbackSlugs;
  }

  const sanitySlugs = await client.fetch<{ slug: string }[]>(blogPostSlugsQuery);
  return Array.from(new Set([...fallbackSlugs, ...sanitySlugs.map((post) => post.slug)]))
    .filter(isValidBlogSlug);
}

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: `Blog Post Not Found | ${brandName}`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = getBlogPostTitle(post);
  const description = getBlogPostDescription(post);
  const url = getBlogPostUrl(post);
  const image = getBlogPostImage(post);

  return {
    title,
    description,
    robots: post.noIndex
      ? {
          index: false,
          follow: true,
        }
      : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: brandName,
      locale: 'en_IN',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.coverImageAlt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

function getBlockText(block: NonNullable<SeoBlogPost['body']>[number]) {
  if (block._type !== 'block') {
    return block.title || '';
  }

  return block.children?.map((child) => child.text || '').join('') || '';
}

function toHeadingId(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

function formatPriceOptions(prices?: ProductPriceOption[]) {
  const validPrices = prices?.filter((price) => price.weight && typeof price.price === 'number') || [];

  if (validPrices.length === 0) {
    return 'Ask for current price';
  }

  return validPrices
    .map((price) => `${price.weight}: ${formatPrice(price.price as number)}`)
    .join(' / ');
}

function BlogBody({ post }: { post: SeoBlogPost }) {
  if (!post.body?.length) {
    return (
      <p className="text-lg text-foreground/75 leading-8">
        {post.excerpt}
      </p>
    );
  }

  return (
    <>
      {post.body.map((block, index) => {
        if (block._type === 'imageGallery') {
          const images = block.images?.filter((image) => image.imagePath) || [];

          if (images.length === 0) {
            return null;
          }

          return (
            <section key={block._key || `gallery-${index}`} className="my-10">
              {block.title && (
                <h2 className="mb-4 text-2xl font-serif font-bold text-foreground">{block.title}</h2>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {images.map((image, imageIndex) => (
                  <figure key={image._key || `${image.imagePath}-${imageIndex}`} className="overflow-hidden rounded-2xl border border-foreground/10 bg-white/50">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={image.imagePath as string}
                        alt={image.alt || ''}
                        fill
                        sizes="(min-width: 768px) 340px, 100vw"
                        className="object-cover"
                      />
                    </div>
                    {image.caption && (
                      <figcaption className="px-4 py-3 text-sm leading-6 text-foreground/60">{image.caption}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          );
        }

        if (block._type === 'comparisonTable') {
          return (
            <div key={block._key || `table-${index}`} className="my-10 overflow-hidden rounded-2xl border border-foreground/10 bg-white/50">
              {block.title && (
                <h2 className="px-5 py-4 text-xl font-serif font-bold text-foreground border-b border-foreground/10">
                  {block.title}
                </h2>
              )}
              <div className="divide-y divide-foreground/10">
                {block.rows?.map((row, rowIndex) => (
                  <div key={`${row.label}-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-5">
                    <div className="font-bold text-foreground">{row.label}</div>
                    <div className="text-foreground/75">{row.value}</div>
                    <div className="text-foreground/60">{row.note}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (block._type === 'productPriceTable') {
          return (
            <div key={block._key || `price-table-${index}`} className="my-10 overflow-hidden rounded-2xl border border-brand-gold/30 bg-white/60">
              <div className="px-5 py-4 border-b border-foreground/10">
                <h2 className="text-xl font-serif font-bold text-foreground">
                  {block.title || 'Current Annapurna Mewa prices'}
                </h2>
                <p className="mt-2 text-sm text-foreground/60 leading-6">
                  {block.intro || 'Prices are pulled from the current product catalog and may change with market rates and availability.'}
                </p>
              </div>
              <div className="divide-y divide-foreground/10">
                {block.products?.map((item, itemIndex) => {
                  const product = item.product;

                  if (!product?.slug) {
                    return null;
                  }

                  return (
                    <TrackedLink
                      key={item._key || product._id || `${product.slug}-${itemIndex}`}
                      href={`/product/${product.slug}`}
                      eventName="blog_product_click"
                      eventParams={{
                        blog_slug: post.slug,
                        product_slug: product.slug,
                        product_name: product.name,
                        product_category: product.category || '',
                        location: 'blog_live_price_table',
                      }}
                      className="grid grid-cols-1 gap-3 p-5 transition-colors hover:bg-brand-gold/10 md:grid-cols-[1.1fr_1.4fr]"
                    >
                      <div>
                        <h3 className="font-bold text-foreground">
                          {item.label || product.name}
                        </h3>
                        {product.category && (
                          <p className="text-sm text-foreground/50">{product.category}</p>
                        )}
                        {item.note && (
                          <p className="mt-2 text-sm text-foreground/60 leading-6">{item.note}</p>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-foreground/80 md:text-right">
                        {formatPriceOptions(product.prices)}
                      </div>
                    </TrackedLink>
                  );
                })}
              </div>
            </div>
          );
        }

        const text = getBlockText(block);
        const key = block._key || `${block.style}-${index}`;

        if (!text.trim()) {
          return null;
        }

        if (block.style === 'h2') {
          return (
            <h2 key={key} id={toHeadingId(text)} className="scroll-mt-28 text-3xl font-serif font-bold text-foreground mt-12 mb-4">
              {text}
            </h2>
          );
        }

        if (block.style === 'h3') {
          return (
            <h3 key={key} id={toHeadingId(text)} className="scroll-mt-28 text-2xl font-serif font-bold text-foreground mt-10 mb-3">
              {text}
            </h3>
          );
        }

        if (block.listItem === 'bullet') {
          return (
            <div key={key} className="flex gap-3 text-lg text-foreground/75 leading-8 mb-3">
              <span className="mt-3 h-2 w-2 rounded-full bg-brand-gold flex-shrink-0" />
              <InlineText block={block} />
            </div>
          );
        }

        if (block.listItem === 'number') {
          return (
            <div key={key} className="flex gap-3 text-lg text-foreground/75 leading-8 mb-3">
              <span className="text-brand-gold font-bold min-w-6">{index + 1}.</span>
              <InlineText block={block} />
            </div>
          );
        }

        if (block.style === 'blockquote') {
          return (
            <blockquote key={key} className="border-l-4 border-brand-gold pl-5 my-8 text-xl italic text-foreground/75">
              <InlineText block={block} />
            </blockquote>
          );
        }

        return (
          <p key={key} className="text-lg text-foreground/75 leading-8 mb-6">
            <InlineText block={block} />
          </p>
        );
      })}
    </>
  );
}

function InlineText({ block }: { block: Extract<NonNullable<SeoBlogPost['body']>[number], { _type: 'block' }> }) {
  const markDefs = block.markDefs || [];

  return (
    <>
      {block.children?.map((child, index) => {
        const content = child.text || '';
        const key = child._key || `${content}-${index}`;
        const linkMark = child.marks
          ?.map((mark) => markDefs.find((definition) => definition._key === mark))
          .find(Boolean);
        const isStrong = child.marks?.includes('strong');
        const isEm = child.marks?.includes('em');
        let node: ReactNode = content;

        if (isStrong) {
          node = <strong>{node}</strong>;
        }

        if (isEm) {
          node = <em>{node}</em>;
        }

        if (linkMark?._type === 'link' && linkMark.href) {
          node = (
            <a
              href={linkMark.href}
              target={linkMark.blank ? '_blank' : undefined}
              rel={linkMark.blank ? 'noopener noreferrer' : undefined}
              className="text-brand-red underline underline-offset-4 hover:text-red-700"
            >
              {node}
            </a>
          );
        }

        if (linkMark?._type === 'internalProductLink' && linkMark.product?.slug) {
          node = (
            <Link href={`/product/${linkMark.product.slug}`} className="text-brand-red underline underline-offset-4 hover:text-red-700">
              {node}
            </Link>
          );
        }

        return <span key={key}>{node}</span>;
      })}
    </>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isValidBlogSlug(slug)) {
    notFound();
  }

  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const blogPostingJsonLd = buildBlogPostingJsonLd(post);
  const faqJsonLd = buildFaqJsonLd(post);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Blog', url: absoluteUrl('/blog') },
    { name: post.title, url: getBlogPostUrl(post) },
  ]);
  const readingTime = estimateReadingTime(post);
  const relatedGuides = getRelatedBlogGuides({
    excludeSlug: post.slug,
    limit: 2,
  });
  const headings = (post.body || [])
    .filter((block) => block._type === 'block' && block.style === 'h2')
    .map((block) => getBlockText(block))
    .filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdStringify(blogPostingJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdStringify(faqJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdStringify(breadcrumbJsonLd) }}
      />
      <Header />

      <main className="flex-grow">
        <article>
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-brand-red hover:text-red-700 font-medium mb-8 transition-colors">
              <ChevronLeft size={20} /> Back to Blog
            </Link>

            <div className="text-center mb-10">
              {post.category && (
                <p className="text-brand-gold font-semibold uppercase tracking-[0.25em] text-sm mb-4">
                  {post.category}
                </p>
              )}
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
                {post.title}
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 leading-relaxed max-w-3xl mx-auto">
                {post.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-foreground/50">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={16} />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
                {post.updatedAt && (
                  <>
                    <span>•</span>
                    <span>Updated {formatDate(post.updatedAt)}</span>
                  </>
                )}
                <span>•</span>
                <span className="inline-flex items-center gap-2">
                  <Clock size={16} />
                  {readingTime} min read
                </span>
                <span>•</span>
                <span>{post.author || brandName}</span>
              </div>
            </div>

            {post.quickAnswer && (
              <div className="glass rounded-3xl p-6 md:p-8 mb-10 border border-brand-gold/30">
                <div className="flex items-center gap-3 mb-4 text-brand-gold">
                  <Lightbulb size={22} />
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Quick Answer</h2>
                </div>
                <p className="text-lg md:text-xl text-foreground/80 leading-8">
                  {post.quickAnswer}
                </p>
              </div>
            )}

            {post.keyTakeaways && post.keyTakeaways.length > 0 && (
              <div className="glass rounded-3xl p-6 md:p-8 mb-10">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/50 mb-4">
                  Key Takeaways
                </h2>
                <div className="grid gap-3">
                  {post.keyTakeaways.map((takeaway) => (
                    <div key={takeaway} className="flex gap-3 text-foreground/75">
                      <span className="mt-2 h-2 w-2 rounded-full bg-brand-red flex-shrink-0" />
                      <p>{takeaway}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {headings.length > 0 && (
              <nav className="mb-10 rounded-2xl border border-foreground/10 bg-white/40 p-5">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/50 mb-3">In this guide</p>
                <div className="grid gap-2">
                  {headings.map((heading) => (
                    <a key={heading} href={`#${toHeadingId(heading)}`} className="text-foreground/75 hover:text-brand-red transition-colors">
                      {heading}
                    </a>
                  ))}
                </div>
              </nav>
            )}

            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-neutral-900">
              <Image
                src={getBlogPostImageSource(post)}
                alt={post.coverImageAlt || post.title}
                fill
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </section>

          <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <div className="glass rounded-3xl p-6 md:p-10">
              <BlogBody post={post} />

              {(post.author || post.authorTitle || post.authorBio || post.reviewedBy || post.lastReviewedAt) && (
                <section className="mt-12 rounded-2xl bg-white/50 border border-foreground/10 p-6">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/50 mb-4">About this guide</h2>
                  <div className="space-y-2 text-foreground/70">
                    {post.author && (
                      <p>
                        <span className="font-semibold text-foreground">Author:</span> {post.author}
                        {post.authorTitle ? `, ${post.authorTitle}` : ''}
                      </p>
                    )}
                    {post.authorBio && <p>{post.authorBio}</p>}
                    {post.reviewedBy && (
                      <p><span className="font-semibold text-foreground">Reviewed by:</span> {post.reviewedBy}</p>
                    )}
                    {post.lastReviewedAt && (
                      <p><span className="font-semibold text-foreground">Last reviewed:</span> {formatDate(post.lastReviewedAt)}</p>
                    )}
                  </div>
                </section>
              )}

              {post.faqs && post.faqs.length > 0 && (
                <section className="mt-14">
                  <div className="flex items-center gap-3 mb-6">
                    <HelpCircle className="text-brand-gold" size={24} />
                    <h2 className="text-3xl font-serif font-bold text-foreground">FAQs</h2>
                  </div>
                  <div className="space-y-4">
                    {post.faqs.map((faq) => (
                      <div key={faq.question} className="rounded-2xl bg-white/50 border border-foreground/10 p-5">
                        <h3 className="font-bold text-lg text-foreground mb-2">{faq.question}</h3>
                        <p className="text-foreground/70 leading-7">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {post.relatedCategories && post.relatedCategories.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/50 mb-4">Related Topics</h2>
                  <div className="flex flex-wrap gap-2">
                    {post.relatedCategories.map((category) => (
                      <span key={category} className="rounded-full bg-brand-gold/15 text-brand-gold px-4 py-2 text-sm font-semibold">
                        {category}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {post.relatedProducts && post.relatedProducts.length > 0 && (
                <section className="mt-12">
                  <div className="flex items-center gap-3 mb-6">
                    <ShoppingBag className="text-brand-gold" size={24} />
                    <h2 className="text-3xl font-serif font-bold text-foreground">Related Products</h2>
                  </div>
                  <div className="grid gap-3">
                    {post.relatedProducts.map((product) => (
                      <TrackedLink
                        key={product._id || product.slug}
                        href={`/product/${product.slug}`}
                        eventName="blog_product_click"
                        eventParams={{
                          blog_slug: post.slug,
                          product_slug: product.slug,
                          product_name: product.name,
                          product_category: product.category || '',
                          location: 'blog_related_products',
                        }}
                        className="flex items-center justify-between gap-4 rounded-2xl bg-white/50 border border-foreground/10 p-4 hover:border-brand-gold/50 transition-colors"
                      >
                        <div>
                          <h3 className="font-bold text-foreground">{product.name}</h3>
                          {product.category && <p className="text-sm text-foreground/50">{product.category}</p>}
                          {product.prices && product.prices.length > 0 && (
                            <p className="mt-1 text-sm text-foreground/60">{formatPriceOptions(product.prices)}</p>
                          )}
                        </div>
                        <span className="text-brand-red font-semibold text-sm">View</span>
                      </TrackedLink>
                    ))}
                  </div>
                </section>
              )}

              {relatedGuides.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/50 mb-4">Related Guides</h2>
                  <div className="grid gap-3">
                    {relatedGuides.map((guide) => (
                      <Link
                        key={guide.slug}
                        href={guide.href}
                        className="group rounded-2xl bg-white/50 border border-foreground/10 p-5 hover:border-brand-gold/50 transition-colors"
                      >
                        <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-brand-red transition-colors">
                          {guide.title}
                        </h3>
                        <p className="mt-2 text-sm text-foreground/65 leading-6">
                          {guide.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-12 p-6 rounded-2xl bg-neutral-900 text-white">
                <h2 className="text-2xl font-serif font-bold mb-3">
                  {post.cta?.title || 'Explore premium dry fruits'}
                </h2>
                <p className="text-neutral-300 mb-5">
                  {post.cta?.text || 'Browse almonds, cashews, pistachios, raisins, makhana, walnuts, figs, and more from Annapurna Mewa.'}
                </p>
                {post.cta?.href?.startsWith('http') ? (
                  <TrackedLink
                    href={post.cta.href}
                    eventName={post.cta.href.includes('wa.me') || post.cta.href.includes('whatsapp.com') ? 'whatsapp_inquiry_click' : 'cta_click'}
                    eventParams={{
                      blog_slug: post.slug,
                      cta_label: post.cta.label || 'Ask on WhatsApp',
                      location: 'blog_bottom_cta',
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-brand-red hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
                  >
                    {post.cta.label || 'Ask on WhatsApp'}
                  </TrackedLink>
                ) : (
                  <TrackedLink
                    href={post.cta?.href || '/#products'}
                    eventName="cta_click"
                    eventParams={{
                      blog_slug: post.slug,
                      cta_label: post.cta?.label || 'View Catalog',
                      location: 'blog_bottom_cta',
                    }}
                    className="inline-flex items-center justify-center bg-brand-red hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
                  >
                    {post.cta?.label || 'View Catalog'}
                  </TrackedLink>
                )}
              </div>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
