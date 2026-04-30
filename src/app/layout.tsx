import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://annapurna-mewa.vercel.app'),
  title: 'Annapurna Mewa | Premium Dry Fruits in Bangalore',
  description: 'High-quality dry fruits for daily consumption. Pan India delivery. Same-day delivery in Bangalore.',
  openGraph: {
    title: 'Annapurna Mewa | Premium Dry Fruits in Bangalore',
    description: 'High-quality dry fruits for daily consumption. Pan India delivery. Same-day delivery in Bangalore.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Annapurna Mewa',
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/icon.png',
  }
};

import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
      <body className={`${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
