import { bold, cyan, green, yellow, dim, heading, muted, accent, separator, brightCyan, brightBlack } from "@/lib/ansi";
import type { CommandDefinition } from "@/lib/commands/types";

function formatSection(title: string, lines: string[]): string {
  return [heading(title), ...lines.map((l) => `  ${dim("•")} ${l}`)].join("\n");
}

export const portfolioCommands: CommandDefinition[] = [
  {
    name: "help",
    description: "Show available commands.",
    usage: "help",
    execute: (_, context) => {
      const commands = context.getCommands()
        .slice()
        .sort((left, right) => left.name.localeCompare(right.name));

      const maxLen = Math.max(...commands.map((c) => c.name.length)) + 2;

      const formatted = commands.map(
        (command) => `  ${cyan(command.name.padEnd(maxLen))} ${dim(command.description)}`
      );

      return {
        output: [
          heading("Available Commands"),
          separator(42),
          ...formatted,
          "",
          dim("Start with:"),
          `  ${accent("whoami")}  ${accent("ls")}  ${accent("cd projects")}  ${accent("cat bio.txt")}  ${accent("github")}`,
          `  ${accent('ask "what have you built?"')}`,
        ].join("\n")
      };
    }
  },
  {
    name: "whoami",
    description: "Print Daljeet's short profile.",
    usage: "whoami",
    execute: (_, context) => ({
      output: [
        `${bold(brightCyan(context.portfolio.profile.handle))} ${dim("—")} ${context.portfolio.profile.title}`,
        `${dim("📍")} ${context.portfolio.profile.location}`,
        "",
        context.portfolio.profile.tagline,
        "",
        `${dim("Try:")} ${accent("projects")}  ${accent("skills")}  ${accent("contact")}`
      ].join("\n")
    })
  },
  {
    name: "projects",
    description: "List flagship projects with their stack.",
    usage: "projects",
    execute: (_, context) => ({
      output: context.portfolio.projects
        .map((project) => [
          `${bold(cyan(project.name))}`,
          `  ${project.description}`,
          `  ${dim("stack:")} ${yellow(project.stack.join(", "))}`
        ].join("\n"))
        .join("\n\n")
    })
  },
  {
    name: "skills",
    description: "List core skills grouped by domain.",
    usage: "skills",
    execute: (_, context) => ({
      output: [
        formatSection("Languages", context.portfolio.skills.languages),
        formatSection("Frontend", context.portfolio.skills.frontend),
        formatSection("Backend", context.portfolio.skills.backend),
        formatSection("Infra", context.portfolio.skills.infra)
      ].join("\n\n")
    })
  },
  {
    name: "contact",
    description: "Show email and social links.",
    usage: "contact",
    execute: (_, context) => ({
      output: [
        heading("Contact"),
        separator(42),
        `  ${bold("email")}${dim(":")}    ${accent(context.portfolio.profile.email)}`,
        `  ${bold("github")}${dim(":")}   ${accent(context.portfolio.profile.github.url)}`,
        `  ${bold("linkedin")}${dim(":")} ${accent(context.portfolio.profile.linkedin)}`,
        "",
        dim("Use 'open github.txt' or 'open linkedin.txt' from ~/contact.")
      ].join("\n")
    })
  }
];