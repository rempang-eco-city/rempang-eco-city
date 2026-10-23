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
import InstagramSection from "@/components/sections/InstagramSection";
import {
  getBerandaPage,
  getKoperasiList,
  getHomeNewsArticles,
  getPetaLokasi,
  getUmkmItems,
} from "@/lib/sanity/queries";
import { FEATURES } from "@/lib/features";
import { getInstagramFeeds } from "@/lib/instagram";

// Matches the 4-column Berita grid on large screens.
const HOME_NEWS_LIMIT = 4;

export async function generateMetadata(): Promise<Metadata> {
  const beranda = await getBerandaPage();
  return { description: beranda?.heroDescription };
}

export default async function Home() {
  const [beranda, articles, umkms, koperasiList, petaLokasi] = await Promise.all([
    getBerandaPage(),
    getHomeNewsArticles(HOME_NEWS_LIMIT),
    getUmkmItems(),
    getKoperasiList(),
    getPetaLokasi(),
  ]);

  if (!beranda) notFound();

  const instagramFeeds = await getInstagramFeeds(
    beranda.instagramAccounts.map(({ username }) => username)
  );

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
          lokasi={petaLokasi}
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
        <InstagramSection
          title={beranda.instagramTitle}
          description={beranda.instagramDescription}
          accounts={beranda.instagramAccounts}
          feeds={instagramFeeds}
        />
      </div>
      <Footer />
    </main>
  );
}
