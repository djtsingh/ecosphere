import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-strong": "var(--surface-strong)",
        border: "var(--border)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        prompt: "var(--prompt)",
        accent: "var(--accent)"
      },
      boxShadow: {
        glow: "0 0 0 1px var(--border), 0 20px 60px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(77,120,180,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(77,120,180,0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;