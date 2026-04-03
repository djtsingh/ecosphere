import { bold, cyan, green, yellow, dim, heading, muted, accent, separator, brightCyan } from "@/lib/ansi";
import type { CommandDefinition } from "@/lib/commands/types";

function formatGithubSnapshot(username: string): string {
  return [
    `${yellow("GitHub live data for")} ${bold(username)} ${yellow("is unavailable right now.")}`,
    dim("Check GITHUB_TOKEN or retry later."),
    `Try ${accent("'open https://github.com/djtsingh'")}`
  ].join("\n");
}

export const githubCommands: CommandDefinition[] = [
  {
    name: "github",
    description: "Fetch live GitHub profile and repo stats.",
    usage: "github",
    execute: async (_, context) => {
      const snapshot = (await context.fetchGitHub()) ?? context.githubSnapshot;

      if (!snapshot) {
        return {
          output: formatGithubSnapshot(context.portfolio.profile.github.username)
        };
      }

      const topRepos = snapshot.topRepos.length
        ? snapshot.topRepos
            .map((repo) => `  ${cyan(repo.name)} ${dim(`(${yellow(String(repo.stars))} ★${repo.language ? `, ${repo.language}` : ""})`)}`)
            .join("\n")
        : `  ${dim("No repository data available")}`;

      const recentCommits = snapshot.recentCommits.length
        ? snapshot.recentCommits
            .slice(0, 3)
            .map((commit) => `  ${cyan(commit.repo)}${dim(":")} ${commit.message}`)
            .join("\n")
        : `  ${dim("No recent commits available")}`;

      return {
        output: [
          heading(`${snapshot.username} on GitHub`),
          separator(42),
          `  ${bold("Followers")}${dim(":")}    ${green(String(snapshot.followers))}`,
          `  ${bold("Public repos")}${dim(":")} ${green(String(snapshot.publicRepos))}`,
          `  ${bold("Total stars")}${dim(":")}  ${yellow(String(snapshot.totalStars))} ★`,
          "",
          heading("Top Repositories"),
          topRepos,
          "",
          heading("Recent Commits"),
          recentCommits
        ].join("\n")
      };
    }
  },
  {
    name: "ask",
    description: "Ask grounded questions about Daljeet's work.",
    usage: "ask <question>",
    execute: async (args, context) => {
      if (!args.length) {
        return {
          output: `${dim("ask:")} missing question. Try ${accent('ask "what have you built?"')}`
        };
      }

      return {
        output: await context.askPortfolio(args.join(" "))
      };
    }
  }
];