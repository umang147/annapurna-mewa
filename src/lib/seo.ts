const DEFAULT_SITE_URL = 'https://annapurnamewa.com';

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
).replace(/\/$/, '');

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

export function absoluteUrl(pathOrUrl = '/'): string {
  if (!pathOrUrl) {
    return siteUrl;
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return `${siteUrl}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export function truncateDescription(text: string, maxLength = 155): string {
  const normalized = text.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
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
