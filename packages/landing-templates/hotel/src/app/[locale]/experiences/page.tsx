import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'experiences' });
  return {
    title: `${t('title')} | Can Serena`,
    description: t('description'),
  };
}

const experiences = [
  { key: 'sailing', image: 'https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=1200&q=80', duration: 'Half or full day', price: 'From €450' },
  { key: 'wine', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80', duration: '4-5 hours', price: 'From €180' },
  { key: 'cooking', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80', duration: '3 hours', price: 'From €150' },
  { key: 'hiking', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80', duration: 'Half day', price: 'From €95' },
];

const additionalKeys = ['helicopter', 'golf', 'truffle', 'artGallery', 'catamaran', 'photography'];
const additionalPrices = ['From €800', 'From €150', 'From €220', 'From €120', 'From €380', 'From €250'];

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('experiences');

  return (
    <>
      <section className="relative h-[70vh] min-h-[500px]">
        <Image src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80" alt={t('title')} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <span className="inline-block text-sm tracking-[0.3em] uppercase text-white/70 mb-4">{t('subtitle')}</span>
            <h1 className="text-display text-white mb-4">{t('title')}</h1>
            <p className="text-xl text-white/80 max-w-2xl">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-narrow mx-auto text-center">
          <p className="text-2xl md:text-3xl font-serif font-light leading-relaxed text-stone-700">{t('description')}</p>
        </div>
      </section>

      <section className="section-padding bg-sand-50">
        <div className="container-wide mx-auto">
          <h2 className="text-headline text-center mb-16">{t('signatureExperiences')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {experiences.map((exp) => (
              <div key={exp.key} className="group bg-white overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-square md:aspect-auto overflow-hidden">
                    <Image src={exp.image} alt={t(`activities.${exp.key}.title`)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-serif mb-4">{t(`activities.${exp.key}.title`)}</h3>
                    <p className="text-stone-600 mb-6 leading-relaxed">{t(`activities.${exp.key}.description`)}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                      <span className="text-sm text-stone-500">{exp.duration}</span>
                      <span className="font-medium">{exp.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide mx-auto">
          <h2 className="text-headline text-center mb-16">{t('moreToExplore')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalKeys.map((key, i) => (
              <div key={key} className="p-8 border border-stone-200 hover:border-stone-400 transition-colors">
                <h3 className="text-xl font-serif mb-2">{t(`additional.${key}`)}</h3>
                <p className="text-stone-500">{additionalPrices[i]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-stone-900 text-white">
        <div className="container-narrow mx-auto text-center">
          <h2 className="text-headline text-white mb-6">{t('designPerfectDay')}</h2>
          <p className="text-xl text-white/70 leading-relaxed mb-8">{t('conciergeDescription')}</p>
          <a href="mailto:concierge@canserena.com" className="btn-primary bg-white text-stone-900 hover:bg-white/90">{t('contactConcierge')}</a>
        </div>
      </section>
    </>
  );
}
