'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const t = useTranslations('hero')
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      const tl = gsap.timeline({ delay: 0.2 })
      tl.from('.hero-line', { y: 120, opacity: 0, duration: 1, stagger: 0.1, ease: 'power4.out' })
        .from('.hero-sub', { y: 30, opacity: 0, duration: 0.6 }, '-=0.6')
        .from('.hero-desc', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.hero-btn', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
        .from('.hero-stats > div', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
        .from('.hero-scroll', { opacity: 0, duration: 0.5 }, '-=0.2')
        .from('.hero-image-wrapper', { scale: 1.1, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1')

      // Parallax layers on scroll
      gsap.to('.parallax-layer-1', {
        y: -100,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1 }
      })
      gsap.to('.parallax-layer-2', {
        y: -200,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1.5 }
      })
      gsap.to('.parallax-layer-3', {
        y: -50,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 0.5 }
      })
      gsap.to('.hero-bg-text', {
        y: -300,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1 }
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-cream">
      {/* Background text - Parallax Layer 1 */}
      <div className="hero-bg-text parallax-layer-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0" aria-hidden="true">
        <span className="text-[25vw] font-heading font-bold text-accent/[0.02] leading-none whitespace-nowrap">AGENCY</span>
      </div>

      {/* Decorative shapes - Parallax Layer 2 */}
      <div className="parallax-layer-2 absolute top-20 right-[10%] w-64 h-64 rounded-full bg-gradient-to-br from-accent/5 to-transparent blur-3xl pointer-events-none" />
      <div className="parallax-layer-2 absolute bottom-40 left-[5%] w-48 h-48 rounded-full bg-gradient-to-tr from-accent/5 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Text content */}
          <div className="parallax-layer-3">
            <p className="hero-sub text-xs font-semibold tracking-[0.3em] uppercase text-accent/50 mb-6">
              {t('tagline')}
            </p>
            <h1 className="font-heading leading-[0.9] mb-8 overflow-hidden">
              <span className="hero-line block text-display font-bold">{t('title1')}</span>
              <span className="hero-line block text-display font-bold">{t('title2')}</span>
              <span className="hero-line block text-display font-bold">
                <em className="italic text-accent/60">{t('title3')}</em>
              </span>
            </h1>
            <p className="hero-desc text-lg lg:text-xl text-accent/60 leading-relaxed mb-10 max-w-md">
              {t('description')}
            </p>
            <div className="flex flex-wrap gap-4 mb-16">
              <a href="#work" className="hero-btn magnetic-btn group relative bg-accent text-cream px-8 py-4 text-sm font-semibold tracking-wide uppercase overflow-hidden">
                <span className="relative z-10">{t('viewWork')}</span>
                <div className="absolute inset-0 bg-accent/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </a>
              <a href="#contact" className="hero-btn magnetic-btn border border-accent/20 px-8 py-4 text-sm font-semibold tracking-wide uppercase hover:bg-accent hover:text-cream transition-all duration-300">
                {t('startProject')}
              </a>
            </div>
            <div className="hero-stats flex gap-10 lg:gap-14">
              <div className="group">
                <span className="block text-4xl lg:text-5xl font-heading font-bold group-hover:text-accent/70 transition-colors">150+</span>
                <span className="text-xs tracking-wide uppercase text-accent/40">{t('stats.projects')}</span>
              </div>
              <div className="group">
                <span className="block text-4xl lg:text-5xl font-heading font-bold group-hover:text-accent/70 transition-colors">12</span>
                <span className="text-xs tracking-wide uppercase text-accent/40">{t('stats.years')}</span>
              </div>
              <div className="group">
                <span className="block text-4xl lg:text-5xl font-heading font-bold group-hover:text-accent/70 transition-colors">98%</span>
                <span className="text-xs tracking-wide uppercase text-accent/40">{t('stats.retention')}</span>
              </div>
            </div>
          </div>

          {/* Right column - Hero Image with Parallax */}
          <div className="relative lg:h-[600px] hidden lg:block">
            <div className="hero-image-wrapper relative w-full h-full">
              {/* Main image */}
              <div className="parallax-layer-3 absolute inset-0 overflow-hidden">
                <img
                  src="/hero-office.png"
                  alt={t('imageAlt')}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-cream/40 via-transparent to-transparent" />
              </div>

              {/* Floating badge */}
              <div className="parallax-layer-2 absolute -bottom-6 -left-6 bg-accent text-cream p-6 shadow-2xl">
                <span className="block text-3xl font-heading font-bold">28</span>
                <span className="text-xs tracking-wide uppercase text-cream/60">{t('awardsWon')}</span>
              </div>

              {/* Decorative frame */}
              <div className="absolute -top-4 -right-4 w-full h-full border border-accent/10 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-[0.65rem] font-medium tracking-[0.2em] uppercase text-accent/40">{t('scroll')}</span>
        <div className="w-px h-12 bg-gradient-to-b from-accent/30 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
