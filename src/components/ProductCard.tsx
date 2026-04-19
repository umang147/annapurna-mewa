import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../data/mockProducts';
import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }: { product: any }) {
  // Using the hero image as placeholder if specific not found
  const firstImage = product.imagePaths?.[0] || product.imagePath; // Support old seeded data
  const imageSource = firstImage?.includes('placeholder') || !firstImage ? '/images/hero.png' : firstImage;

  return (
    <div className="glass rounded-2xl overflow-hidden hover-glow flex flex-col h-full animate-fade-in-up">
      <div className="relative h-64 w-full">
        <Image 
          src={imageSource}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-brand-gold">
          {product.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 text-foreground">{product.name}</h3>
        <p className="text-sm text-foreground/70 mb-6 flex-grow">{product.description}</p>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            {product.prices.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm border-b border-foreground/10 pb-1 last:border-0 last:pb-0">
                <span className="font-medium text-foreground/80">{p.weight}</span>
                <span className="font-bold text-brand-gold">₹{p.price}</span>
              </div>
            ))}
          </div>
          
          <Link 
            href={`/product/${product.slug}`}
            className="w-full mt-4 bg-brand-red hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 group"
          >
            <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
            View Options
          </Link>
        </div>
      </div>
    </div>
  );
}
