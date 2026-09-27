import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UMKMDetailContent from "@/components/pages/UMKMDetailContent";
import { getUmkmItemBySlug, getUmkmSlugs } from "@/lib/sanity/queries";

type PageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getUmkmSlugs();
  return slugs.map(({ slug }) => ({ slug }));
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
