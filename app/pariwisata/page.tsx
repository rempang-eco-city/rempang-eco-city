import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Breadcrumb removed per request
import PageHeader from "@/components/PageHeader";
import PariwisataContent from "@/components/pages/PariwisataContent";
import { getPariwisataDestinations } from "@/lib/sanity/queries";

export default async function PariwisataPage() {
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
