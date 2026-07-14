import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import Image from 'next/image';
import { Truck, ShieldCheck, Leaf } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { productsQuery } from '@/sanity/lib/queries';
import { SeoProduct } from '@/lib/seo';

export const revalidate = 10; // Revalidate the page every 10 seconds

export default async function Home() {
  const hasSanityConfig = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'yoursanityprojectid';
  let products: SeoProduct[] = MOCK_PRODUCTS;

  if (hasSanityConfig) {
    products = await client.fetch(productsQuery);
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/hero.png" 
              alt="Premium Dry Fruits Assortment" 
              fill 
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent"></div>
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-md">
              Nature&apos;s Finest, <br/><span className="text-brand-gold italic">Handpicked for You.</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-200 mb-10 font-light drop-shadow-sm">
              Above-average quality dry fruits for your daily health. 
              <br className="hidden md:block"/> Authentic. Premium. Delicious.
            </p>
            <a 
              href="#products" 
              className="inline-block bg-brand-red hover:bg-brand-red/90 text-white font-bold py-4 px-10 rounded-full text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(209,40,33,0.5)]"
            >
              Explore Our Catalog
            </a>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-16 bg-neutral-900 border-y border-brand-gold/20 relative z-20 -mt-10 mx-4 md:mx-12 rounded-3xl shadow-2xl shadow-brand-gold/5">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-around items-center gap-8">
            <div className="flex items-center gap-4 group">
              <div className="bg-brand-gold/10 p-4 rounded-full text-brand-gold group-hover:bg-brand-gold group-hover:text-neutral-900 transition-colors">
                <Leaf size={32} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Premium Quality</h3>
                <p className="text-neutral-400 text-sm">Finest selection of daily consumables</p>
              </div>
            </div>
            <div className="w-px h-16 bg-neutral-800 hidden md:block"></div>
            <div className="flex items-center gap-4 group">
              <div className="bg-brand-gold/10 p-4 rounded-full text-brand-gold group-hover:bg-brand-gold group-hover:text-neutral-900 transition-colors">
                <Truck size={32} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Fast Delivery</h3>
                <p className="text-neutral-400 text-sm">Pan India & Same-Day in Bangalore</p>
              </div>
            </div>
            <div className="w-px h-16 bg-neutral-800 hidden md:block"></div>
            <div className="flex items-center gap-4 group">
              <div className="bg-brand-gold/10 p-4 rounded-full text-brand-gold group-hover:bg-brand-gold group-hover:text-neutral-900 transition-colors">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">100% Authentic</h3>
                <p className="text-neutral-400 text-sm">Directly sourced, pure goodness</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT CATALOG SECTION */}
        <section id="products" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4 text-foreground">Our Catalog</h2>
            <div className="w-24 h-1 bg-brand-red mx-auto mb-6"></div>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              We carefully source the best dry fruits to ensure you get exceptional taste and health benefits in every bite. Choose from our curated selection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
