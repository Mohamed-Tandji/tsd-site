import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import "../globals.css";

const crimson = Crimson_Pro({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-crimson" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s – Administration TSD Systems" },
  robots: { index: false, follow: false },
};

// Administration : hors langue, en français, jamais indexée
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${crimson.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-[15px] text-navy antialiased">{children}</body>
    </html>
  );
}
