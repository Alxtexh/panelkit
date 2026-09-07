'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';

const highlights = [
  {
    key: 'serra',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    key: 'beaches',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
  },
  {
    key: 'culture',
    image: 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800&q=80',
  },
  {
    key: 'gastronomy',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  },
];

export function MallorcaSection() {
  const t = useTranslations('mallorca');

  return (
    <section className="section-padding bg-stone-900 text-white">
      <div className="container-wide mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-sm tracking-[0.3em] uppercase text-white/50 mb-4">
            {t('subtitle')}
          </span>
          <AnimatedHeading as="h2" className="text-headline text-white mb-6">{t('title')}</AnimatedHeading>
          <p className="text-xl text-white/70 leading-relaxed">{t('description')}</p>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-[16/10] overflow-hidden"
            >
              <Image
                src={item.image}
                alt={t(`highlights.${item.key}.title`)}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjkyNTI0Ii8+PC9zdmc+"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-serif mb-2">
                  {t(`highlights.${item.key}.title`)}
                </h3>
                <p className="text-white/70 max-w-md">
                  {t(`highlights.${item.key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
