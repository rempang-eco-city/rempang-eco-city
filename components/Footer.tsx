import Link from "next/link";
import { FEATURES } from "@/lib/features";

const leftMenuLinks = [
  { label: "Beranda", href: "/" },
  { label: "Profil REC", href: "/profil" },
  { label: "Koperasi", href: "/koperasi" },
];

const rightMenuLinks = [
  ...(FEATURES.pariwisata ? [{ label: "Pariwisata", href: "/pariwisata" }] : []),
  { label: "UMKM", href: "/umkm" },
  { label: "Berita", href: "/berita" },
];

export default function Footer() {
  return (
    <footer className="bg-primary-dark pt-10 pb-8 text-white md:pt-12 md:pb-10">
      <div className="container-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/10">
          {/* Logo Kementrans */}
          <div className="flex items-start">
            <div className="flex flex-col">
              <div className="w-24 h-24 mb-4">
                <img 
                  src="/images/logo-kementrans.png" 
                  alt="Logo Kementrans"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-sm text-white leading-relaxed">Kementerian Transmigrasi</p>
              <p className="text-sm text-white leading-relaxed">Republik Indonesia</p>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Menu
            </h4>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <ul className="space-y-2">
                {leftMenuLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white hover:text-primary-yellow transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {rightMenuLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white hover:text-primary-yellow transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Alamat */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Alamat
            </h4>
            <div className="mt-4 text-sm text-white space-y-2">
              <p>Rempang, Batam</p>
              <p>Kepulauan Riau, Indonesia</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 text-center text-sm text-white/60">
          <p>Copyright © 2026 Rempang Eco City.</p>
        </div>
      </div>
    </footer>
  );
}
