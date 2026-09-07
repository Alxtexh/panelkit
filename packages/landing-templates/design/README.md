# Design Template

A premium SaaS landing page template built with Next.js 15, React 19, Tailwind CSS, and Framer Motion.

## Features

- Modern, responsive design with smooth animations
- Dark mode with glass-morphism effects
- AI-Ready: includes `agents.json` and `llms.txt` for AI agent discovery
- Multi-language support (next-intl)
- SEO optimized with JSON-LD structured data
- Fully customizable via `site.config.ts`

## Quick Start

```bash
git clone https://github.com/studiomeyer-ai/design-template.git
cd design-template
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Customization

Edit `site.config.ts` to change branding, colors, content, and features.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS 4, Framer Motion
- **i18n:** next-intl
- **Deployment:** Docker, Vercel, or any Node.js host

## AI-Ready

This template includes built-in AI agent compatibility:
- `/.well-known/agents.json` — Agent discovery protocol
- `/llms.txt` — LLM-readable site description

Learn more: [AI-Ready Standard](https://studiomeyer.io/ai-ready)

## License

MIT — see [LICENSE](LICENSE)

---

Made with care by [StudioMeyer](https://studiomeyer.io) — AI-First Digital Studio
