import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import '@/styles/globals.css'
import { siteConfig } from '../../site.config'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const { company, seo } = siteConfig;
const titleString = `${company.name} | ${company.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: titleString,
  description: company.description,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: titleString,
    description: company.description,
    url: company.url,
    siteName: company.name,
    images: [{ url: seo.ogImage, width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: titleString,
    description: company.description,
    images: [seo.ogImage],
  },
  alternates: {
    canonical: company.url,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Preload hero image for faster LCP */}
        <link rel="preload" href="/hero-office.png" as="image" type="image/png" />
      </head>
      <body className="antialiased bg-cream text-accent">{children}</body>
    </html>
  )
}
