import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'wellness' });
  return {
    title: `${t('title')} | Can Serena`,
    description: t('description'),
  };
}

export default async function WellnessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('wellness');

  const treatments = [
    {
      key: 'signature',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
      duration: '90 min',
      price: '€180',
    },
    {
      key: 'hammam',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
      duration: '75 min',
      price: '€150',
    },
    {
      key: 'yoga',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      duration: '60 min',
      priceKey: 'complimentary',
    },
  ];

  const facilities = [
    {
      key: 'pool',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0a2 2 0 002-2V8a2 2 0 00-2 2v6a2 2 0 002 2zm14 0a2 2 0 01-2-2V8a2 2 0 012 2v6a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: 'sauna',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      key: 'gym',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      key: 'garden',
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&q=80"
          alt={t('title')}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <span className="inline-block text-sm tracking-[0.3em] uppercase text-white/70 mb-4">
              {t('title')}
            </span>
            <h1 className="text-display text-white mb-4">{t('title')}</h1>
            <p className="text-xl text-white/80 max-w-2xl">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-white">
        <div className="container-narrow mx-auto text-center">
          <p className="text-2xl md:text-3xl font-serif font-light leading-relaxed text-stone-700">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Treatments */}
      <section className="section-padding bg-sand-50">
        <div className="container-wide mx-auto">
          <h2 className="text-headline text-center mb-16">{t('signatureTreatments')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {treatments.map((treatment) => (
              <div key={treatment.key} className="bg-white group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={treatment.image}
                    alt={t(`treatments.${treatment.key}.title`)}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-serif mb-4">
                    {t(`treatments.${treatment.key}.title`)}
                  </h3>
                  <p className="text-stone-600 mb-6 leading-relaxed">
                    {t(`treatments.${treatment.key}.description`)}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                    <span className="text-sm text-stone-500">{treatment.duration}</span>
                    <span className="font-medium">
                      {treatment.priceKey ? t(treatment.priceKey) : treatment.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section-padding bg-stone-900 text-white">
        <div className="container-wide mx-auto">
          <h2 className="text-headline text-white text-center mb-16">{t('spaFacilities')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility) => (
              <div key={facility.key} className="text-center p-8 border border-white/10">
                <div className="inline-flex items-center justify-center mb-6 text-olive-300">
                  {facility.icon}
                </div>
                <p className="text-lg text-white/90">{t(`facilities.${facility.key}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-olive-50">
        <div className="container-narrow mx-auto text-center">
          <h2 className="text-headline mb-6">{t('beginWellnessJourney')}</h2>
          <p className="text-body-large mb-8">{t('wellnessCta')}</p>
          <a href="mailto:spa@canserena.com" className="btn-primary">
            {t('bookTreatment')}
          </a>
        </div>
      </section>
    </>
  );
}
