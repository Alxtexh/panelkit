import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import '../globals.css';

import Navigation from '@/components/sections/Navigation';
import CustomCursor from '@/components/effects/CustomCursor';
import NoiseOverlay from '@/components/effects/NoiseOverlay';
import { siteConfig } from '../../site.config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const { company, seo, hours, links } = siteConfig;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: seo.themeColor,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const title = t('title');
  const description = t('description');

  const keywordsByLocale: Record<string, string[]> = {
    en: [
      'AI Workspace',
      'Knowledge Graph Memory',
      'AI with memory',
      'Claude API',
      'GPT workspace',
      'Multi-Provider AI',
      'AI chatbot memory',
      'BYOK encryption',
      'AI Telegram Bot',
      'Visual Workflow Engine',
      'Research Agent',
      'RAG pipeline',
      'AI API endpoints',
      'Ollama workspace',
      'OpenRouter',
      'persistent AI memory',
      'AI tools',
      'MCP integration',
    ],
    de: [
      'AI Workspace',
      'Knowledge Graph Memory',
      'KI mit Gedaechtnis',
      'Claude API',
      'GPT Workspace',
      'Multi-Provider KI',
      'KI Chatbot Memory',
      'BYOK Verschluesselung',
      'KI Telegram Bot',
      'Visual Workflow Engine',
      'Research Agent',
      'RAG Pipeline',
      'KI API Endpunkte',
      'Ollama Workspace',
      'OpenRouter',
      'persistentes KI Memory',
      'KI Tools',
      'MCP Integration',
    ],
    es: [
      'AI Workspace',
      'Knowledge Graph Memory',
      'IA con memoria',
      'Claude API',
      'GPT workspace',
      'IA Multi-Provider',
      'chatbot IA memoria',
      'cifrado BYOK',
      'Telegram Bot IA',
      'Visual Workflow Engine',
      'Research Agent',
      'RAG pipeline',
      'API endpoints IA',
      'Ollama workspace',
      'OpenRouter',
      'memoria IA persistente',
      'herramientas IA',
      'integracion MCP',
    ],
  };

  return {
    metadataBase: new URL(company.url),
    title: {
      default: title,
      template: `%s | ${company.name}`,
    },
    description,
    keywords: keywordsByLocale[locale] ?? keywordsByLocale.en,
    authors: [{ name: company.name, url: company.url }],
    creator: company.name,
    publisher: company.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'de' ? 'de_DE' : locale === 'es' ? 'es_ES' : 'en_US',
      url: `${company.url}/${locale}`,
      siteName: company.name,
      images: [
        {
          url: seo.ogImage,
          width: 1792,
          height: 1024,
          alt: `${company.name} — AI Workspace with Knowledge Graph Memory`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: `@${siteConfig.social.twitter}`,
      creator: `@${siteConfig.social.twitter}`,
      title,
      description,
      images: [seo.ogImage],
    },
    alternates: {
      canonical: `${company.url}/${locale}`,
      languages: {
        en: `${company.url}/en`,
        de: `${company.url}/de`,
        es: `${company.url}/es`,
        'x-default': `${company.url}/en`,
      },
    },
    category: 'technology',
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function JsonLd() {
  const faqItems = [
    {
      q: 'What is Knowledge Graph Memory?',
      a: 'Most AI chatbots store preferences as simple key-value pairs. AI Workspace uses a knowledge graph with entities, relations, and confidence scoring. The system detects contradictions, links knowledge across conversations, and builds genuine understanding over time.',
    },
    {
      q: 'Which AI models are supported?',
      a: 'Claude (Anthropic), GPT (OpenAI), Ollama (local models), and OpenRouter (100+ models). Bring your own API key to remove message limits.',
    },
    {
      q: 'How is my data protected?',
      a: 'Per-user envelope encryption with AES-256-GCM. Bring Your Own Key (BYOK) for maximum control. GDPR compliant with full account deletion.',
    },
    {
      q: 'What does the Research Agent do?',
      a: 'The Research Agent searches the web via SearXNG and Tavily, extracts content, synthesizes findings, and stores results in your knowledge graph.',
    },
    {
      q: 'Is there an API?',
      a: 'Yes — 41 RESTful endpoints with bearer token authentication. Manage chats, workflows, memories, and MCP servers programmatically.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes. No minimum contract, no hidden fees. Upgrade, downgrade, or cancel at any time. Data export is always available.',
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${company.url}/#app`,
        name: `${company.name} AI Workspace`,
        description: company.description,
        url: company.url,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: [
          { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'EUR' },
          { '@type': 'Offer', name: 'Plus', price: '19', priceCurrency: 'EUR', billingIncrement: 'P1M' },
          { '@type': 'Offer', name: 'Pro', price: '49', priceCurrency: 'EUR', billingIncrement: 'P1M' },
          { '@type': 'Offer', name: 'Business', price: '149', priceCurrency: 'EUR', billingIncrement: 'P1M' },
        ],
        featureList: [
          'Knowledge Graph Memory with 16 features',
          'Multi-Provider: Claude, GPT, Ollama, OpenRouter',
          'Visual Workflow Engine with AI Builder',
          '41 RESTful API Endpoints',
          'Telegram Bot with streaming',
          'BYOK AES-256-GCM Encryption',
          'Research Agent with web search',
          'RAG Pipeline for documents',
          'Flux Image Generation',
          'MCP Integration',
        ],
      },
      {
        '@type': 'Organization',
        '@id': `${company.url}/#organization`,
        name: company.name,
        url: company.url,
        email: siteConfig.contact.email,
        logo: `${company.url}/icon.png`,
        sameAs: [
          links.twitter,
          links.github,
          links.telegram,
        ],
        openingHoursSpecification: hours.structured.map((slot) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: slot.days,
          opens: slot.opens,
          closes: slot.closes,
        })),
      },
      {
        '@type': 'WebSite',
        '@id': `${company.url}/#website`,
        url: company.url,
        name: company.name,
        description: company.description,
        publisher: { '@id': `${company.url}/#organization` },
        inLanguage: ['en', 'de', 'es'],
      },
      {
        '@type': 'FAQPage',
        '@id': `${company.url}/#faq`,
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body className="font-sans antialiased bg-[#09090b] text-white">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-6 focus:py-3 focus:bg-[var(--color-accent)] focus:text-white focus:rounded-md focus:font-medium"
          >
            Skip to main content
          </a>
          <CustomCursor />
          <NoiseOverlay />
          <Navigation />
          <main id="main-content" role="main" tabIndex={-1}>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
