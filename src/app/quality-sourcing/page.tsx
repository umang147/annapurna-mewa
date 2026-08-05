import type { Metadata } from 'next';
import TrustPage from '@/components/TrustPage';
import { TRUST_PAGES } from '@/data/trustPages';
import { absoluteUrl, brandName } from '@/lib/seo';

const page = TRUST_PAGES.quality;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: {
    canonical: absoluteUrl(page.href),
  },
  openGraph: {
    title: page.metaTitle,
    description: page.metaDescription,
    url: absoluteUrl(page.href),
    siteName: brandName,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function QualitySourcingPage() {
  return <TrustPage page={page} />;
}
