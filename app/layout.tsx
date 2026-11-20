import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter_Tight } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Julia — Eau de Parfum · 20.01.2027",
  description:
    "Julia, la nouvelle eau de parfum. Une lumière ambrée posée sur la peau. Sortie le 20 janvier 2027.",
};

export const viewport: Viewport = {
  themeColor: "#e9dfd0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${interTight.variable}`}>
      <body className="grain is-loading">{children}</body>
    </html>
  );
}
