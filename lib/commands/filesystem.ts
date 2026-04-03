import { autocompletePath, changeDirectory, listDirectory, readFileNode, resolvePath } from "@/lib/filesystem";
import { THEME_NAMES } from "@/lib/themes";
import { bold, cyan, muted, heading, separator, dim, brightBlack, accent } from "@/lib/ansi";
import type { CommandDefinition } from "@/lib/commands/types";

function resolveOpenTarget(path: string, content: string, resumeUrl: string): string | null {
  if (content === "__DOWNLOAD__") {
    return resumeUrl;
  }

  if (content.startsWith("https://") || content.startsWith("http://")) {
    return content;
  }

  if (path.endsWith(".url") && content) {
    return content;
  }

  return null;
}

export const filesystemCommands: CommandDefinition[] = [
  {
    name: "ls",
    description: "List files in the current directory.",
    usage: "ls [-a] [path]",
    execute: (args, context) => {
      const showHidden = args.includes("-a");
      const target = args.find((arg) => !arg.startsWith("-"));
      return {
        output: listDirectory(context.root, context.cwd, target, showHidden)
      };
    }
  },
  {
    name: "cd",
    description: "Change the working directory.",
    usage: "cd [path]",
    execute: (args, context) => ({
      nextCwd: changeDirectory(context.root, context.cwd, args[0])
    })
  },
  {
    name: "pwd",
    description: "Print the current directory.",
    usage: "pwd",
    execute: (_, context) => ({
      output: context.cwd
    })
  },
  {
    name: "cat",
    description: "Read a file from the virtual filesystem.",
    usage: "cat <file>",
    execute: (args, context) => {
      const content = readFileNode(context.root, context.cwd, args[0]);
      if (content === "__DOWNLOAD__") {
        return { output: `${dim("Binary asset detected.")} Use ${accent("'open resume.pdf'")} to download it.` };
      }
      return { output: content };
    }
  },
  {
    name: "open",
    description: "Open a URL or downloadable asset in a new tab.",
    usage: "open <file-or-url>",
    execute: (args, context) => {
      const target = args[0];

      if (!target) {
        return {
          output: `${dim("open:")} missing target`
        };
      }

      if (target.startsWith("https://") || target.startsWith("http://")) {
        return { openUrl: target };
      }

      const resolved = resolvePath(context.cwd, target);
      const node = readFileNode(context.root, context.cwd, target);
      const openTarget = resolveOpenTarget(resolved, node, context.portfolio.profile.resumeUrl);

      if (!openTarget) {
        return {
          output: `${dim("open:")} ${target}: ${brightBlack("no launchable target")}`
        };
      }

      return {
        openUrl: openTarget,
        output: `${dim("Opening")} ${cyan(openTarget)}`
      };
    }
  },
  {
    name: "tabhint",
    description: "Show available theme names and path autocomplete samples.",
    usage: "tabhint",
    execute: (_, context) => ({
      output: [
        `${bold("Themes:")} ${THEME_NAMES.map((t) => accent(t)).join(", ")}`,
        `${bold("Paths:")}  ${autocompletePath(context.root, context.cwd, "").map((p) => cyan(p)).join(", ") || muted("none")}`
      ].join("\n")
    })
  }
];