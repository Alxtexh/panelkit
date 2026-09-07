import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
})

// ✅ Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

// ✅ Static Metadata (keep this only)
export const metadata: Metadata = {
  title: "SaaSify - Modern SaaS Solution for Your Business",
  description:
    "Transform your business with our cutting-edge SaaS platform. Streamline operations, boost productivity, and scale effortlessly with advanced analytics and automation.",
  keywords: "SaaS, business software, productivity, automation, cloud platform, analytics, dashboard",
  manifest: "/manifest.json",
  authors: [{ name: "SaaSify Team" }],
  creator: "SaaSify",
  publisher: "SaaSify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://saasify-template.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SaaSify - Modern SaaS Solution for Your Business",
    description:
      "Transform your business with our cutting-edge SaaS platform. Streamline operations, boost productivity, and scale effortlessly.",
    url: "https://saasify-template.vercel.app",
    siteName: "SaaSify",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SaaSify - Modern SaaS Solution",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaSify - Modern SaaS Solution for Your Business",
    description:
      "Transform your business with our cutting-edge SaaS platform. Streamline operations, boost productivity, and scale effortlessly.",
    images: ["/og-image.jpg"],
    creator: "@saasify",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
