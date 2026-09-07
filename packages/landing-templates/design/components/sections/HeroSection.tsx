'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('hero');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -80]);

  const stats = [
    { value: '4', label: t('stats.providers') },
    { value: '16', label: t('stats.memoryFeatures') },
    { value: '41', label: t('stats.apiEndpoints') },
  ];

  return (
    <section ref={heroRef} className="saas-hero">
      <motion.div className="saas-hero__mesh" aria-hidden="true">
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }}
            animate={{ x: ['-10%', '10%', '-10%'], y: ['-5%', '5%', '-5%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            initial={{ top: '20%', left: '30%' }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
            animate={{ x: ['5%', '-5%', '5%'], y: ['8%', '-8%', '8%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            initial={{ bottom: '20%', right: '20%' }}
          />
        </div>
        <div className="saas-hero__overlay" />
      </motion.div>

      <motion.div className="saas-hero__content pt-20" style={{ opacity: contentOpacity, y: contentY }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.03] mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] opacity-70" />
          <span className="text-xs font-medium text-zinc-400">{t('badge')}</span>
        </motion.div>

        <motion.h1
          className="saas-hero__headline"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {t('headline')}
          <br />
          <span className="gradient-text">{t('headlineHighlight')}</span>
        </motion.h1>

        <motion.p
          className="saas-hero__subline"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {t('subline')}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <a href="#" className="btn-gradient">
            {t('ctaPrimary')}
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a href="#" className="btn-ghost" target="_blank" rel="noopener noreferrer">
            <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {t('ctaSecondary')}
          </a>
        </motion.div>

        <motion.div
          className="flex gap-12 md:gap-16 justify-center flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <span className="block text-2xl md:text-3xl font-semibold text-white tabular-nums">{stat.value}</span>
              <span className="block text-xs uppercase tracking-widest text-zinc-500 mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
