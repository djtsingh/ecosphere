"use client";

import { create } from "zustand";

import { DEFAULT_THEME, type ThemeName } from "@/lib/themes";

type TerminalStore = {
  cwd: string;
  themeName: ThemeName;
  history: string[];
  isBusy: boolean;
  setCwd: (cwd: string) => void;
  setThemeName: (themeName: ThemeName) => void;
  pushHistory: (command: string) => void;
  setBusy: (isBusy: boolean) => void;
};

export const useTerminalStore = create<TerminalStore>((set) => ({
  cwd: "~",
  themeName: DEFAULT_THEME,
  history: [],
  isBusy: false,
  setCwd: (cwd) => set({ cwd }),
  setThemeName: (themeName) => set({ themeName }),
  pushHistory: (command) =>
    set((state) => ({
      history: command ? [...state.history, command].slice(-50) : state.history
    })),
  setBusy: (isBusy) => set({ isBusy })
}));