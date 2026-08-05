import fs from 'node:fs';
import path from 'node:path';

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const index = line.indexOf('=');
        const key = line.slice(0, index).trim();
        const value = line
          .slice(index + 1)
          .trim()
          .replace(/^['"]|['"]$/g, '');
        return [key, value];
      }),
  );
}

const localEnv = readEnvFile(path.join(process.cwd(), '.env.local'));
const sanityConfigPath = path.join(process.env.HOME || '', '.config/sanity/config.json');
const sanityConfig = fs.existsSync(sanityConfigPath)
  ? JSON.parse(fs.readFileSync(sanityConfigPath, 'utf8'))
  : {};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || localEnv.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || localEnv.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_AUTH_TOKEN || localEnv.SANITY_AUTH_TOKEN || sanityConfig.authToken;

if (!projectId || !dataset || !token) {
  throw new Error('Missing Sanity project ID, dataset, or auth token.');
}

const apiVersion = '2026-07-30';
const apiBase = `https://${projectId}.api.sanity.io/v${apiVersion}`;

async function sanityRequest(pathname, init = {}) {
  const response = await fetch(`${apiBase}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Sanity API ${response.status}: ${text}`);
  }

  return response.json();
}

const client = {
  async createOrReplace(document) {
    return sanityRequest(`/data/mutate/${dataset}?returnDocuments=false`, {
      method: 'POST',
      body: JSON.stringify({ mutations: [{ createOrReplace: document }] }),
    });
  },
  async fetch(query) {
    const params = new URLSearchParams({ query });
    const result = await sanityRequest(`/data/query/${dataset}?${params.toString()}`);
    return result.result;
  },
};

const products = {
  premiumMamra: 'dcpUyvJvVcIBlbaP2bMPCU',
  californiaAlmond: 'hOY4QT6kgIcd7unpKyfQ26',
  premiumCashew: 'hOY4QT6kgIcd7unpKyfRrB',
  splitCashew3pcs: '2bc65165-2942-45d9-97fa-8e9cfba5a2fd',
  brokenCashew4pcs: 'd8bb5848-261c-4e79-9a59-7426762b5d54',
  californiaSaltedPista: 'hOY4QT6kgIcd7unpKyfQJI',
  nonSaltedPista: 'hOY4QT6kgIcd7unpKyfQf7',
  premiumWalnut: 'n6JOdPJzF7vQOhozSyOthu',
  makhanaBigSize: 'dcpUyvJvVcIBlbaP2bMn7e',
  kishmish: 'hOY4QT6kgIcd7unpKyfQzc',
  anjir: 'dcpUyvJvVcIBlbaP2bMu0l',
  apricot: 'n6JOdPJzF7vQOhozSyOj3Q',
};

function span(key, text, marks = []) {
  return { _type: 'span', _key: key, text, marks };
}

function block(key, text, style = 'normal', markDefs = []) {
  return {
    _type: 'block',
    _key: key,
    style,
    markDefs,
    children: [span(`${key}-span`, text)],
  };
}

function markedBlock(key, children, markDefs = [], style = 'normal') {
  return {
    _type: 'block',
    _key: key,
    style,
    markDefs,
    children,
  };
}

function bullet(key, text) {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    listItem: 'bullet',
    children: [span(`${key}-span`, text)],
  };
}

function linkMark(key, href, blank = false) {
  return { _key: key, _type: 'link', href, blank };
}

function productLinkMark(key, productId) {
  return {
    _key: key,
    _type: 'internalProductLink',
    product: { _type: 'reference', _ref: productId },
  };
}

function productRef(_key, productId, label, note) {
  return {
    _key,
    label,
    note,
    product: { _type: 'reference', _ref: productId },
  };
}

function relatedProduct(_key, productId) {
  return { _key, _type: 'reference', _ref: productId };
}

function comparisonTable(_key, title, rows) {
  return {
    _type: 'comparisonTable',
    _key,
    title,
    rows: rows.map((row, index) => ({
      _key: `${_key}-row-${index + 1}`,
      ...row,
    })),
  };
}

function priceTable(_key, title, intro, rows) {
  return {
    _type: 'productPriceTable',
    _key,
    title,
    intro,
    products: rows,
  };
}

const authorBio =
  'Annapurna Mewa helps customers choose premium dry fruits by freshness, grade, use case, pack size, and current market price.';
const publishedAt = '2026-08-05T00:00:00.000Z';

const posts = [
  {
    _id: 'blogPost-dry-fruits-price-list-today',
    _type: 'blogPost',
    title: 'Dry Fruits Price List Today: Why Rates Change Monthly',
    slug: { _type: 'slug', current: 'dry-fruits-price-list-today' },
    excerpt:
      'A practical guide to reading dry fruits price lists, comparing current rates, and understanding why almond, cashew, pista, walnut and Mamra prices change.',
    targetKeyword: 'dry fruits price list today',
    secondaryKeywords: [
      'dry fruits rates',
      'dry fruits market price today',
      'dry fruits price in bangalore',
      'dry fruits price list bangalore',
    ],
    searchIntent: 'commercial',
    targetLocation: 'Bangalore',
    metaTitle: 'Dry Fruits Price List Today: Rates & Buying Guide',
    metaDescription:
      'Check how dry fruit rates change, compare live Annapurna Mewa prices, and choose almonds, cashews, pista, walnuts, Mamra, raisins and figs.',
    quickAnswer:
      'A dry fruits price list is useful only when it is current, because rates can move with crop supply, import cost, grade, demand, and pack size. Compare products by quality and use case, not only by the lowest price. Annapurna Mewa uses live product records for current prices so older article text does not become stale.',
    keyTakeaways: [
      'Dry fruit rates can change monthly, especially for premium almonds, cashews, pista, walnuts and figs.',
      'Compare price by grade, pack size, freshness and intended use.',
      'Live product tables are safer than static price paragraphs.',
      'For Bangalore buyers, storage and delivery context matter along with rate.',
    ],
    publishedAt,
    lastReviewedAt: publishedAt,
    author: 'Annapurna Mewa',
    authorTitle: 'Premium Dry Fruits Specialist',
    authorBio,
    category: 'Price Guide',
    noIndex: false,
    coverImageAlt: 'Current dry fruits price list guide for Bangalore buyers',
    body: [
      markedBlock(
        'intro',
        [
          span('intro-1', 'When people search for a dry fruits price list today, they usually want a current buying reference, not an old rate chart. Prices for '),
          span('intro-2', 'Premium Mamra', ['premium-mamra-link']),
          span('intro-3', ', '),
          span('intro-4', 'California Almond', ['california-almond-link']),
          span('intro-5', ', cashews, pista, walnuts, kishmish, anjir and apricots can change with market supply and product grade. Use this guide to compare current rates without losing sight of quality.'),
        ],
        [
          productLinkMark('premium-mamra-link', products.premiumMamra),
          productLinkMark('california-almond-link', products.californiaAlmond),
        ],
      ),
      block('current-prices-heading', 'Current Annapurna Mewa prices', 'h2'),
      priceTable(
        'live-price-table',
        'Live dry fruits price table',
        'These rows are pulled from live Sanity product records. Prices may change with market rates, grade and availability.',
        [
          productRef('premium-mamra-row', products.premiumMamra, 'Premium Mamra', 'Premium almond option with a richer bite and higher price band.'),
          productRef('california-almond-row', products.californiaAlmond, 'California Almond', 'Practical daily-use almond option.'),
          productRef('premium-cashew-row', products.premiumCashew, 'Premium Cashew', 'Whole cashews for snacking and gifting.'),
          productRef('split-cashew-row', products.splitCashew3pcs, '3pcs split cashew', 'Useful for sweets, cooking and recipes.'),
          productRef('broken-cashew-row', products.brokenCashew4pcs, '4pcs broken Cashew', 'Practical cashew grade when appearance is less important.'),
          productRef('salted-pista-row', products.californiaSaltedPista, 'California Salted Pista', 'Ready-to-snack salted pista.'),
          productRef('walnut-row', products.premiumWalnut, 'Premium Walnut', 'Fresh walnut kernels for snacking and recipes.'),
          productRef('kishmish-row', products.kishmish, 'Kishmish', 'Naturally sweet raisins for snacking and mixes.'),
          productRef('anjir-row', products.anjir, 'Anjir', 'Premium dried figs for gifting and dried-fruit mixes.'),
          productRef('apricot-row', products.apricot, 'Apricot', 'Soft dried fruit option for snacking and mixes.'),
          productRef('makhana-row', products.makhanaBigSize, 'Makhana big size', 'Light snack option for roasting and fasting snacks.'),
        ],
      ),
      block('why-rates-change-heading', 'Why dry fruits rates change', 'h2'),
      block(
        'why-rates-change-body',
        'Dry fruits are agricultural and traded products, so the rate is affected by crop size, import route, demand, grade, sorting, processing, packaging and freshness. A lower price can be reasonable for a cooking grade, but the same logic may not work for gifting or premium daily snacking.',
      ),
      comparisonTable('rate-driver-table', 'Price drivers to compare', [
        { label: 'Grade', value: 'Whole, split, broken, size and appearance', note: 'Whole premium products usually cost more.' },
        { label: 'Use case', value: 'Daily use, cooking, gifting or premium snacking', note: 'The right value depends on purpose.' },
        { label: 'Freshness', value: 'Clean aroma and texture', note: 'Avoid stale, oily or damp-smelling packs.' },
        { label: 'Pack size', value: 'Trial, family pack or bulk order', note: 'Large packs need better storage discipline.' },
      ]),
      block('bangalore-heading', 'How Bangalore buyers should use a price list', 'h2'),
      block(
        'bangalore-body',
        'In Bangalore, do not compare only the rate. Ask how to store the pack after opening, how quickly the product should be consumed, and whether the product suits your purpose. A family snacking order, a sweet-making order and a gift box need different product choices.',
      ),
      bullet('check-current', 'Check the current product table or WhatsApp before ordering, because older rates may be outdated.'),
      bullet('check-grade', 'Compare grade and use case before deciding whether a price is actually good value.'),
      bullet('check-storage', 'Store opened packs airtight, away from heat and moisture, especially during humid weather.'),
      markedBlock(
        'hub-links',
        [
          span('hub-links-1', 'For more buying context, see the '),
          span('hub-links-2', 'Dry Fruits Price List Bangalore', ['price-hub']),
          span('hub-links-3', ' hub and the '),
          span('hub-links-4', 'Dry Fruits Price in Bangalore', ['price-guide']),
          span('hub-links-5', ' guide.'),
        ],
        [
          linkMark('price-hub', '/dry-fruits-price-list-bangalore'),
          linkMark('price-guide', '/blog/dry-fruits-price-in-bangalore'),
        ],
      ),
    ],
    faqs: [
      {
        _key: 'price-change-faq',
        question: 'Why do dry fruit prices change so often?',
        answer:
          'Dry fruit prices change because of crop supply, imports, demand, grade, size, packaging and freshness. Premium products can move differently from daily-use products.',
      },
      {
        _key: 'static-price-faq',
        question: 'Should I trust old dry fruit prices in blogs?',
        answer:
          'Use old prices only as rough context. For actual buying, check the live product table or ask on WhatsApp because rates can change monthly.',
      },
      {
        _key: 'best-value-faq',
        question: 'Is the lowest dry fruit price always best?',
        answer:
          'No. The best value depends on grade, freshness, pack size and use case. A split cashew may be great for sweets, while whole cashews may suit gifting better.',
      },
      {
        _key: 'bangalore-rate-faq',
        question: 'How should I compare dry fruit rates in Bangalore?',
        answer:
          'Compare current price, product grade, aroma, texture, pack size, delivery option and storage advice before deciding.',
      },
    ],
    relatedProducts: [
      relatedProduct('related-premium-mamra', products.premiumMamra),
      relatedProduct('related-california-almond', products.californiaAlmond),
      relatedProduct('related-premium-cashew', products.premiumCashew),
      relatedProduct('related-kishmish', products.kishmish),
    ],
    relatedCategories: ['Price Guide', 'Almonds', 'Cashews', 'Pistachios', 'Dried Fruits'],
    cta: {
      title: 'Need today\'s dry fruit prices?',
      text: 'Message Annapurna Mewa to confirm current rates, pack sizes and availability before ordering.',
      label: 'Ask on WhatsApp',
      href: 'https://wa.me/917259496740',
    },
  },
  {
    _id: 'blogPost-mamra-badam-price-guide',
    _type: 'blogPost',
    title: 'Mamra Badam Price Guide: What Affects the Rate?',
    slug: { _type: 'slug', current: 'mamra-badam-price-guide' },
    excerpt:
      'Understand Mamra badam price, why it differs from California almonds, what quality checks matter, and how to compare current almond rates.',
    targetKeyword: 'mamra badam price',
    secondaryKeywords: [
      'mamra badam rate',
      'mamra almonds price',
      'mamra badam price 1kg',
      'gurbandi badam',
    ],
    searchIntent: 'commercial',
    targetLocation: 'India',
    metaTitle: 'Mamra Badam Price Guide: Rate, Quality & Buying Tips',
    metaDescription:
      'Compare Mamra badam price with California almonds, learn rate drivers, quality checks, storage tips and see live Annapurna Mewa prices.',
    quickAnswer:
      'Mamra badam price is usually higher than regular California almonds because buyers pay for a richer eating experience, grade, origin, sorting and availability. The right question is not only the 1kg rate, but whether Mamra suits your purpose. Choose it for premium snacking or gifting, and use live catalog prices before ordering.',
    keyTakeaways: [
      'Mamra badam is usually a premium almond, so price should be judged with quality and purpose.',
      'Compare Mamra with California almonds before choosing a pack size.',
      'Check aroma, surface feel, bite and freshness before buying.',
      'Use live prices because Mamra rates can move with market supply.',
    ],
    publishedAt,
    lastReviewedAt: publishedAt,
    author: 'Annapurna Mewa',
    authorTitle: 'Premium Dry Fruits Specialist',
    authorBio,
    category: 'Almond Buying Guide',
    noIndex: false,
    coverImageAlt: 'Mamra badam price and almond quality guide',
    body: [
      markedBlock(
        'intro',
        [
          span('intro-1', 'Mamra badam price searches are usually commercial: the buyer already knows Mamra is premium and wants to know whether the rate makes sense. Compare '),
          span('intro-2', 'Premium Mamra', ['premium-mamra-link']),
          span('intro-3', ' with '),
          span('intro-4', 'California Almond', ['california-almond-link']),
          span('intro-5', ' by taste, use case, freshness and pack size before deciding.'),
        ],
        [
          productLinkMark('premium-mamra-link', products.premiumMamra),
          productLinkMark('california-almond-link', products.californiaAlmond),
        ],
      ),
      block('current-heading', 'Current almond prices', 'h2'),
      priceTable(
        'almond-price-table',
        'Live Mamra and almond prices',
        'Prices are pulled from live product records and may change with grade, supply and market rates.',
        [
          productRef('premium-mamra-row', products.premiumMamra, 'Premium Mamra', 'Premium almond option for richer eating and gifting.'),
          productRef('california-almond-row', products.californiaAlmond, 'California Almond', 'Practical daily-use almond option.'),
        ],
      ),
      block('why-heading', 'Why Mamra badam costs more', 'h2'),
      block(
        'why-body',
        'Mamra is typically bought for a richer almond bite and premium feel. Price can move because of availability, grade, sorting, size, origin, demand and freshness. A low Mamra rate is not automatically better if the product smells stale, looks uneven in a worrying way, or does not match the buyer\'s intended use.',
      ),
      comparisonTable('mamra-comparison-table', 'Mamra badam vs California almonds', [
        { label: 'Best use', value: 'Mamra for premium snacking and gifting', note: 'California almonds are practical for daily family use.' },
        { label: 'Price band', value: 'Mamra usually sits higher', note: 'Compare current live rates before ordering.' },
        { label: 'Taste', value: 'Mamra feels richer', note: 'Preference matters; not every buyer needs premium almonds daily.' },
        { label: 'Storage', value: 'Both need airtight storage', note: 'Keep away from heat and moisture.' },
      ]),
      block('quality-heading', 'Quality checks before paying Mamra prices', 'h2'),
      bullet('aroma', 'Smell should be clean and almond-like, never stale, oily or musty.'),
      bullet('surface', 'Surface should feel dry and clean, not damp or sticky.'),
      bullet('bite', 'Taste should feel rich but fresh, without flat or rancid notes.'),
      bullet('use-case', 'Buy Mamra when you want premium eating, gifting or a special family-use almond.'),
      markedBlock(
        'links',
        [
          span('links-1', 'For a broader almond comparison, read the '),
          span('links-2', 'Mamra Badam Guide', ['mamra-guide']),
          span('links-3', ' and the '),
          span('links-4', 'Dry Fruits Price List Bangalore', ['price-hub']),
          span('links-5', ' hub.'),
        ],
        [
          linkMark('mamra-guide', '/blog/mamra-badam-guide'),
          linkMark('price-hub', '/dry-fruits-price-list-bangalore'),
        ],
      ),
    ],
    faqs: [
      {
        _key: 'why-expensive-faq',
        question: 'Why is Mamra badam expensive?',
        answer:
          'Mamra badam is usually treated as a premium almond, and price depends on grade, origin, sorting, supply and freshness. It is often chosen for richer taste and gifting.',
      },
      {
        _key: 'mamra-vs-california-faq',
        question: 'Is Mamra better than California almonds?',
        answer:
          'Mamra can feel richer and more premium, while California almonds are often practical for daily family use. The better choice depends on taste, budget and purpose.',
      },
      {
        _key: 'price-1kg-faq',
        question: 'Should I buy Mamra badam 1kg at once?',
        answer:
          'Buy 1kg only if you can store it well and finish it while fresh. For trial or occasional use, a smaller pack may be more practical.',
      },
      {
        _key: 'check-freshness-faq',
        question: 'How do I check if Mamra badam is fresh?',
        answer:
          'Check clean aroma, dry surface, natural appearance and fresh bite. Avoid stale, oily or musty smell.',
      },
    ],
    relatedProducts: [
      relatedProduct('related-premium-mamra', products.premiumMamra),
      relatedProduct('related-california-almond', products.californiaAlmond),
    ],
    relatedCategories: ['Almonds', 'Mamra Badam', 'Price Guide'],
    cta: {
      title: 'Want the current Mamra rate?',
      text: 'Message Annapurna Mewa to confirm current Mamra badam price, pack sizes and availability.',
      label: 'Ask on WhatsApp',
      href: 'https://wa.me/917259496740',
    },
  },
  {
    _id: 'blogPost-cashew-price-1kg-guide',
    _type: 'blogPost',
    title: 'Cashew Price 1kg Guide: Whole, Split, and Broken Kaju',
    slug: { _type: 'slug', current: 'cashew-price-1kg-guide' },
    excerpt:
      'Compare cashew price by grade, understand 1kg kaju rates, and choose between whole, split and broken cashews for snacking, gifting or cooking.',
    targetKeyword: 'cashew price 1kg',
    secondaryKeywords: [
      'kaju price 1kg',
      'cashew nut price',
      '1 kg kaju price',
      'cashew 1kg price',
      'kaju rate',
    ],
    searchIntent: 'commercial',
    targetLocation: 'India',
    metaTitle: 'Cashew Price 1kg Guide: Whole, Split & Broken Kaju',
    metaDescription:
      'Compare current cashew prices for whole, split and broken kaju. Learn which grade suits snacking, gifting, sweets and cooking.',
    quickAnswer:
      'Cashew price for 1kg depends heavily on grade. Whole premium cashews usually cost more and suit snacking or gifting, while split or broken cashews can be better value for sweets, gravies and recipes. Compare current live prices and choose the grade by use case.',
    keyTakeaways: [
      'Whole cashews are usually better for snacking and gifting.',
      'Split and broken cashew grades can be practical for cooking and sweets.',
      '1kg is useful only if storage and consumption speed are realistic.',
      'Use live prices because kaju rates can change with market supply.',
    ],
    publishedAt,
    lastReviewedAt: publishedAt,
    author: 'Annapurna Mewa',
    authorTitle: 'Premium Dry Fruits Specialist',
    authorBio,
    category: 'Cashew Buying Guide',
    noIndex: false,
    coverImageAlt: 'Cashew price 1kg guide for whole split and broken kaju',
    body: [
      markedBlock(
        'intro',
        [
          span('intro-1', 'A cashew price 1kg search is incomplete unless you know the grade. '),
          span('intro-2', 'Premium Cashew', ['premium-cashew-link']),
          span('intro-3', ' is different from '),
          span('intro-4', '3pcs split cashew', ['split-cashew-link']),
          span('intro-5', ' or '),
          span('intro-6', '4pcs broken Cashew', ['broken-cashew-link']),
          span('intro-7', '. The best 1kg kaju buy depends on whether you are snacking, gifting, cooking or making sweets.'),
        ],
        [
          productLinkMark('premium-cashew-link', products.premiumCashew),
          productLinkMark('split-cashew-link', products.splitCashew3pcs),
          productLinkMark('broken-cashew-link', products.brokenCashew4pcs),
        ],
      ),
      block('current-heading', 'Current cashew prices', 'h2'),
      priceTable(
        'cashew-price-table',
        'Live cashew price table',
        'Prices are pulled from current product records and may change with grade, market rates and availability.',
        [
          productRef('premium-cashew-row', products.premiumCashew, 'Premium Cashew', 'Whole cashew option for snacking and gifting.'),
          productRef('split-cashew-row', products.splitCashew3pcs, '3pcs split cashew', 'Practical for sweets, cooking and recipes.'),
          productRef('broken-cashew-row', products.brokenCashew4pcs, '4pcs broken Cashew', 'Useful when appearance is less important than function.'),
        ],
      ),
      block('grade-heading', 'Whole, split or broken: which kaju should you buy?', 'h2'),
      comparisonTable('cashew-grade-table', 'Cashew grade by use case', [
        { label: 'Whole cashew', value: 'Best for snacking, serving and gifting', note: 'Presentation matters.' },
        { label: 'Split cashew', value: 'Useful for sweets, curries and recipes', note: 'Often practical when pieces are acceptable.' },
        { label: 'Broken cashew', value: 'Good for cooking, gravies and mixes', note: 'Can be better value for non-display use.' },
        { label: '1kg pack', value: 'Best for regular users', note: 'Store airtight and finish while fresh.' },
      ]),
      block('storage-heading', 'Should you buy 1kg cashew at once?', 'h2'),
      block(
        'storage-body',
        'A 1kg pack can make sense for families, sweet-making, small events or regular cooking. But if the pack will stay open for too long, a smaller pack may preserve freshness better. Cashews should smell clean and creamy, not oily or stale.',
      ),
      bullet('snacking', 'For snacking and guests, choose whole cashews when budget allows.'),
      bullet('sweets', 'For sweets and recipes, split or broken cashews can be more practical.'),
      bullet('storage', 'Store opened cashews airtight, away from heat, sunlight and moisture.'),
      markedBlock(
        'links',
        [
          span('links-1', 'For broader rate context, see the '),
          span('links-2', 'Dry Fruits Price List Today', ['today-guide']),
          span('links-3', ' guide and the '),
          span('links-4', 'Dry Fruits Price List Bangalore', ['price-hub']),
          span('links-5', ' hub.'),
        ],
        [
          linkMark('today-guide', '/blog/dry-fruits-price-list-today'),
          linkMark('price-hub', '/dry-fruits-price-list-bangalore'),
        ],
      ),
    ],
    faqs: [
      {
        _key: 'whole-vs-broken-faq',
        question: 'Why are whole cashews usually costlier than broken cashews?',
        answer:
          'Whole cashews usually have better presentation and are preferred for snacking and gifting. Broken grades can be practical for cooking and sweets.',
      },
      {
        _key: 'one-kg-faq',
        question: 'Is buying 1kg cashew a good idea?',
        answer:
          'It is a good idea if you use cashews regularly and can store them airtight. For slow consumption, smaller packs may stay fresher.',
      },
      {
        _key: 'kaju-price-faq',
        question: 'Why does kaju price change?',
        answer:
          'Kaju price changes with grade, crop supply, demand, size, sorting, processing and market conditions.',
      },
      {
        _key: 'cooking-grade-faq',
        question: 'Which cashew is best for cooking?',
        answer:
          'Split or broken cashews are often practical for sweets, curries and gravies because appearance is less important after cooking.',
      },
    ],
    relatedProducts: [
      relatedProduct('related-premium-cashew', products.premiumCashew),
      relatedProduct('related-split-cashew', products.splitCashew3pcs),
      relatedProduct('related-broken-cashew', products.brokenCashew4pcs),
    ],
    relatedCategories: ['Cashews', 'Kaju', 'Price Guide'],
    cta: {
      title: 'Need current kaju prices?',
      text: 'Message Annapurna Mewa to compare whole, split and broken cashew pack sizes before ordering.',
      label: 'Ask on WhatsApp',
      href: 'https://wa.me/917259496740',
    },
  },
  {
    _id: 'blogPost-dry-fruits-gift-box-guide',
    _type: 'blogPost',
    title: 'Dry Fruits Gift Box Guide: What to Include for Premium Gifting',
    slug: { _type: 'slug', current: 'dry-fruits-gift-box-guide' },
    excerpt:
      'Learn how to build a premium dry fruits gift box with almonds, cashews, pista, walnuts, figs, raisins and apricots for family or business gifting.',
    targetKeyword: 'dry fruits gift box',
    secondaryKeywords: [
      'dry fruit gift box',
      'dry fruit box',
      'dry fruit gift hamper',
      'nuts gift box',
      'dry fruits gift pack',
    ],
    searchIntent: 'commercial',
    targetLocation: 'Bangalore',
    metaTitle: 'Dry Fruits Gift Box Guide: Premium Gifting Ideas',
    metaDescription:
      'Build a premium dry fruits gift box with almonds, cashews, pista, walnuts, figs, raisins and apricots. Practical guide for Bangalore gifting.',
    quickAnswer:
      'A good dry fruits gift box should balance premium appearance, freshness, variety and the recipient\'s taste. Almonds, cashews, pista, walnuts, figs, raisins and apricots work well because they offer different textures and colors. For premium gifting, choose clean-looking products, current packs and a mix that feels intentional.',
    keyTakeaways: [
      'Gift boxes should prioritize freshness, appearance and variety.',
      'Use Mamra, whole cashews, pista, walnuts, anjir, apricots and kishmish for a premium mix.',
      'Match the mix to the occasion: family gifting, festive gifting, office gifting or client gifting.',
      'Confirm current availability before finalizing a gift box.',
    ],
    publishedAt,
    lastReviewedAt: publishedAt,
    author: 'Annapurna Mewa',
    authorTitle: 'Premium Dry Fruits Specialist',
    authorBio,
    category: 'Gifting Guide',
    noIndex: false,
    coverImageAlt: 'Premium dry fruits gift box buying guide',
    body: [
      block(
        'intro',
        'Dry fruits gift boxes work because they feel useful, premium and easy to share. But a good gift box is not just a random mix of expensive products. It should have freshness, color, texture and balance. A smart mix can feel generous without wasting budget on items the recipient may not use.',
      ),
      block('current-heading', 'Premium products to consider for gifting', 'h2'),
      priceTable(
        'gift-price-table',
        'Gift-friendly dry fruit options',
        'Use current product records to check availability and prices before building a gift box.',
        [
          productRef('premium-mamra-row', products.premiumMamra, 'Premium Mamra', 'Premium almond option for a special gift box.'),
          productRef('premium-cashew-row', products.premiumCashew, 'Premium Cashew', 'Whole cashews add a premium feel.'),
          productRef('salted-pista-row', products.californiaSaltedPista, 'California Salted Pista', 'Adds color and ready-to-snack appeal.'),
          productRef('walnut-row', products.premiumWalnut, 'Premium Walnut', 'Useful for a richer, more varied mix.'),
          productRef('anjir-row', products.anjir, 'Anjir', 'Dried figs feel premium and pair well with nuts.'),
          productRef('apricot-row', products.apricot, 'Apricot', 'Adds softness and color to dried-fruit mixes.'),
          productRef('kishmish-row', products.kishmish, 'Kishmish', 'Naturally sweet option for balance.'),
        ],
      ),
      block('what-include-heading', 'What to include in a dry fruit gift box', 'h2'),
      comparisonTable('gift-mix-table', 'Gift box mix ideas', [
        { label: 'Premium family gift', value: 'Mamra, cashew, pista, walnut, anjir', note: 'Feels rich and occasion-ready.' },
        { label: 'Balanced everyday gift', value: 'California almonds, cashews, kishmish, apricot, makhana', note: 'Useful and approachable.' },
        { label: 'Client or office gift', value: 'Whole cashews, pista, walnuts, figs, apricots', note: 'Prioritize appearance and variety.' },
        { label: 'Sweet-leaning gift', value: 'Kishmish, apricot, anjir with cashews and almonds', note: 'Good when the recipient likes dried fruits.' },
      ]),
      block('quality-heading', 'Gift-box quality checklist', 'h2'),
      bullet('freshness', 'Choose products with clean aroma and fresh texture.'),
      bullet('appearance', 'Use cleaner-looking whole nuts and colorful dried fruits for presentation.'),
      bullet('balance', 'Balance crunchy nuts with softer dried fruits.'),
      bullet('recipient', 'Match the mix to the recipient, not only to the highest price.'),
      markedBlock(
        'links',
        [
          span('links-1', 'For local gifting details, see '),
          span('links-2', 'Dry Fruit Gift Boxes Bangalore', ['gift-hub']),
          span('links-3', ' and '),
          span('links-4', 'Same-Day Dry Fruits Delivery Bangalore', ['delivery-hub']),
          span('links-5', '.'),
        ],
        [
          linkMark('gift-hub', '/dry-fruit-gift-boxes-bangalore'),
          linkMark('delivery-hub', '/same-day-dry-fruits-delivery-bangalore'),
        ],
      ),
    ],
    faqs: [
      {
        _key: 'best-items-faq',
        question: 'What should I put in a dry fruits gift box?',
        answer:
          'A premium gift box can include Mamra almonds, cashews, pista, walnuts, anjir, apricots and kishmish. Choose based on budget, recipient taste and availability.',
      },
      {
        _key: 'bangalore-gift-faq',
        question: 'Can I order dry fruits gift boxes in Bangalore?',
        answer:
          'Yes. Message Annapurna Mewa to check current products, pack sizes, availability and delivery options for Bangalore gifting.',
      },
      {
        _key: 'premium-gift-faq',
        question: 'What makes a dry fruit gift box premium?',
        answer:
          'Freshness, clean appearance, better product selection, variety and thoughtful balance make a dry fruit gift box feel premium.',
      },
      {
        _key: 'price-faq',
        question: 'Do gift box prices change?',
        answer:
          'Yes. Gift box cost depends on the selected dry fruits, pack sizes, current market rates and packaging choices.',
      },
    ],
    relatedProducts: [
      relatedProduct('related-premium-mamra', products.premiumMamra),
      relatedProduct('related-premium-cashew', products.premiumCashew),
      relatedProduct('related-salted-pista', products.californiaSaltedPista),
      relatedProduct('related-premium-walnut', products.premiumWalnut),
      relatedProduct('related-anjir', products.anjir),
    ],
    relatedCategories: ['Gifting', 'Gift Boxes', 'Almonds', 'Cashews', 'Dried Fruits'],
    cta: {
      title: 'Planning a dry fruits gift box?',
      text: 'Message Annapurna Mewa to choose current products, pack sizes and delivery options for gifting.',
      label: 'Ask on WhatsApp',
      href: 'https://wa.me/917259496740',
    },
  },
  {
    _id: 'blogPost-mixed-dry-fruits-guide',
    _type: 'blogPost',
    title: 'Mixed Dry Fruits Guide: Best Mixes for Daily Snacking and Gifting',
    slug: { _type: 'slug', current: 'mixed-dry-fruits-guide' },
    excerpt:
      'Build better mixed dry fruits for daily snacking, office snacks, family use and gifting with almonds, cashews, pista, walnuts, raisins, figs and apricots.',
    targetKeyword: 'mixed dry fruits',
    secondaryKeywords: [
      'mix dry fruits',
      'dry fruit mixture',
      'dry fruits mix packet',
      'dried fruit and nut mix',
      'mixed nuts with dried fruit',
    ],
    searchIntent: 'commercial',
    targetLocation: 'India',
    metaTitle: 'Mixed Dry Fruits Guide: Daily Snacks & Gift Mixes',
    metaDescription:
      'Learn how to build mixed dry fruits for daily snacking and gifting with almonds, cashews, pista, walnuts, raisins, figs, apricots and makhana.',
    quickAnswer:
      'A good mixed dry fruits pack should balance crunch, sweetness, richness and freshness. For daily snacking, use practical products such as California almonds, cashews, walnuts, makhana and kishmish. For gifting, add more premium-looking products such as Mamra, pista, anjir and apricots.',
    keyTakeaways: [
      'Daily mixes should be easy to eat regularly and store well.',
      'Gift mixes should look premium and include more variety.',
      'Balance nuts with dried fruits instead of making the mix one-note.',
      'Check current product prices before choosing a final mix.',
    ],
    publishedAt,
    lastReviewedAt: publishedAt,
    author: 'Annapurna Mewa',
    authorTitle: 'Premium Dry Fruits Specialist',
    authorBio,
    category: 'Dry Fruits Guide',
    noIndex: false,
    coverImageAlt: 'Mixed dry fruits guide for daily snacking and gifting',
    body: [
      block(
        'intro',
        'Mixed dry fruits are popular because one pack can cover multiple needs: quick snacking, guests, office drawers, family nutrition and gifting. The best mix is not just the most expensive mix. It should match how the pack will actually be eaten.',
      ),
      block('current-heading', 'Products to build a dry fruit mix', 'h2'),
      priceTable(
        'mixed-price-table',
        'Live products for mixed dry fruits',
        'Current prices are pulled from live product records. Use them to build a mix that fits your budget and use case.',
        [
          productRef('california-almond-row', products.californiaAlmond, 'California Almond', 'Daily-use crunch for regular mixes.'),
          productRef('premium-mamra-row', products.premiumMamra, 'Premium Mamra', 'Richer almond for premium mixes.'),
          productRef('premium-cashew-row', products.premiumCashew, 'Premium Cashew', 'Creamy whole cashew for snacking and gifting.'),
          productRef('salted-pista-row', products.californiaSaltedPista, 'California Salted Pista', 'Adds color and ready-snack flavor.'),
          productRef('walnut-row', products.premiumWalnut, 'Premium Walnut', 'Adds richness and texture.'),
          productRef('kishmish-row', products.kishmish, 'Kishmish', 'Adds natural sweetness.'),
          productRef('anjir-row', products.anjir, 'Anjir', 'Premium dried fruit for richer mixes.'),
          productRef('apricot-row', products.apricot, 'Apricot', 'Soft dried fruit that adds color.'),
          productRef('makhana-row', products.makhanaBigSize, 'Makhana big size', 'Light snack option for roasted mixes.'),
        ],
      ),
      block('mix-heading', 'Best mixed dry fruits by use case', 'h2'),
      comparisonTable('mix-use-table', 'Mix ideas by purpose', [
        { label: 'Daily family snack', value: 'California almonds, cashews, walnuts, kishmish, makhana', note: 'Practical and easy to repeat.' },
        { label: 'Premium gift mix', value: 'Mamra, cashews, pista, anjir, apricot, walnuts', note: 'More color and premium feel.' },
        { label: 'Office snack mix', value: 'Almonds, cashews, makhana, raisins', note: 'Easy to eat without much mess.' },
        { label: 'Sweet dried-fruit mix', value: 'Kishmish, anjir, apricot with almonds and cashews', note: 'Better for buyers who prefer softer textures.' },
      ]),
      block('balance-heading', 'How to balance a dry fruit mixture', 'h2'),
      bullet('crunch', 'Use almonds, cashews, pista and walnuts for crunch and richness.'),
      bullet('sweetness', 'Use kishmish, anjir and apricot for natural sweetness and softness.'),
      bullet('lightness', 'Use makhana when you want a lighter roasted snack mix.'),
      bullet('freshness', 'Avoid overbuying if the mix will stay open for too long.'),
      markedBlock(
        'links',
        [
          span('links-1', 'For more buying context, read the '),
          span('links-2', 'Premium Dry Fruits', ['premium-hub']),
          span('links-3', ' hub and the '),
          span('links-4', 'Raisins, Figs, Apricots Comparison', ['dried-guide']),
          span('links-5', '.'),
        ],
        [
          linkMark('premium-hub', '/premium-dry-fruits'),
          linkMark('dried-guide', '/blog/raisins-figs-apricots-which-dried-fruit-to-buy'),
        ],
      ),
    ],
    faqs: [
      {
        _key: 'best-mix-faq',
        question: 'What is the best mixed dry fruits combination?',
        answer:
          'For daily use, almonds, cashews, walnuts, makhana and kishmish are practical. For gifting, add Mamra, pista, anjir and apricots for a more premium feel.',
      },
      {
        _key: 'daily-faq',
        question: 'Can mixed dry fruits be used for daily snacking?',
        answer:
          'Yes. Choose a practical mix and store it airtight. Avoid buying too much if the pack will stay open for a long time.',
      },
      {
        _key: 'gift-mix-faq',
        question: 'Which dry fruits make a mix look premium?',
        answer:
          'Mamra almonds, whole cashews, pista, walnuts, anjir and apricots usually make a mix feel more premium.',
      },
      {
        _key: 'storage-faq',
        question: 'How should mixed dry fruits be stored?',
        answer:
          'Store mixed dry fruits in an airtight container away from heat, moisture and sunlight. Softer dried fruits and crunchy nuts can change texture if stored poorly.',
      },
    ],
    relatedProducts: [
      relatedProduct('related-california-almond', products.californiaAlmond),
      relatedProduct('related-premium-mamra', products.premiumMamra),
      relatedProduct('related-premium-cashew', products.premiumCashew),
      relatedProduct('related-kishmish', products.kishmish),
      relatedProduct('related-anjir', products.anjir),
      relatedProduct('related-apricot', products.apricot),
    ],
    relatedCategories: ['Mixed Dry Fruits', 'Daily Snacking', 'Gifting', 'Dried Fruits'],
    cta: {
      title: 'Want help building a dry fruit mix?',
      text: 'Message Annapurna Mewa to choose products, pack sizes and current prices for daily use or gifting.',
      label: 'Ask on WhatsApp',
      href: 'https://wa.me/917259496740',
    },
  },
];

const requiredProductIds = new Set();
for (const post of posts) {
  for (const item of post.relatedProducts || []) {
    requiredProductIds.add(item._ref);
  }
  for (const blockItem of post.body || []) {
    if (blockItem._type === 'productPriceTable') {
      for (const row of blockItem.products || []) {
        requiredProductIds.add(row.product._ref);
      }
    }
    if (blockItem._type === 'block') {
      for (const markDef of blockItem.markDefs || []) {
        if (markDef._type === 'internalProductLink') {
          requiredProductIds.add(markDef.product._ref);
        }
      }
    }
  }
}

const existingProducts = await client.fetch(
  `*[_type == "product" && _id in ${JSON.stringify([...requiredProductIds])}]{_id, name, "slug": slug.current}`,
);
const existingProductIds = new Set(existingProducts.map((product) => product._id));
const missingProducts = [...requiredProductIds].filter((id) => !existingProductIds.has(id));

if (missingProducts.length > 0) {
  throw new Error(`Missing referenced products: ${missingProducts.join(', ')}`);
}

for (const post of posts) {
  await client.createOrReplace(post);
  console.log(`published\t${post.slug.current}\t${post.title}`);
}

const published = await client.fetch(
  `*[_type == "blogPost" && slug.current in ${JSON.stringify(posts.map((post) => post.slug.current))}]{
    _id,
    title,
    "slug": slug.current,
    noIndex,
    publishedAt,
    targetKeyword
  } | order(slug asc)`,
);

console.log(JSON.stringify(published, null, 2));
