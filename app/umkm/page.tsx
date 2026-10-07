import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import UMKMContent from "@/components/pages/UMKMContent";
import { getUmkmItems, getListingPageHeader } from "@/lib/sanity/queries";

// Used until the header fields are filled in the Studio.
const DEFAULT_TITLE = "UMKM Rempang Eco City";
const DEFAULT_DESCRIPTION = "Temukan dan dukung produk usaha masyarakat";

export async function generateMetadata(): Promise<Metadata> {
  const header = await getListingPageHeader("umkmPage");
  return {
    title: "UMKM",
    description: header?.headerDescription || DEFAULT_DESCRIPTION,
  };
}

export default async function UMKMPage() {
  const [umkms, header] = await Promise.all([
    getUmkmItems(),
    getListingPageHeader("umkmPage"),
  ]);

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PageHeader
          title={header?.headerTitle || DEFAULT_TITLE}
          description={header?.headerDescription || DEFAULT_DESCRIPTION}
        />
        <UMKMContent umkms={umkms} />
      </div>
      <Footer />
    </main>
  );
}
