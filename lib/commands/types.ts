import type portfolioData from "@/data/portfolio.json";
import type { DirectoryNode } from "@/lib/filesystem";
import type { ThemeName } from "@/lib/themes";

export type PortfolioData = typeof portfolioData;
export type PortfolioRoot = DirectoryNode;

export type GitHubSnapshot = {
  username: string;
  followers: number;
  publicRepos: number;
  totalStars: number;
  topRepos: Array<{
    name: string;
    description: string | null;
    stars: number;
    language: string | null;
    url: string;
    updatedAt: string;
  }>;
  recentCommits: Array<{
    repo: string;
    message: string;
    url: string;
    committedAt: string;
  }>;
} | null;

export type TerminalAnimationName = "matrix" | "hack";

export type CommandResult = {
  output?: string;
  nextCwd?: string;
  nextTheme?: ThemeName;
  clear?: boolean;
  animation?: TerminalAnimationName;
  openUrl?: string;
};

export type CommandContext = {
  cwd: string;
  root: PortfolioRoot;
  portfolio: PortfolioData;
  themeName: ThemeName;
  githubSnapshot: GitHubSnapshot;
  history: string[];
  askPortfolio: (question: string) => Promise<string>;
  fetchGitHub: () => Promise<GitHubSnapshot>;
  openExternal: (url: string) => void;
  getCommands: () => CommandDefinition[];
};

export type CommandFn = (args: string[], context: CommandContext) => Promise<CommandResult> | CommandResult;

export type CommandDefinition = {
  name: string;
  description: string;
  usage?: string;
  aliases?: string[];
  execute: CommandFn;
};