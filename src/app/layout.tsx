import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { SerwistProvider } from "./serwist-provider";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Cadence",
  description: "A personal productivity system built as a mobile-first PWA.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cadence",
    startupImage: [],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0E0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${dmSans.variable} ${dmMono.variable}`}
      >
        <SerwistProvider swUrl="/serwist/sw.js">{children}</SerwistProvider>
      </body>
    </html>
  );
}
