'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function AboutSection() {
  const t = useTranslations('about');

  return (
    <section id="about" className="py-20 md:py-28 border-t border-white/[0.04]" aria-labelledby="about-title">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <span className="inline-block text-xs font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4">
              {t('label')}
            </span>
            <h2 id="about-title" className="section-title">{t('title')}</h2>
          </motion.div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Story Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-white mb-3">{t('storyTitle')}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-3">{t('storyText')}</p>
              <p className="text-zinc-500 text-sm leading-relaxed">{t('storyText2')}</p>
            </motion.div>

            {/* Principles Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-white mb-3">{t('principlesTitle')}</h3>
              <ul className="space-y-2.5">
                {(['p1', 'p2', 'p3', 'p4'] as const).map((key) => (
                  <li key={key} className="flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] mt-2 shrink-0" />
                    <span className="text-zinc-400 text-sm leading-relaxed">{t(`principles.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Tech Stack Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="card md:col-span-2"
            >
              <h3 className="text-lg font-semibold text-white mb-4">{t('techTitle')}</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Next.js', 'React 19', 'TypeScript', 'PostgreSQL', 'pgvector',
                  'Prisma', 'Tailwind CSS', 'Claude API', 'OpenAI API', 'Ollama',
                  'OpenRouter', 'AES-256-GCM', 'BYOK', 'RAG Pipeline', 'SSE Streaming',
                  'Knowledge Graph', 'Docker',
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-medium text-zinc-400 bg-white/[0.04] border border-white/[0.06] rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
