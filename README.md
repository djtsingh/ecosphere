# Daljeet Terminal

Interactive terminal portfolio for `terminal.daljeetsingh.me`, built with Next.js 14, App Router, TypeScript, xterm.js, Tailwind, Zustand, Octokit, and the Vercel AI SDK.

## What It Is

This app treats the portfolio like a system instead of a landing page.

- `xterm.js` provides the real terminal surface.
- A JSON-backed virtual filesystem powers `ls`, `cd`, `cat`, and `pwd`.
- Command handlers live in a registry so new commands stay isolated.
- App Router API routes proxy GitHub data and power the `ask` command.
- The UI ships as a PWA and includes metadata for SEO.

## Core Commands

- `help`
- `whoami`
- `ls`, `cd`, `cat`, `pwd`, `open`
- `projects`, `skills`, `contact`
- `github`
- `ask "what have you built?"`
- `theme default|matrix|cyber|minimal`
- `neofetch`, `matrix`, `hack`, `cowsay`, `curl wttr.in/mumbai`
- `sudo make me a sandwich`

## Data Model

All portfolio content lives in [data/portfolio.json](data/portfolio.json).

Add a project or file there and the virtual terminal can already expose it through the filesystem commands with no extra command wiring.

## Environment Variables

Copy `.env.example` to `.env.local` and set only what you need.

- `GITHUB_USERNAME`: defaults to `djtsingh`
- `GITHUB_TOKEN`: optional, improves GitHub API rate limits
- `OPENAI_API_KEY`: optional for `ask`
- `OPENAI_MODEL`: optional, defaults to `gpt-4.1-mini`
- `OPENAI_BASE_URL`: optional, for OpenAI-compatible providers
- `ANTHROPIC_API_KEY`: optional alternative for `ask`
- `ANTHROPIC_MODEL`: optional, defaults to `claude-3-5-sonnet-latest`
- `GITHUB_MODELS_TOKEN`: optional GitHub Models token for `ask`
- `GITHUB_MODEL`: optional, defaults to `gpt-4o-mini`

If no AI credentials are set, `ask` falls back to a deterministic answer generated from the portfolio JSON.

## Local Development

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run lint
npm run build
```

## Deployment

Deploy to Vercel as a standard Next.js app.

1. Import the repo into Vercel.
2. Add environment variables for GitHub and AI if needed.
3. Point `terminal.daljeetsingh.me` at the Vercel deployment.

## Notes

- The PWA service worker is generated during production build by `next-pwa`.
- GitHub data is prefetched on the server and can be refreshed from the `github` command.
- The current build target is Next.js `14.2.35` to stay on the latest patched Next 14 line.