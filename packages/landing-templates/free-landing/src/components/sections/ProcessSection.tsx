'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export function ProcessSection() {
  const t = useTranslations('process')
  const ref = useRef<HTMLElement>(null)

  const steps = [
    { num: t('steps.discover.num'), title: t('steps.discover.title'), desc: t('steps.discover.desc') },
    { num: t('steps.design.num'), title: t('steps.design.title'), desc: t('steps.design.desc') },
    { num: t('steps.develop.num'), title: t('steps.develop.title'), desc: t('steps.develop.desc') },
    { num: t('steps.deliver.num'), title: t('steps.deliver.title'), desc: t('steps.deliver.desc') },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-step', { x: -60, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: '.process-grid', start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} id="process" className="section-padding bg-accent text-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-20">
          <p className="reveal-up text-xs font-semibold tracking-[0.3em] uppercase text-cream/40 mb-4">{t('sectionLabel')}</p>
          <h2 className="reveal-up text-section font-heading font-bold">{t('title')}</h2>
        </div>
        <div className="process-grid">
          {steps.map(s => (
            <div key={s.num} className="process-step group grid md:grid-cols-[100px_1fr] gap-8 py-10 border-t border-cream/10 last:border-b">
              <span className="text-5xl font-heading font-bold text-cream/10 group-hover:text-cream/30 transition-colors">{s.num}</span>
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-16">
                <h3 className="text-2xl lg:text-3xl font-heading font-bold min-w-[200px]">{s.title}</h3>
                <p className="text-cream/50 group-hover:text-cream/70 transition-colors leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
