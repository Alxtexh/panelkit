'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { locales, localeNames, type Locale } from '@/i18n/config';
import { useParams } from 'next/navigation';
import Image from 'next/image';

const localeFlags: Record<Locale, string> = {
  de: '🇩🇪',
  en: '🇬🇧',
  es: '🇪🇸',
};

export function Navigation() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const currentLocale = params.locale as Locale;

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/rooms', label: t('rooms') },
    { href: '/wellness', label: t('wellness') },
    { href: '/dining', label: t('dining') },
    { href: '/experiences', label: t('experiences') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-strong shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo - Icon only */}
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image
              src="/logo-mark.webp"
              alt="Can Serena"
              width={40}
              height={40}
              className={`transition-all duration-500 ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'} ${!isScrolled ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-serif font-normal tracking-[0.2em] uppercase transition-colors duration-300 hover:opacity-70 ${
                  isScrolled ? 'text-stone-800' : 'text-white/90'
                } ${pathname === link.href ? 'opacity-100 font-medium' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Language Switcher - subtle flag */}
            <div className="relative">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="text-base opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Change language"
              >
                {localeFlags[currentLocale]}
              </button>
              <AnimatePresence>
                {showLanguages && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 flex flex-col gap-1 p-1"
                  >
                    {locales.filter(l => l !== currentLocale).map((locale) => (
                      <button
                        key={locale}
                        onClick={() => {
                          setShowLanguages(false);
                          router.replace(pathname, { locale });
                        }}
                        className="text-base px-1 py-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        {localeFlags[locale as Locale]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className={`lg:hidden p-2 transition-colors ${
              isScrolled ? 'text-stone-900' : 'text-white'
            }`}
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="container-wide mx-auto px-4 py-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-serif font-normal tracking-wide text-stone-800 py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-2" />
                <div className="flex gap-4">
                  {locales.map((locale) => (
                    <Link
                      key={locale}
                      href={pathname}
                      locale={locale}
                      onClick={() => setIsOpen(false)}
                      className={`text-sm font-medium ${
                        currentLocale === locale ? 'text-stone-900' : 'text-stone-500'
                      }`}
                    >
                      {localeNames[locale]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
