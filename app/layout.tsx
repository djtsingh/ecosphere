import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import "@/app/globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://terminal.daljeetsingh.me"),
  title: {
    default: "Daljeet Terminal",
    template: "%s | Daljeet Terminal"
  },
  description: "A living terminal portfolio for Daljeet Singh built with Next.js, xterm.js, and a data-driven virtual filesystem.",
  applicationName: "Daljeet Terminal",
  authors: [{ name: "Daljeet Singh Lotey" }],
  creator: "Daljeet Singh Lotey",
  keywords: [
    "Daljeet Singh",
    "terminal portfolio",
    "Next.js portfolio",
    "xterm.js",
    "software developer Mumbai"
  ],
  manifest: "/manifest.json",
  openGraph: {
    title: "Daljeet Terminal",
    description: "Explore Daljeet's work through a living terminal with real commands, GitHub data, and AI-assisted answers.",
    url: "https://terminal.daljeetsingh.me",
    siteName: "Daljeet Terminal",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Daljeet Terminal",
    description: "A living terminal portfolio for Daljeet Singh."
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  category: "technology"
};

export const viewport: Viewport = {
  themeColor: "#07111f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}