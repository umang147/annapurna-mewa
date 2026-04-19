import { getCliClient } from 'sanity/cli';
import { readFileSync } from 'fs';
import { basename } from 'path';

const client = getCliClient();

const productsToSeed = [
  {
    name: 'Premium Mamra',
    slug: { _type: 'slug', current: 'premium-mamra' },
    category: 'Almonds',
    imageFile: '/Users/umang/Downloads/annapurna-mewa-images/mamra1.png',
    description: 'Exclusive quality Iranian Mamra almonds, rich in oils and perfect for premium daily consumption.',
    prices: [
      { _key: '1', weight: '250gr', price: 840 },
      { _key: '2', weight: '500gr', price: 1675 },
      { _key: '3', weight: '1kg', price: 3360 },
    ],
  },
  {
    name: 'California Almond',
    slug: { _type: 'slug', current: 'california-almond' },
    category: 'Almonds',
    imageFile: '/Users/umang/Downloads/annapurna-mewa-images/almond1.png',
    description: 'High-grade California almonds, naturally sweet and delightfully crunchy.',
    prices: [
      { _key: '1', weight: '250gr', price: 240 },
      { _key: '2', weight: '500gr', price: 490 },
      { _key: '3', weight: '1kg', price: 980 },
    ],
  },
  {
    name: 'California Salted Pista',
    slug: { _type: 'slug', current: 'california-salted-pista' },
    category: 'Pistachios',
    imageFile: '/Users/umang/Downloads/annapurna-mewa-images/salted-pista1.png',
    description: 'Perfectly roasted and mildly salted California pistachios.',
    prices: [
      { _key: '1', weight: '250gr', price: 350 },
      { _key: '2', weight: '500gr', price: 700 },
      { _key: '3', weight: '1kg', price: 1400 },
    ],
  },
  {
    name: 'Non Salted Pista',
    slug: { _type: 'slug', current: 'non-salted-pista' },
    category: 'Pistachios',
    imageFile: '/Users/umang/Downloads/annapurna-mewa-images/salted-pista2.jpg',
    description: 'Premium unsalted pistachios, great for cooking, garnishing, or healthy snacking.',
    prices: [
      { _key: '1', weight: '250gr', price: 725 },
      { _key: '2', weight: '500gr', price: 1450 },
      { _key: '3', weight: '1kg', price: 2900 },
    ],
  },
  {
    name: 'Kishmish',
    slug: { _type: 'slug', current: 'kishmish' },
    category: 'Raisins',
    imageFile: '/Users/umang/Downloads/annapurna-mewa-images/kismis1.png',
    description: 'Naturally sweet and plump golden raisins.',
    prices: [
      { _key: '1', weight: '250gr', price: 150 },
      { _key: '2', weight: '500gr', price: 300 },
      { _key: '3', weight: '1kg', price: 600 },
    ],
  },
  {
    name: 'Makhana',
    slug: { _type: 'slug', current: 'makhana' },
    category: 'Seeds & Nuts',
    imageFile: '/Users/umang/Downloads/annapurna-mewa-images/makhana1.png',
    description: 'Premium quality fox nuts (Makhana), highly nutritious and perfect for light snacking.',
    prices: [
      { _key: '1', weight: '250gr', price: 375 },
      { _key: '2', weight: '500gr', price: 750 },
      { _key: '3', weight: '1kg', price: 1500 },
    ],
  },
  {
    name: 'Apricot',
    slug: { _type: 'slug', current: 'apricot' },
    category: 'Dried Fruits',
    imageFile: '/Users/umang/Downloads/annapurna-mewa-images/aloobukara1.png',
    description: 'Soft, sweet, and sun-dried premium apricots.',
    prices: [
      { _key: '1', weight: '250gr', price: 175 },
      { _key: '2', weight: '500gr', price: 350 },
      { _key: '3', weight: '1kg', price: 700 },
    ],
  },
  {
    name: 'Premium Cashew',
    slug: { _type: 'slug', current: 'premium-cashew' },
    category: 'Cashews',
    imageFile: '/Users/umang/Downloads/annapurna-mewa-images/kaju1.png',
    description: 'Large, whole, and deliciously buttery premium cashews.',
    prices: [
      { _key: '1', weight: '250gr', price: 240 },
      { _key: '2', weight: '500gr', price: 490 },
      { _key: '3', weight: '1kg', price: 980 },
    ],
  },
  {
    name: 'Anjir',
    slug: { _type: 'slug', current: 'anjir' },
    category: 'Dried Fruits',
    imageFile: '/Users/umang/Downloads/annapurna-mewa-images/anjeer1.png',
    description: 'High-quality naturally dried figs (Anjir), packed with nutrients.',
    prices: [
      { _key: '1', weight: '250gr', price: 375 },
      { _key: '2', weight: '500gr', price: 750 },
      { _key: '3', weight: '1kg', price: 1500 },
    ],
  },
  {
    name: 'Premium Walnut',
    slug: { _type: 'slug', current: 'premium-walnut' },
    category: 'Walnuts',
    imageFile: '/Users/umang/Downloads/annapurna-mewa-images/walnut1.png',
    description: 'Fresh and crunchy whole walnut kernels.',
    prices: [
      { _key: '1', weight: '250gr', price: 440 },
      { _key: '2', weight: '500gr', price: 880 },
      { _key: '3', weight: '1kg', price: 1760 },
    ],
  },
];

async function seed() {
  console.log('Starting seed process...');
  for (const product of productsToSeed) {
    try {
      console.log(`Uploading image for ${product.name}...`);
      const fileBuffer = readFileSync(product.imageFile);
      const asset = await client.assets.upload('image', fileBuffer, {
        filename: basename(product.imageFile),
      });

      console.log(`Creating product ${product.name}...`);
      await client.create({
        _type: 'product',
        name: product.name,
        slug: product.slug,
        category: product.category,
        description: product.description,
        prices: product.prices,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
      });
      console.log(`✅ Successfully seeded ${product.name}`);
    } catch (err) {
      console.error(`❌ Failed to seed ${product.name}:`, err);
    }
  }
  console.log('Seed process completed!');
}

seed();
