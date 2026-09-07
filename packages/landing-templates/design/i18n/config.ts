export const locales = ['en', 'de', 'es'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];
