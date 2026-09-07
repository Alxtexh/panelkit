'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteConfig } from '../../site.config'
gsap.registerPlugin(ScrollTrigger)

export function Footer() {
  const t = useTranslations('footer')
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-content > *', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 90%' }
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const services = [
    t('servicesList.strategy'),
    t('servicesList.uiux'),
    t('servicesList.development'),
    t('servicesList.branding'),
    t('servicesList.marketing')
  ]

  const company = [
    t('companyList.about'),
    t('companyList.work'),
    t('companyList.process'),
    t('companyList.careers'),
    t('companyList.contact')
  ]

  const socials = [
    { name: t('social.twitter'), abbr: 'T' },
    { name: t('social.linkedin'), abbr: 'L' },
    { name: t('social.instagram'), abbr: 'I' },
    { name: t('social.dribbble'), abbr: 'D' }
  ]

  const legalLinks = [
    t('legalLinks.privacy'),
    t('legalLinks.terms'),
    t('legalLinks.imprint'),
    t('legalLinks.cookies')
  ]

  return (
    <footer ref={ref} className="bg-dark text-cream">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24 footer-content">
        {/* Top Row - CTA */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-16 mb-16 border-b border-cream/10">
          <div className="mb-8 lg:mb-0">
            <h3 className="text-3xl lg:text-4xl font-heading font-bold mb-3">
              {t('ctaTitle')}
            </h3>
            <p className="text-cream/40 max-w-sm">
              {t('ctaDescription')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={`mailto:${siteConfig.contact.email}`} className="magnetic-btn bg-cream text-dark px-8 py-4 text-sm font-semibold tracking-wide uppercase hover:bg-cream/90 transition-colors text-center">
              {t('startProject')}
            </a>
            <a href="#" className="magnetic-btn border border-cream/20 px-8 py-4 text-sm font-semibold tracking-wide uppercase hover:bg-cream/5 transition-colors text-center">
              {t('bookCall')}
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-16 mb-16 border-b border-cream/10">
          <div className="mb-6 lg:mb-0">
            <h4 className="text-lg font-heading font-bold mb-2">{t('newsletterTitle')}</h4>
            <p className="text-sm text-cream/40">{t('newsletterDescription')}</p>
          </div>
          <form className="flex gap-3 max-w-md w-full" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="flex-1 bg-cream/5 border border-cream/10 px-5 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-cream/30 transition-colors"
            />
            <button className="bg-cream text-dark px-6 py-3 text-sm font-semibold tracking-wide uppercase hover:bg-cream/90 transition-colors whitespace-nowrap">
              {t('subscribe')}
            </button>
          </form>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {/* Logo & Description */}
          <div className="col-span-2">
            <span className="font-heading text-3xl font-bold block mb-4">{siteConfig.company.name}</span>
            <p className="text-sm text-cream/40 leading-relaxed max-w-xs mb-6">
              {t('brandDescription')}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socials.map(social => (
                <a
                  key={social.name}
                  href="#"
                  className="w-10 h-10 border border-cream/10 flex items-center justify-center hover:bg-cream/5 hover:border-cream/20 transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-xs font-semibold">{social.abbr}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/40 mb-4">{t('servicesLabel')}</h4>
            <ul className="space-y-3 text-sm text-cream/60">
              {services.map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-cream transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/40 mb-4">{t('companyLabel')}</h4>
            <ul className="space-y-3 text-sm text-cream/60">
              {company.map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-cream transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/40 mb-4">{t('contactLabel')}</h4>
            <ul className="space-y-3 text-sm text-cream/60">
              <li>{t('contactInfo.email')}</li>
              <li>{t('contactInfo.phone')}</li>
              <li className="pt-2">
                {t('contactInfo.address')}<br />
                {t('contactInfo.city')}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs text-cream/30 pt-8 border-t border-cream/10">
          <p>© {t('copyright')}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {legalLinks.map(link => (
              <a key={link} href="#" className="hover:text-cream/60 transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
