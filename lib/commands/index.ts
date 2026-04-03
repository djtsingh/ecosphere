import { filesystemCommands } from "@/lib/commands/filesystem";
import { portfolioCommands } from "@/lib/commands/portfolio";
import { githubCommands } from "@/lib/commands/github";
import { themeCommands } from "@/lib/commands/themes";
import { easterEggCommands } from "@/lib/commands/easter-eggs";
import { utilityCommands } from "@/lib/commands/utility";
import { autocompletePath } from "@/lib/filesystem";
import { THEME_NAMES } from "@/lib/themes";
import type { CommandContext, CommandDefinition, CommandResult } from "@/lib/commands/types";

const registry = [
  ...portfolioCommands,
  ...filesystemCommands,
  ...githubCommands,
  ...themeCommands,
  ...utilityCommands,
  ...easterEggCommands
];

const commandMap = new Map<string, CommandDefinition>();

for (const command of registry) {
  commandMap.set(command.name, command);
  command.aliases?.forEach((alias) => commandMap.set(alias, command));
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  const pattern = /"([^"]*)"|'([^']*)'|([^\s]+)/g;
  let match: RegExpExecArray | null = pattern.exec(input);

  while (match) {
    tokens.push(match[1] ?? match[2] ?? match[3]);
    match = pattern.exec(input);
  }

  return tokens;
}

export async function executeCommand(input: string, context: Omit<CommandContext, "getCommands">): Promise<CommandResult> {
  const tokens = tokenize(input.trim());
  const [commandName, ...args] = tokens;

  if (!commandName) {
    return {};
  }

  const command = commandMap.get(commandName);

  if (!command) {
    return {
      output: `\x1b[2mcommand not found:\x1b[0m ${commandName}. Try \x1b[96m'help'\x1b[0m`
    };
  }

  try {
    return await command.execute(args, {
      ...context,
      getCommands: () => registry
    });
  } catch (error) {
    return {
      output: error instanceof Error ? error.message : "Command failed"
    };
  }
}

export function getCommandRegistry(): CommandDefinition[] {
  return registry;
}

export function getAutocompleteSuggestions(input: string, cwd: string, root: CommandContext["root"]): string[] {
  const trimmed = input.trimStart();
  const parts = trimmed.split(/\s+/);
  const isNewToken = /\s$/.test(trimmed);

  if (parts.length <= 1 && !isNewToken) {
    const query = parts[0] || "";
    return registry
      .map((command) => command.name)
      .filter((name) => name.startsWith(query))
      .sort((left, right) => left.localeCompare(right));
  }

  const commandName = parts[0] || "";
  const lastPart = isNewToken ? "" : parts[parts.length - 1] || "";

  if (commandName === "theme") {
    return THEME_NAMES.filter((theme) => theme.startsWith(lastPart));
  }

  if (["cd", "ls", "cat", "open"].includes(commandName)) {
    return autocompletePath(root, cwd, lastPart);
  }

  return [];
}