/**
 * ANSI escape code helpers for xterm.js terminal output.
 * All functions return raw strings with embedded ANSI sequences.
 */

const ESC = "\x1b[";
const RESET = `${ESC}0m`;

// ── Core SGR wrappers ─────────────────────────────────────────────

export function bold(text: string): string {
  return `${ESC}1m${text}${RESET}`;
}

export function dim(text: string): string {
  return `${ESC}2m${text}${RESET}`;
}

export function italic(text: string): string {
  return `${ESC}3m${text}${RESET}`;
}

export function underline(text: string): string {
  return `${ESC}4m${text}${RESET}`;
}

// ── Named 4-bit colors ────────────────────────────────────────────

export function red(text: string): string {
  return `${ESC}31m${text}${RESET}`;
}

export function green(text: string): string {
  return `${ESC}32m${text}${RESET}`;
}

export function yellow(text: string): string {
  return `${ESC}33m${text}${RESET}`;
}

export function blue(text: string): string {
  return `${ESC}34m${text}${RESET}`;
}

export function magenta(text: string): string {
  return `${ESC}35m${text}${RESET}`;
}

export function cyan(text: string): string {
  return `${ESC}36m${text}${RESET}`;
}

export function white(text: string): string {
  return `${ESC}37m${text}${RESET}`;
}

export function brightBlack(text: string): string {
  return `${ESC}90m${text}${RESET}`;
}

export function brightRed(text: string): string {
  return `${ESC}91m${text}${RESET}`;
}

export function brightGreen(text: string): string {
  return `${ESC}92m${text}${RESET}`;
}

export function brightYellow(text: string): string {
  return `${ESC}93m${text}${RESET}`;
}

export function brightBlue(text: string): string {
  return `${ESC}94m${text}${RESET}`;
}

export function brightMagenta(text: string): string {
  return `${ESC}95m${text}${RESET}`;
}

export function brightCyan(text: string): string {
  return `${ESC}96m${text}${RESET}`;
}

export function brightWhite(text: string): string {
  return `${ESC}97m${text}${RESET}`;
}

// ── Compound styles ───────────────────────────────────────────────

export function heading(text: string): string {
  return bold(cyan(text));
}

export function label(text: string): string {
  return bold(white(text));
}

export function muted(text: string): string {
  return brightBlack(text);
}

export function accent(text: string): string {
  return brightCyan(text);
}

export function prompt(text: string): string {
  return blue(text);
}

export function success(text: string): string {
  return green(text);
}

export function error(text: string): string {
  return red(text);
}

export function warning(text: string): string {
  return yellow(text);
}

export function link(text: string): string {
  return underline(cyan(text));
}

// ── Utility ───────────────────────────────────────────────────────

export function separator(width = 48): string {
  return dim("─".repeat(width));
}

export function indent(text: string, spaces = 2): string {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => `${pad}${line}`)
    .join("\n");
}

export function table(rows: [string, string][], gap = 2): string {
  const maxLeft = Math.max(...rows.map(([left]) => left.length));
  return rows
    .map(([left, right]) => `${left.padEnd(maxLeft + gap)}${right}`)
    .join("\n");
}

export function stripAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}
