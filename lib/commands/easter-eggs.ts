import { bold, cyan, green, yellow, brightCyan, dim, heading, muted, accent, separator } from "@/lib/ansi";
import type { CommandDefinition } from "@/lib/commands/types";

function renderCow(text: string): string {
  const maxWidth = 40;
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (current.length + word.length + 1 > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);

  const width = Math.max(...lines.map((l) => l.length));
  const top = ` ${"_".repeat(width + 2)}`;
  const bottom = ` ${"-".repeat(width + 2)}`;

  let bubble: string;
  if (lines.length === 1) {
    bubble = [top, `< ${lines[0].padEnd(width)} >`, bottom].join("\n");
  } else {
    const mid = lines.map((line, i) => {
      const l = i === 0 ? "/" : i === lines.length - 1 ? "\\" : "|";
      const r = i === 0 ? "\\" : i === lines.length - 1 ? "/" : "|";
      return `${l} ${line.padEnd(width)} ${r}`;
    });
    bubble = [top, ...mid, bottom].join("\n");
  }

  return [
    bubble,
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||"
  ].join("\n");
}

function renderNeofetch(name: string, themeName: string, handle: string): string {
  const art = [
    `${cyan("      ____        _ _           _  ")}`,
    `${cyan("     |  _ \\  __ _| (_) ___  ___| |_ ")}`,
    `${cyan("     | | | |/ _` | | |/ _ \\/ __| __|")}`,
    `${cyan("     | |_| | (_| | | |  __/ (__| |_ ")}`,
    `${cyan("     |____/ \\__,_|_|_|\\___|\\___|\\___|")}`,
  ];

  const info = [
    "",
    `${bold(brightCyan(name))}`,
    dim("─".repeat(36)),
    `${bold("role")}${dim(":")}    software developer`,
    `${bold("handle")}${dim(":")}  ${handle}`,
    `${bold("shell")}${dim(":")}   terminal.daljeetsingh.me`,
    `${bold("theme")}${dim(":")}   ${themeName}`,
    `${bold("stack")}${dim(":")}   next.js, xterm.js, typescript`,
    `${bold("modes")}${dim(":")}   portfolio, github, ask, easter-eggs`,
    "",
    `  ${"\x1b[41m  \x1b[42m  \x1b[43m  \x1b[44m  \x1b[45m  \x1b[46m  \x1b[47m  \x1b[0m"}`,
    `  ${"\x1b[101m  \x1b[102m  \x1b[103m  \x1b[104m  \x1b[105m  \x1b[106m  \x1b[107m  \x1b[0m"}`,
  ];

  const maxArtWidth = 40;
  const lines: string[] = [];
  const totalLines = Math.max(art.length, info.length);

  for (let i = 0; i < totalLines; i++) {
    const artLine = i < art.length ? art[i] : "";
    const infoLine = i < info.length ? info[i] : "";
    // Can't rely on visible width of ANSI strings, so just pad the art column
    lines.push(`${artLine}${"".padEnd(2)}${infoLine}`);
  }

  return lines.join("\n");
}

export const easterEggCommands: CommandDefinition[] = [
  {
    name: "clear",
    description: "Clear the terminal output.",
    usage: "clear",
    execute: () => ({ clear: true })
  },
  {
    name: "neofetch",
    description: "Show terminal system info and ASCII branding.",
    usage: "neofetch",
    execute: (_, context) => ({
      output: renderNeofetch(context.portfolio.profile.name, context.themeName, context.portfolio.profile.handle)
    })
  },
  {
    name: "matrix",
    description: "Run a short matrix rain animation.",
    usage: "matrix",
    execute: () => ({ animation: "matrix" })
  },
  {
    name: "hack",
    description: "Run a fake intrusion sequence.",
    usage: "hack",
    execute: () => ({ animation: "hack" })
  },
  {
    name: "cowsay",
    description: "Render a speaking cow.",
    usage: "cowsay <message>",
    execute: (args) => ({
      output: renderCow(args.join(" ") || "hello")
    })
  },
  {
    name: "curl",
    description: "Simulate a few well-known curl targets.",
    usage: "curl <url>",
    execute: (args) => {
      const target = args[0];

      if (target === "wttr.in/mumbai") {
        return {
          output: [
            heading("Mumbai Weather"),
            "",
            `${bold("Condition:")} ${yellow("humid haze")}`,
            `${bold("Temp:")}      ${green("31°C")}`,
            `${bold("Feels like:")} ${yellow("37°C")}`,
            `${bold("Forecast:")}  ${accent("code, chai, repeat")}`,
          ].join("\n")
        };
      }

      return {
        output: `${dim("curl:")} unsupported target '${target || ""}'`
      };
    }
  },
  {
    name: "sudo",
    description: "Simulate sudo for a few classic terminal jokes.",
    usage: "sudo <command>",
    execute: (args) => {
      const phrase = args.join(" ").trim();

      if (phrase === "make me a sandwich") {
        return { output: yellow("What? Make it yourself.") };
      }

      if (phrase === "!!") {
        return { output: yellow("Nice try.") };
      }

      return { output: `${dim("sudo:")} ${phrase || "command"}: ${yellow("permission denied")}` };
    }
  },
  {
    name: "rm",
    description: "Immutable filesystem protection demo.",
    usage: "rm -rf /",
    execute: (args) => {
      if (args.join(" ") === "-rf /") {
        return {
          output: `${green("[Protected]")} Nice try. This system is ${bold("immutable")}.`
        };
      }

      return {
        output: `${dim("rm:")} destructive operations are ${yellow("disabled")} in this terminal`
      };
    }
  }
];