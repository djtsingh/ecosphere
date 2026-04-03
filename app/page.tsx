import portfolioData from "@/data/portfolio.json";
import { TerminalWorkbench } from "@/components/terminal-workbench";
import { TerminalErrorBoundary } from "@/components/error-boundary";
import { getGitHubSnapshot } from "@/lib/github";

export const revalidate = 300;

export default async function HomePage() {
  const initialGitHubSnapshot = await getGitHubSnapshot().catch(() => null);

  return (
    <main className="flex h-dvh flex-col overflow-hidden sm:p-2.5 lg:p-4">

      {/* ── Terminal — fills viewport ── */}
      <div className="mx-auto w-full max-w-6xl flex-1 min-h-0">
        <TerminalErrorBoundary>
          <TerminalWorkbench initialGitHubSnapshot={initialGitHubSnapshot} portfolio={portfolioData} />
        </TerminalErrorBoundary>
      </div>

      {/* ── Host strip — desktop only ── */}
      <div className="mx-auto hidden w-full max-w-6xl flex-none items-center justify-between gap-2 px-1 py-1 font-mono text-[10px] text-muted/50 sm:flex sm:text-xs">
        <div className="flex items-center gap-2 truncate">
          <span className="text-prompt/70">{portfolioData.profile.handle}</span>
          <span className="text-border/50">@</span>
          <span className="text-muted/60">terminal.daljeetsingh.me</span>
          <span className="text-border/40">·</span>
          <span className="text-muted/40">{portfolioData.profile.location}</span>
        </div>
        <div className="flex flex-shrink-0 items-center gap-4">
          <a
            href="https://daljeetsingh.me"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 transition hover:text-accent"
          >
            <span className="text-border/50 group-hover:text-accent/60">⌁</span>
            main portfolio
          </a>
          <a href="/report" className="transition hover:text-muted/80">
            sys·report
          </a>
        </div>
      </div>
    </main>
  );
}

