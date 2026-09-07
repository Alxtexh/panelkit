'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { locales, localeNames, type Locale } from '@/i18n/config'

export function Navigation() {
  const t = useTranslations('nav')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const navItems = [
    { key: 'services', href: '#services' },
    { key: 'work', href: '#work' },
    { key: 'about', href: '#about' },
    { key: 'process', href: '#process' },
  ] as const

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm' : ''}`}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="font-heading text-2xl font-bold tracking-tight">Agency</Link>
        <div className="hidden md:flex items-center gap-10">
          {navItems.map(item => (
            <a key={item.key} href={item.href} className="text-sm font-medium tracking-wide uppercase opacity-60 hover:opacity-100 transition-opacity">
              {t(item.key)}
            </a>
          ))}
          <a href="#contact" className="text-sm font-medium tracking-wide uppercase bg-accent text-cream px-5 py-2.5 hover:bg-accent/80 transition-colors">
            {t('getInTouch')}
          </a>
          {/* Language Switcher */}
          <div className="relative group">
            <button className="text-sm font-medium tracking-wide uppercase opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1">
              <span className="w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </span>
            </button>
            <div className="absolute right-0 top-full mt-2 bg-cream border border-accent/10 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {locales.map((locale) => (
                <Link
                  key={locale}
                  href={pathname}
                  locale={locale}
                  className="block px-4 py-2 text-sm hover:bg-accent/5 whitespace-nowrap"
                >
                  {localeNames[locale as Locale]}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(!open)} aria-label={t('menu')}>
          <span className={`w-6 h-0.5 bg-accent transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-accent transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-accent transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>
      {open && (
        <div className="md:hidden bg-cream/98 backdrop-blur-md px-6 pb-8 space-y-4">
          {navItems.map(item => (
            <a key={item.key} href={item.href} className="block text-lg font-medium" onClick={() => setOpen(false)}>
              {t(item.key)}
            </a>
          ))}
          <a href="#contact" className="block bg-accent text-cream text-center py-3 mt-4" onClick={() => setOpen(false)}>
            {t('getInTouch')}
          </a>
          {/* Mobile Language Switcher */}
          <div className="flex gap-4 pt-4 border-t border-accent/10">
            {locales.map((locale) => (
              <Link
                key={locale}
                href={pathname}
                locale={locale}
                className="text-sm font-medium opacity-60 hover:opacity-100"
                onClick={() => setOpen(false)}
              >
                {localeNames[locale as Locale]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
