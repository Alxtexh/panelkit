'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function CTASection() {
  const t = useTranslations('ctaSection');

  return (
    <section id="cta" className="py-20 md:py-28 relative" aria-labelledby="cta-title">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent)]/[0.03] to-transparent" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg mx-auto"
        >
          <h2 id="cta-title" className="section-title mb-4">
            {t('title')}
          </h2>
          <p className="text-zinc-400 mb-8">
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#" className="btn-gradient">
              {t('cta')}
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a href="#" className="btn-ghost" target="_blank" rel="noopener noreferrer">
              Telegram Bot
            </a>
          </div>

          <p className="text-xs text-zinc-600 mt-6">
            {t('note')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
