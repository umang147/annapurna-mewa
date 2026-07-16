export type SeoHubSection = {
  title: string;
  body: string;
  bullets?: string[];
};

export type SeoHubFaq = {
  question: string;
  answer: string;
};

export type SeoHub = {
  slug: string;
  href: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heroTitle: string;
  heroText: string;
  quickAnswer: string;
  productIntro: string;
  productKeywords: string[];
  sections: SeoHubSection[];
  faqs: SeoHubFaq[];
  relatedBlogSlugs: string[];
  relatedHubSlugs: string[];
  ctaTitle: string;
  ctaText: string;
  ctaMessage: string;
};

export const SEO_HUBS: SeoHub[] = [
  {
    slug: 'dry-fruits-in-bangalore',
    href: '/dry-fruits-in-bangalore',
    title: 'Dry Fruits in Bangalore',
    metaTitle: 'Dry Fruits in Bangalore | Premium Dry Fruits Delivery | Annapurna Mewa',
    metaDescription:
      'Buy premium dry fruits in Bangalore from Annapurna Mewa. Explore almonds, cashews, pistachios, raisins, makhana, walnuts, figs, prices, and WhatsApp ordering.',
    eyebrow: 'Bangalore Dry Fruits',
    heroTitle: 'Premium dry fruits in Bangalore, selected for daily use and gifting',
    heroText:
      'Browse fresh almonds, cashews, pistachios, makhana, raisins, walnuts, figs, apricots, and more with practical buying guidance from Annapurna Mewa.',
    quickAnswer:
      'If you are buying dry fruits in Bangalore, start with freshness, product grade, pack size, and current price. Annapurna Mewa helps you compare premium dry fruits and ask directly on WhatsApp before ordering.',
    productIntro:
      'Popular dry fruits for Bangalore customers include almonds, cashews, pista, makhana, kishmish, walnuts, anjir, and apricots.',
    productKeywords: ['almond', 'cashew', 'pista', 'pistachio', 'makhana', 'kishmish', 'raisin', 'walnut', 'anjir', 'fig', 'apricot'],
    sections: [
      {
        title: 'What to check before buying',
        body: 'Dry fruits should smell clean, look consistent, and match the use case. Daily snacking, gifting, cooking, and family nutrition may need different products and pack sizes.',
        bullets: ['Clean aroma without stale or oily smell', 'Crisp texture for nuts and natural softness for raisins or figs', 'Transparent pack sizes and current pricing'],
      },
      {
        title: 'Why local buying context matters',
        body: 'Bangalore weather, delivery speed, and storage habits affect how dry fruits feel after opening. A local seller can guide you on what to buy, how much to buy, and how to store it.',
      },
    ],
    faqs: [
      {
        question: 'Where can I buy dry fruits in Bangalore?',
        answer: 'You can buy dry fruits in Bangalore from Annapurna Mewa and ask for current availability, prices, pack sizes, and delivery support on WhatsApp.',
      },
      {
        question: 'Which dry fruits are popular for daily use?',
        answer: 'Almonds, cashews, pistachios, walnuts, makhana, raisins, figs, and apricots are popular options for daily snacking and family use.',
      },
      {
        question: 'Can I ask for current prices before ordering?',
        answer: 'Yes. Dry fruit prices can move with market conditions, so it is best to confirm current prices on the product page or through WhatsApp.',
      },
    ],
    relatedBlogSlugs: ['dry-fruits-in-bangalore', 'dry-fruits-price-in-bangalore', 'where-to-buy-premium-dry-fruits-in-bangalore'],
    relatedHubSlugs: ['dry-fruits-price-list-bangalore', 'premium-dry-fruits', 'same-day-dry-fruits-delivery-bangalore'],
    ctaTitle: 'Need help choosing dry fruits?',
    ctaText: 'Message Annapurna Mewa to check current availability and get practical product guidance.',
    ctaMessage: 'Hi Shikha, I am looking for premium dry fruits in Bangalore. Can you help me choose the right products?',
  },
  {
    slug: 'dry-fruits-price-list-bangalore',
    href: '/dry-fruits-price-list-bangalore',
    title: 'Dry Fruits Price List Bangalore',
    metaTitle: 'Dry Fruits Price List Bangalore | Almond, Cashew, Pista Prices',
    metaDescription:
      'Check Annapurna Mewa dry fruit prices in Bangalore across almonds, cashews, pistachios, raisins, makhana, walnuts, figs, and more.',
    eyebrow: 'Current Price Guide',
    heroTitle: 'Dry fruits price list for Bangalore buyers',
    heroText:
      'Compare pack sizes and product options before you order. Prices may change with market rates, so use WhatsApp for final confirmation.',
    quickAnswer:
      'Dry fruit prices depend on product grade, pack size, freshness, crop supply, and market movement. Use this page to compare product options, then confirm today’s price before ordering.',
    productIntro:
      'Use these product cards as a live catalog reference. For exact availability and today’s price, ask Annapurna Mewa on WhatsApp.',
    productKeywords: ['almond', 'badam', 'cashew', 'kaju', 'pista', 'pistachio', 'makhana', 'raisin', 'kishmish', 'walnut', 'anjir', 'apricot'],
    sections: [
      {
        title: 'Why dry fruit prices change',
        body: 'Prices can change because of seasonality, crop quality, import costs, product grade, demand, and pack size. Premium products usually cost more because consistency and freshness matter.',
      },
      {
        title: 'How to compare value',
        body: 'Do not compare only the lowest price. Compare aroma, texture, grade, use case, and how quickly you will consume the pack.',
        bullets: ['Small packs are useful for trial orders', 'Larger packs can be better for regular family use', 'Premium grades are better for gifting and special use'],
      },
    ],
    faqs: [
      {
        question: 'Are dry fruit prices fixed?',
        answer: 'No. Dry fruit prices may change with market rates and availability. Confirm current price before ordering.',
      },
      {
        question: 'Which dry fruits are usually costlier?',
        answer: 'Premium mamra almonds, high-grade pistachios, walnuts, figs, and large cashews often cost more depending on grade and market conditions.',
      },
      {
        question: 'Can I order different pack sizes?',
        answer: 'Many products have multiple pack sizes. Check the product page or ask on WhatsApp for current pack options.',
      },
    ],
    relatedBlogSlugs: ['dry-fruits-price-in-bangalore', 'dry-fruits-in-bangalore'],
    relatedHubSlugs: ['dry-fruits-in-bangalore', 'premium-dry-fruits', 'same-day-dry-fruits-delivery-bangalore'],
    ctaTitle: 'Want today’s price?',
    ctaText: 'Ask for current prices, pack sizes, and availability before ordering.',
    ctaMessage: 'Hi Shikha, can you share today’s dry fruits price list and available pack sizes?',
  },
  {
    slug: 'premium-dry-fruits',
    href: '/premium-dry-fruits',
    title: 'Premium Dry Fruits',
    metaTitle: 'Premium Dry Fruits | Almonds, Cashews, Pista, Walnuts | Annapurna Mewa',
    metaDescription:
      'Explore premium dry fruits from Annapurna Mewa including almonds, cashews, pistachios, walnuts, figs, raisins, makhana, and apricots.',
    eyebrow: 'Premium Selection',
    heroTitle: 'Premium dry fruits for daily nutrition, gifting, and special use',
    heroText:
      'Choose dry fruits with better freshness, texture, and use-case fit instead of buying only by price.',
    quickAnswer:
      'Premium dry fruits should have clean aroma, consistent texture, good appearance, and clear pack information. The best choice depends on whether you are buying for daily snacking, gifting, cooking, or family nutrition.',
    productIntro:
      'Explore premium almonds, cashews, pistachios, walnuts, figs, raisins, makhana, and apricots from the Annapurna Mewa catalog.',
    productKeywords: ['premium', 'almond', 'mamra', 'cashew', 'pista', 'pistachio', 'walnut', 'anjir', 'fig', 'makhana', 'apricot'],
    sections: [
      {
        title: 'What makes dry fruits premium',
        body: 'Premium quality is about freshness, texture, consistency, and suitability for the use case. A product that works well for cooking may not be the best gifting product.',
        bullets: ['Clean, natural smell', 'Consistent bite and appearance', 'Clear grade and pack-size guidance'],
      },
      {
        title: 'Choose by occasion',
        body: 'For daily nutrition, balanced packs of almonds, walnuts, raisins, and makhana work well. For gifting, appearance and variety matter more. For cooking, split or broken grades can be practical.',
      },
    ],
    faqs: [
      {
        question: 'Which dry fruits are considered premium?',
        answer: 'Premium mamra almonds, large cashews, pistachios, walnuts, figs, and clean-grade raisins are commonly selected for premium use.',
      },
      {
        question: 'Are premium dry fruits good for gifting?',
        answer: 'Yes. Premium dry fruits are popular for gifting because they look better, taste fresher, and feel more thoughtful than generic packs.',
      },
      {
        question: 'How should I choose premium dry fruits?',
        answer: 'Choose based on freshness, aroma, texture, appearance, pack size, budget, and whether the product is for snacking, gifting, or cooking.',
      },
    ],
    relatedBlogSlugs: ['where-to-buy-premium-dry-fruits-in-bangalore', 'dry-fruits-in-bangalore'],
    relatedHubSlugs: ['dry-fruits-in-bangalore', 'dry-fruit-gift-boxes-bangalore', 'dry-fruits-price-list-bangalore'],
    ctaTitle: 'Looking for a premium selection?',
    ctaText: 'Ask Annapurna Mewa for product suggestions based on your use case and budget.',
    ctaMessage: 'Hi Shikha, I want to buy premium dry fruits. Can you suggest the best options?',
  },
  {
    slug: 'dry-fruit-gift-boxes-bangalore',
    href: '/dry-fruit-gift-boxes-bangalore',
    title: 'Dry Fruit Gift Boxes Bangalore',
    metaTitle: 'Dry Fruit Gift Boxes Bangalore | Premium Gifting | Annapurna Mewa',
    metaDescription:
      'Plan premium dry fruit gifting in Bangalore with almonds, cashews, pistachios, walnuts, figs, raisins, and custom product guidance from Annapurna Mewa.',
    eyebrow: 'Gifting Guide',
    heroTitle: 'Dry fruit gifting in Bangalore, built around quality and occasion',
    heroText:
      'Choose premium dry fruits for festivals, family gifting, corporate gifting, housewarming, and thoughtful everyday presents.',
    quickAnswer:
      'Good dry fruit gifting depends on freshness, appearance, variety, pack size, and recipient preference. Premium almonds, cashews, pistachios, walnuts, figs, and raisins are strong gifting options.',
    productIntro:
      'For gifting, prioritize products with strong appearance and broad appeal: mamra almonds, cashews, pistachios, walnuts, figs, raisins, and apricots.',
    productKeywords: ['mamra', 'almond', 'cashew', 'pista', 'pistachio', 'walnut', 'anjir', 'fig', 'raisin', 'kishmish', 'apricot'],
    sections: [
      {
        title: 'How to choose dry fruits for gifting',
        body: 'A gifting pack should feel fresh, premium, and balanced. Choose variety if the recipient’s taste is unknown, and choose premium grades when presentation matters.',
        bullets: ['Use almonds and cashews for broad appeal', 'Add pista, walnuts, figs, or apricots for premium feel', 'Confirm freshness and pack timing before gifting'],
      },
      {
        title: 'When dry fruit gifting works best',
        body: 'Dry fruits work well for festive gifting, family visits, housewarming, corporate appreciation, and health-conscious gifts because they are useful, shareable, and premium.',
      },
    ],
    faqs: [
      {
        question: 'Which dry fruits are best for gifting?',
        answer: 'Almonds, cashews, pistachios, walnuts, figs, raisins, and apricots are strong gifting choices.',
      },
      {
        question: 'Can I ask for gifting recommendations?',
        answer: 'Yes. Share the occasion, budget, and quantity on WhatsApp and Annapurna Mewa can suggest suitable products.',
      },
      {
        question: 'Are dry fruits good for corporate gifting?',
        answer: 'Yes. Dry fruits are useful and premium, making them suitable for festive and corporate gifting.',
      },
    ],
    relatedBlogSlugs: ['where-to-buy-premium-dry-fruits-in-bangalore', 'dry-fruits-in-bangalore'],
    relatedHubSlugs: ['premium-dry-fruits', 'dry-fruits-in-bangalore', 'dry-fruits-price-list-bangalore'],
    ctaTitle: 'Planning dry fruit gifting?',
    ctaText: 'Message Annapurna Mewa with your occasion and budget to shortlist good gifting options.',
    ctaMessage: 'Hi Shikha, I am planning dry fruit gifting in Bangalore. Can you suggest good options?',
  },
  {
    slug: 'same-day-dry-fruits-delivery-bangalore',
    href: '/same-day-dry-fruits-delivery-bangalore',
    title: 'Same-Day Dry Fruits Delivery Bangalore',
    metaTitle: 'Same-Day Dry Fruits Delivery Bangalore | Annapurna Mewa',
    metaDescription:
      'Ask Annapurna Mewa for dry fruits delivery in Bangalore. Check current availability, pack sizes, prices, and delivery support through WhatsApp.',
    eyebrow: 'Bangalore Delivery',
    heroTitle: 'Dry fruits delivery in Bangalore with WhatsApp-first ordering',
    heroText:
      'Check current products, prices, pack sizes, and delivery availability directly before placing your order.',
    quickAnswer:
      'For dry fruits delivery in Bangalore, confirm product availability, pack size, current price, and delivery timing before ordering. WhatsApp is the fastest way to check what is available today.',
    productIntro:
      'Browse available dry fruits and ask on WhatsApp for current delivery support in Bangalore.',
    productKeywords: ['almond', 'cashew', 'pista', 'pistachio', 'makhana', 'raisin', 'kishmish', 'walnut', 'anjir', 'apricot'],
    sections: [
      {
        title: 'What to confirm before delivery',
        body: 'Before ordering, confirm the exact product, pack size, price, delivery location, and expected delivery timing.',
        bullets: ['Product and pack size', 'Current price and availability', 'Delivery area and timing'],
      },
      {
        title: 'Why WhatsApp ordering helps',
        body: 'Dry fruits are market-linked products. WhatsApp makes it easier to confirm freshness, availability, and delivery support before you commit.',
      },
    ],
    faqs: [
      {
        question: 'Is same-day dry fruits delivery available in Bangalore?',
        answer: 'Delivery timing depends on current availability and location. Ask on WhatsApp to confirm same-day support.',
      },
      {
        question: 'Can I confirm prices before delivery?',
        answer: 'Yes. You can confirm current prices and pack sizes before placing an order.',
      },
      {
        question: 'Can I order dry fruits for gifting delivery?',
        answer: 'Yes. Share the occasion, preferred products, budget, and delivery location on WhatsApp for guidance.',
      },
    ],
    relatedBlogSlugs: ['dry-fruits-in-bangalore', 'where-to-buy-premium-dry-fruits-in-bangalore'],
    relatedHubSlugs: ['dry-fruits-in-bangalore', 'dry-fruit-gift-boxes-bangalore', 'dry-fruits-price-list-bangalore'],
    ctaTitle: 'Check delivery availability',
    ctaText: 'Message Annapurna Mewa with your location and products to confirm delivery support.',
    ctaMessage: 'Hi Shikha, I want dry fruits delivery in Bangalore. Can you confirm availability and delivery timing?',
  },
];

export function getSeoHub(slug: string) {
  return SEO_HUBS.find((hub) => hub.slug === slug) || null;
}

export function getRelatedSeoHubs(slugs: string[]) {
  return slugs
    .map((slug) => getSeoHub(slug))
    .filter((hub): hub is SeoHub => Boolean(hub));
}
