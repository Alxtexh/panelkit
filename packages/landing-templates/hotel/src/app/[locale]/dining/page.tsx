import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dining' });
  return {
    title: `${t('title')} | Can Serena`,
    description: t('description'),
  };
}

const restaurants = [
  {
    key: 'main',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
    accent: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  },
  {
    key: 'terrace',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80',
    accent: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=600&q=80',
  },
  {
    key: 'bar',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80',
    accent: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80',
  },
];

export default async function DiningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('dining');

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1920&q=80"
          alt={t('title')}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <span className="inline-block text-sm tracking-[0.3em] uppercase text-white/70 mb-4">
              {t('gastronomy')}
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

      {/* Restaurants */}
      {restaurants.map((restaurant, index) => (
        <section
          key={restaurant.key}
          className={`section-padding ${index % 2 === 0 ? 'bg-sand-50' : 'bg-white'}`}
        >
          <div className="container-wide mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={restaurant.image}
                    alt={t(`restaurants.${restaurant.key}.title`)}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-48 h-48 hidden lg:block">
                  <Image src={restaurant.accent} alt="" fill className="object-cover" />
                </div>
              </div>
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <h2 className="text-headline mb-6">{t(`restaurants.${restaurant.key}.title`)}</h2>
                <p className="text-body-large mb-8">{t(`restaurants.${restaurant.key}.description`)}</p>
                <div className="p-6 bg-stone-100 inline-block">
                  <p className="text-sm tracking-wide text-stone-600">{t(`restaurants.${restaurant.key}.hours`)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="section-padding bg-olive-900 text-white">
        <div className="container-narrow mx-auto text-center">
          <h2 className="text-headline text-white mb-6">{t('reserveTable')}</h2>
          <p className="text-xl text-white/70 leading-relaxed mb-8">{t('reserveDescription')}</p>
          <a href="mailto:dining@canserena.com" className="btn-primary bg-white text-stone-900 hover:bg-white/90">
            {t('makeReservation')}
          </a>
        </div>
      </section>
    </>
  );
}
