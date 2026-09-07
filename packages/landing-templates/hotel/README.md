# Hotel Template

A luxury boutique hotel template built with Next.js 15, React 19, Tailwind CSS, and Framer Motion.

## Features

- Elegant, responsive design with cinematic animations
- Booking integration ready
- Multi-language support (next-intl)
- AI-Ready: includes `agents.json` and `llms.txt`
- SEO optimized with JSON-LD structured data (Hotel, LocalBusiness)
- Fully customizable via `site.config.ts`

## Quick Start

```bash
git clone https://github.com/studiomeyer-ai/hotel-template.git
cd hotel-template
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Customization

Edit `site.config.ts` to change branding, colors, rooms, and features.

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
