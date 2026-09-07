'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export function ServicesSection() {
  const t = useTranslations('services')
  const ref = useRef<HTMLElement>(null)

  const services = [
    {
      num: t('items.strategy.num'),
      title: t('items.strategy.title'),
      desc: t('items.strategy.desc'),
      tags: t.raw('items.strategy.tags') as string[]
    },
    {
      num: t('items.design.num'),
      title: t('items.design.title'),
      desc: t('items.design.desc'),
      tags: t.raw('items.design.tags') as string[]
    },
    {
      num: t('items.development.num'),
      title: t('items.development.title'),
      desc: t('items.development.desc'),
      tags: t.raw('items.development.tags') as string[]
    },
    {
      num: t('items.branding.num'),
      title: t('items.branding.title'),
      desc: t('items.branding.desc'),
      tags: t.raw('items.branding.tags') as string[]
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.service-card', { y: 80, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.services-grid', start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} id="services" className="section-padding">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-20 gap-6">
          <div>
            <p className="reveal-up text-xs font-semibold tracking-[0.3em] uppercase text-accent/40 mb-4">{t('sectionLabel')}</p>
            <h2 className="reveal-up text-section font-heading font-bold">{t('title')}</h2>
          </div>
          <p className="reveal-up text-accent/50 max-w-md lg:text-right">{t('subtitle')}</p>
        </div>
        <div className="services-grid grid md:grid-cols-2 gap-6">
          {services.map(s => (
            <div key={s.num} className="service-card group border border-accent/10 p-8 lg:p-10 hover:bg-accent hover:text-cream transition-colors duration-500 cursor-default">
              <span className="block text-xs font-semibold tracking-[0.2em] text-accent/30 group-hover:text-cream/40 mb-6 transition-colors">{s.num}</span>
              <h3 className="text-2xl lg:text-3xl font-heading font-bold mb-4">{s.title}</h3>
              <p className="text-accent/50 group-hover:text-cream/60 mb-6 leading-relaxed transition-colors">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map(tag => <span key={tag} className="text-xs font-medium tracking-wide uppercase border border-accent/10 group-hover:border-cream/20 px-3 py-1.5 transition-colors">{tag}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
