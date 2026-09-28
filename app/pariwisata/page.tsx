import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Breadcrumb removed per request
import PageHeader from "@/components/PageHeader";
import PariwisataContent from "@/components/pages/PariwisataContent";
import { getPariwisataDestinations } from "@/lib/sanity/queries";
import { FEATURES } from "@/lib/features";

export const metadata: Metadata = {
  title: "Pariwisata",
  description:
    "Jelajahi destinasi unggulan Rempang: wisata mancing dan eksplorasi mangrove.",
};

export default async function PariwisataPage() {
  if (!FEATURES.pariwisata) notFound();

  const destinations = await getPariwisataDestinations();

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PageHeader 
          title="Pariwisata Rempang"
          description="Jelajahi dua destinasi unggulan Rempang saat ini: wisata mancing dan eksplorasi mangrove, lengkap dengan detail aktivitas dan rekomendasi kunjungan."
        />
        <PariwisataContent destinations={destinations} />
      </div>
      <Footer />
    </main>
  );
}
