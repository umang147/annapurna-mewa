export type BlogGuideLink = {
  title: string;
  slug: string;
  href: string;
  description: string;
  keywords: string[];
};

export const BLOG_GUIDES: BlogGuideLink[] = [
  {
    title: 'Dry Fruits in Bangalore',
    slug: 'dry-fruits-in-bangalore',
    href: '/blog/dry-fruits-in-bangalore',
    description:
      'A local buying guide for choosing almonds, cashews, pistachios, makhana, raisins, walnuts, figs, and more in Bangalore.',
    keywords: [
      'almond',
      'almonds',
      'anjir',
      'apricot',
      'bangalore',
      'cashew',
      'cashews',
      'dry fruit',
      'dry fruits',
      'fig',
      'makhana',
      'pista',
      'pistachio',
      'raisin',
      'raisins',
      'walnut',
      'walnuts',
    ],
  },
  {
    title: 'Dry Fruits Price in Bangalore',
    slug: 'dry-fruits-price-in-bangalore',
    href: '/blog/dry-fruits-price-in-bangalore',
    description:
      'Compare dry fruit prices, pack sizes, and value signals before placing a bulk or family order in Bangalore.',
    keywords: [
      'almond',
      'badam',
      'cashew',
      'kaju',
      'price',
      'prices',
      'rate',
      'rates',
      'mamra',
      'makhana',
      'pista',
      'walnut',
      'wholesale',
    ],
  },
  {
    title: 'Where to Buy Premium Dry Fruits in Bangalore',
    slug: 'where-to-buy-premium-dry-fruits-in-bangalore',
    href: '/blog/where-to-buy-premium-dry-fruits-in-bangalore',
    description:
      'Learn what to check for freshness, quality, delivery, gifting, and daily consumption before buying premium dry fruits.',
    keywords: [
      'buy',
      'delivery',
      'fresh',
      'gift',
      'gifting',
      'premium',
      'quality',
      'where to buy',
    ],
  },
];

type RelatedGuideInput = {
  name?: string;
  category?: string;
  slug?: string;
  excludeSlug?: string;
  limit?: number;
};

export function getRelatedBlogGuides(input: RelatedGuideInput = {}) {
  const haystack = [input.name, input.category, input.slug]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const guides = BLOG_GUIDES.filter((guide) => guide.slug !== input.excludeSlug);

  if (!haystack) {
    return guides.slice(0, input.limit || 3);
  }

  return guides
    .map((guide, index) => ({
      guide,
      index,
      score: guide.keywords.reduce((score, keyword) => (
        haystack.includes(keyword.toLowerCase()) ? score + 1 : score
      ), 0),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, input.limit || 3)
    .map(({ guide }) => guide);
}
