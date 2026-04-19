export type ProductPrice = { weight: string; price: number };

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  prices: ProductPrice[];
  imagePath: string; // for stock/placeholder images
  description: string;
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Mamra',
    slug: 'premium-mamra',
    category: 'Almonds',
    imagePath: '/images/almond.jpg',
    description: 'Exclusive quality Iranian Mamra almonds, rich in oils and perfect for premium daily consumption.',
    prices: [
      { weight: '250gr', price: 840 },
      { weight: '500gr', price: 1675 },
      { weight: '1kg', price: 3360 },
    ],
  },
  {
    id: '2',
    name: 'California Almond',
    slug: 'california-almond',
    category: 'Almonds',
    imagePath: '/images/almond-ca.jpg',
    description: 'High-grade California almonds, naturally sweet and delightfully crunchy.',
    prices: [
      { weight: '250gr', price: 240 },
      { weight: '500gr', price: 490 },
      { weight: '1kg', price: 980 },
    ],
  },
  {
    id: '3',
    name: 'California Salted Pista',
    slug: 'california-salted-pista',
    category: 'Pistachios',
    imagePath: '/images/pista-salted.jpg',
    description: 'Perfectly roasted and mildly salted California pistachios.',
    prices: [
      { weight: '250gr', price: 350 },
      { weight: '500gr', price: 700 },
      { weight: '1kg', price: 1400 },
    ],
  },
  {
    id: '4',
    name: 'Non Salted Pista',
    slug: 'non-salted-pista',
    category: 'Pistachios',
    imagePath: '/images/pista-plain.jpg',
    description: 'Premium unsalted pistachios, great for cooking, garnishing, or healthy snacking.',
    prices: [
      { weight: '250gr', price: 725 },
      { weight: '500gr', price: 1450 },
      { weight: '1kg', price: 2900 },
    ],
  },
  {
    id: '5',
    name: 'Kishmish',
    slug: 'kishmish',
    category: 'Raisins',
    imagePath: '/images/kishmish.jpg',
    description: 'Naturally sweet and plump golden raisins.',
    prices: [
      { weight: '250gr', price: 150 },
      { weight: '500gr', price: 300 },
      { weight: '1kg', price: 600 },
    ],
  },
  {
    id: '6',
    name: 'Makhana',
    slug: 'makhana',
    category: 'Seeds & Nuts',
    imagePath: '/images/makhana.jpg',
    description: 'Premium quality fox nuts (Makhana), highly nutritious and perfect for light snacking.',
    prices: [
      { weight: '250gr', price: 375 },
      { weight: '500gr', price: 750 },
      { weight: '1kg', price: 1500 },
    ],
  },
  {
    id: '7',
    name: 'Apricot',
    slug: 'apricot',
    category: 'Dried Fruits',
    imagePath: '/images/apricot.jpg',
    description: 'Soft, sweet, and sun-dried premium apricots.',
    prices: [
      { weight: '250gr', price: 175 },
      { weight: '500gr', price: 350 },
      { weight: '1kg', price: 700 },
    ],
  },
  {
    id: '8',
    name: 'Premium Cashew',
    slug: 'premium-cashew',
    category: 'Cashews',
    imagePath: '/images/cashew.jpg',
    description: 'Large, whole, and deliciously buttery premium cashews.',
    prices: [
      { weight: '250gr', price: 240 },
      { weight: '500gr', price: 490 },
      { weight: '1kg', price: 980 },
    ],
  },
  {
    id: '9',
    name: 'Anjir',
    slug: 'anjir',
    category: 'Dried Fruits',
    imagePath: '/images/anjir.jpg',
    description: 'High-quality naturally dried figs (Anjir), packed with nutrients.',
    prices: [
      { weight: '250gr', price: 375 },
      { weight: '500gr', price: 750 },
      { weight: '1kg', price: 1500 },
    ],
  },
  {
    id: '10',
    name: 'Premium Walnut',
    slug: 'premium-walnut',
    category: 'Walnuts',
    imagePath: '/images/walnut.jpg',
    description: 'Fresh and crunchy whole walnut kernels.',
    prices: [
      { weight: '250gr', price: 440 },
      { weight: '500gr', price: 880 },
      { weight: '1kg', price: 1760 },
    ],
  },
];
