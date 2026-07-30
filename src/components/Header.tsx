import Link from 'next/link';
import Image from 'next/image';
import { Leaf } from 'lucide-react';
import TrackedLink from './TrackedLink';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg shadow-brand-red/20 group-hover:scale-105 transition-transform flex-shrink-0 bg-white">
            <Image 
              src="/logo.png" 
              alt="Annapurna Mewa Logo" 
              fill 
              className="object-contain p-1"
            />
          </div>
          <span className="font-serif text-2xl font-bold tracking-wide text-foreground group-hover:text-brand-red transition-colors whitespace-nowrap hidden sm:block">
            Annapurna <span className="text-brand-gold font-light">Mewa</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-brand-red transition-colors">Home</Link>
          <Link href="/#products" className="hover:text-brand-red transition-colors">Shop Catalog</Link>
          <Link href="/blog" className="hover:text-brand-red transition-colors">Blog</Link>
          <Link href="/#contact" className="hover:text-brand-red transition-colors">Contact</Link>
          <TrackedLink
            href="https://chat.whatsapp.com/BqA4cJRFfP0K5Cg6hzb5tl" 
            eventName="whatsapp_group_click"
            eventParams={{
              location: 'header',
              link_text: 'Join WhatsApp',
            }}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-full font-bold transition-colors shadow-sm flex items-center gap-2"
          >
            Join WhatsApp
          </TrackedLink>
        </nav>
        <div className="md:hidden">
           {/* Mobile menu could go here */}
           <Leaf className="text-brand-gold" />
        </div>
      </div>
    </header>
  );
}
