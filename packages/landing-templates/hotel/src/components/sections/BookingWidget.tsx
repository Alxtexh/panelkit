'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDaysIcon,
  UserGroupIcon,
  SparklesIcon,
  ChevronDownIcon,
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';

export function BookingWidget() {
  const t = useTranslations('booking');
  const [activeField, setActiveField] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [showPromo, setShowPromo] = useState(false);

  return (
    <section id="booking" className="relative -mt-24 z-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container-wide mx-auto"
      >
        <div className="bg-white shadow-2xl">
          {/* Header */}
          <div className="px-8 py-6 bg-stone-900 text-white">
            <h2 className="font-serif text-2xl font-light tracking-wide flex items-center gap-3">
              <SparklesIcon className="w-6 h-6" />
              {t('title')}
            </h2>
          </div>

          {/* Booking Form */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Check-in */}
              <div className="relative">
                <label htmlFor="check-in" className="block text-xs font-medium tracking-wider text-stone-500 uppercase mb-2">
                  {t('checkIn')}
                </label>
                <div className="relative">
                  <CalendarDaysIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    id="check-in"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 focus:border-stone-400 focus:outline-none transition-colors text-stone-800"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div className="relative">
                <label htmlFor="check-out" className="block text-xs font-medium tracking-wider text-stone-500 uppercase mb-2">
                  {t('checkOut')}
                </label>
                <div className="relative">
                  <CalendarDaysIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    id="check-out"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 focus:border-stone-400 focus:outline-none transition-colors text-stone-800"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="relative">
                <label className="block text-xs font-medium tracking-wider text-stone-500 uppercase mb-2">
                  {t('guests')}
                </label>
                <button
                  onClick={() => setActiveField(activeField === 'guests' ? null : 'guests')}
                  className="w-full flex items-center justify-between pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 focus:border-stone-400 focus:outline-none transition-colors text-stone-800"
                >
                  <UserGroupIcon className="absolute left-4 top-1/2 translate-y-1 w-5 h-5 text-stone-400" />
                  <span>
                    {adults} {t('adults')}, {children} {t('children')}
                  </span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-stone-400 transition-transform ${
                      activeField === 'guests' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Guests Dropdown */}
                <AnimatePresence>
                  {activeField === 'guests' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 shadow-xl z-20 p-6"
                    >
                      {/* Adults */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-stone-700">{t('adults')}</span>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            aria-label="Decrease adults"
                            className="w-10 h-10 flex items-center justify-center border border-stone-200 hover:border-stone-400 transition-colors"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium" aria-live="polite">{adults}</span>
                          <button
                            onClick={() => setAdults(adults + 1)}
                            aria-label="Increase adults"
                            className="w-10 h-10 flex items-center justify-center border border-stone-200 hover:border-stone-400 transition-colors"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-stone-700">{t('children')}</span>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            aria-label="Decrease children"
                            className="w-10 h-10 flex items-center justify-center border border-stone-200 hover:border-stone-400 transition-colors"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium" aria-live="polite">{children}</span>
                          <button
                            onClick={() => setChildren(children + 1)}
                            aria-label="Increase children"
                            className="w-10 h-10 flex items-center justify-center border border-stone-200 hover:border-stone-400 transition-colors"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Rooms */}
                      <div className="flex items-center justify-between">
                        <span className="text-stone-700">{t('rooms')}</span>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setRooms(Math.max(1, rooms - 1))}
                            aria-label="Decrease rooms"
                            className="w-10 h-10 flex items-center justify-center border border-stone-200 hover:border-stone-400 transition-colors"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium" aria-live="polite">{rooms}</span>
                          <button
                            onClick={() => setRooms(rooms + 1)}
                            aria-label="Increase rooms"
                            className="w-10 h-10 flex items-center justify-center border border-stone-200 hover:border-stone-400 transition-colors"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button className="w-full btn-primary py-4">
                  {t('search')}
                </button>
              </div>
            </div>

            {/* Promo Code Toggle */}
            <div className="mt-6 pt-6 border-t border-stone-100">
              <button
                onClick={() => setShowPromo(!showPromo)}
                className="text-sm text-stone-500 hover:text-stone-700 transition-colors flex items-center gap-2"
              >
                <SparklesIcon className="w-4 h-4" />
                {t('specialCode')}
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${showPromo ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {showPromo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <label htmlFor="promo-code" className="sr-only">{t('specialCode')}</label>
                    <input
                      id="promo-code"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder={t('specialCode')}
                      className="w-full md:w-1/3 px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-400 focus:outline-none transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
