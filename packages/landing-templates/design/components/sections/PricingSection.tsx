'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const plans = ['free', 'plus', 'pro', 'business'] as const;

export default function PricingSection() {
  const t = useTranslations('pricing');

  return (
    <section id="pricing" className="py-20 md:py-28" aria-labelledby="pricing-title">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 id="pricing-title" className="section-title">{t('title')}</h2>
          <p className="section-subtitle">{t('subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto" role="list" aria-label="Pricing plans">
          {plans.map((plan, i) => {
            const isPro = plan === 'pro';
            const price = parseInt(t(`plans.${plan}.price`));
            const features = t.raw(`plans.${plan}.features`) as string[];

            return (
              <motion.article
                key={plan}
                role="listitem"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative rounded-lg p-6 ${
                  isPro
                    ? 'bg-[var(--color-surface)] border-2 border-[var(--color-accent)]'
                    : 'bg-[var(--color-surface)] border border-[var(--color-border)]'
                }`}
                aria-label={`${t(`plans.${plan}.name`)} plan`}
              >
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-[var(--color-accent)] text-white text-xs font-medium rounded-md">
                      {t('popular')}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-white mb-1">
                  {t(`plans.${plan}.name`)}
                </h3>
                <p className="text-zinc-500 text-sm mb-5">
                  {t(`plans.${plan}.description`)}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{price === 0 ? '0' : price}</span>
                  <span className="text-zinc-500 ml-1 text-sm">{price === 0 ? '' : `EUR${t('perMonth')}`}</span>
                </div>

                <ul className="space-y-3 mb-6" aria-label={`${t(`plans.${plan}.name`)} features`}>
                  {features.map((feature: string, j: number) => (
                    <li key={j} className="flex items-start gap-2.5 text-zinc-400 text-sm">
                      <svg className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#"
                  className={`block w-full py-3 rounded-md font-medium transition-all text-center text-sm ${
                    isPro
                      ? 'btn-gradient'
                      : 'bg-white/5 text-white hover:bg-white/10 border border-[var(--color-border)]'
                  }`}
                >
                  {t('cta')}
                </a>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
