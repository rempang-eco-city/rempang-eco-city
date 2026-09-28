import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/sections/HeroBanner";
import PetaWilayah from "@/components/sections/PetaWilayah";
import KoperasiSection from "@/components/sections/KoperasiSection";
import PariwisataSection from "@/components/sections/PariwisataSection";
import UMKMSection from "@/components/sections/UMKMSection";
import BeritaTerbaru from "@/components/sections/BeritaTerbaru";
import {
  getBerandaPage,
  getKoperasiList,
  getLatestNewsArticles,
  getUmkmItems,
} from "@/lib/sanity/queries";
import { FEATURES } from "@/lib/features";

// Matches the 4-column Berita grid on large screens.
const HOME_NEWS_LIMIT = 4;

export async function generateMetadata(): Promise<Metadata> {
  const beranda = await getBerandaPage();
  return { description: beranda?.heroDescription };
}

export default async function Home() {
  const [beranda, articles, umkms, koperasiList] = await Promise.all([
    getBerandaPage(),
    getLatestNewsArticles(HOME_NEWS_LIMIT),
    getUmkmItems(),
    getKoperasiList(),
  ]);

  if (!beranda) notFound();

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <HeroBanner
          title={beranda.heroTitle}
          description={beranda.heroDescription}
          buttonLabel={beranda.heroButtonLabel}
          buttonLink={beranda.heroButtonLink}
          image={beranda.heroImage}
        />
        <PetaWilayah
          title={beranda.petaTitle}
          description={beranda.petaDescription}
          address={beranda.petaAddress}
        />
        <KoperasiSection title={beranda.koperasiTitle} koperasiList={koperasiList} />
        {FEATURES.pariwisata && (
          <PariwisataSection
            title={beranda.pariwisataTitle}
            description={beranda.pariwisataDescription}
            images={beranda.pariwisataImages}
          />
        )}
        <UMKMSection
          title={beranda.umkmTitle}
          description={beranda.umkmDescription}
          umkms={umkms}
        />
        <BeritaTerbaru title={beranda.beritaTitle} articles={articles} />
      </div>
      <Footer />
    </main>
  );
}
