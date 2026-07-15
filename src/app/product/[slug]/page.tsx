import { Metadata } from 'next';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { getRelatedBlogGuides } from '@/data/internalLinks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpenText, CheckCircle2, ChevronLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { productBySlugQuery } from '@/sanity/lib/queries';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import {
  buildProductJsonLd,
  getProductDescription,
  getProductImages,
  getProductTitle,
  getProductUrl,
  jsonLdStringify,
  SeoProduct,
} from '@/lib/seo';

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export const revalidate = 10; // Revalidate the page every 10 seconds

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  
  const hasSanityConfig = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'yoursanityprojectid';
  let product: SeoProduct | null = null;
  
  if (hasSanityConfig) {
    product = await client.fetch(productBySlugQuery, { slug: slug });
  } else {
    product = MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }

  if (!product) {
    return {
      title: 'Product Not Found | Annapurna Mewa',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = getProductTitle(product);
  const description = getProductDescription(product);
  const images = getProductImages(product);
  const url = getProductUrl(product);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Annapurna Mewa',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: images[0],
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [images[0]],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // If no sanity project ID is configured yet, fall back to mock data
  const hasSanityConfig = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'yoursanityprojectid';
  
  let product: SeoProduct | null = null;
  
  if (hasSanityConfig) {
    product = await client.fetch(productBySlugQuery, { slug: slug });
  } else {
    product = MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }

  if (!product) {
    notFound();
  }

  const validImagePaths = (product.imagePaths || []).filter(Boolean);
  const firstImage = validImagePaths[0] || product.imagePath;
  const imageSource = firstImage?.includes('placeholder') || !firstImage ? '/images/hero.png' : firstImage;
  const imagesToRender = validImagePaths.length > 0 ? validImagePaths : [imageSource];
  const productJsonLd = buildProductJsonLd(product);
  const relatedGuides = getRelatedBlogGuides({
    name: product.name,
    category: product.category,
    slug: product.slug,
    limit: 3,
  });
  const phoneNumber = '917259496740';
  const whatsappMessage = encodeURIComponent(`Hi Shikha, I'm interested in purchasing the ${product.name} from Annapurna Mewa. Could you please share more details?`);
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdStringify(productJsonLd) }}
      />
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link href="/#products" className="inline-flex items-center gap-2 text-brand-red hover:text-red-700 font-medium mb-8 transition-colors">
          <ChevronLeft size={20} /> Back to Catalog
        </Link>
        
        <div className="glass rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          
          {/* Image Section */}
          <ProductImageCarousel 
            images={imagesToRender} 
            productName={product.name} 
            category={product.category || ''} 
          />
          
          {/* Content Section */}
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">{product.name}</h1>
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              {product.description}
            </p>
            
            <div className="mb-10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/50 mb-4">Pricing Options</h3>
              <div className="grid gap-3">
                {product.prices?.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-brand-gold/50 transition-colors">
                    <span className="font-medium text-lg text-foreground">
                      {p.weight?.replace(/gr/i, ' Gms')?.replace(/kg/i, ' Kg')}
                    </span>
                    <span className="font-bold text-xl text-brand-gold">₹{p.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 mt-auto">
               <a 
                 href={whatsappLink} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-2xl flex justify-center items-center gap-3 transition-transform hover:scale-105 shadow-lg shadow-[#25D366]/30"
               >
                 <MessageCircle size={24} />
                 Inquire via WhatsApp
               </a>
               <p className="text-xs text-center text-foreground/50 font-medium">
                 Connect directly with Shikha. Easy query and order process.
               </p>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-4 text-sm font-medium text-foreground/70">
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="text-brand-gold" size={18} /> Pan India Delivery
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="text-brand-gold" size={18} /> Same-day (Bangalore)
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="text-brand-gold" size={18} /> Handpicked Quality
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="text-brand-gold" size={18} /> Secure Packaging
               </div>
            </div>
          </div>
          
        </div>

        {relatedGuides.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <BookOpenText className="text-brand-gold" size={24} />
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/50">Helpful buying guides</p>
                <h2 className="text-3xl font-serif font-bold text-foreground">Learn before you buy</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={guide.href}
                  className="group rounded-2xl bg-white/60 border border-foreground/10 p-5 hover:border-brand-gold/60 hover:bg-brand-gold/10 transition-colors"
                >
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-brand-red transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-foreground/65 leading-6 mb-5">
                    {guide.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red">
                    Read guide <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
