import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan",
};

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PageHeader
          title="Halaman Tidak Ditemukan"
          description="Maaf, halaman yang anda cari tidak tersedia atau telah dipindahkan."
        />
        <div className="container-content py-16 text-center">
          <Link href="/" className="text-primary-blue font-medium hover:text-primary-dark">
            Kembali ke Beranda →
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
