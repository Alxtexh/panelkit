'use client'
import { useTranslations } from 'next-intl'

export function MarqueeSection() {
  const t = useTranslations('marquee')

  const items = [
    t('strategy'),
    t('design'),
    t('development'),
    t('branding'),
    t('ecommerce'),
    t('marketing'),
    t('uxui'),
    t('motion')
  ]

  return (
    <section className="py-8 border-y border-accent/10 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center mx-8">
            <span className="text-2xl md:text-3xl font-heading font-medium text-accent/80">{item}</span>
            <span className="ml-8 w-2 h-2 rounded-full bg-accent/20" />
          </span>
        ))}
      </div>
    </section>
  )
}
