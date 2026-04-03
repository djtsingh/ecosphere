import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';

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
    default: "ssh — daljeet@portfolio.sh",
    template: "%s ─ daljeet@portfolio.sh"
  },
  description: "Interactive terminal portfolio — navigate projects, run commands, query GitHub live, and ask AI anything about Daljeet Singh.",
  applicationName: "daljeet@portfolio.sh",
  authors: [{ name: "Daljeet Singh" }],
  creator: "Daljeet Singh",
  keywords: [
    "Daljeet Singh",
    "terminal portfolio",
    "interactive portfolio",
    "software developer Mumbai"
  ],
  manifest: "/manifest.json",
  openGraph: {
    title: "ssh — daljeet@portfolio.sh",
    description: "Interactive terminal portfolio. Navigate the filesystem, run 30+ commands, and ask AI about my work.",
    url: "https://terminal.daljeetsingh.me",
    siteName: "daljeet@portfolio.sh",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "ssh — daljeet@portfolio.sh",
    description: "Interactive terminal portfolio by Daljeet Singh."
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
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${mono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}