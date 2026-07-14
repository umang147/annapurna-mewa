import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { buildLocalBusinessJsonLd, defaultSeoDescription, siteUrl } from '@/lib/seo';

const outfit = Outfit({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Annapurna Mewa | Premium Dry Fruits in Bangalore',
  description: defaultSeoDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Annapurna Mewa | Premium Dry Fruits in Bangalore',
    description: defaultSeoDescription,
    url: siteUrl,
    type: 'website',
    locale: 'en_IN',
    siteName: 'Annapurna Mewa',
    images: [
      {
        url: '/images/hero.png',
        width: 1200,
        height: 630,
        alt: 'Premium dry fruits from Annapurna Mewa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Annapurna Mewa | Premium Dry Fruits in Bangalore',
    description: defaultSeoDescription,
    images: ['/images/hero.png'],
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessJsonLd = buildLocalBusinessJsonLd();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M66KP56TTK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-M66KP56TTK');
          `}
        </Script>
      </head>
      <body className={`${outfit.variable} antialiased`}>{children}</body>
    </html>
  );
}
