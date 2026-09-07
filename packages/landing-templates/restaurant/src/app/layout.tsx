import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AURELIA | Fine Dining Restaurant',
  description: 'Experience culinary excellence with our seasonal tasting menus and curated wine selection.',
  keywords: ['restaurant', 'fine dining', 'tasting menu', 'michelin', 'gourmet'],
  openGraph: {
    title: 'AURELIA | Fine Dining Restaurant',
    description: 'Experience culinary excellence with our seasonal tasting menus.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased bg-neutral-100 text-neutral-200 font-sans">
        {children}
      </body>
    </html>
  )
}
