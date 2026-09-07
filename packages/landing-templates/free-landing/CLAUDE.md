# CLAUDE.md — Free Landing Page Template

You are working on a **Landing Page** project from [StudioMeyer](https://studiomeyer.io). This is a free, production-ready template.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (CSS-first config)
- **Animations:** Framer Motion
- **i18n:** next-intl (DE/EN/ES)

## Project Structure
```
app/
  [locale]/
    page.tsx           # Homepage — section imports
    layout.tsx         # Root layout with providers
components/
  sections/            # Page sections (Hero, Services, About, etc.)
  ui/                  # Reusable UI components
lib/
  config.ts            # Site configuration
messages/
  de.json / en.json / es.json  # All text content
public/
  images/              # Static assets
```

## Key Files to Customize
1. **`lib/config.ts`** — Business name, colors, contact, social links
2. **`messages/*.json`** — All text content (3 languages)
3. **`public/images/`** — Replace with your images
4. **`app/globals.css`** — Theme colors via CSS variables

## Commands
```bash
npm run dev          # Dev server at localhost:3000
npm run build        # Production build
npm run typecheck    # TypeScript check
```

## Rules
- TypeScript strict, no `any`
- All text via i18n (messages/*.json), never hardcode
- Mobile-first responsive (test at 375px)
- Use CSS variables for colors
- Framer Motion for animations (whileInView)
- Use next/image with WebP format
