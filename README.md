Interactive terminal portfolio for `terminal.daljeetsingh.me`, built with Next.js 14, App Router, TypeScript, xterm.js, Tailwind, Zustand, Octokit, and the Vercel AI SDK.

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

Add a project or file there and the virtual terminal can already expose it through the filesystem commands with no extra command wiring.

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

## Notes

- The PWA service worker is generated during production build by `next-pwa`.
- GitHub data is prefetched on the server and can be refreshed from the `github` command.
- The current build target is Next.js `14.2.35` to stay on the latest patched Next 14 line.
