import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import KoperasiDetailContent from "@/components/pages/KoperasiDetailContent";
import { getKoperasiByRouteKey, getKoperasiList } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";

type PageProps = {
  params: { routeKey: string };
};

export async function generateStaticParams() {
  const koperasiList = await getKoperasiList();
  return koperasiList.map(({ routeKey }) => ({ routeKey }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const koperasi = await getKoperasiByRouteKey(params.routeKey);
  if (!koperasi) return { title: "Koperasi Tidak Ditemukan" };

  const description = koperasi.pageDescription || koperasi.homeCardDescription;
  return {
    title: koperasi.name,
    description,
    openGraph: {
      title: koperasi.name,
      description,
      images: [sanityImageUrl(koperasi.heroImage, 1200)],
    },
  };
}

export default async function KoperasiDetailPage({ params }: PageProps) {
  const koperasi = await getKoperasiByRouteKey(params.routeKey);

  if (!koperasi) notFound();

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PageHeader
          title={koperasi.name}
          description={koperasi.pageDescription || koperasi.homeCardDescription}
        />
        <KoperasiDetailContent koperasi={koperasi} />
      </div>
      <Footer />
    </main>
  );
}
