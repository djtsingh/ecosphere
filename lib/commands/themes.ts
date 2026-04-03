import { THEMES, THEME_NAMES } from "@/lib/themes";
import { bold, cyan, dim, heading, separator, accent, yellow, green } from "@/lib/ansi";
import type { CommandDefinition } from "@/lib/commands/types";

export const themeCommands: CommandDefinition[] = [
  {
    name: "theme",
    description: "Switch the terminal theme.",
    usage: "theme [name]",
    execute: (args, context) => {
      const nextTheme = args[0] as keyof typeof THEMES | undefined;

      if (!nextTheme) {
        return {
          output: [
            heading("Available Themes"),
            separator(38),
            ...THEME_NAMES.map((themeName) => {
              const marker = themeName === context.themeName ? green(" ● ") : dim(" ○ ");
              return `${marker}${bold(cyan(themeName))} ${dim("—")} ${THEMES[themeName].description}`;
            }),
          ].join("\n")
        };
      }

      if (!THEME_NAMES.includes(nextTheme)) {
        return {
          output: `${yellow("Unknown theme")} '${nextTheme}'. Available: ${THEME_NAMES.map((t) => accent(t)).join(", ")}`
        };
      }

      return {
        nextTheme,
        output: `${green("✓")} Theme changed to ${bold(cyan(nextTheme))}`
      };
    }
  }
];