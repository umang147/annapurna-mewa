export type BlogGuideLink = {
  title: string;
  slug: string;
  href: string;
  description: string;
  keywords: string[];
};

export const BLOG_GUIDES: BlogGuideLink[] = [
  {
    title: 'Dry Fruits Price List Today',
    slug: 'dry-fruits-price-list-today',
    href: '/blog/dry-fruits-price-list-today',
    description:
      'Understand why dry fruit rates change monthly and compare current live prices for almonds, cashews, pista, walnuts, raisins, figs, and more.',
    keywords: [
      'price',
      'prices',
      'rate',
      'rates',
      'price list',
      'today',
      'almond',
      'badam',
      'cashew',
      'kaju',
      'pista',
      'walnut',
      'kishmish',
      'anjir',
    ],
  },
  {
    title: 'Mamra Badam Price Guide',
    slug: 'mamra-badam-price-guide',
    href: '/blog/mamra-badam-price-guide',
    description:
      'Learn what affects Mamra badam price, how to compare it with California almonds, and what quality checks matter before buying.',
    keywords: [
      'almond',
      'almonds',
      'badam',
      'mamra',
      'mamra badam',
      'gurbandi',
      'price',
      'rate',
      'quality',
    ],
  },
  {
    title: 'Cashew Price 1kg Guide',
    slug: 'cashew-price-1kg-guide',
    href: '/blog/cashew-price-1kg-guide',
    description:
      'Compare whole, split, and broken kaju prices and choose the right cashew grade for snacking, gifting, cooking, or sweets.',
    keywords: [
      'cashew',
      'cashews',
      'kaju',
      'price',
      'rate',
      '1kg',
      '1 kg',
      'split',
      'broken',
      'cooking',
    ],
  },
  {
    title: 'Dry Fruits Gift Box Guide',
    slug: 'dry-fruits-gift-box-guide',
    href: '/blog/dry-fruits-gift-box-guide',
    description:
      'Choose what to include in a premium dry fruits gift box for family gifting, festive gifting, office gifting, or client gifting.',
    keywords: [
      'gift',
      'gifting',
      'gift box',
      'gift pack',
      'hamper',
      'almond',
      'cashew',
      'pista',
      'walnut',
      'anjir',
      'apricot',
    ],
  },
  {
    title: 'Mixed Dry Fruits Guide',
    slug: 'mixed-dry-fruits-guide',
    href: '/blog/mixed-dry-fruits-guide',
    description:
      'Build better mixed dry fruits for daily snacking and gifting with almonds, cashews, pista, walnuts, raisins, figs, apricots, and makhana.',
    keywords: [
      'mix',
      'mixed',
      'mixture',
      'trail mix',
      'daily use',
      'snacking',
      'gift',
      'almond',
      'cashew',
      'kishmish',
      'anjir',
      'apricot',
      'makhana',
    ],
  },
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
    title: 'Mamra Badam Guide',
    slug: 'mamra-badam-guide',
    href: '/blog/mamra-badam-guide',
    description:
      'Compare Mamra badam with California almonds, check quality signals, understand price factors, and choose the right almond for daily use or gifting.',
    keywords: [
      'almond',
      'almonds',
      'badam',
      'california almond',
      'daily use',
      'gift',
      'gifting',
      'mamra',
      'mamra badam',
      'premium',
      'price',
      'quality',
    ],
  },
  {
    title: 'Raisins, Figs, Apricots Comparison',
    slug: 'raisins-figs-apricots-which-dried-fruit-to-buy',
    href: '/blog/raisins-figs-apricots-which-dried-fruit-to-buy',
    description:
      'Compare Kishmish, Anjir, and Apricot by taste, texture, price band, storage, gifting fit, and daily-use buying needs.',
    keywords: [
      'anjir',
      'apricot',
      'dried fruit',
      'dried fruits',
      'fig',
      'figs',
      'gift',
      'gifting',
      'kishmish',
      'raisin',
      'raisins',
      'storage',
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
