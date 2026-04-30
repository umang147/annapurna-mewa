'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

export default function ProductImageCarousel({ images, productName, category }: { images: string[], productName: string, category: string }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Extend images to create a round-robin loop effect: [1, 2, 3, 1]
  const extendedImages = images.length > 1 ? [...images, images[0]] : images;
  const isTeleporting = useRef(false);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || images.length <= 1 || isTeleporting.current) return;
    const width = scrollContainerRef.current.clientWidth;
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const index = Math.round(scrollLeft / width);
    
    if (index >= images.length) {
      // User manually scrolled to the clone, teleport back
      isTeleporting.current = true;
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: 'instant' as ScrollBehavior
      });
      setActiveIndex(0);
      setTimeout(() => { isTeleporting.current = false; }, 50);
    } else if (index !== activeIndex) {
      setActiveIndex(index);
    }
  }, [activeIndex, images.length]);

  useEffect(() => {
    if (images.length <= 1) return;

    const intervalId = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollWidth = container.clientWidth;
        let nextIndex = activeIndex + 1;
        
        container.scrollTo({
          left: scrollWidth * nextIndex,
          behavior: 'smooth'
        });
        
        if (nextIndex >= images.length) {
          isTeleporting.current = true;
          // Wait for smooth scroll to finish before instant teleport
          setTimeout(() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTo({
                left: 0,
                behavior: 'instant' as ScrollBehavior
              });
              isTeleporting.current = false;
            }
          }, 500);
          setActiveIndex(0);
        } else {
          setActiveIndex(nextIndex);
        }
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [activeIndex, images.length]);

  return (
    <div 
      className="w-full md:w-1/2 relative h-[400px] md:h-auto md:min-h-[600px] flex overflow-x-auto snap-x snap-mandatory no-scrollbar bg-neutral-900" 
      ref={scrollContainerRef}
      onScroll={handleScroll}
    >
      {extendedImages.map((src: string, i: number) => (
        <div key={i} className="min-w-full relative h-full shrink-0 snap-center">
          <Image 
            src={src}
            alt={`${productName} image ${(i % images.length) + 1}`}
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
            <button 
              key={i} 
              onClick={() => {
                if(scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({
                    left: scrollContainerRef.current.clientWidth * i,
                    behavior: 'smooth'
                  });
                  setActiveIndex(i);
                }
              }}
              className={`w-2 h-2 rounded-full backdrop-blur-md shadow-sm transition-colors cursor-pointer ${i === activeIndex ? 'bg-white scale-125' : 'bg-white/30 border border-black/10'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
