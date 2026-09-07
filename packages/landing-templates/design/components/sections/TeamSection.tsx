'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const agentKeys = ['ceo', 'cto', 'cmo', 'github', 'support', 'dev', 'revops', 'apisales', 'onboarding'] as const;

const agentImages: Record<string, string> = {
  ceo: '/team/ceo.webp',
  cto: '/team/cto.webp',
  cmo: '/team/cmo.webp',
  github: '/team/github.webp',
  support: '/team/support.webp',
  dev: '/team/dev.webp',
  revops: '/team/revops.webp',
  apisales: '/team/apisales.webp',
  onboarding: '/team/onboarding.webp',
};

export default function TeamSection() {
  const t = useTranslations('team');

  return (
    <section id="team" className="py-20 md:py-28" aria-labelledby="team-title">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4">
            {t('aiPowered')}
          </span>
          <h2 id="team-title" className="section-title">{t('title')}</h2>
          <p className="section-subtitle max-w-2xl mx-auto">{t('description')}</p>
        </motion.div>

        {/* Agent Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-5 max-w-4xl mx-auto mb-16">
          {agentKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="card group text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border border-white/[0.08] group-hover:border-[var(--color-accent)]/30 transition-colors">
                <Image
                  src={agentImages[key]}
                  alt={t(`roles.${key}.name`)}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <h3 className="text-base font-semibold text-white mb-0.5">
                {t(`roles.${key}.name`)}
              </h3>
              <p className="text-xs text-[var(--color-accent)] font-medium mb-2">
                {t(`roles.${key}.role`)}
              </p>
              <p className="text-zinc-500 text-xs leading-relaxed">
                {t(`roles.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Story Block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="card">
            <span className="inline-block text-xs font-medium tracking-widest uppercase text-[var(--color-accent)] mb-3">
              {t('sharedLabel')}
            </span>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {t('sharedText')}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/[0.06]">
              {[
                { value: '9', label: t('stat1') },
                { value: '24/7', label: t('stat2') },
                { value: '65', label: t('stat3') },
                { value: '157+', label: t('stat4') },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-lg md:text-xl font-semibold text-white">{stat.value}</p>
                  <p className="text-[10px] md:text-xs text-zinc-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
