'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Logo } from '@/components/ui/Logo';

export function Hero() {
  const t = useTranslations('hero');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Lazy load video after initial render and LCP
    const timer = setTimeout(() => {
      setVideoLoaded(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoLoaded && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoLoaded]);

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image (shows immediately) */}
      <div className="absolute inset-0">
        <Image
          src="/hero-hotel.webp"
          alt="Can Serena Hotel Mallorca"
          fill
          priority
          fetchPriority="high"
          className="object-cover"
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzYTMyMmEiLz48L3N2Zz4="
        />
        {/* Video Background (lazy loaded) */}
        {videoLoaded && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-luxury-resort-on-the-beach-4808-large.mp4"
              type="video/mp4"
            />
          </video>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
            className="mb-10"
          >
            <Logo variant="light" className="justify-center scale-150" />
          </motion.div>

          <motion.h1
            initial={{ y: 15 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light leading-none tracking-tight mb-8"
          >
            {t('tagline')}
          </motion.h1>

          <motion.p
            initial={{ y: 15 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto mb-12"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ y: 15 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <button
              onClick={scrollToBooking}
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-stone-900 font-medium tracking-wide hover:bg-white/90 transition-all duration-300"
            >
              {t('cta')}
              <ChevronDownIcon className="w-5 h-5 transition-transform group-hover:translate-y-1" />
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1 h-3 bg-white/70 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
