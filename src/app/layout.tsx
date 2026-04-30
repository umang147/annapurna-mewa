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
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
