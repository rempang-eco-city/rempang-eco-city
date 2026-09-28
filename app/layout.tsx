import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { FEATURES } from "@/lib/features";

const heading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rempang Eco City — Portal Informasi",
    template: "%s | Rempang Eco City",
  },
  description: FEATURES.pariwisata
    ? "Portal informasi masyarakat Rempang Eco City. Profil REC, Koperasi, Pariwisata, UMKM, dan Berita terkini."
    : "Portal informasi masyarakat Rempang Eco City. Profil REC, Koperasi, UMKM, dan Berita terkini.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body bg-bg-light text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
