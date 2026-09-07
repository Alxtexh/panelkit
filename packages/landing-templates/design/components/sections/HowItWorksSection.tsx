'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function HowItWorksSection() {
  const t = useTranslations('howItWorks');

  const steps = [
    { key: 'step1', number: '01' },
    { key: 'step2', number: '02' },
    { key: 'step3', number: '03' },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative" aria-labelledby="how-it-works-title">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 id="how-it-works-title" className="section-title">{t('title')}</h2>
          <p className="section-subtitle">{t('subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.5 }}
              className="text-center"
            >
              <span className="inline-block text-xs font-medium text-zinc-600 uppercase tracking-widest mb-4">
                {step.number}
              </span>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t(`${step.key}.title`)}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">
                {t(`${step.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
