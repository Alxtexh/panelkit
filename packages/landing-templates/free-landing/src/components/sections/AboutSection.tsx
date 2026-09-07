'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export function AboutSection() {
  const t = useTranslations('about')
  const ref = useRef<HTMLElement>(null)

  const stats = [
    { value: '35+', label: t('stats.teamMembers') },
    { value: '4', label: t('stats.globalOffices') },
    { value: '150+', label: t('stats.projectsCompleted') },
    { value: '98%', label: t('stats.clientRetention') },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveal
      gsap.from('.about-img-wrapper', {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.about-grid', start: 'top 75%' }
      })

      gsap.from('.about-img', {
        scale: 1.3,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-grid', start: 'top 75%' }
      })

      // Content reveal
      gsap.from('.about-content > *', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-content', start: 'top 80%' }
      })

      // Stats counter animation
      document.querySelectorAll('.stat-value').forEach(el => {
        const value = el.textContent || ''
        const hasPlus = value.includes('+')
        const hasPercent = value.includes('%')
        const numValue = parseInt(value.replace(/[^0-9]/g, ''))

        gsap.from(el, {
          textContent: 0,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: function() {
            const current = Math.round(gsap.getProperty(el, 'textContent') as number)
            el.textContent = current + (hasPlus ? '+' : '') + (hasPercent ? '%' : '')
          }
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} id="about" className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="about-grid grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            <div className="about-img-wrapper relative overflow-hidden">
              <img
                src="/hero-office.png"
                alt={t('imageAlt')}
                className="about-img w-full aspect-[4/5] object-cover"
                loading="lazy"
              />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8 bg-accent text-cream p-6 lg:p-8 shadow-2xl hidden md:block">
              <span className="block text-4xl lg:text-5xl font-heading font-bold">12</span>
              <span className="text-xs tracking-wide uppercase text-cream/60">{t('yearsLabel')}</span>
            </div>

            {/* Decorative line */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-accent/20 pointer-events-none hidden lg:block" />
          </div>

          {/* Content */}
          <div className="about-content">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent/40 mb-4">{t('sectionLabel')}</p>
            <h2 className="text-section font-heading font-bold mb-6 leading-tight">
              {t('title')}
            </h2>
            <p className="text-accent/60 leading-relaxed mb-6 text-lg">
              {t('description1')}
            </p>
            <p className="text-accent/50 leading-relaxed mb-10">
              {t('description2')}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 lg:gap-8 pt-8 border-t border-accent/10">
              {stats.map((stat) => (
                <div key={stat.label} className="group">
                  <span className="stat-value block text-3xl lg:text-4xl font-heading font-bold mb-1 group-hover:text-accent/70 transition-colors">
                    {stat.value}
                  </span>
                  <span className="text-xs tracking-wide uppercase text-accent/40">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
