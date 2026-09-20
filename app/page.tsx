import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/sections/HeroBanner";
import PetaWilayah from "@/components/sections/PetaWilayah";
import KoperasiSection from "@/components/sections/KoperasiSection";
import PariwisataSection from "@/components/sections/PariwisataSection";
import UMKMSection from "@/components/sections/UMKMSection";
import BeritaTerbaru from "@/components/sections/BeritaTerbaru";
import { getNewsArticles, getUmkmItems } from "@/lib/sanity/queries";

export default async function Home() {
  const [articles, umkms] = await Promise.all([
    getNewsArticles(),
    getUmkmItems(),
  ]);

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <HeroBanner />
        <PetaWilayah />
        <KoperasiSection />
        <PariwisataSection />
        <UMKMSection umkms={umkms} />
        <BeritaTerbaru articles={articles} />
      </div>
      <Footer />
    </main>
  );
}
