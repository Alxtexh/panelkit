'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export function AwardsSection() {
  const t = useTranslations('awards')
  const ref = useRef<HTMLElement>(null)

  const awards = [
    { year: t('items.item1.year'), title: t('items.item1.title'), org: t('items.item1.org'), project: t('items.item1.project') },
    { year: t('items.item2.year'), title: t('items.item2.title'), org: t('items.item2.org'), project: t('items.item2.project') },
    { year: t('items.item3.year'), title: t('items.item3.title'), org: t('items.item3.org'), project: t('items.item3.project') },
    { year: t('items.item4.year'), title: t('items.item4.title'), org: t('items.item4.org'), project: t('items.item4.project') },
    { year: t('items.item5.year'), title: t('items.item5.title'), org: t('items.item5.org'), project: t('items.item5.project') },
    { year: t('items.item6.year'), title: t('items.item6.title'), org: t('items.item6.org'), project: t('items.item6.project') },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.awards-header > *', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.awards-header', start: 'top 85%' }
      })

      gsap.from('.award-row', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.awards-list', start: 'top 85%' }
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left - Header */}
          <div className="awards-header">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent/40 mb-4">{t('sectionLabel')}</p>
            <h2 className="text-section font-heading font-bold mb-6">{t('title')}</h2>
            <p className="text-accent/50 leading-relaxed max-w-md mb-8">
              {t('description')}
            </p>
            <div className="flex gap-12">
              <div>
                <span className="block text-5xl lg:text-6xl font-heading font-bold">28</span>
                <span className="text-xs tracking-wide uppercase text-accent/40">{t('awardsWon')}</span>
              </div>
              <div>
                <span className="block text-5xl lg:text-6xl font-heading font-bold">6</span>
                <span className="text-xs tracking-wide uppercase text-accent/40">{t('sotd')}</span>
              </div>
            </div>
          </div>

          {/* Right - Awards List */}
          <div className="awards-list">
            {awards.map((award, i) => (
              <div
                key={`${award.title}-${i}`}
                className="award-row group grid grid-cols-[60px_1fr_auto] gap-4 lg:gap-6 items-center py-5 border-b border-accent/10 hover:bg-accent/[0.02] -mx-4 px-4 transition-colors cursor-default"
              >
                <span className="text-sm text-accent/30 font-medium">{award.year}</span>
                <div>
                  <h4 className="font-heading font-bold text-lg group-hover:text-accent/70 transition-colors">{award.title}</h4>
                  <p className="text-sm text-accent/40">{award.org} — {award.project}</p>
                </div>
                <div className="w-6 h-6 border border-accent/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[0.6rem]">↗</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
