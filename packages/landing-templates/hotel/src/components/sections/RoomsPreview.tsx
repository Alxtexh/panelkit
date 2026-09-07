'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { TiltCard } from '@/components/ui/TiltCard';

const roomImages = [
  {
    key: 'garden',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
  },
  {
    key: 'terrace',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  },
  {
    key: 'master',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  },
];

export function RoomsPreview() {
  const t = useTranslations('rooms');

  return (
    <section className="section-padding bg-sand-50">
      <div className="container-wide mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-sm tracking-[0.3em] uppercase text-stone-500 mb-4">
            {t('subtitle')}
          </span>
          <AnimatedHeading as="h2" className="text-headline mb-6">{t('title')}</AnimatedHeading>
          <p className="text-body-large">{t('description')}</p>
        </motion.div>

        {/* Room Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {roomImages.map((room, index) => (
            <motion.div
              key={room.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link href="/rooms" className="block">
                <TiltCard intensity={0.3} perspective={1200} glare>
                <div className="relative aspect-[3/4] mb-6 overflow-hidden">
                  <Image
                    src={room.image}
                    alt={t(`types.${room.key}.title`)}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDRjNGE4Ii8+PC9zdmc+"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-serif mb-2 group-hover:text-olive-600 transition-colors">
                      {t(`types.${room.key}.title`)}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {t(`types.${room.key}.size`)}
                    </p>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-stone-400 group-hover:text-olive-600 group-hover:translate-x-1 transition-all" />
                </div>
                </TiltCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Amenities Note */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-stone-500 mt-12 max-w-2xl mx-auto"
        >
          {t('amenities')}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/rooms" className="btn-secondary">
            {t('viewAll')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
