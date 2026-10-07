import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Breadcrumb removed per request
import PageHeader from "@/components/PageHeader";
import PariwisataContent from "@/components/pages/PariwisataContent";
import PokdarwisContent from "@/components/pages/PokdarwisContent";
import { getPariwisataDestinations, getPariwisataPage } from "@/lib/sanity/queries";
import { FEATURES } from "@/lib/features";

export const metadata: Metadata = {
  title: "Pariwisata",
  description:
    "Jelajahi destinasi wisata unggulan Rempang, lengkap dengan paket harga dan rekomendasi kunjungan.",
};

export default async function PariwisataPage() {
  if (!FEATURES.pariwisata) notFound();

  const [destinations, pariwisataPage] = await Promise.all([
    getPariwisataDestinations(),
    getPariwisataPage(),
  ]);

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PageHeader 
          title="Pariwisata Rempang Eco City"
          description="Jelajahi destinasi wisata unggulan Rempang, lengkap dengan detail aktivitas, paket harga, dan rekomendasi kunjungan."
        />
        {pariwisataPage && <PokdarwisContent page={pariwisataPage} />}
        <PariwisataContent
          destinations={destinations}
          eyebrow={pariwisataPage ? `Destinasi ${pariwisataPage.shortName}` : "Destinasi Wisata"}
        />
      </div>
      <Footer />
    </main>
  );
}
