import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import RichText from "@/components/RichText";
import Link from "next/link";
import { getNewsArticleBySlug } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";

// The dynamic segment is named "id" for the route folder, but the value is
// actually the Sanity document's slug.
type PageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getNewsArticleBySlug(params.id);
  if (!article) return { title: "Berita Tidak Ditemukan" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      images: [sanityImageUrl(article.image, 1200)],
    },
  };
}

export default async function BeritaDetailPage({ params }: PageProps) {
  const article = await getNewsArticleBySlug(params.id);

  if (!article) notFound();

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PageHeader
          title={article.title}
          description={article.excerpt}
        />

        <article className="bg-white py-16 md:py-24">
          <div className="container-content max-w-3xl">
            {/* Article Image */}
            <div className="mb-12 rounded-xl overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Article Meta */}
            <div className="mb-8 pb-8 border-b border-border-color">
              <span className="text-sm text-text-secondary">{article.date}</span>
            </div>

            {/* Article Content */}
            <div className="mb-12">
              <RichText value={article.content} />
            </div>

            {/* Back Link */}
            <div className="pt-8 border-t border-border-color">
              <Link
                href="/berita"
                className="text-primary-blue font-medium hover:text-primary-dark transition-colors inline-flex items-center gap-2"
              >
                ← Kembali ke Berita
              </Link>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </main>
  );
}
