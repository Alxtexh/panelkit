'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export function WorkSection() {
  const t = useTranslations('work')
  const ref = useRef<HTMLElement>(null)

  const projects = [
    {
      title: t('projects.lumiere.title'),
      category: t('projects.lumiere.category'),
      image: '/project-fashion.png',
      year: '2025',
      tags: ['Shopify', 'UI/UX', 'Brand Identity'],
      description: t('projects.lumiere.description'),
      metrics: t('projects.lumiere.metrics')
    },
    {
      title: t('projects.neurotech.title'),
      category: t('projects.neurotech.category'),
      image: '/project-saas.png',
      year: '2025',
      tags: ['React', 'Dashboard', 'Data Viz'],
      description: t('projects.neurotech.description'),
      metrics: t('projects.neurotech.metrics')
    },
    {
      title: t('projects.atlas.title'),
      category: t('projects.atlas.category'),
      image: '/project-realestate.png',
      year: '2024',
      tags: ['Next.js', 'CMS', 'SEO'],
      description: t('projects.atlas.description'),
      metrics: t('projects.atlas.metrics')
    },
    {
      title: t('projects.vitality.title'),
      category: t('projects.vitality.category'),
      image: '/hero-office.png',
      year: '2024',
      tags: ['Branding', 'Web Design', 'Motion'],
      description: t('projects.vitality.description'),
      metrics: t('projects.vitality.metrics')
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal for project items
      gsap.from('.work-item', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.work-grid', start: 'top 85%' }
      })

      // Parallax effect on images
      document.querySelectorAll('.work-img').forEach(img => {
        gsap.to(img, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: (img as HTMLElement).closest('.work-item')!,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
          }
        })
      })

      // Reveal animation for header
      gsap.from('.work-header > *', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.work-header', start: 'top 85%' }
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} id="work" className="section-padding bg-dark text-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="work-header flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 lg:mb-20 gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-cream/40 mb-4">{t('sectionLabel')}</p>
            <h2 className="text-section font-heading font-bold leading-tight">
              {t('title')}
            </h2>
          </div>
          <a href="#" className="group flex items-center gap-3 text-sm font-medium tracking-wide uppercase self-start lg:self-auto">
            <span className="border-b border-cream/30 pb-1 group-hover:border-cream transition-colors">{t('viewAll')}</span>
            <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {/* Projects Grid */}
        <div className="work-grid grid md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((p, i) => (
            <article
              key={p.title}
              className="work-item group cursor-pointer"
              data-cursor="view"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-[4/3] mb-6 bg-cream/5">
                <img
                  src={p.image}
                  alt={p.title}
                  className="work-img w-full h-[120%] object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading={i < 2 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : undefined}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Metrics badge */}
                <div className="absolute bottom-4 left-4 bg-cream text-dark px-4 py-2 text-xs font-semibold tracking-wide uppercase opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {p.metrics}
                </div>

                {/* Tags */}
                <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                  {p.tags.map(tag => (
                    <span key={tag} className="bg-cream/10 backdrop-blur-sm text-cream text-[0.65rem] font-medium tracking-wide uppercase px-3 py-1.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl lg:text-2xl font-heading font-bold mb-1 group-hover:text-cream/80 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-cream/50 mb-2">{p.category}</p>
                  <p className="text-sm text-cream/30 leading-relaxed max-w-sm hidden lg:block">
                    {p.description}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-cream/30 tracking-wide mb-2">{p.year}</span>
                  <div className="w-8 h-8 border border-cream/20 flex items-center justify-center group-hover:bg-cream group-hover:text-dark transition-all duration-300">
                    <span className="text-xs">→</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 lg:mt-20 pt-12 border-t border-cream/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p className="text-cream/40 max-w-md">
            {t('bottomText')}
          </p>
          <a href="#contact" className="magnetic-btn bg-cream text-dark px-8 py-4 text-sm font-semibold tracking-wide uppercase hover:bg-cream/90 transition-colors">
            {t('startYourProject')}
          </a>
        </div>
      </div>
    </section>
  )
}
