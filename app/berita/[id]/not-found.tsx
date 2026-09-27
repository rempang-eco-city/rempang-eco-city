import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Berita Tidak Ditemukan",
};

// Rendered (with a real 404 status) when page.tsx calls notFound().
export default function BeritaNotFound() {
  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PageHeader
          title="Berita Tidak Ditemukan"
          description="Maaf, berita yang anda cari tidak dapat ditemukan"
        />
        <div className="container-content py-16 text-center">
          <p className="text-text-secondary mb-4">Berita ini tidak tersedia atau telah dihapus.</p>
          <Link href="/berita" className="text-primary-blue font-medium hover:text-primary-dark">
            Kembali ke halaman berita →
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
