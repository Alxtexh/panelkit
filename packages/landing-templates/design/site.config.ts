const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const siteConfig = {
  company: {
    name: 'YourBrand',
    tagline: 'AI Workspace',
    description:
      'AI Workspace with persistent memory. Your AI remembers context, learns preferences, and gets better over time.',
    url: baseUrl,
  },

  contact: {
    email: 'hello@example.com',
    phone: '',
    phoneRaw: '',
  },

  address: {
    street: '',
    zip: '',
    city: 'Germany',
    country: 'Germany',
    countryCode: 'DE',
  },

  social: {
    twitter: 'yourhandle',
    github: 'yourbrand',
    telegram: 'yourbot',
  },

  seo: {
    themeColor: '#09090b',
    ogImage: '/opengraph-image.webp',
    accentColor: '#8B5CF6',
  },

  hours: {
    openingHours: 'Mo-Su 00:00-23:59',
    structured: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
  },

  legal: {
    legalName: 'Your Name',
    vatId: '',
  },

  links: {
    app: 'https://app.example.com',
    telegram: 'https://t.me/yourbot',
    github: 'https://github.com/yourbrand',
    twitter: 'https://x.com/yourhandle',
    docs: 'https://app.example.com',
  },
} as const;

export type SiteConfig = typeof siteConfig;
