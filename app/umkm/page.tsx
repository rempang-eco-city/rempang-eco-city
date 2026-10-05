import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Breadcrumb removed per request
import PageHeader from "@/components/PageHeader";
import UMKMContent from "@/components/pages/UMKMContent";
import { getUmkmItems } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "UMKM",
  description:
    "Temukan dan dukung produk usaha masyarakat Rempang.",
};

export default async function UMKMPage() {
  const umkms = await getUmkmItems();

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PageHeader 
          title="UMKM Rempang Eco City"
          description="Temukan dan dukung produk usaha masyarakat"
        />
        <UMKMContent umkms={umkms} />
      </div>
      <Footer />
    </main>
  );
}
