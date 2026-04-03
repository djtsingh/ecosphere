import { Terminal } from "@xterm/xterm";

import type { GitHubSnapshot, PortfolioData, TerminalAnimationName } from "@/lib/commands/types";
import { THEMES, type ThemeName } from "@/lib/themes";

const MATRIX_CHARS = "01ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノ#$%&*+-=@";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function applyTerminalTheme(terminal: Terminal, themeName: ThemeName): void {
  terminal.options.theme = THEMES[themeName].terminal;
}

export function formatPrompt(handle: string, cwd: string): string {
  return `\x1b[34m${handle}\x1b[0m\x1b[2m@portfolio\x1b[0m:\x1b[36m${cwd}\x1b[0m$ `;
}

export function renderLines(terminal: Terminal, text: string): void {
  terminal.write(text.replace(/\n/g, "\r\n"));
}

export function buildBootMessage(portfolio: PortfolioData, snapshot: GitHubSnapshot): string {
  const divider = "\x1b[2m─────────────────────────────────────────────\x1b[0m";
  const githubLine = snapshot
    ? `\x1b[32m●\x1b[0m GitHub cache warmed: \x1b[33m${snapshot.publicRepos}\x1b[0m repos, \x1b[33m${snapshot.totalStars}\x1b[0m stars`
    : "\x1b[33m○\x1b[0m GitHub cache cold. Run \x1b[96m'github'\x1b[0m to fetch live data.";

  return [
    "",
    `\x1b[1m\x1b[36m  terminal.daljeetsingh.me\x1b[0m`,
    `  \x1b[2m${portfolio.profile.tagline}\x1b[0m`,
    "",
    divider,
    `  ${githubLine}`,
    `  \x1b[32m●\x1b[0m Virtual filesystem loaded: \x1b[33m${Object.keys(portfolio.filesystem["~"]).length}\x1b[0m entries at ~/`,
    `  \x1b[32m●\x1b[0m Command registry active`,
    divider,
    "",
    `  Type \x1b[96m'help'\x1b[0m to inspect the system.`,
    `  \x1b[2mSuggested: whoami → ls → cd projects → cat README.md\x1b[0m`,
    ""
  ].join("\n");
}

export async function runTerminalAnimation(terminal: Terminal, animation: TerminalAnimationName): Promise<void> {
  if (animation === "matrix") {
    const cols = terminal.cols || 80;
    const drops = new Array(cols).fill(0).map(() => Math.random() * -20 | 0);
    const frameCount = 30;

    terminal.write("\r\n");

    for (let frame = 0; frame < frameCount; frame++) {
      const line: string[] = new Array(cols).fill(" ");

      for (let col = 0; col < cols; col++) {
        drops[col]++;

        if (drops[col] >= 0) {
          const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];

          // Head of drop is bright, trail fades
          if (drops[col] < 2) {
            line[col] = `\x1b[97m${char}\x1b[0m`;
          } else if (drops[col] < 6) {
            line[col] = `\x1b[92m${char}\x1b[0m`;
          } else {
            line[col] = `\x1b[32m${char}\x1b[0m`;
          }
        }

        // Reset drop after random length
        if (drops[col] > 8 + Math.random() * 12) {
          drops[col] = Math.random() * -8 | 0;
        }
      }

      renderLines(terminal, `${line.join("")}\n`);
      await sleep(60);
    }

    renderLines(terminal, "\x1b[32m[animation complete]\x1b[0m");
    return;
  }

  const sequence = [
    "\x1b[33m[*]\x1b[0m Establishing uplink...",
    "\x1b[33m[*]\x1b[0m Bypassing Hollywood firewall...",
    "\x1b[33m[*]\x1b[0m Injecting totally real shellcode...",
    "\x1b[31m[!]\x1b[0m Access denied.",
    "\x1b[32m[✓]\x1b[0m Nice try. System remains immutable."
  ];

  terminal.write("\r\n");

  for (const step of sequence) {
    renderLines(terminal, `${step}\n`);
    await sleep(400);
  }
}