import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { absoluteUrl, brandName, getProductDescription, getProductImages, getProductUrl, SeoProduct } from '@/lib/seo';
import { client } from '@/sanity/lib/client';
import { productsQuery } from '@/sanity/lib/queries';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

function escapeXml(value: string | number | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizeId(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatPrice(price: number): string {
  return `${price.toFixed(2)} INR`;
}

function formatWeightLabel(weight: string | undefined): string {
  if (!weight) {
    return '';
  }

  return weight
    .replace(/(\d+)\s*gr\b/i, '$1g')
    .replace(/(\d+)\s*gms\b/i, '$1g')
    .replace(/(\d+)\s*kg\b/i, '$1kg')
    .trim();
}

function formatShippingWeight(weight: string): string {
  const match = weight.match(/^(\d+(?:\.\d+)?)(g|kg)$/i);

  if (!match) {
    return '';
  }

  return `${match[1]} ${match[2].toLowerCase()}`;
}

function getMerchantCenterDescription(product: SeoProduct): string {
  const description = getProductDescription(product);
  const restrictedHealthClaimPattern = /\b(ailment|antioxidants?|brain function|cholesterol|cure|diabetes|disease|health benefits?|heart health|inflammation|medicine|prevent|treat)\b/i;

  if (!restrictedHealthClaimPattern.test(description)) {
    return description;
  }

  return `${product.name} from ${brandName}. Premium dry fruit for snacking, cooking, baking, gifting, desserts, and everyday pantry use with delivery in Bangalore and across India.`;
}

function getProductFeedItems(product: SeoProduct) {
  const prices = product.prices?.filter((price) => (
    typeof price.price === 'number' && price.price > 0
  )) || [];
  const images = getProductImages(product);
  const imageLink = images[0] || absoluteUrl('/images/hero-optimized.jpg');
  const productUrl = getProductUrl(product);
  const description = getMerchantCenterDescription(product);

  return prices.map((priceOption, index) => {
    const weight = formatWeightLabel(priceOption.weight);
    const id = normalizeId([product.slug, weight || index + 1].join('-'));
    const productName = product.name.trim();
    const title = weight ? `${productName} - ${weight}` : productName;
    const shippingWeight = formatShippingWeight(weight);

    return {
      id,
      itemGroupId: normalizeId(product.slug),
      title,
      description,
      productUrl,
      imageLink,
      price: formatPrice(priceOption.price as number),
      shippingWeight,
      mpn: id,
      productType: ['Dry Fruits', product.category].filter(Boolean).join(' > '),
    };
  });
}

async function getProducts(): Promise<SeoProduct[]> {
  const hasSanityConfig = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'yoursanityprojectid';

  if (!hasSanityConfig) {
    return MOCK_PRODUCTS;
  }

  const products = await client.fetch<SeoProduct[]>(productsQuery);
  return products.length > 0 ? products : MOCK_PRODUCTS;
}

function buildFeed(products: SeoProduct[]) {
  const items = products.flatMap(getProductFeedItems);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(`${brandName} Product Feed`)}</title>
    <link>${escapeXml(absoluteUrl('/'))}</link>
    <description>${escapeXml('Live product feed for Annapurna Mewa dry fruits.')}</description>
${items.map((item) => `    <item>
      <g:id>${escapeXml(item.id)}</g:id>
      <g:item_group_id>${escapeXml(item.itemGroupId)}</g:item_group_id>
      <g:title>${escapeXml(item.title)}</g:title>
      <g:description>${escapeXml(item.description)}</g:description>
      <g:link>${escapeXml(item.productUrl)}</g:link>
      <g:image_link>${escapeXml(item.imageLink)}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${escapeXml(item.price)}</g:price>
${item.shippingWeight ? `      <g:shipping_weight>${escapeXml(item.shippingWeight)}</g:shipping_weight>
` : ''}      <g:brand>${escapeXml(brandName)}</g:brand>
      <g:condition>new</g:condition>
      <g:mpn>${escapeXml(item.mpn)}</g:mpn>
      <g:product_type>${escapeXml(item.productType)}</g:product_type>
    </item>`).join('\n')}
  </channel>
</rss>
`;
}

export async function GET() {
  const products = await getProducts();
  const feed = buildFeed(products);

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
