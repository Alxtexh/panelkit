import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // The landing route is pre-rendered and served as a self-contained bundle
  // by PanelKit; this does not alter the source components or interactions.
  output: 'export',
  basePath: process.env.PANELKIT_LANDING_BASE_PATH || '',
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/agents.json',
        destination: '/api/well-known/agents-json',
      },
      {
        source: '/.well-known/agent-card.json',
        destination: '/api/well-known/agent-card-json',
      },
      // IndexNow key verification (Bing/Yandex)
      {
        source: '/7536dd7636e93d1d5f7eca797af976c8620bbc5a28c0e513db55f993b74d74ac.txt',
        destination: '/api/indexnow-key',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
