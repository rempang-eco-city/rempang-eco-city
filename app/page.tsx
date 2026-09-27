import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/sections/HeroBanner";
import PetaWilayah from "@/components/sections/PetaWilayah";
import KoperasiSection from "@/components/sections/KoperasiSection";
import PariwisataSection from "@/components/sections/PariwisataSection";
import UMKMSection from "@/components/sections/UMKMSection";
import BeritaTerbaru from "@/components/sections/BeritaTerbaru";
import {
  getKoperasiList,
  getNewsArticles,
  getUmkmItems,
} from "@/lib/sanity/queries";

export default async function Home() {
  const [articles, umkms, koperasiList] = await Promise.all([
    getNewsArticles(),
    getUmkmItems(),
    getKoperasiList(),
  ]);

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <HeroBanner />
        <PetaWilayah />
        <KoperasiSection koperasiList={koperasiList} />
        <PariwisataSection />
        <UMKMSection umkms={umkms} />
        <BeritaTerbaru articles={articles} />
      </div>
      <Footer />
    </main>
  );
}
