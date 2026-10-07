import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import BeritaContent from "@/components/pages/BeritaContent";
import { getNewsArticles, getListingPageHeader } from "@/lib/sanity/queries";

// Used until the header fields are filled in the Studio.
const DEFAULT_TITLE = "Berita & Informasi";
const DEFAULT_DESCRIPTION = "Kabar terbaru seputar Rempang Eco City";

export async function generateMetadata(): Promise<Metadata> {
  const header = await getListingPageHeader("beritaPage");
  return {
    title: "Berita",
    description: header?.headerDescription || DEFAULT_DESCRIPTION,
  };
}

export default async function BeritaPage() {
  const [articles, header] = await Promise.all([
    getNewsArticles(),
    getListingPageHeader("beritaPage"),
  ]);

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PageHeader
          title={header?.headerTitle || DEFAULT_TITLE}
          description={header?.headerDescription || DEFAULT_DESCRIPTION}
        />
        <BeritaContent articles={articles} />
      </div>
      <Footer />
    </main>
  );
}
