'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export function CTASection() {
  const t = useTranslations('cta')
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-text > *', { y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} id="contact" className="section-padding bg-cream-dark/40 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
        <div className="w-[600px] h-[600px] rounded-full bg-accent/[0.03] blur-3xl" />
      </div>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <div className="cta-text">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent/40 mb-6">{t('sectionLabel')}</p>
          <h2 className="text-hero font-heading font-bold mb-6">{t('title')}</h2>
          <p className="text-lg text-accent/50 mb-10 max-w-xl mx-auto">{t('description')}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:hello@youragency.com" className="magnetic-btn bg-accent text-cream px-10 py-4 text-sm font-semibold tracking-wide uppercase hover:bg-accent/80 transition-colors">{t('startProject')}</a>
            <a href="#" className="magnetic-btn border border-accent/20 px-10 py-4 text-sm font-semibold tracking-wide uppercase hover:bg-accent/5 transition-colors">{t('bookCall')}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
