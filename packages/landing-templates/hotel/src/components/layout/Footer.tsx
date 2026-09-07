'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-stone-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-wide mx-auto section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-headline text-white mb-4">{t('newsletter.title')}</h3>
              <p className="text-lg text-white/70">{t('newsletter.description')}</p>
            </div>
            <form className="flex gap-4 flex-col sm:flex-row">
              <input
                type="email"
                placeholder={t('newsletter.placeholder')}
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-stone-900 font-medium tracking-wide hover:bg-white/90 transition-colors"
              >
                {t('newsletter.button')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-wide mx-auto section-padding">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Logo variant="light" />
            </Link>
            <p className="mt-4 text-lg text-white/70 max-w-md">
              {t('tagline')}
            </p>
            {/* Social Links */}
            <div className="mt-8">
              <p className="text-sm font-medium tracking-wide text-white/50 mb-4">
                {t('social')}
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center border border-white/20 hover:bg-white hover:text-stone-900 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center border border-white/20 hover:bg-white hover:text-stone-900 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center border border-white/20 hover:bg-white hover:text-stone-900 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium tracking-wide text-white/50 mb-6">
              {t('contact')}
            </h4>
            <address className="not-italic text-white/80 space-y-3">
              <p>Camí de Son Vida</p>
              <p>07013 Palma de Mallorca</p>
              <p>Spain</p>
              <p className="pt-4">
                <a href="tel:+34971123456" className="hover:text-white transition-colors">
                  +34 971 123 456
                </a>
              </p>
              <p>
                <a href="mailto:reservations@canserena.com" className="hover:text-white transition-colors">
                  reservations@canserena.com
                </a>
              </p>
            </address>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wide text-white/50 mb-6">
              {t('legal')}
            </h4>
            <ul className="space-y-3 text-white/80">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('links.legal')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('links.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('links.cookies')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('links.careers')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
