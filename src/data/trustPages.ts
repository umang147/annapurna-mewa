import { absoluteUrl, brandName } from '@/lib/seo';

export type TrustPageSection = {
  title: string;
  body: string;
  bullets?: string[];
};

export type TrustPageFaq = {
  question: string;
  answer: string;
};

export type TrustPage = {
  slug: string;
  href: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heroTitle: string;
  heroText: string;
  quickAnswer: string;
  sections: TrustPageSection[];
  faqs: TrustPageFaq[];
  ctaTitle: string;
  ctaText: string;
  ctaMessage: string;
};

export const TRUST_PAGES = {
  about: {
    slug: 'about',
    href: '/about',
    title: 'About Annapurna Mewa',
    metaTitle: 'About Annapurna Mewa | Premium Dry Fruits in Bangalore',
    metaDescription:
      'Learn about Annapurna Mewa, a Bangalore dry fruits business helping customers choose premium almonds, cashews, pista, raisins, walnuts, figs and more.',
    eyebrow: 'About Annapurna Mewa',
    heroTitle: 'A practical dry fruits specialist for Bangalore buyers',
    heroText:
      'Annapurna Mewa helps customers choose fresh, premium dry fruits for daily snacking, family use, cooking, gifting and bulk enquiries.',
    quickAnswer:
      'Annapurna Mewa is a Bangalore-based premium dry fruits seller focused on practical buying guidance, current prices, product quality and WhatsApp-first customer support.',
    sections: [
      {
        title: 'What Annapurna Mewa helps with',
        body:
          'Buying dry fruits is easier when someone can explain product grade, pack size, use case and storage. Annapurna Mewa focuses on helping customers choose the right almonds, cashews, pista, makhana, raisins, figs, walnuts and apricots instead of pushing a generic pack.',
        bullets: [
          'Premium dry fruits for daily use, gifting and cooking',
          'Current pack-size and price guidance through product pages and WhatsApp',
          'Local Bangalore context with delivery support across India',
        ],
      },
      {
        title: 'Business identifiers',
        body:
          'Trust matters for food purchases. Annapurna Mewa displays business details clearly so customers and search engines can understand who is behind the site.',
        bullets: [
          'GST No.: 20ABSPA3006B1ZN',
          'FSSAI No.: 11121017000105',
          'Contact Person: Shikha Singhania',
        ],
      },
    ],
    faqs: [
      {
        question: 'Where is Annapurna Mewa based?',
        answer: 'Annapurna Mewa is based in Bangalore, India and supports dry fruit enquiries through WhatsApp.',
      },
      {
        question: 'What does Annapurna Mewa sell?',
        answer:
          'Annapurna Mewa sells premium dry fruits including almonds, cashews, pistachios, makhana, raisins, figs, walnuts, apricots and related products.',
      },
      {
        question: 'Can I ask for help before ordering?',
        answer:
          'Yes. Customers can ask on WhatsApp for current availability, pack sizes, prices, delivery and product recommendations.',
      },
    ],
    ctaTitle: 'Need help choosing dry fruits?',
    ctaText: 'Message Annapurna Mewa for product guidance, pack sizes, prices and availability.',
    ctaMessage: 'Hi Shikha, I want to know more about Annapurna Mewa and current dry fruit options.',
  },
  quality: {
    slug: 'quality-sourcing',
    href: '/quality-sourcing',
    title: 'Quality & Sourcing',
    metaTitle: 'Dry Fruit Quality & Sourcing | Annapurna Mewa',
    metaDescription:
      'Learn how Annapurna Mewa helps customers evaluate dry fruit freshness, aroma, texture, pack sizes and storage before buying.',
    eyebrow: 'Quality & Sourcing',
    heroTitle: 'How to judge dry fruit quality before you buy',
    heroText:
      'Good dry fruits should smell clean, feel fresh, match their grade and suit the way you plan to use them.',
    quickAnswer:
      'Dry fruit quality should be checked through aroma, texture, appearance, pack-size fit and storage guidance. Fresh products should not smell stale, oily, musty or damp.',
    sections: [
      {
        title: 'Freshness signals',
        body:
          'Different dry fruits have different textures, but freshness signals are consistent: clean aroma, natural appearance and a bite that does not feel flat or stale.',
        bullets: [
          'Almonds and cashews should have a clean bite',
          'Raisins, figs and apricots should feel naturally soft, not overly sticky',
          'Pista and walnuts should not smell stale or oily',
        ],
      },
      {
        title: 'Choose quality by use case',
        body:
          'Premium whole cashews make sense for gifting and serving. Split or broken cashews can be practical for sweets and cooking. Mamra almonds suit premium eating, while California almonds can be practical for daily family use.',
      },
    ],
    faqs: [
      {
        question: 'How can I tell if dry fruits are fresh?',
        answer:
          'Check for clean aroma, natural appearance and the expected texture. Avoid stale, oily, musty or damp smells.',
      },
      {
        question: 'Is the costliest dry fruit always the best?',
        answer:
          'No. The best product depends on freshness, grade and use case. A cooking grade can be better value for recipes, while premium whole products can suit gifting.',
      },
      {
        question: 'Why does storage guidance matter?',
        answer:
          'Dry fruits can lose texture or absorb moisture after opening, especially in warm or humid kitchens. Airtight storage helps preserve freshness.',
      },
    ],
    ctaTitle: 'Want a quality recommendation?',
    ctaText: 'Tell us whether you are buying for daily use, cooking, gifting or bulk use.',
    ctaMessage: 'Hi Shikha, can you help me choose dry fruits based on freshness and quality?',
  },
  shipping: {
    slug: 'shipping-delivery',
    href: '/shipping-delivery',
    title: 'Shipping & Delivery',
    metaTitle: 'Shipping & Delivery | Dry Fruits in Bangalore | Annapurna Mewa',
    metaDescription:
      'Check Annapurna Mewa delivery guidance for Bangalore and India-wide dry fruit orders, including availability, pack sizes and WhatsApp confirmation.',
    eyebrow: 'Shipping & Delivery',
    heroTitle: 'Dry fruits delivery guidance for Bangalore and India',
    heroText:
      'Confirm current availability, pack size, price and delivery timing before placing your dry fruits order.',
    quickAnswer:
      'Annapurna Mewa supports dry fruits enquiries for Bangalore and India-wide delivery. Delivery timing depends on location, product availability and order details, so WhatsApp confirmation is recommended before ordering.',
    sections: [
      {
        title: 'What to confirm before delivery',
        body:
          'Dry fruit prices and availability can move with market conditions. Confirm the exact product, pack size, current price, delivery location and timing before finalizing your order.',
        bullets: [
          'Product and grade',
          'Pack size and current price',
          'Delivery address and expected timing',
        ],
      },
      {
        title: 'Bangalore delivery context',
        body:
          'For Bangalore buyers, WhatsApp is the fastest way to confirm same-day feasibility, current availability and suitable products for daily use or gifting.',
      },
    ],
    faqs: [
      {
        question: 'Is same-day delivery available in Bangalore?',
        answer:
          'Same-day support depends on product availability, order timing and delivery location. Ask on WhatsApp to confirm.',
      },
      {
        question: 'Can Annapurna Mewa deliver outside Bangalore?',
        answer:
          'Annapurna Mewa supports India-wide dry fruit enquiries. Delivery options depend on location and order details.',
      },
      {
        question: 'Should I confirm prices before ordering?',
        answer:
          'Yes. Dry fruit prices can change with market rates, so confirm current prices before placing an order.',
      },
    ],
    ctaTitle: 'Check delivery before ordering',
    ctaText: 'Message your location, products and quantity to confirm current delivery support.',
    ctaMessage: 'Hi Shikha, can you confirm dry fruits delivery options for my location?',
  },
  returns: {
    slug: 'returns',
    href: '/returns',
    title: 'Returns & Order Support',
    metaTitle: 'Returns & Order Support | Annapurna Mewa',
    metaDescription:
      'Read Annapurna Mewa order support guidance for dry fruit purchases, including quality concerns, delivery issues and WhatsApp support.',
    eyebrow: 'Returns & Support',
    heroTitle: 'Order support for dry fruit purchases',
    heroText:
      'If something is unclear about a product, pack, price or delivery, contact Annapurna Mewa on WhatsApp for support.',
    quickAnswer:
      'For any dry fruit order concern, contact Annapurna Mewa promptly with the product name, pack size, order details and photos where relevant. Food product support depends on the specific issue and order condition.',
    sections: [
      {
        title: 'How to raise an order concern',
        body:
          'Dry fruits are food products, so support requests should be raised quickly and clearly. Share product name, pack size, order date, concern and photos if the issue is visual.',
        bullets: [
          'Product name and pack size',
          'Order or delivery details',
          'Clear photo or video if relevant',
        ],
      },
      {
        title: 'Quality concerns',
        body:
          'If a product seems stale, damaged or different from what was discussed, contact Annapurna Mewa as soon as possible so the issue can be reviewed with context.',
      },
    ],
    faqs: [
      {
        question: 'How do I contact support?',
        answer:
          'Message Annapurna Mewa on WhatsApp with your product name, pack size, order details and concern.',
      },
      {
        question: 'Can food products be returned?',
        answer:
          'Support depends on the specific product, issue and order condition. Raise concerns promptly for review.',
      },
      {
        question: 'What photos should I share for a quality concern?',
        answer:
          'Share clear photos of the pack, product and any visible issue, along with the order context.',
      },
    ],
    ctaTitle: 'Need order support?',
    ctaText: 'Send the product name, pack size and order concern on WhatsApp.',
    ctaMessage: 'Hi Shikha, I need help with a dry fruits order concern.',
  },
  bulk: {
    slug: 'bulk-orders',
    href: '/bulk-orders',
    title: 'Bulk Dry Fruit Orders',
    metaTitle: 'Bulk Dry Fruit Orders Bangalore | Annapurna Mewa',
    metaDescription:
      'Ask Annapurna Mewa about bulk dry fruit orders for family use, events, gifting, cooking and business needs in Bangalore and across India.',
    eyebrow: 'Bulk Orders',
    heroTitle: 'Bulk dry fruit orders for events, gifting and regular use',
    heroText:
      'Compare product grade, pack size, freshness and current rates before placing a larger dry fruit order.',
    quickAnswer:
      'Bulk dry fruit orders should be planned by use case: gifting, cooking, family use, event serving or business requirements. Confirm current rates, pack sizes, delivery feasibility and freshness before ordering.',
    sections: [
      {
        title: 'When bulk orders make sense',
        body:
          'Bulk buying can be useful for events, corporate gifting, family consumption, sweets, recipes and regular business use. The right product grade depends on the purpose.',
        bullets: [
          'Whole cashews, pista and premium almonds for gifting',
          'Split or broken cashews for sweets and cooking',
          'Balanced mixes for office or family snacking',
        ],
      },
      {
        title: 'What to confirm before bulk buying',
        body:
          'Ask for current price, available quantity, pack-size options, delivery support and storage guidance. Do not buy a large pack unless you can store it properly and use it while fresh.',
      },
    ],
    faqs: [
      {
        question: 'Can I order dry fruits in bulk?',
        answer:
          'Yes. Share the required products, quantity, use case and delivery location on WhatsApp to check current support.',
      },
      {
        question: 'Which dry fruits are good for bulk gifting?',
        answer:
          'Mamra almonds, whole cashews, pista, walnuts, figs, apricots and raisins can work well depending on budget and availability.',
      },
      {
        question: 'Do bulk prices change?',
        answer:
          'Yes. Bulk rates can change with product grade, market movement, quantity and availability.',
      },
    ],
    ctaTitle: 'Planning a bulk dry fruit order?',
    ctaText: 'Share your quantity, use case and location for current availability and pricing.',
    ctaMessage: 'Hi Shikha, I want to discuss a bulk dry fruit order.',
  },
} satisfies Record<string, TrustPage>;

export const TRUST_PAGE_LINKS = Object.values(TRUST_PAGES).map((page) => ({
  title: page.title,
  href: page.href,
}));

export function getTrustPageJsonLd(page: TrustPage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.metaDescription,
    url: absoluteUrl(page.href),
    isPartOf: {
      '@type': 'WebSite',
      name: brandName,
      url: absoluteUrl('/'),
    },
    about: {
      '@type': 'Organization',
      name: brandName,
      url: absoluteUrl('/'),
    },
  };
}

export function getTrustPageFaqJsonLd(page: TrustPage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
