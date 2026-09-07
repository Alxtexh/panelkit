import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/sections/HeroSection';
import { ClientsSection } from '@/components/sections/ClientsSection';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { WorkSection } from '@/components/sections/WorkSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { AwardsSection } from '@/components/sections/AwardsSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <ClientsSection />
      <MarqueeSection />
      <ServicesSection />
      <WorkSection />
      <AboutSection />
      <AwardsSection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
