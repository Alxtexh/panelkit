import withBundleAnalyzer from './next.config.analyzer.js'
import withPWA from './next.config.pwa.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    minimumCacheTTL: 3600,
    unoptimized: false,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      '@radix-ui',
      'lucide-react'
    ],
    optimizeCss: true,
    webpackBuildWorker: true,
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack'],
      },
    },
  },
}

export default withBundleAnalyzer(withPWA(nextConfig))
