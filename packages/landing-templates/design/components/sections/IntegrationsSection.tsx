'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const integrations = [
  { name: 'Claude', sub: 'Anthropic' },
  { name: 'GPT', sub: 'OpenAI' },
  { name: 'Ollama', sub: 'Local' },
  { name: 'OpenRouter', sub: '100+ Models' },
  { name: 'Telegram', sub: 'Bot API' },
  { name: 'MCP', sub: 'Protocol' },
  { name: 'Stripe', sub: 'Billing' },
  { name: 'Tavily', sub: 'Search' },
  { name: 'SearXNG', sub: 'Meta Search' },
  { name: 'Flux', sub: 'Image Gen' },
  { name: 'Whisper', sub: 'Voice' },
  { name: 'RAG', sub: 'Documents' },
];

export default function IntegrationsSection() {
  const t = useTranslations('integrations');

  return (
    <section id="integrations" className="py-20 md:py-28" aria-labelledby="integrations-title">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 id="integrations-title" className="section-title">{t('title')}</h2>
          <p className="section-subtitle">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 max-w-4xl mx-auto">
          {integrations.map((integration, i) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="flex flex-col items-center justify-center p-4 md:p-5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-zinc-700 transition-all"
            >
              <span className="text-sm font-medium text-white mb-1">{integration.name}</span>
              <span className="text-xs text-zinc-600">{integration.sub}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
