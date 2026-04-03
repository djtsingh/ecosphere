import { buildTree } from "@/lib/filesystem";
import { bold, cyan, dim, heading, separator, accent, yellow, green, muted, brightCyan } from "@/lib/ansi";
import type { CommandDefinition, CommandContext } from "@/lib/commands/types";

const BOOT_TIME = Date.now();

function renderBanner(): string {
  return [
    `${cyan("╔══════════════════════════════════════════════════╗")}`,
    `${cyan("║")}                                                  ${cyan("║")}`,
    `${cyan("║")}   ${bold(brightCyan("██████╗  █████╗ ██╗     ██╗███████╗███████╗"))}   ${cyan("║")}`,
    `${cyan("║")}   ${bold(brightCyan("██╔══██╗██╔══██╗██║     ██║██╔════╝██╔════╝"))}   ${cyan("║")}`,
    `${cyan("║")}   ${bold(brightCyan("██║  ██║███████║██║     ██║█████╗  █████╗  "))}   ${cyan("║")}`,
    `${cyan("║")}   ${bold(brightCyan("██║  ██║██╔══██║██║██   ██║██╔══╝  ██╔══╝  "))}   ${cyan("║")}`,
    `${cyan("║")}   ${bold(brightCyan("██████╔╝██║  ██║███████╗██║███████╗███████╗"))}   ${cyan("║")}`,
    `${cyan("║")}   ${bold(brightCyan("╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝╚══════╝╚══════╝"))}   ${cyan("║")}`,
    `${cyan("║")}                                                  ${cyan("║")}`,
    `${cyan("║")}   ${dim("terminal.daljeetsingh.me")}                          ${cyan("║")}`,
    `${cyan("║")}   ${dim("Type 'help' to get started.")}                      ${cyan("║")}`,
    `${cyan("║")}                                                  ${cyan("║")}`,
    `${cyan("╚══════════════════════════════════════════════════╝")}`,
  ].join("\n");
}

function formatUptime(): string {
  const elapsed = Date.now() - BOOT_TIME;
  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export const utilityCommands: CommandDefinition[] = [
  {
    name: "history",
    description: "Show recent command history.",
    usage: "history",
    execute: (_, context) => {
      const commands = context.history ?? [];
      if (!commands.length) {
        return { output: dim("No commands in history yet.") };
      }

      const lines = commands.map(
        (cmd, i) => `  ${dim(String(i + 1).padStart(3))}  ${cmd}`
      );

      return {
        output: [heading("Command History"), separator(38), ...lines].join("\n")
      };
    }
  },
  {
    name: "tree",
    description: "Display directory tree structure.",
    usage: "tree [-a] [path]",
    execute: (args, context) => {
      const showHidden = args.includes("-a");
      const target = args.find((arg) => !arg.startsWith("-"));
      return {
        output: buildTree(context.root, context.cwd, target, showHidden)
      };
    }
  },
  {
    name: "echo",
    description: "Print text to the terminal.",
    usage: "echo <text>",
    execute: (args) => ({
      output: args.join(" ")
    })
  },
  {
    name: "date",
    description: "Print the current date and time.",
    usage: "date",
    execute: () => ({
      output: new Date().toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short"
      })
    })
  },
  {
    name: "banner",
    description: "Show the ASCII art banner.",
    usage: "banner",
    execute: () => ({
      output: renderBanner()
    })
  },
  {
    name: "uptime",
    description: "Show how long this terminal session has been running.",
    usage: "uptime",
    execute: () => ({
      output: `${dim("session uptime:")} ${green(formatUptime())}`
    })
  },
  {
    name: "man",
    description: "Show detailed usage for a command.",
    usage: "man <command>",
    execute: (args, context) => {
      const target = args[0];

      if (!target) {
        return {
          output: `${dim("man:")} What manual page do you want? Try ${accent("man help")}`
        };
      }

      const commands = context.getCommands();
      const command = commands.find((c) => c.name === target || c.aliases?.includes(target));

      if (!command) {
        return {
          output: `${dim("man:")} No manual entry for ${yellow(target)}`
        };
      }

      const lines = [
        heading(command.name.toUpperCase()),
        separator(38),
        `  ${bold("Name")}${dim(":")}        ${command.name}`,
        `  ${bold("Description")}${dim(":")} ${command.description}`,
      ];

      if (command.usage) {
        lines.push(`  ${bold("Usage")}${dim(":")}       ${accent(command.usage)}`);
      }

      if (command.aliases?.length) {
        lines.push(`  ${bold("Aliases")}${dim(":")}     ${command.aliases.map((a) => cyan(a)).join(", ")}`);
      }

      return { output: lines.join("\n") };
    }
  },
  {
    name: "grep",
    description: "Search file contents in the current directory.",
    usage: "grep <pattern>",
    execute: (args, context) => {
      const pattern = args[0];

      if (!pattern) {
        return { output: `${dim("grep:")} missing search pattern` };
      }

      const results: string[] = [];

      function searchNode(node: Record<string, unknown>, path: string): void {
        for (const [name, child] of Object.entries(node)) {
          const fullPath = `${path}/${name}`;
          if (typeof child === "string") {
            if (child.toLowerCase().includes(pattern.toLowerCase()) || name.toLowerCase().includes(pattern.toLowerCase())) {
              results.push(`${cyan(fullPath)}${dim(":")} ${child.slice(0, 80)}${child.length > 80 ? dim("...") : ""}`);
            }
          } else if (child && typeof child === "object") {
            searchNode(child as Record<string, unknown>, fullPath);
          }
        }
      }

      searchNode(context.root as unknown as Record<string, unknown>, "~");

      if (!results.length) {
        return { output: `${dim("grep:")} no matches for '${yellow(pattern)}'` };
      }

      return {
        output: [heading(`Matches for '${pattern}'`), separator(38), ...results].join("\n")
      };
    }
  }
];
