/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export the original React app as a self-contained static bundle so it can
  // be shipped by PanelKit without a second Node server in production.
  output: 'export',
  basePath: process.env.PANELKIT_LANDING_BASE_PATH || '',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 400, 500],
  },
}

module.exports = nextConfig
