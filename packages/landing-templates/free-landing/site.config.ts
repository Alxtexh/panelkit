// ============================================================================
// Site Configuration
// ============================================================================
// Central configuration for the entire site. Update these values to customize
// branding, contact details, SEO metadata, and legal information.
// ============================================================================

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-agency.com';

export const siteConfig = {
  // --------------------------------------------------------------------------
  // Company
  // --------------------------------------------------------------------------
  company: {
    name: 'Your Agency',
    tagline: 'Digital Creative Agency',
    description:
      'Digital experiences that elevate brands and drive growth. Strategy, Design, Development, and Marketing solutions.',
    url: siteUrl,
  },

  // --------------------------------------------------------------------------
  // Contact
  // --------------------------------------------------------------------------
  contact: {
    email: 'hello@your-agency.com',
    phone: '+49 (0) 30 123 456 78',
    phoneRaw: '+493012345678',
  },

  // --------------------------------------------------------------------------
  // Address
  // --------------------------------------------------------------------------
  address: {
    street: 'Musterstraße 42',
    city: '10115 Berlin',
    country: 'Germany',
    countryCode: 'DE',
  },

  // --------------------------------------------------------------------------
  // Social
  // --------------------------------------------------------------------------
  social: {
    twitter: '',
    linkedin: '',
    instagram: '',
    dribbble: '',
    github: '',
    youtube: '',
  },

  // --------------------------------------------------------------------------
  // SEO
  // --------------------------------------------------------------------------
  seo: {
    themeColor: '#1a1a1a',
    ogImage: '/og-image.png',
  },

  // --------------------------------------------------------------------------
  // Legal
  // --------------------------------------------------------------------------
  legal: {
    legalName: 'Your Agency GmbH',
    vatId: 'DE000000000',
    registrationCourt: 'Amtsgericht Berlin-Charlottenburg',
    registrationNumber: 'HRB 000000',
  },
} as const;

export type SiteConfig = typeof siteConfig;
