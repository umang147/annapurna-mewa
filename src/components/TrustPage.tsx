import { CheckCircle2, ChevronLeft, HelpCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrackedLink from '@/components/TrackedLink';
import {
  getTrustPageFaqJsonLd,
  getTrustPageJsonLd,
  TrustPage as TrustPageData,
} from '@/data/trustPages';
import { absoluteUrl, buildBreadcrumbJsonLd, jsonLdStringify } from '@/lib/seo';

export default function TrustPage({ page }: { page: TrustPageData }) {
  const whatsappLink = `https://wa.me/917259496740?text=${encodeURIComponent(page.ctaMessage)}`;
  const webPageJsonLd = getTrustPageJsonLd(page);
  const faqJsonLd = getTrustPageFaqJsonLd(page);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: absoluteUrl('/') },
    { name: page.title, url: absoluteUrl(page.href) },
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdStringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdStringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdStringify(faqJsonLd) }}
      />
      <Header />

      <main className="flex-grow">
        <section className="bg-neutral-900 text-white px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-brand-gold hover:text-white font-semibold mb-8 transition-colors">
              <ChevronLeft size={20} /> Back to Home
            </Link>
            <p className="text-brand-gold font-semibold uppercase tracking-[0.25em] text-sm mb-4">
              {page.eyebrow}
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              {page.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-neutral-200 leading-relaxed max-w-3xl">
              {page.heroText}
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-2xl bg-white/60 border border-foreground/10 p-6 md:p-8 mb-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">
              Quick answer
            </p>
            <p className="text-xl leading-8 text-foreground/80">
              {page.quickAnswer}
            </p>
          </div>

          <div className="space-y-12">
            {page.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                  {section.title}
                </h2>
                <p className="text-lg text-foreground/75 leading-8">
                  {section.body}
                </p>
                {section.bullets?.length ? (
                  <div className="mt-5 grid gap-3">
                    {section.bullets.map((bullet) => (
                      <div key={bullet} className="flex gap-3 text-foreground/75 leading-7">
                        <CheckCircle2 className="text-brand-gold mt-0.5 flex-shrink-0" size={20} />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}
          </div>

          <section className="mt-14">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="text-brand-gold" size={24} />
              <h2 className="text-3xl font-serif font-bold text-foreground">FAQs</h2>
            </div>
            <div className="space-y-4">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl bg-white/60 border border-foreground/10 p-5">
                  <h3 className="font-bold text-lg text-foreground mb-2">{faq.question}</h3>
                  <p className="text-foreground/70 leading-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-12 rounded-2xl bg-neutral-900 text-white p-6 md:p-8">
            <h2 className="text-2xl font-serif font-bold mb-3">{page.ctaTitle}</h2>
            <p className="text-neutral-300 mb-5">{page.ctaText}</p>
            <TrackedLink
              href={whatsappLink}
              eventName="whatsapp_inquiry_click"
              eventParams={{
                page_slug: page.slug,
                cta_label: 'Ask on WhatsApp',
                location: 'trust_page_bottom_cta',
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3 px-6 rounded-full transition-colors"
            >
              <MessageCircle size={20} />
              Ask on WhatsApp
            </TrackedLink>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
