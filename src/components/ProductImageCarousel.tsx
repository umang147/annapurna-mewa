'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function ProductImageCarousel({ images, productName, category }: { images: string[], productName: string, category: string }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const intervalId = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const nextIndex = (activeIndex + 1) % images.length;
        const scrollWidth = container.clientWidth;
        
        container.scrollTo({
          left: scrollWidth * nextIndex,
          behavior: 'smooth'
        });
        
        setActiveIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [activeIndex, images.length]);

  return (
    <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[600px] flex overflow-x-auto snap-x snap-mandatory no-scrollbar bg-neutral-900" ref={scrollContainerRef}>
      {images.map((src: string, i: number) => (
        <div key={i} className="min-w-full relative h-full shrink-0 snap-center">
          <Image 
            src={src}
            alt={`${productName} image ${i+1}`}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}
      <div className="absolute top-6 left-6 z-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold tracking-wider text-brand-gold">
        {category}
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full backdrop-blur-md shadow-sm transition-colors ${i === activeIndex ? 'bg-white' : 'bg-white/30 border border-black/10'}`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}
