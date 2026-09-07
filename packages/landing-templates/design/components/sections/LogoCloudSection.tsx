'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const techs = ['Next.js', 'React', 'PostgreSQL', 'Prisma', 'Tailwind', 'TypeScript'];

export default function LogoCloudSection() {
  const t = useTranslations('logoCloud');

  return (
    <section className="py-12 md:py-16 border-t border-white/5" aria-labelledby="logo-cloud-title">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.p
          id="logo-cloud-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center text-xs uppercase tracking-widest text-zinc-600 mb-8"
        >
          {t('title')}
        </motion.p>

        <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
          {techs.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.3 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
              className="text-sm font-medium text-zinc-500 tracking-wide"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
