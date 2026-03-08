import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";

import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

// ── ZenPrep metadata (replaces PrepWise) ──
export const metadata: Metadata = {
  title: "ZenPrep",
  description:
    "AI-powered multilingual mock interview platform for Indian job seekers. Practice in Hindi, Tamil, Telugu, and 19 more Indian languages.",
  keywords: [
    "mock interview",
    "AI interview",
    "Hindi interview",
    "Indian languages",
    "job preparation",
    "ZenPrep",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // dark class forces dark mode globally — ZenPrep is dark-first
    <html lang="en" className="dark">
      <body className={`${monaSans.variable} font-[family-name:var(--font-mona-sans)] antialiased pattern`}>
        {children}

        {/* Sonner toast notifications — appears at bottom-right */}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
