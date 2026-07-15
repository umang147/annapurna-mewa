const DEFAULT_SITE_URL = 'https://annapurnamewa.com';

function getCanonicalSiteUrl() {
  const configuredUrl = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');

  if (/^https:\/\/annapurna-mewa\.vercel\.app\/?$/i.test(configuredUrl)) {
    return DEFAULT_SITE_URL;
  }

  return configuredUrl;
}

export const siteUrl = getCanonicalSiteUrl();

export const brandName = 'Annapurna Mewa';
export const defaultSeoDescription =
  'Buy premium dry fruits from Annapurna Mewa. Fresh, high-quality almonds, cashews, pistachios, raisins, makhana, and more with delivery in Bangalore and across India.';

export type ProductPriceOption = {
  weight?: string;
  price?: number;
};

export type SeoProduct = {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  description: string;
  category?: string;
  imagePath?: string;
  imagePaths?: string[];
  prices?: ProductPriceOption[];
};

export type BlogTextSpan = {
  _key?: string;
  _type?: 'span';
  text?: string;
  marks?: string[];
};

export type BlogMarkDef = {
  _key: string;
  _type: 'link' | 'internalProductLink';
  href?: string;
  blank?: boolean;
  product?: BlogRelatedProduct;
};

export type BlogBlock = {
  _key?: string;
  _type: 'block';
  style?: string;
  listItem?: 'bullet' | 'number';
  children?: BlogTextSpan[];
  markDefs?: BlogMarkDef[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogRelatedProduct = {
  _id?: string;
  name: string;
  slug: string;
  category?: string;
  imagePath?: string;
  prices?: ProductPriceOption[];
};

export type BlogTableRow = {
  label?: string;
  value?: string;
  note?: string;
};

export type BlogComparisonTable = {
  _key?: string;
  _type: 'comparisonTable';
  title?: string;
  rows?: BlogTableRow[];
};

export type BlogProductPriceTableItem = {
  _key?: string;
  label?: string;
  note?: string;
  product?: BlogRelatedProduct;
};

export type BlogProductPriceTable = {
  _key?: string;
  _type: 'productPriceTable';
  title?: string;
  intro?: string;
  products?: BlogProductPriceTableItem[];
};

export type BlogCta = {
  title?: string;
  text?: string;
  label?: string;
  href?: string;
};

export type BlogBodyItem = BlogBlock | BlogComparisonTable | BlogProductPriceTable;

export type SeoBlogPost = {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  targetKeyword?: string;
  secondaryKeywords?: string[];
  searchIntent?: 'informational' | 'commercial' | 'transactional' | 'local' | 'navigational';
  targetLocation?: string;
  metaTitle?: string;
  metaDescription?: string;
  quickAnswer?: string;
  keyTakeaways?: string[];
  publishedAt: string;
  updatedAt?: string;
  lastReviewedAt?: string;
  author?: string;
  authorTitle?: string;
  authorBio?: string;
  reviewedBy?: string;
  category?: string;
  coverImageAlt?: string;
  noIndex?: boolean;
  imagePath?: string;
  body?: BlogBodyItem[];
  faqs?: BlogFaq[];
  relatedProducts?: BlogRelatedProduct[];
  relatedCategories?: string[];
  cta?: BlogCta;
};

export function absoluteUrl(pathOrUrl = '/'): string {
  if (!pathOrUrl) {
    return siteUrl;
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return `${siteUrl}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export function jsonLdStringify(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function truncateDescription(text: string, maxLength = 155): string {
  const normalized = text.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function getBlogPostUrl(post: SeoBlogPost): string {
  return absoluteUrl(`/blog/${encodeURIComponent(post.slug || '')}`);
}

export function getBlogPostTitle(post: SeoBlogPost): string {
  return post.metaTitle?.trim() || `${post.title} | ${brandName}`;
}

export function getBlogPostDescription(post: SeoBlogPost): string {
  return truncateDescription(post.metaDescription || post.excerpt || defaultSeoDescription);
}

export function getBlogPostImage(post: SeoBlogPost): string {
  return absoluteUrl(post.imagePath || '/images/hero.png');
}

export function getBlogPostImageSource(post: SeoBlogPost): string {
  return post.imagePath || '/images/hero.png';
}

export function isValidBlogSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function estimateReadingTime(post: SeoBlogPost): number {
  const bodyText = post.body
    ?.flatMap((block) => {
      if (block._type === 'comparisonTable') {
        return block.rows?.flatMap((row) => [row.label, row.value, row.note]) || [];
      }

      if (block._type === 'productPriceTable') {
        return [
          block.title,
          block.intro,
          ...(block.products?.flatMap((item) => [item.label, item.note, item.product?.name]) || []),
        ];
      }

      return block.children?.map((child) => child.text || '') || [];
    })
    .join(' ') || '';
  const faqText = post.faqs?.map((faq) => `${faq.question} ${faq.answer}`).join(' ') || '';
  const takeawaysText = post.keyTakeaways?.join(' ') || '';
  const wordCount = `${post.title} ${post.excerpt} ${post.quickAnswer || ''} ${takeawaysText} ${bodyText} ${faqText}`
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / 200));
}

export function buildBlogPostingJsonLd(post: SeoBlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: getBlogPostDescription(post),
    image: [getBlogPostImage(post)],
    datePublished: post.publishedAt,
    dateModified: post.lastReviewedAt || post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Organization',
      name: post.author || brandName,
    },
    publisher: {
      '@type': 'Organization',
      name: brandName,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getBlogPostUrl(post),
    },
    ...(post.keyTakeaways?.length ? { about: post.keyTakeaways } : {}),
  };
}

export function buildFaqJsonLd(post: SeoBlogPost) {
  const faqs = (post.faqs || [])
    .filter((faq) => faq.question?.trim() && faq.answer?.trim());

  if (faqs.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getProductDescription(product: SeoProduct): string {
  if (product.description?.trim()) {
    return truncateDescription(product.description);
  }

  return `Buy ${product.name || 'premium dry fruits'} from ${brandName}. Fresh, high-quality dry fruits with delivery in Bangalore and across India.`;
}

export function getProductTitle(product: SeoProduct): string {
  const name = product.name || 'Premium Dry Fruits';
  const category = product.category ? ` ${product.category}` : '';

  return `${name} | Premium${category} in Bangalore | ${brandName}`;
}

export function getProductImages(product: SeoProduct): string[] {
  const images = [
    ...(product.imagePaths || []),
    product.imagePath,
  ].filter((image): image is string => Boolean(image));

  const usableImages = images.filter((image) => !image.includes('placeholder'));

  return (usableImages.length > 0 ? usableImages : ['/images/hero.png']).map(absoluteUrl);
}

export function getProductUrl(product: SeoProduct): string {
  return absoluteUrl(`/product/${encodeURIComponent(product.slug || '')}`);
}

export function isValidProductSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function buildProductJsonLd(product: SeoProduct) {
  const prices = (product.prices || [])
    .map((option) => option.price)
    .filter((price): price is number => typeof price === 'number' && price > 0);
  const lowPrice = prices.length > 0 ? Math.min(...prices) : undefined;
  const highPrice = prices.length > 0 ? Math.max(...prices) : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: getProductDescription(product),
    image: getProductImages(product),
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    category: product.category || 'Dry Fruits',
    url: getProductUrl(product),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: getProductUrl(product),
      ...(lowPrice ? { lowPrice } : {}),
      ...(highPrice ? { highPrice } : {}),
      offerCount: prices.length || undefined,
    },
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: brandName,
    url: siteUrl,
    logo: absoluteUrl('/logo.png'),
    image: absoluteUrl('/images/hero.png'),
    description: defaultSeoDescription,
    telephone: '+917259496740',
    email: 'shikhasinghania56.ss@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Bangalore',
      },
      {
        '@type': 'Country',
        name: 'India',
      },
    ],
    sameAs: ['https://chat.whatsapp.com/BqA4cJRFfP0K5Cg6hzb5tl'],
  };
}
