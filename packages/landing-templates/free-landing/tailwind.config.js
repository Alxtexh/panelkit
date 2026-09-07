/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0a0a0a',
        cream: '#f2edeb',
        'cream-dark': '#e8d5c4',
        accent: '#221f20',
        muted: 'rgba(34, 31, 32, 0.5)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display': 'clamp(3rem, 8vw, 8rem)',
        'hero': 'clamp(2.5rem, 6vw, 5.5rem)',
        'section': 'clamp(2rem, 4vw, 3.5rem)',
      },
    },
  },
  plugins: [],
}
