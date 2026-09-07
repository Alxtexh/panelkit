'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  const t = useTranslations('contact');
  const subjectKeys = ['general', 'reservations', 'spa', 'events', 'press'] as const;

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px]">
        <Image src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80" alt={t('title')} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h1 className="text-display text-white mb-4">{t('title')}</h1>
            <p className="text-xl text-white/80 max-w-2xl">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-headline mb-8">{t('sendMessage')}</h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">{t('form.name')}</label>
                    <input type="text" className="w-full px-4 py-4 bg-stone-50 border border-stone-200 focus:border-stone-400 focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">{t('form.email')}</label>
                    <input type="email" className="w-full px-4 py-4 bg-stone-50 border border-stone-200 focus:border-stone-400 focus:outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">{t('form.subject')}</label>
                  <select className="w-full px-4 py-4 bg-stone-50 border border-stone-200 focus:border-stone-400 focus:outline-none transition-colors">
                    {subjectKeys.map((key) => (
                      <option key={key}>{t(`subjects.${key}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">{t('form.message')}</label>
                  <textarea rows={6} className="w-full px-4 py-4 bg-stone-50 border border-stone-200 focus:border-stone-400 focus:outline-none transition-colors resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full sm:w-auto">{t('form.send')}</button>
              </form>
            </div>
            <div>
              <h2 className="text-headline mb-8">{t('getInTouch')}</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <MapPinIcon className="w-6 h-6 text-olive-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">{t('addressLabel')}</h3>
                    <p className="text-stone-600">Camí de Son Vida<br />07013 Palma de Mallorca<br />Spain</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <PhoneIcon className="w-6 h-6 text-olive-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">{t('phoneLabel')}</h3>
                    <a href="tel:+34971123456" className="text-stone-600 hover:text-stone-900 transition-colors">+34 971 123 456</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <EnvelopeIcon className="w-6 h-6 text-olive-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">{t('emailLabel')}</h3>
                    <a href="mailto:reservations@canserena.com" className="text-stone-600 hover:text-stone-900 transition-colors">reservations@canserena.com</a>
                  </div>
                </div>
              </div>
              <div className="mt-12 aspect-video bg-stone-200 relative overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80" alt="Map location" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn-primary">{t('viewOnMap')}</a>
                </div>
              </div>
              <div className="mt-12 p-8 bg-sand-50">
                <h3 className="font-serif text-xl mb-6">{t('departments')}</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">{t('deptReservations')}</span>
                    <a href="mailto:reservations@canserena.com" className="hover:text-stone-900">reservations@canserena.com</a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">{t('deptSpa')}</span>
                    <a href="mailto:spa@canserena.com" className="hover:text-stone-900">spa@canserena.com</a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">{t('deptEvents')}</span>
                    <a href="mailto:events@canserena.com" className="hover:text-stone-900">events@canserena.com</a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">{t('deptPress')}</span>
                    <a href="mailto:press@canserena.com" className="hover:text-stone-900">press@canserena.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
