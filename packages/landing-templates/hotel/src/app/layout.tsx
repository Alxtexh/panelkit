import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
  preload: true,
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hotel.studiomeyer.io'),
  title: 'Can Serena | Boutique Hotel Mallorca',
  description: 'Erleben Sie zeitlose Eleganz im Herzen Mallorcas. Can Serena – Ihr exklusives Boutique-Hotel mit erstklassigem Service und mediterranem Charme.',
  openGraph: {
    title: 'Can Serena | Boutique Hotel Mallorca',
    description: 'Erleben Sie zeitlose Eleganz im Herzen Mallorcas. Can Serena – Ihr exklusives Boutique-Hotel.',
    url: 'https://hotel.studiomeyer.io',
    siteName: 'Can Serena',
    images: [{ url: '/og-image.webp', width: 1792, height: 1024, alt: 'Can Serena - Boutique Hotel Mallorca' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Can Serena | Boutique Hotel Mallorca',
    description: 'Erleben Sie zeitlose Eleganz im Herzen Mallorcas.',
    images: ['/og-image.webp'],
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.webp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" dir="ltr" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#1c1917" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Hotel',
              name: 'Can Serena',
              description: 'Boutique Hotel in the heart of Mallorca',
              url: 'https://hotel.studiomeyer.io',
              image: 'https://hotel.studiomeyer.io/og-image.jpg',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Mallorca',
                addressCountry: 'ES',
              },
              starRating: {
                '@type': 'Rating',
                ratingValue: '5',
              },
            }),
          }}
        />
      </head>
      <body className={`${cormorant.variable} ${inter.variable} font-sans antialiased bg-sand-50 text-stone-900`}>
        {children}
      </body>
    </html>
  );
}
