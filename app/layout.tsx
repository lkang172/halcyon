import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Literata } from "next/font/google";
import Menu from "@/components/Menu";
import "./globals.css";

const display = Literata({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "lucas' notes",
  description:
    "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <Menu />
        {children}
      </body>
    </html>
  );
}
