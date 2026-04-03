export type FileNode = string | DirectoryNode;

export interface DirectoryNode {
  [name: string]: FileNode;
}

const HOME = "~";

function splitPath(input: string): string[] {
  return input.split("/").filter(Boolean);
}

export function resolvePath(cwd: string, target?: string): string {
  if (!target || target === ".") {
    return cwd || HOME;
  }

  const isAbsolute = target.startsWith(HOME) || target.startsWith("/");
  const baseSegments = isAbsolute ? [] : splitPath(cwd === HOME ? "" : cwd.replace(`${HOME}/`, ""));
  const targetSegments = splitPath(target.replace(/^~\/?/, ""));

  for (const segment of targetSegments) {
    if (segment === ".") {
      continue;
    }

    if (segment === "..") {
      baseSegments.pop();
      continue;
    }

    baseSegments.push(segment);
  }

  return baseSegments.length ? `${HOME}/${baseSegments.join("/")}` : HOME;
}

export function getNode(root: DirectoryNode, path: string): FileNode | null {
  if (path === HOME) {
    return root;
  }

  const segments = splitPath(path.replace(`${HOME}/`, ""));
  let current: FileNode = root;

  for (const segment of segments) {
    if (typeof current === "string") {
      return null;
    }

    current = current[segment];

    if (current === undefined) {
      return null;
    }
  }

  return current;
}

export function isDirectory(node: FileNode | null): node is DirectoryNode {
  return !!node && typeof node !== "string";
}

export function listDirectory(root: DirectoryNode, cwd: string, target?: string, showHidden = false, colorize = true): string {
  const resolved = resolvePath(cwd, target);
  const node = getNode(root, resolved);

  if (!node) {
    throw new Error(`ls: cannot access '${target}': No such file or directory`);
  }

  if (typeof node === "string") {
    return target || resolved.split("/").pop() || resolved;
  }

  const entries = Object.entries(node)
    .filter(([name]) => showHidden || !name.startsWith("."))
    .sort(([leftName, leftNode], [rightName, rightNode]) => {
      const leftIsDir = typeof leftNode !== "string";
      const rightIsDir = typeof rightNode !== "string";

      if (leftIsDir !== rightIsDir) {
        return leftIsDir ? -1 : 1;
      }

      return leftName.localeCompare(rightName);
    })
    .map(([name, child]) => {
      const isDir = typeof child !== "string";
      const display = isDir ? `${name}/` : name;
      if (!colorize) return display;
      return isDir ? `\x1b[1m\x1b[36m${name}/\x1b[0m` : name;
    });

  return entries.length ? entries.join("  ") : "\x1b[2m[empty]\x1b[0m";
}

export function readFileNode(root: DirectoryNode, cwd: string, target?: string): string {
  if (!target) {
    throw new Error("cat: missing operand");
  }

  const resolved = resolvePath(cwd, target);
  const node = getNode(root, resolved);

  if (!node) {
    throw new Error(`cat: ${target}: No such file or directory`);
  }

  if (typeof node !== "string") {
    throw new Error(`cat: ${target}: Is a directory`);
  }

  return node;
}

export function changeDirectory(root: DirectoryNode, cwd: string, target?: string): string {
  const resolved = resolvePath(cwd, target || HOME);
  const node = getNode(root, resolved);

  if (!node) {
    throw new Error(`cd: ${target}: No such file or directory`);
  }

  if (typeof node === "string") {
    throw new Error(`cd: ${target}: Not a directory`);
  }

  return resolved;
}

export function pathExists(root: DirectoryNode, cwd: string, target?: string): boolean {
  const resolved = resolvePath(cwd, target);
  return !!getNode(root, resolved);
}

export function buildTree(root: DirectoryNode, cwd: string, target?: string, showHidden = false): string {
  const resolved = resolvePath(cwd, target);
  const node = getNode(root, resolved);

  if (!node || typeof node === "string") {
    throw new Error(`tree: '${target || resolved}': Not a directory`);
  }

  const lines: string[] = [`\x1b[1m\x1b[36m${resolved}\x1b[0m`];
  let dirCount = 0;
  let fileCount = 0;

  function walk(directory: DirectoryNode, prefix: string): void {
    const entries = Object.entries(directory)
      .filter(([name]) => showHidden || !name.startsWith("."))
      .sort(([a, av], [b, bv]) => {
        const aDir = typeof av !== "string";
        const bDir = typeof bv !== "string";
        if (aDir !== bDir) return aDir ? -1 : 1;
        return a.localeCompare(b);
      });

    entries.forEach(([name, child], index) => {
      const isLast = index === entries.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const isDir = typeof child !== "string";

      if (isDir) {
        dirCount++;
        lines.push(`${prefix}${connector}\x1b[1m\x1b[36m${name}/\x1b[0m`);
        walk(child as DirectoryNode, `${prefix}${isLast ? "    " : "│   "}`);
      } else {
        fileCount++;
        lines.push(`${prefix}${connector}${name}`);
      }
    });
  }

  walk(node, "");
  lines.push("");
  lines.push(`\x1b[2m${dirCount} directories, ${fileCount} files\x1b[0m`);
  return lines.join("\n");
}

export function autocompletePath(root: DirectoryNode, cwd: string, partial = ""): string[] {
  const hasSlash = partial.includes("/");
  const segments = splitPath(partial.replace(/^~\/?/, ""));
  const leaf = segments.pop() ?? "";
  const base = partial.startsWith(HOME) || partial.startsWith("/") ? HOME : cwd;
  const directoryTarget = segments.length ? `${base === HOME ? HOME : base}/${segments.join("/")}` : base;
  const resolvedDirectory = resolvePath(cwd, directoryTarget);
  const node = getNode(root, resolvedDirectory);

  if (!node || typeof node === "string") {
    return [];
  }

  return Object.entries(node)
    .filter(([name]) => name.startsWith(leaf) && !name.startsWith("."))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, child]) => {
      const suffix = typeof child === "string" ? "" : "/";
      if (!hasSlash) {
        return `${name}${suffix}`;
      }

      const prefix = segments.length ? `${segments.join("/")}/` : "";
      return `${prefix}${name}${suffix}`;
    });
}