# Next.js 15 Landing Page Template

A **free, production-ready** landing page template built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4. Fully responsive, dark mode, i18n-ready (DE/EN/ES), and optimized for Lighthouse 90+.

## Features

- Next.js 15 App Router with React 19
- TypeScript (strict mode)
- Tailwind CSS v4 with CSS-first configuration
- Framer Motion animations
- Dark mode with CSS variables
- Mobile-first responsive design
- i18n ready (next-intl, DE/EN/ES)
- Lighthouse 90+ performance
- AI-Ready (ships with CLAUDE.md for vibe coding)
- SEO optimized with metadata API

## Quick Start

```bash
# Clone
git clone https://github.com/studiomeyer-ai/free-landing-template.git my-site
cd my-site

# Install
npm install

# Start
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## Customize

1. **Content:** Edit `messages/en.json` (and `de.json`, `es.json`)
2. **Colors:** Edit CSS variables in `app/globals.css`
3. **Images:** Replace files in `public/images/`
4. **Config:** Edit `lib/config.ts` for business info

## Project Structure

```
app/
  [locale]/
    page.tsx           # Homepage
    layout.tsx         # Root layout
components/
  sections/
    Hero.tsx           # Hero section
    Services.tsx       # Services grid
    About.tsx          # About section
    Testimonials.tsx   # Testimonials
    Contact.tsx        # Contact form
    Footer.tsx         # Footer
lib/
  config.ts            # Site configuration
messages/
  de.json              # German
  en.json              # English
  es.json              # Spanish
public/
  images/              # Your images here
```

## Vibe Coding

This template ships with a `CLAUDE.md` file that helps AI agents (Claude Code, Cursor, etc.) understand the project structure. Just tell your AI:

> "Change the hero section to blue and add a pricing table"

And it will know exactly what to do.

## Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/studiomeyer-ai/free-landing-template)

### Docker

```bash
docker build -t my-site .
docker run -p 3000:3000 my-site
```

## License

MIT License. Use it for anything.

---

Made with care by [StudioMeyer](https://studiomeyer.io) — AI-First Digital Studio
