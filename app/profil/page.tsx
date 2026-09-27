import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import ProfilContent from "@/components/pages/ProfilContent";
import { getProfilPage } from "@/lib/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
  const profil = await getProfilPage();
  return {
    title: "Profil",
    description: profil?.headerDescription,
  };
}

export default async function ProfilPage() {
  const profil = await getProfilPage();

  if (!profil) notFound();

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PageHeader
          title={profil.headerTitle}
          description={profil.headerDescription}
        />
        <ProfilContent profil={profil} />
      </div>
      <Footer />
    </main>
  );
}
