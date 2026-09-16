import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UMKMDetailContent from "@/components/pages/UMKMDetailContent";
import { umkmCatalog } from "@/data/umkmCatalog";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const getUmkmBySlug = (slug: string) => {
  return umkmCatalog.find((item) => item.slug === slug);
};

export function generateStaticParams() {
  return umkmCatalog.map((item) => ({ slug: item.slug }));
}

export default async function UMKMDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const umkm = getUmkmBySlug(slug);

  if (!umkm) notFound();

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <UMKMDetailContent umkm={umkm} />
      </div>
      <Footer />
    </main>
  );
}