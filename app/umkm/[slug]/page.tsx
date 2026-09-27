import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UMKMDetailContent from "@/components/pages/UMKMDetailContent";
import { getUmkmItemBySlug, getUmkmSlugs } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";

type PageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getUmkmSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const umkm = await getUmkmItemBySlug(params.slug);
  if (!umkm) return { title: "UMKM Tidak Ditemukan" };

  return {
    title: umkm.name,
    description: umkm.cardDescription,
    openGraph: {
      title: umkm.name,
      description: umkm.cardDescription,
      images: [sanityImageUrl(umkm.image, 1200)],
    },
  };
}

export default async function UMKMDetailPage({ params }: PageProps) {
  const umkm = await getUmkmItemBySlug(params.slug);

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
