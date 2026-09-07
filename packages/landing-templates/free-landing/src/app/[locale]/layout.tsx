import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { DemoBanner } from '@/components/DemoBanner';
import { AnimationProvider } from '@/components/AnimationProvider';
import { siteConfig } from '../../../site.config';

const baseUrl = siteConfig.company.url;
const isDemoMode = process.env.DEMO_MODE === 'true';
const demoTemplateName = process.env.DEMO_TEMPLATE_NAME || 'Business Template';
const demoBuyUrl = process.env.DEMO_BUY_URL || 'https://studiomeyer.io/store';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const meta = messages.meta as { title: string; description: string };

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}`,
      locale: locale,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {isDemoMode && <DemoBanner templateName={demoTemplateName} buyUrl={demoBuyUrl} />}
      <AnimationProvider>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </AnimationProvider>
    </NextIntlClientProvider>
  );
}
