import { Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SEO_HUBS } from '@/data/seoHubs';
import { TRUST_PAGE_LINKS } from '@/data/trustPages';
import TrackedLink from './TrackedLink';

export default function Footer() {
  return (
    <footer id="contact" className="bg-neutral-900 text-neutral-300 py-12 mt-20 border-t-4 border-brand-red">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-3 mb-4">
             <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white flex-shrink-0">
               <Image 
                 src="/logo.png" 
                 alt="Annapurna Mewa Logo" 
                 fill 
                 sizes="48px"
                 className="object-contain p-1"
               />
             </div>
             <span className="font-serif text-xl font-bold text-white">
               Annapurna <span className="text-brand-gold font-light">Mewa</span>
             </span>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            Providing Bangalore and the whole of India with premium quality dry fruits for healthy daily consumption and gifting.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-brand-gold transition-colors">Home</Link></li>
            <li><Link href="/#products" className="hover:text-brand-gold transition-colors">Products</Link></li>
            <li><Link href="/blog" className="hover:text-brand-gold transition-colors">Blog</Link></li>
            <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Annapurna Mewa</Link></li>
            <li><Link href={SEO_HUBS[0].href} className="hover:text-brand-gold transition-colors">{SEO_HUBS[0].title}</Link></li>
            <li><Link href={SEO_HUBS[1].href} className="hover:text-brand-gold transition-colors">{SEO_HUBS[1].title}</Link></li>
            <li><Link href={SEO_HUBS[2].href} className="hover:text-brand-gold transition-colors">{SEO_HUBS[2].title}</Link></li>
            {TRUST_PAGE_LINKS.slice(1).map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="hover:text-brand-gold transition-colors">{page.title}</Link>
              </li>
            ))}
            <li><Link href="/blog/dry-fruits-in-bangalore" className="hover:text-brand-gold transition-colors">Dry Fruits in Bangalore</Link></li>
            <li><Link href="/blog/dry-fruits-price-in-bangalore" className="hover:text-brand-gold transition-colors">Dry Fruits Price Guide</Link></li>
            <li>
              <TrackedLink
                href="https://chat.whatsapp.com/BqA4cJRFfP0K5Cg6hzb5tl" 
                eventName="whatsapp_group_click"
                eventParams={{
                  location: 'footer',
                  link_text: 'Join WhatsApp Group',
                }}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#25D366] hover:text-[#20bd5a] font-medium transition-colors"
              >
                Join WhatsApp Group
              </TrackedLink>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <span className="p-2 bg-neutral-800 rounded-full text-brand-gold">
                <Phone size={16} />
              </span>
              <span>+91 7259496740</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="p-2 bg-neutral-800 rounded-full text-brand-gold">
                <Mail size={16} />
              </span>
              <span>shikhasinghania56.ss@gmail.com</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="p-2 bg-neutral-800 rounded-full text-brand-gold">
                <MapPin size={16} />
              </span>
              <span>Bangalore, India</span>
            </li>
          </ul>
          <p className="mt-4 text-xs font-semibold text-brand-gold">Contact Person: Shikha Singhania</p>
          <div className="mt-4 space-y-1 text-xs text-neutral-400">
            <p>GST No.: 20ABSPA3006B1ZN</p>
            <p>FSSAI No.: 11121017000105</p>
          </div>
        </div>
      </div>
      <div className="text-center mt-12 pt-8 border-t border-neutral-800 text-xs">
        <p>&copy; {new Date().getFullYear()} Annapurna Mewa. All rights reserved.</p>
      </div>
    </footer>
  );
}
