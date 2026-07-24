import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import { KeepAlive } from "./_components/keep-alive";
import QueryProvider from "./_providers/QueryProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GITHUB PROFILE // TACTICAL TELEMETRY",
  description:
    "CLASSIFIED DATA RETRIEVAL SYSTEM // GITHUB USER INTELLIGENCE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-dvh bg-background text-foreground">
        <div className="crt-overlay" aria-hidden="true" />
        <KeepAlive />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
