"use client";

import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { FitAddon } from "@xterm/addon-fit";
import { WebglAddon } from "@xterm/addon-webgl";
import { Terminal } from "@xterm/xterm";

import { executeCommand, getAutocompleteSuggestions } from "@/lib/commands";
import type { GitHubSnapshot, PortfolioData } from "@/lib/commands/types";
import { applyTerminalTheme, buildBootMessage, formatPrompt, renderLines, runTerminalAnimation } from "@/lib/terminal";
import { useTerminalStore } from "@/lib/store/terminal-store";
import { THEMES } from "@/lib/themes";

type TerminalWorkbenchProps = {
  portfolio: PortfolioData;
  initialGitHubSnapshot: GitHubSnapshot;
};

function getEditableTail(input: string): { prefix: string; tail: string } {
  const match = input.match(/^(.*?)(\S*)$/);
  return {
    prefix: match?.[1] ?? "",
    tail: match?.[2] ?? ""
  };
}

export function TerminalWorkbench({ portfolio, initialGitHubSnapshot }: TerminalWorkbenchProps) {
  const root = portfolio.filesystem["~"];
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const initializedRef = useRef(false);
  const inputValueRef = useRef("");
  const cwdRef = useRef("~");
  const themeRef = useRef<keyof typeof THEMES>("default");
  const busyRef = useRef(false);
  const historyRef = useRef<string[]>([]);
  const historyCursorRef = useRef<number | null>(null);
  const githubSnapshotRef = useRef<GitHubSnapshot>(initialGitHubSnapshot);
  const composerRef = useRef<HTMLInputElement | null>(null);
  const handleAutocompleteRef = useRef<() => void>(() => undefined);
  const submitCommandRef = useRef<() => Promise<void>>(async () => undefined);

  const cwd = useTerminalStore((state) => state.cwd);
  const themeName = useTerminalStore((state) => state.themeName);
  const history = useTerminalStore((state) => state.history);
  const isBusy = useTerminalStore((state) => state.isBusy);
  const setCwd = useTerminalStore((state) => state.setCwd);
  const setThemeName = useTerminalStore((state) => state.setThemeName);
  const pushHistory = useTerminalStore((state) => state.pushHistory);
  const setBusy = useTerminalStore((state) => state.setBusy);

  const [input, setInput] = useState("");
  const [status, setStatus] = useState("System ready");
  const [githubSnapshot, setGitHubSnapshot] = useState<GitHubSnapshot>(initialGitHubSnapshot);

  const deferredInput = useDeferredValue(input);

  const suggestions = useMemo(
    () => getAutocompleteSuggestions(deferredInput, cwd, root).slice(0, 5),
    [cwd, deferredInput, root]
  );

  useEffect(() => {
    cwdRef.current = cwd;
  }, [cwd]);

  useEffect(() => {
    themeRef.current = themeName;
    document.documentElement.dataset.theme = themeName;

    Object.entries(THEMES[themeName].css).forEach(([token, value]) => {
      document.documentElement.style.setProperty(token, value);
    });

    if (terminalRef.current) {
      applyTerminalTheme(terminalRef.current, themeName);
      terminalRef.current.refresh(0, terminalRef.current.rows - 1);
    }
  }, [themeName]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    busyRef.current = isBusy;
  }, [isBusy]);

  useEffect(() => {
    githubSnapshotRef.current = githubSnapshot;
  }, [githubSnapshot]);

  useEffect(() => {
    inputValueRef.current = input;

    if (!initializedRef.current || !terminalRef.current) {
      return;
    }

    terminalRef.current.write(`\u001b[2K\r${formatPrompt(portfolio.profile.handle, cwdRef.current)}${input}`);
  }, [input, portfolio.profile.handle]);

  useEffect(() => {
    if (!terminalContainerRef.current || initializedRef.current) {
      return;
    }

    const term = new Terminal({
      allowTransparency: false,
      cursorBlink: true,
      cursorStyle: "block",
      // xterm cannot resolve CSS variables — provide a concrete font stack
      fontFamily: '"IBM Plex Mono", "Cascadia Code", "Fira Code", "JetBrains Mono", "Menlo", "Consolas", monospace',
      fontSize: 13,
      lineHeight: 1.4,
      letterSpacing: 0,
      scrollback: 2000,
      convertEol: true
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    try {
      term.loadAddon(new WebglAddon());
    } catch {
      setStatus("Running without WebGL acceleration");
    }

    term.open(terminalContainerRef.current);
    // Defer first fit to next frame — container must be laid out first
    requestAnimationFrame(() => {
      fitAddon.fit();
      applyTerminalTheme(term, themeRef.current);
      renderLines(term, `${buildBootMessage(portfolio, githubSnapshotRef.current)}\n\n`);
      term.write(formatPrompt(portfolio.profile.handle, cwdRef.current));
      term.focus();
    });

    const onResize = () => {
      requestAnimationFrame(() => fitAddon.fit());
    };

    const onDataDispose = term.onData((data) => {
      if (busyRef.current) {
        return;
      }

      if (data === "\r") {
        void submitCommandRef.current();
        return;
      }

      if (data === "\t") {
        handleAutocompleteRef.current();
        return;
      }

      if (data === "\u0003") {
        startTransition(() => {
          setInput("");
        });
        return;
      }

      // Ctrl+L: clear terminal
      if (data === "\u000c") {
        term.clear();
        term.write(`\u001b[2K\r${formatPrompt(portfolio.profile.handle, cwdRef.current)}${inputValueRef.current}`);
        return;
      }

      if (data === "\u007f") {
        startTransition(() => {
          setInput((current) => current.slice(0, -1));
        });
        return;
      }

      if (data === "\u001b[A") {
        cycleHistory("up");
        return;
      }

      if (data === "\u001b[B") {
        cycleHistory("down");
        return;
      }

      if (data.includes("\u001b")) {
        return;
      }

      const sanitized = data.replace(/[\r\n]+/g, " ");

      startTransition(() => {
        setInput((current) => `${current}${sanitized}`);
      });
    });

    // ResizeObserver is more reliable than window resize for flex containers
    const ro = new ResizeObserver(onResize);
    ro.observe(terminalContainerRef.current);
    window.addEventListener("resize", onResize);

    terminalRef.current = term;
    fitAddonRef.current = fitAddon;
    initializedRef.current = true;

    return () => {
      onDataDispose.dispose();
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      fitAddon.dispose();
      term.dispose();
      initializedRef.current = false;
    };
  }, [portfolio]);

  async function fetchGitHub(): Promise<GitHubSnapshot> {
    try {
      const response = await fetch("/api/github", { cache: "no-store" });

      if (!response.ok) {
        return githubSnapshotRef.current;
      }

      const snapshot = (await response.json()) as GitHubSnapshot;
      startTransition(() => {
        setGitHubSnapshot(snapshot);
      });

      return snapshot;
    } catch {
      return githubSnapshotRef.current;
    }
  }

  async function askPortfolio(question: string): Promise<string> {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    if (!response.ok) {
      return "The ask endpoint is unavailable right now. Try browsing with projects, skills, or contact.";
    }

    const data = (await response.json()) as { answer: string };
    return data.answer;
  }

  function openExternal(url: string): void {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function focusTerminal(): void {
    terminalRef.current?.focus();
    composerRef.current?.focus();
  }

  function cycleHistory(direction: "up" | "down"): void {
    const commands = historyRef.current;

    if (!commands.length) {
      return;
    }

    if (direction === "up") {
      const nextCursor = historyCursorRef.current === null ? commands.length - 1 : Math.max(historyCursorRef.current - 1, 0);
      historyCursorRef.current = nextCursor;
      startTransition(() => {
        setInput(commands[nextCursor] || "");
      });
      return;
    }

    if (historyCursorRef.current === null) {
      return;
    }

    const nextCursor = historyCursorRef.current + 1;

    if (nextCursor >= commands.length) {
      historyCursorRef.current = null;
      startTransition(() => {
        setInput("");
      });
      return;
    }

    historyCursorRef.current = nextCursor;
    startTransition(() => {
      setInput(commands[nextCursor] || "");
    });
  }

  function handleAutocomplete(): void {
    const available = getAutocompleteSuggestions(inputValueRef.current, cwdRef.current, root);

    if (!available.length) {
      return;
    }

    if (available.length === 1) {
      const { prefix } = getEditableTail(inputValueRef.current);
      startTransition(() => {
        setInput(`${prefix}${available[0]}`);
      });
      return;
    }

    if (terminalRef.current) {
      terminalRef.current.write("\r\n");
      renderLines(terminalRef.current, `${available.join("  ")}\n`);
      terminalRef.current.write(`${formatPrompt(portfolio.profile.handle, cwdRef.current)}${inputValueRef.current}`);
    }
  }

  async function submitCommand(commandOverride?: string): Promise<void> {
    const currentCommand = (commandOverride ?? inputValueRef.current).trim();
    const term = terminalRef.current;

    if (!term) {
      return;
    }

    term.write("\r\n");
    historyCursorRef.current = null;
    inputValueRef.current = "";

    startTransition(() => {
      setInput("");
    });

    if (!currentCommand) {
      term.write(formatPrompt(portfolio.profile.handle, cwdRef.current));
      return;
    }

    pushHistory(currentCommand);
    setBusy(true);
    setStatus(`Running ${currentCommand.split(" ")[0]}...`);

    const result = await executeCommand(currentCommand, {
      cwd: cwdRef.current,
      root,
      portfolio,
      themeName: themeRef.current,
      githubSnapshot: githubSnapshotRef.current,
      history: historyRef.current,
      askPortfolio,
      fetchGitHub,
      openExternal
    });

    if (result.clear) {
      term.clear();
    }

    if (result.nextCwd) {
      setCwd(result.nextCwd);
    }

    if (result.nextTheme) {
      setThemeName(result.nextTheme);
    }

    if (result.output) {
      renderLines(term, `${result.output}\n`);
    }

    if (result.openUrl) {
      openExternal(result.openUrl);
    }

    if (result.animation) {
      await runTerminalAnimation(term, result.animation);
      term.write("\r\n");
    }

    setBusy(false);
    setStatus("System ready");
    term.write(formatPrompt(portfolio.profile.handle, result.nextCwd ?? cwdRef.current));
    focusTerminal();
  }

  handleAutocompleteRef.current = handleAutocomplete;
  submitCommandRef.current = () => submitCommand();

  const themeNames = Object.keys(THEMES) as Array<keyof typeof THEMES>;
  const plainPrompt = `${portfolio.profile.handle}@portfolio:${cwd}$`;

  return (
    <section className="scanlines relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-glow">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* ── Title bar ── */}
      <header className="relative flex h-11 flex-none items-center border-b border-border bg-surface-strong/70 px-4">
        {/* Traffic lights */}
        <div className="flex items-center gap-[6px]">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        </div>

        {/* Session title — centered absolutely so lights don't shift it */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[12px] text-muted/70">
            <span className="text-prompt/75">{portfolio.profile.handle}</span>
            <span className="opacity-40">@portfolio:</span>
            <span className="text-accent/80">{cwd}</span>
          </span>
        </div>

        {/* Ready/running indicator */}
        <div className="ml-auto flex items-center gap-2 font-mono text-[11px]">
          <span
            className={`h-[5px] w-[5px] rounded-full ${isBusy ? "bg-amber-400" : "bg-emerald-500/80"}`}
            aria-hidden="true"
          />
          <span className={`hidden sm:block ${isBusy ? "text-amber-400/80" : "text-muted/50"}`}>
            {isBusy ? status : "ready"}
          </span>
        </div>
      </header>

      {/* ── Main content area ── */}
      <div className="flex min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_200px]">

        {/* Terminal pane */}
        <div className="flex flex-col border-b border-border lg:border-b-0 lg:border-r">
          {/* xterm surface */}
          <div
            className="flex-1 cursor-text px-4 py-3"
            onClick={focusTerminal}
            role="presentation"
          >
            <div ref={terminalContainerRef} className="terminal-host min-h-[480px]" />
          </div>

          {/* Input strip */}
          <form
            className="flex flex-col border-t border-border bg-black/20 px-4 py-2.5"
            onSubmit={(event) => {
              event.preventDefault();
              void submitCommand();
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="hidden select-none font-mono text-[12px] text-prompt/70 sm:block"
                aria-hidden="true"
              >
                {plainPrompt}
              </span>
              <input
                ref={composerRef}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                className="min-w-0 flex-1 rounded-md border border-border/60 bg-transparent px-3 py-1.5 font-mono text-sm text-foreground outline-none transition placeholder:text-muted/30 focus:border-prompt/50 focus:bg-black/10"
                onChange={(event) => {
                  const nextValue = event.target.value;
                  inputValueRef.current = nextValue;
                  setInput(nextValue);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Tab") {
                    event.preventDefault();
                    handleAutocomplete();
                    return;
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    cycleHistory("up");
                    return;
                  }
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    cycleHistory("down");
                  }
                }}
                placeholder="enter command…"
                spellCheck={false}
                value={input}
              />
              <button
                className="flex-none rounded-md border border-border/60 bg-accent/10 px-3 py-1.5 font-mono text-xs text-accent transition hover:bg-accent/20 disabled:pointer-events-none disabled:opacity-40"
                disabled={isBusy}
                type="submit"
              >
                exec
              </button>
            </div>

            {suggestions.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    className="rounded border border-border/50 px-2 py-0.5 font-mono text-[11px] text-muted/70 transition hover:border-accent/40 hover:text-accent"
                    onClick={() => {
                      const { prefix } = getEditableTail(inputValueRef.current);
                      const nextValue = `${prefix}${suggestion}`;
                      inputValueRef.current = nextValue;
                      setInput(nextValue);
                      focusTerminal();
                    }}
                    type="button"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
          </form>
        </div>

        {/* ── Sidebar ── */}
        <aside className="hidden flex-col divide-y divide-border font-mono text-xs lg:flex">

          {/* Quick run */}
          <div className="px-3 py-2.5">
            <p className="panel-label mb-2">quick run</p>
            <div className="space-y-px">
              {["whoami", "projects", "github", 'ask "what have you built?"', "theme matrix"].map((cmd) => (
                <button
                  key={cmd}
                  className="flex w-full items-center gap-1.5 rounded px-1.5 py-[5px] text-left text-muted/70 transition hover:bg-accent/8 hover:text-accent"
                  onClick={() => void submitCommand(cmd)}
                  type="button"
                >
                  <span className="text-prompt/40">›</span>
                  <span className="truncate">{cmd}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Session info */}
          <div className="px-3 py-2.5">
            <p className="panel-label mb-2">session</p>
            <dl className="space-y-1">
              <div className="flex justify-between">
                <dt className="text-muted/50">path</dt>
                <dd className="text-accent/80">{cwd}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted/50">theme</dt>
                <dd className="text-foreground/80">{themeName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted/50">history</dt>
                <dd className="text-foreground/80">{history.length} cmds</dd>
              </div>
            </dl>
          </div>

          {/* GitHub */}
          <div className="px-3 py-2.5">
            <p className="panel-label mb-2">github</p>
            {githubSnapshot ? (
              <dl className="space-y-1">
                <div className="flex justify-between">
                  <dt className="text-muted/50">repos</dt>
                  <dd className="text-foreground/80">{githubSnapshot.publicRepos}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted/50">stars</dt>
                  <dd className="text-foreground/80">{githubSnapshot.totalStars}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted/50">followers</dt>
                  <dd className="text-foreground/80">{githubSnapshot.followers}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-muted/40">run github to fetch</p>
            )}
          </div>

          {/* Theme switcher */}
          <div className="flex-1 px-3 py-2.5">
            <p className="panel-label mb-2">themes</p>
            <div className="space-y-px">
              {themeNames.map((name) => (
                <button
                  key={name}
                  className={`flex w-full items-center gap-2 rounded px-1.5 py-[5px] text-left transition-colors ${
                    themeName === name ? "text-accent" : "text-muted/50 hover:text-muted/80"
                  }`}
                  onClick={() => setThemeName(name)}
                  type="button"
                >
                  <span
                    className={`block h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                      themeName === name ? "bg-accent" : "bg-border/60"
                    }`}
                  />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ── Status bar ── */}
      <footer className="flex h-6 flex-none items-center border-t border-border bg-surface-strong/50 px-4 font-mono text-[11px]">
        <span className="text-accent/40">◈</span>
        <span className="ml-2 text-muted/60">{cwd}</span>
        <span className="mx-2.5 text-border/60">│</span>
        <span className="hidden text-muted/40 sm:block">{portfolio.profile.handle}@portfolio</span>
        <span className="mx-2.5 hidden text-border/60 sm:block">│</span>
        <span className={isBusy ? "text-amber-400/60" : "text-emerald-500/50"}>
          {isBusy ? "● running" : "○ idle"}
        </span>
        <div className="ml-auto text-muted/30">
          <a href="/report" className="transition hover:text-muted/60">
            report
          </a>
          <span className="mx-2 text-border/40">·</span>
          <span>v0.2.0</span>
        </div>
      </footer>
    </section>
  );
}