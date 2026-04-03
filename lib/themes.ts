export type ThemeName = keyof typeof THEMES;

export const THEMES = {
  default: {
    label: "operator",
    description: "Graphite shell with cold blue prompts.",
    css: {
      "--background": "#07111f",
      "--surface": "rgba(9, 20, 36, 0.82)",
      "--surface-strong": "#0c1a2d",
      "--foreground": "#d6e2f2",
      "--muted": "#8ea0bb",
      "--border": "rgba(112, 152, 199, 0.22)",
      "--prompt": "#5ab2ff",
      "--accent": "#5eead4",
      "--glow": "rgba(90, 178, 255, 0.22)"
    },
    terminal: {
      background: "#07111f",
      foreground: "#d6e2f2",
      cursor: "#5ab2ff",
      cursorAccent: "#07111f",
      selectionBackground: "rgba(90, 178, 255, 0.28)",
      black: "#0f172a",
      red: "#ef4444",
      green: "#22c55e",
      yellow: "#eab308",
      blue: "#5ab2ff",
      magenta: "#f97316",
      cyan: "#5eead4",
      white: "#e2e8f0",
      brightBlack: "#475569",
      brightRed: "#fb7185",
      brightGreen: "#4ade80",
      brightYellow: "#facc15",
      brightBlue: "#7dd3fc",
      brightMagenta: "#fdba74",
      brightCyan: "#99f6e4",
      brightWhite: "#f8fafc"
    }
  },
  matrix: {
    label: "matrix",
    description: "Monochrome phosphor green.",
    css: {
      "--background": "#020702",
      "--surface": "rgba(5, 17, 5, 0.84)",
      "--surface-strong": "#081608",
      "--foreground": "#83ff7c",
      "--muted": "#4db348",
      "--border": "rgba(73, 255, 102, 0.18)",
      "--prompt": "#46ff65",
      "--accent": "#b2ff9e",
      "--glow": "rgba(70, 255, 101, 0.2)"
    },
    terminal: {
      background: "#020702",
      foreground: "#83ff7c",
      cursor: "#46ff65",
      cursorAccent: "#020702",
      selectionBackground: "rgba(70, 255, 101, 0.3)",
      black: "#071107",
      red: "#6dff7d",
      green: "#46ff65",
      yellow: "#d0ff72",
      blue: "#46ff65",
      magenta: "#9eff98",
      cyan: "#89ffca",
      white: "#d7ffcf",
      brightBlack: "#1f4720",
      brightRed: "#96ff8d",
      brightGreen: "#7fff9e",
      brightYellow: "#eaff90",
      brightBlue: "#8cffc3",
      brightMagenta: "#bdffbc",
      brightCyan: "#bcffe8",
      brightWhite: "#f2fff0"
    }
  },
  cyber: {
    label: "cyber",
    description: "Electric cyan and hot amber.",
    css: {
      "--background": "#090b13",
      "--surface": "rgba(12, 15, 26, 0.84)",
      "--surface-strong": "#0f1322",
      "--foreground": "#edf4ff",
      "--muted": "#98a3bd",
      "--border": "rgba(52, 211, 255, 0.2)",
      "--prompt": "#34d3ff",
      "--accent": "#ff9d2e",
      "--glow": "rgba(52, 211, 255, 0.2)"
    },
    terminal: {
      background: "#090b13",
      foreground: "#edf4ff",
      cursor: "#34d3ff",
      cursorAccent: "#090b13",
      selectionBackground: "rgba(52, 211, 255, 0.24)",
      black: "#151a27",
      red: "#ff6b6b",
      green: "#83ff9f",
      yellow: "#ffd166",
      blue: "#34d3ff",
      magenta: "#ff9d2e",
      cyan: "#7be7ff",
      white: "#f8fbff",
      brightBlack: "#4b556f",
      brightRed: "#ff8e8e",
      brightGreen: "#9bffb2",
      brightYellow: "#ffe08f",
      brightBlue: "#8cebff",
      brightMagenta: "#ffbc78",
      brightCyan: "#b2f4ff",
      brightWhite: "#ffffff"
    }
  },
  minimal: {
    label: "paper",
    description: "High-contrast light mode for daylight browsing.",
    css: {
      "--background": "#f5f1e7",
      "--surface": "rgba(255, 252, 246, 0.88)",
      "--surface-strong": "#fffaf0",
      "--foreground": "#16120e",
      "--muted": "#6a6258",
      "--border": "rgba(38, 24, 15, 0.12)",
      "--prompt": "#915c1b",
      "--accent": "#0f766e",
      "--glow": "rgba(145, 92, 27, 0.12)"
    },
    terminal: {
      background: "#fffaf0",
      foreground: "#16120e",
      cursor: "#915c1b",
      cursorAccent: "#fffaf0",
      selectionBackground: "rgba(145, 92, 27, 0.18)",
      black: "#221b16",
      red: "#b42318",
      green: "#13795b",
      yellow: "#915c1b",
      blue: "#155e75",
      magenta: "#9f1239",
      cyan: "#0f766e",
      white: "#f8f3ea",
      brightBlack: "#776b5d",
      brightRed: "#dc2626",
      brightGreen: "#15803d",
      brightYellow: "#b45309",
      brightBlue: "#0f766e",
      brightMagenta: "#be185d",
      brightCyan: "#0d9488",
      brightWhite: "#ffffff"
    }
  },
  dracula: {
    label: "dracula",
    description: "Classic purple-tinted dark theme.",
    css: {
      "--background": "#282a36",
      "--surface": "rgba(40, 42, 54, 0.88)",
      "--surface-strong": "#21222c",
      "--foreground": "#f8f8f2",
      "--muted": "#6272a4",
      "--border": "rgba(98, 114, 164, 0.3)",
      "--prompt": "#bd93f9",
      "--accent": "#50fa7b",
      "--glow": "rgba(189, 147, 249, 0.2)"
    },
    terminal: {
      background: "#282a36",
      foreground: "#f8f8f2",
      cursor: "#f8f8f2",
      cursorAccent: "#282a36",
      selectionBackground: "rgba(68, 71, 90, 0.6)",
      black: "#21222c",
      red: "#ff5555",
      green: "#50fa7b",
      yellow: "#f1fa8c",
      blue: "#bd93f9",
      magenta: "#ff79c6",
      cyan: "#8be9fd",
      white: "#f8f8f2",
      brightBlack: "#6272a4",
      brightRed: "#ff6e6e",
      brightGreen: "#69ff94",
      brightYellow: "#ffffa5",
      brightBlue: "#d6acff",
      brightMagenta: "#ff92df",
      brightCyan: "#a4ffff",
      brightWhite: "#ffffff"
    }
  }
} as const;

export const DEFAULT_THEME: ThemeName = "default";

export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];