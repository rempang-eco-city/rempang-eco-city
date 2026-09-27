import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Breadcrumb removed per request
import PageHeader from "@/components/PageHeader";
import BeritaContent from "@/components/pages/BeritaContent";
import { getNewsArticles } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Berita",
  description:
    "Kabar terbaru seputar Rempang Eco City.",
};

export default async function BeritaPage() {
  const articles = await getNewsArticles();

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PageHeader 
          title="Berita & Informasi"
          description="Kabar terbaru seputar Rempang Eco City"
        />
        <BeritaContent articles={articles} />
      </div>
      <Footer />
    </main>
  );
}
