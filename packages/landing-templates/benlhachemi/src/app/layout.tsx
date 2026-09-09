import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LenisProvider from "@/providers/lenis";

const dmSans = DM_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


/*
 * TEMPLATE-LEVEL FALLBACKS, NOT AN INSTALLATION'S BRANDING. This is a
 * reusable landing template vendored into the monorepo, not a specific
 * tenant's site - hardcoding a real business name and copy here would mean
 * every installation that adopts this template inherits somebody else's
 * brand until they think to open this file. The actual served document gets
 * its title, description, Open Graph tags and JSON-LD rewritten per request
 * by `App\Support\LandingSeoInjector`, from settings `App\Support\LandingSeoSettings`
 * reads out of `PanelSettings` - these values only show if that layer is
 * ever bypassed (a raw `next build` preview, say).
 */
const title = "PanelKit";
const description = "Admin panel and business management, built with PanelKit.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: title,
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  alternates: {
    canonical: "/",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: title,
  description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.className} antialiased w-full min-h-screen overflow-x-hidden`}
      >
        <Script src="/panelkit-landing-bridge.js" strategy="afterInteractive" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
