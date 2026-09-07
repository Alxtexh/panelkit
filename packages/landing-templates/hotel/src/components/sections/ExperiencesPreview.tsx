'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';

const experiences = [
  {
    key: 'sailing',
    image: 'https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=800&q=80',
  },
  {
    key: 'wine',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
  },
  {
    key: 'cooking',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
  },
  {
    key: 'hiking',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
  },
];

export function ExperiencesPreview() {
  const t = useTranslations('experiences');

  return (
    <section className="section-padding bg-white">
      <div className="container-wide mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-12 items-end mb-16"
        >
          <div>
            <span className="inline-block text-sm tracking-[0.3em] uppercase text-stone-500 mb-4">
              {t('subtitle')}
            </span>
            <AnimatedHeading as="h2" className="text-headline">{t('title')}</AnimatedHeading>
          </div>
          <p className="text-body-large">{t('description')}</p>
        </motion.div>

        {/* Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory lg:snap-none">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex-shrink-0 w-72 lg:w-auto snap-start"
            >
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] mb-6 overflow-hidden">
                  <Image
                    src={exp.image}
                    alt={t(`activities.${exp.key}.title`)}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 288px, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDRjNGE4Ii8+PC9zdmc+"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-serif text-white mb-2">
                      {t(`activities.${exp.key}.title`)}
                    </h3>
                  </div>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  {t(`activities.${exp.key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/experiences" className="btn-secondary">
            {t('viewAll')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
