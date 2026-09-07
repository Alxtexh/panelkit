'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export function TestimonialsSection() {
  const t = useTranslations('testimonials')
  const ref = useRef<HTMLElement>(null)

  const testimonials = [
    { quote: t('items.item1.quote'), name: t('items.item1.name'), role: t('items.item1.role') },
    { quote: t('items.item2.quote'), name: t('items.item2.name'), role: t('items.item2.role') },
    { quote: t('items.item3.quote'), name: t('items.item3.name'), role: t('items.item3.role') },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testimonial-card', { y: 60, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: '.testimonials-grid', start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-20">
          <p className="reveal-up text-xs font-semibold tracking-[0.3em] uppercase text-accent/40 mb-4">{t('sectionLabel')}</p>
          <h2 className="reveal-up text-section font-heading font-bold">{t('title')}</h2>
        </div>
        <div className="testimonials-grid grid md:grid-cols-3 gap-8">
          {testimonials.map(item => (
            <div key={item.name} className="testimonial-card border border-accent/10 p-8 lg:p-10 hover:border-accent/30 transition-colors">
              <blockquote className="text-accent/70 leading-relaxed mb-8 font-heading text-lg italic">&ldquo;{item.quote}&rdquo;</blockquote>
              <div><p className="font-semibold">{item.name}</p><p className="text-sm text-accent/40">{item.role}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
