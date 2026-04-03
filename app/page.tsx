import portfolioData from "@/data/portfolio.json";
import { TerminalWorkbench } from "@/components/terminal-workbench";
import { TerminalErrorBoundary } from "@/components/error-boundary";
import { getGitHubSnapshot } from "@/lib/github";

export const revalidate = 300;

/* ── Filesystem tree ─ rendered server-side, no client JS needed ── */
type FsNode = string | Record<string, unknown>;

function FsTree({ node, prefix = "", depth = 0 }: { node: Record<string, FsNode>; prefix?: string; depth?: number }) {
  const entries = Object.entries(node).filter(([n]) => !n.startsWith("."));
  return (
    <>
      {entries.map(([name, child], i) => {
        const isLast = i === entries.length - 1;
        const isDir = typeof child === "object" && child !== null;
        const connector = isLast ? "└── " : "├── ";
        const childPrefix = prefix + (isLast ? "    " : "│   ");

        return (
          <div key={name}>
            <span className="select-none text-border/60">{prefix}{connector}</span>
            {isDir
              ? <span className="text-prompt/80">{name}/</span>
              : <span className="text-muted/80">{name}</span>
            }
            {isDir && depth < 1 && (
              <FsTree node={child as Record<string, FsNode>} prefix={childPrefix} depth={depth + 1} />
            )}
          </div>
        );
      })}
    </>
  );
}

/* ── Panel section wrapper ────────────────────────────────────── */
function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border/60 px-4 py-3">
      <p className="panel-label mb-2">{label}</p>
      {children}
    </div>
  );
}

export default async function HomePage() {
  const initialGitHubSnapshot = await getGitHubSnapshot().catch(() => null);

  const fs = portfolioData.filesystem["~"] as Record<string, FsNode>;

  return (
    <main className="flex min-h-screen flex-col px-4 py-6 sm:px-6 lg:px-8">
      {/* ── Top micro-header ── */}
      <div className="mx-auto mb-6 flex w-full max-w-7xl items-center justify-between font-mono text-xs text-muted/50">
        <span>
          <span className="text-prompt/70">ecosphere</span>
          <span className="mx-1.5 opacity-30">·</span>
          terminal.daljeetsingh.me
        </span>
        <a href="/report" className="transition hover:text-muted">
          system report →
        </a>
      </div>

      {/* ── Main layout ── */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-5 lg:grid-cols-[296px_minmax(0,1fr)] lg:items-start">

        {/* ─────────── LEFT: System panel ─────────── */}
        <aside className="overflow-hidden rounded-xl border border-border/70 bg-surface shadow-glow font-mono text-xs">
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-border/60 bg-surface-strong/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent/70" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted/60">system</span>
            </div>
            <span className="text-[10px] text-muted/40">ecosphere v0.2</span>
          </div>

          {/* HOST */}
          <Panel label="HOST">
            <div className="space-y-0.5">
              <div>
                <span className="text-prompt/80">{portfolioData.profile.handle}</span>
                <span className="text-border/60">@portfolio</span>
              </div>
              <div className="text-muted/60">{portfolioData.profile.location}</div>
              <div className="text-muted/60">{portfolioData.profile.title.toLowerCase()}</div>
            </div>
          </Panel>

          {/* FILESYSTEM */}
          <Panel label="FILESYSTEM">
            <div className="leading-[1.7]">
              <div className="text-accent/70">~/</div>
              <FsTree node={fs} />
            </div>
          </Panel>

          {/* KEYBOARD */}
          <Panel label="KEYBOARD">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
              {[
                ["Tab", "autocomplete"],
                ["↑ ↓", "history"],
                ["Ctrl+L", "clear"],
                ["Ctrl+C", "cancel input"],
              ].map(([key, desc]) => (
                <div key={key} className="contents">
                  <span className="text-prompt/70">{key}</span>
                  <span className="text-muted/60">{desc}</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* STACK */}
          <Panel label="STACK">
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-muted/60">
              {[
                ["Next.js", "14.2"],
                ["xterm.js", "6.0"],
                ["TypeScript", "5.7"],
                ["Zustand", "5.0"],
                ["Vercel AI SDK", "5.0"],
                ["Octokit", "4.1"],
              ].map(([name, ver]) => (
                <div key={name} className="flex items-baseline justify-between">
                  <span>{name}</span>
                  <span className="text-border/60">{ver}</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* STATS footer */}
          <div className="border-t border-border/60 bg-surface-strong/30 px-4 py-2">
            <div className="flex items-center justify-between text-[10px] text-muted/40">
              <span>30 commands</span>
              <span className="text-border/40">·</span>
              <span>5 themes</span>
              <span className="text-border/40">·</span>
              <span>PWA</span>
              <span className="text-border/40">·</span>
              <span>ISR 300s</span>
            </div>
          </div>
        </aside>

        {/* ─────────── RIGHT: Terminal ─────────── */}
        <TerminalErrorBoundary>
          <TerminalWorkbench initialGitHubSnapshot={initialGitHubSnapshot} portfolio={portfolioData} />
        </TerminalErrorBoundary>
      </div>
    </main>
  );
}
