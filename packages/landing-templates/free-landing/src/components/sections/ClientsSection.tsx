'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const clients = [
  { name: 'Spotify', logo: 'Spotify' },
  { name: 'Airbnb', logo: 'Airbnb' },
  { name: 'Stripe', logo: 'Stripe' },
  { name: 'Notion', logo: 'Notion' },
  { name: 'Figma', logo: 'Figma' },
  { name: 'Vercel', logo: 'Vercel' },
  { name: 'Linear', logo: 'Linear' },
  { name: 'Framer', logo: 'Framer' },
]

export function ClientsSection() {
  const t = useTranslations('clients')
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.clients-header > *', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.clients-header', start: 'top 85%' }
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="py-20 lg:py-24 bg-cream border-y border-accent/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="clients-header text-center mb-12 lg:mb-16">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent/40 mb-3">{t('trustedBy')}</p>
          <h3 className="text-xl lg:text-2xl font-heading text-accent/60">
            {t('subtitle')}
          </h3>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {clients.map((client, i) => (
            <div
              key={client.name}
              className="group flex items-center justify-center py-6 lg:py-8"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="text-2xl lg:text-3xl font-heading font-bold text-accent/20 group-hover:text-accent/50 transition-colors duration-300 select-none">
                {client.logo}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite Marquee */}
      <div className="mt-16 lg:mt-20 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...clients, ...clients].map((client, i) => (
            <span
              key={`${client.name}-${i}`}
              className="mx-12 lg:mx-16 text-lg lg:text-xl font-heading text-accent/10 uppercase tracking-[0.2em]"
            >
              {client.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
