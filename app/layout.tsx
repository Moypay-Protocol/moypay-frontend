import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";

import { Lexend } from "next/font/google";
import "./globals.css";

import AdaptiveLayout from "@/components/layout/adaptive-layout";
import Providers from "@/components/providers";
import { siteConfig } from "@/config/site";

const lexend = Lexend({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "TypeScript",
    "Web App",
    "Modern UI",
    siteConfig.name,
  ],
  authors: [{ name: "MoyPay", url: siteConfig.url }],
  creator: "MoyPay",
  publisher: siteConfig.name,
  generator: "Next.js 15",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${lexend.className} antialiased bg-background`}>
        <Providers>
          <AdaptiveLayout>{children}</AdaptiveLayout>
        </Providers>
      </body>
    </html>
  );
}
