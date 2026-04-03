import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "System Report ─ terminal.daljeetsingh.me",
  description: "Reference for the terminal portfolio: commands, filesystem layout, themes, and tech stack."
};

/* ─── Data tables ──────────────────────────────────────────────── */

const COMMANDS = [
  // portfolio
  { name: "help",     module: "portfolio",   description: "List every available command with short descriptions",             usage: "help [cmd]" },
  { name: "whoami",   module: "portfolio",   description: "Display profile — name, title, location, tagline, links",        usage: "whoami" },
  { name: "projects", module: "portfolio",   description: "Formatted table of all projects with name, stack, URL",          usage: "projects" },
  { name: "skills",   module: "portfolio",   description: "Skill chart grouped by domain with proficiency bars",            usage: "skills" },
  { name: "contact",  module: "portfolio",   description: "Show email, GitHub, LinkedIn, and social links",                 usage: "contact" },
  // filesystem
  { name: "ls",       module: "filesystem",  description: "List contents of current or target directory",                   usage: "ls [path]" },
  { name: "cd",       module: "filesystem",  description: "Change working directory; supports '..' and absolute paths",     usage: "cd <path>" },
  { name: "pwd",      module: "filesystem",  description: "Print current working directory",                                usage: "pwd" },
  { name: "cat",      module: "filesystem",  description: "Print file contents; handles binary stubs (resume.pdf)",        usage: "cat <file>" },
  { name: "open",     module: "filesystem",  description: "Open a .url file in a new browser tab",                         usage: "open <file>" },
  { name: "tabhint",  module: "filesystem",  description: "Internal: renders directory listing for Tab autocomplete",       usage: "tabhint" },
  // github
  { name: "github",   module: "github",      description: "Fetch & display live GitHub stats — repos, stars, followers, top repos", usage: "github" },
  { name: "ask",      module: "github",      description: "Stream an AI answer grounded in portfolio data (Vercel AI SDK)", usage: 'ask "<question>"' },
  // theme
  { name: "theme",    module: "theme",       description: "Toggle or set a theme; default, matrix, cyber, minimal, dracula", usage: "theme [name]" },
  // easter eggs
  { name: "clear",    module: "easter-eggs", description: "Clear the terminal buffer (also: Ctrl+L)",                       usage: "clear" },
  { name: "neofetch", module: "easter-eggs", description: "Detailed system info card with ANSI art (like the real tool)",  usage: "neofetch" },
  { name: "matrix",   module: "easter-eggs", description: "Full-terminal matrix rain animation (column-drop katakana)",    usage: "matrix" },
  { name: "hack",     module: "easter-eggs", description: "Theatrical hacking simulation with progress bars",              usage: "hack" },
  { name: "cowsay",   module: "easter-eggs", description: "Classic ASCII cowsay with dynamic bubble scaling",              usage: "cowsay [message]" },
  { name: "curl",     module: "easter-eggs", description: "Parody curl response mimicking wttr.in weather",                usage: "curl" },
  { name: "sudo",     module: "easter-eggs", description: "Access-denied easter egg",                                      usage: "sudo <cmd>" },
  { name: "rm",       module: "easter-eggs", description: "Safe rm -rf stub (no files harmed)",                            usage: "rm -rf <path>" },
  // utility
  { name: "history",  module: "utility",     description: "Show command history for the current session (capped at 50)",   usage: "history" },
  { name: "tree",     module: "utility",     description: "Recursive ASCII directory tree from current path",              usage: "tree [path]" },
  { name: "echo",     module: "utility",     description: "Print arguments to terminal output",                            usage: "echo <text>" },
  { name: "date",     module: "utility",     description: "Print current date and time in ISO format",                     usage: "date" },
  { name: "banner",   module: "utility",     description: "Print ASCII-art banner text",                                   usage: "banner <text>" },
  { name: "uptime",   module: "utility",     description: "Show session uptime since page load",                           usage: "uptime" },
  { name: "man",      module: "utility",     description: "Show manual page for a command",                                usage: "man <cmd>" },
  { name: "grep",     module: "utility",     description: "Pattern-match lines in a virtual file",                         usage: "grep <pattern> <file>" },
] as const;

const THEMES = [
  { name: "default", description: "Deep blue-grey — the base dark theme", bg: "#060c17", fg: "#c4d4e8", accent: "#36c8b4" },
  { name: "matrix",  description: "Classic green phosphor on black",       bg: "#001100", fg: "#00ff41", accent: "#00ff41" },
  { name: "cyber",   description: "Cyberpunk magenta on near-black",       bg: "#0a0014", fg: "#ff00ff", accent: "#ff00ff" },
  { name: "minimal", description: "Low-contrast neutral grey palette",     bg: "#111111", fg: "#cccccc", accent: "#888888" },
  { name: "dracula", description: "Dracula color scheme — purple+pink",    bg: "#282a36", fg: "#f8f8f2", accent: "#ff79c6" },
] as const;

const STACK = [
  { name: "next",             pkg: "next",             version: "14.2.35", role: "Full-stack framework, App Router, ISR, API routes" },
  { name: "react",            pkg: "react",            version: "18.3.1",  role: "UI with startTransition + useDeferredValue for smooth typing" },
  { name: "typescript",       pkg: "typescript",       version: "5.7.2",   role: "Strict mode throughout; zero any casts in library code" },
  { name: "@xterm/xterm",     pkg: "@xterm/xterm",     version: "6.0.0",   role: "VT100/ANSI terminal emulator rendered in Canvas" },
  { name: "@xterm/addon-fit", pkg: "@xterm/addon-fit", version: "0.10.0",  role: "Auto-resize xterm to container dimensions" },
  { name: "@xterm/addon-webgl",pkg:"@xterm/addon-webgl",version:"0.18.0",  role: "WebGL renderer; falls back to canvas on unsupported GPU" },
  { name: "zustand",          pkg: "zustand",          version: "5.0.8",   role: "Terminal state store: cwd, theme, history, busy flag" },
  { name: "ai",               pkg: "ai",               version: "5.0.47",  role: "Vercel AI SDK — streaming responses for ask command" },
  { name: "@ai-sdk/google",   pkg: "@ai-sdk/google",   version: "1.0.6",   role: "Google Gemini 2.0 Flash provider for grounded AI answers" },
  { name: "octokit",          pkg: "octokit",          version: "4.1.4",   role: "GitHub REST API — fetch repos, stars, followers" },
  { name: "next-pwa",         pkg: "next-pwa",         version: "5.6.0",   role: "PWA manifest + service worker; installable as desktop app" },
  { name: "tailwindcss",      pkg: "tailwindcss",      version: "3.4.16",  role: "Utility CSS; CSS-variable theme system; custom tokens" },
] as const;

const FILESYSTEM_TREE = `
~/
├── bio.txt            — personal introduction text
├── now.txt            — what I'm working on right now
├── resume.pdf         — stub: opens resume URL when using cat
├── projects/
│   ├── janus/
│   │   ├── readme.md
│   │   └── link.url
│   ├── drishti/
│   │   ├── readme.md
│   │   └── link.url
│   ├── sp500-dashboard/
│   │   ├── readme.md
│   │   └── link.url
│   └── ... (more projects)
├── skills/
│   ├── languages.md
│   ├── frameworks.md
│   ├── tools.md
│   └── learning.md
├── contact/
│   ├── email.txt
│   ├── github.url
│   └── linkedin.url
├── secret/
│   └── .credits       — hidden easter egg
└── .config/
    ├── theme.txt
    └── aliases.sh
`.trim();



/* ─── Section component ─────────────────────────────────────────── */

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16">
      <h2 className="mb-4 border-b border-border/40 pb-2 text-base font-semibold text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ModuleBadge({ module }: { module: string }) {
  const colours: Record<string, string> = {
    portfolio:   "text-blue-400/80",
    filesystem:  "text-emerald-400/80",
    github:      "text-purple-400/80",
    theme:       "text-orange-400/80",
    "easter-eggs":"text-pink-400/80",
    utility:     "text-cyan-400/80",
  };
  return <span className={`${colours[module] ?? "text-muted/70"} text-[11px]`}>{module}</span>;
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function ReportPage() {
  const modules = [...new Set(COMMANDS.map((c) => c.module))];
  const navItems = [
    { id: "overview",    label: "Overview" },
    { id: "commands",    label: `Commands (${COMMANDS.length})` },
    { id: "filesystem",  label: "Filesystem" },
    { id: "themes",      label: "Themes" },
    { id: "stack",       label: "Stack" },
    { id: "integrations",label: "Live Data" },
    { id: "shortcuts",   label: "Shortcuts" },
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* ── Top bar ── */}
      <nav className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-4 overflow-x-auto px-4 py-3 text-xs font-mono text-muted/60 sm:px-6">
          <Link href="/" className="mr-4 flex-shrink-0 font-semibold text-accent/80 transition hover:text-accent">
            ← terminal
          </Link>
          <span className="flex-shrink-0 text-border/60">system report</span>
          <span className="flex-shrink-0 text-border/40">·</span>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="flex-shrink-0 transition hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="border-b border-border/40 bg-surface/40 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted/50">system report</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">terminal.daljeetsingh.me</h1>
          <p className="mt-2 font-mono text-muted/70">terminal.daljeetsingh.me</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted/80">
            A browser-native terminal portfolio with a virtual filesystem, {COMMANDS.length} commands across{" "}
            {modules.length} modules, live GitHub data, and an AI assistant grounded in portfolio content.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs">
            {[
              `${COMMANDS.length} commands`,
              `${modules.length} modules`,
              `${THEMES.length} themes`,
              "PWA",
              "ISR 300s",
              "WebGL renderer",
              "Vercel AI SDK streaming",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded border border-border/50 px-2 py-0.5 text-muted/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="mx-auto max-w-5xl space-y-14 px-4 py-12 sm:px-6">

        {/* Overview */}
        <Section id="overview" title="Overview">
          <div className="grid gap-5 text-sm leading-7 text-muted/80 sm:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-foreground font-medium">What it is</h3>
              <p>
                A terminal emulator running in the browser, built on{" "}
                <strong className="text-foreground/80">xterm.js</strong> and{" "}
                <strong className="text-foreground/80">Next.js 14 App Router</strong>. It presents a personal
                portfolio as a navigable virtual filesystem with a Bash-like command interface.
              </p>
              <p>
                The entire content layer — projects, skills, contact, bio — is driven by a single data file.
                Adding a project means adding one JSON node; the terminal can immediately navigate, list, and
                display it without any code changes.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-foreground font-medium">Design principles</h3>
              <ul className="list-inside list-disc space-y-1.5">
                <li>Command registry pattern — each module exports a typed command definition array</li>
                <li>Single source of truth — all portfolio content from one data file</li>
                <li>ANSI formatting abstracted into a helper — no raw escape strings in business logic</li>
                <li>Minimal React state: cwd, theme, history, busy flag via Zustand</li>
                <li>Dual input: xterm.js for desktop, companion HTML input for mobile compatibility</li>
                <li>GitHub data cached server-side and revalidated periodically — no blocking fetch on load</li>
              </ul>
            </div>
          </div>

          {/* Architecture ASCII */}
          <div className="mt-6 overflow-x-auto rounded-lg border border-border/50 bg-surface-strong p-4">
            <pre className="font-mono text-[11px] leading-5 text-muted/60">{`
  Browser
  ┌────────────────────────────────────────────────────────────┐
  │  page.tsx (RSC)                                            │
  │   ├─ prefetch GitHub snapshot  (ISR cache, server-side)    │
  │   └─ <TerminalWorkbench>  (client component)               │
  │       ├─ xterm.js  →  input handler  →  command parser     │
  │       ├─ HTML input  (mobile / fallback)                   │
  │       ├─ useTerminalStore (Zustand)                        │
  │       └─ executeCommand() → CommandResult                  │
  │           ├─ portfolio module  (whoami / projects / ...)  │
  │           ├─ filesystem module (ls / cd / cat / ...)      │
  │           ├─ github module     (github / ask)              │
  │           │   ├─ GitHub integration  (server-side)        │
  │           │   └─ AI streaming integration (server-side)   │
  │           ├─ theme module      (theme)                     │
  │           ├─ easter-eggs module (neofetch / matrix / ...)  │
  │           └─ utility module    (history / tree / date ...) │
  └────────────────────────────────────────────────────────────┘
`.trim()}</pre>
          </div>
        </Section>

        {/* Commands */}
        <Section id="commands" title={`Command Reference (${COMMANDS.length} total)`}>
          <div className="mb-4 flex flex-wrap gap-2 font-mono text-[11px]">
            {modules.map((mod) => (
              <span key={mod} className="flex items-center gap-1.5">
                <ModuleBadge module={mod} />
                <span className="text-border/60">({COMMANDS.filter((c) => c.module === mod).length})</span>
              </span>
            ))}
          </div>
          <div className="overflow-x-auto rounded-lg border border-border/50">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-surface-strong/60">
                  <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-muted/50">cmd</th>
                  <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-muted/50">module</th>
                  <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-muted/50">usage</th>
                  <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-muted/50 hidden md:table-cell">description</th>
                </tr>
              </thead>
              <tbody>
                {COMMANDS.map((cmd, i) => (
                  <tr
                    key={cmd.name}
                    className={`border-b border-border/20 ${i % 2 === 0 ? "" : "bg-surface-strong/20"}`}
                  >
                    <td className="px-3 py-2 text-prompt/80">{cmd.name}</td>
                    <td className="px-3 py-2"><ModuleBadge module={cmd.module} /></td>
                    <td className="px-3 py-2 text-muted/60">{cmd.usage}</td>
                    <td className="px-3 py-2 text-muted/50 hidden md:table-cell font-sans text-[12px]">{cmd.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Filesystem */}
        <Section id="filesystem" title="Virtual Filesystem">
          <p className="mb-4 text-sm leading-7 text-muted/80">
            The virtual filesystem is a nested JSON structure — directories are plain objects, files are strings.
            The terminal traverses it for{" "}
            <code className="rounded bg-surface-strong px-1 text-[12px] text-accent/80">ls</code>,{" "}
            <code className="rounded bg-surface-strong px-1 text-[12px] text-accent/80">cd</code>,{" "}
            <code className="rounded bg-surface-strong px-1 text-[12px] text-accent/80">cat</code>, and Tab autocomplete.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border/50 bg-surface-strong p-4">
            <pre className="font-mono text-[12px] leading-[1.7] text-muted/70">{FILESYSTEM_TREE}</pre>
          </div>
        </Section>

        {/* Themes */}
        <Section id="themes" title="Theme System">
          <p className="mb-4 text-sm leading-7 text-muted/80">
            Themes are CSS-variable records. Switching a theme updates both the xterm.js renderer
            and the page CSS variables simultaneously. Use{" "}
            <code className="rounded bg-surface-strong px-1 text-[12px] text-accent/80">theme [name]</code>{" "}
            in the terminal, or click a theme name in the sidebar.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {THEMES.map((t) => (
              <div
                key={t.name}
                className="overflow-hidden rounded-lg border border-border/40"
                style={{ background: t.bg }}
              >
                <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.accent }} />
                  <span className="font-mono text-[11px]" style={{ color: t.fg }}>{t.name}</span>
                </div>
                <p className="px-3 py-2 font-sans text-[12px]" style={{ color: t.fg, opacity: 0.6 }}>
                  {t.description}
                </p>
                <div className="flex gap-2 px-3 pb-2 font-mono text-[10px]" style={{ color: t.fg, opacity: 0.4 }}>
                  <span>bg {t.bg}</span>
                  <span>·</span>
                  <span>accent {t.accent}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Stack */}
        <Section id="stack" title="Tech Stack">
          <div className="overflow-x-auto rounded-lg border border-border/50">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-surface-strong/60">
                  <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-muted/50">package</th>
                  <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-muted/50 hidden sm:table-cell">role</th>
                </tr>
              </thead>
              <tbody>
                {STACK.map((s, i) => (
                  <tr key={s.name} className={`border-b border-border/20 ${i % 2 === 0 ? "" : "bg-surface-strong/20"}`}>
                    <td className="px-3 py-2 text-prompt/80">{s.pkg}</td>
                    <td className="px-3 py-2 text-muted/50 hidden sm:table-cell font-sans text-[12px]">{s.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Integrations */}
        <Section id="integrations" title="Live Integrations">
          <div className="space-y-6 text-sm text-muted/80">
            <div>
              <h3 className="mb-2 font-medium text-foreground">GitHub</h3>
              <p className="leading-7">
                Live GitHub stats — public repos, total stars, and follower count — are fetched server-side
                and cached for performance. The{" "}
                <code className="rounded bg-surface-strong px-1 text-[12px] text-accent/80">github</code>{" "}
                command refreshes data on demand.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-foreground">AI Assistant</h3>
              <p className="leading-7">
                The{" "}
                <code className="rounded bg-surface-strong px-1 text-[12px] text-accent/80">ask</code>{" "}
                command streams AI-generated answers grounded in portfolio content — projects, skills, and
                background — for accurate, context-aware responses.
              </p>
            </div>
          </div>
        </Section>

        {/* Shortcuts */}
        <Section id="shortcuts" title="Keyboard Shortcuts">
          <div className="grid gap-3 font-mono text-sm sm:grid-cols-2">
            {[
              ["Tab",    "Autocomplete command or path"],
              ["↑",      "Previous command in history"],
              ["↓",      "Next command in history"],
              ["Enter",  "Execute current command"],
              ["Ctrl+L", "Clear terminal buffer"],
              ["Ctrl+C", "Cancel current input"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-4 rounded-lg border border-border/40 bg-surface-strong/30 px-4 py-3">
                <kbd className="min-w-[4rem] rounded border border-border/60 bg-surface-strong px-2 py-0.5 text-center text-[11px] text-prompt/80">
                  {key}
                </kbd>
                <span className="text-xs text-muted/70">{desc}</span>
              </div>
            ))}
          </div>
        </Section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between font-mono text-[11px] text-muted/40">
          <span>terminal.daljeetsingh.me</span>
          <div className="flex items-center gap-4">
            <a href="https://daljeetsingh.me" className="transition hover:text-muted/70" target="_blank" rel="noopener noreferrer">
              ⇁ full portfolio
            </a>
            <Link href="/" className="transition hover:text-muted/70">← terminal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
