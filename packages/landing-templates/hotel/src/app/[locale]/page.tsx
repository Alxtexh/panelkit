import { setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections/Hero';
import { BookingWidget } from '@/components/sections/BookingWidget';

const AboutSection = dynamic(() => import('@/components/sections/AboutSection').then(m => m.AboutSection));
const RoomsPreview = dynamic(() => import('@/components/sections/RoomsPreview').then(m => m.RoomsPreview));
const MallorcaSection = dynamic(() => import('@/components/sections/MallorcaSection').then(m => m.MallorcaSection));
const ExperiencesPreview = dynamic(() => import('@/components/sections/ExperiencesPreview').then(m => m.ExperiencesPreview));

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <BookingWidget />
      <AboutSection />
      <RoomsPreview />
      <MallorcaSection />
      <ExperiencesPreview />
    </>
  );
}
