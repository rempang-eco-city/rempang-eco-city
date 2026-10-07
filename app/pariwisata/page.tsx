import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PariwisataContent from "@/components/pages/PariwisataContent";
import PokdarwisContent from "@/components/pages/PokdarwisContent";
import { getPariwisataPage } from "@/lib/sanity/queries";
import { FEATURES } from "@/lib/features";

// Used until the header fields are filled in the Studio.
const DEFAULT_TITLE = "Pariwisata Rempang Eco City";
const DEFAULT_DESCRIPTION =
  "Jelajahi destinasi wisata unggulan Rempang Eco City, lengkap dengan detail aktivitas, paket harga, dan rekomendasi kunjungan.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPariwisataPage();
  return {
    title: "Pariwisata",
    description: page?.headerDescription || DEFAULT_DESCRIPTION,
  };
}

export default async function PariwisataPage() {
  if (!FEATURES.pariwisata) notFound();

  const page = await getPariwisataPage();
  const { groupName, shortName } = page ?? {};

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PageHeader
          title={page?.headerTitle || DEFAULT_TITLE}
          description={page?.headerDescription || DEFAULT_DESCRIPTION}
        />
        {page && groupName && shortName && (
          <PokdarwisContent page={{ ...page, groupName, shortName }} />
        )}
        <PariwisataContent
          destinations={page?.destinations ?? []}
          eyebrow={shortName ? `Destinasi ${shortName}` : "Destinasi Wisata"}
        />
      </div>
      <Footer />
    </main>
  );
}
