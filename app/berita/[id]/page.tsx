import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Breadcrumb removed per request
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { getNewsArticleBySlug } from "@/lib/sanity/queries";

export default async function BeritaDetailPage({ params }: { params: { id: string } }) {
  // The dynamic segment is named "id" for the route folder, but the value is
  // actually the Sanity document's slug.
  const article = await getNewsArticleBySlug(params.id);

  if (!article) {
    return (
      <main>
        <Navbar />
        <div className="pt-20 md:pt-24">
          <PageHeader 
            title="Berita Tidak Ditemukan"
            description="Maaf, berita yang anda cari tidak dapat ditemukan"
          />
          <div className="container-content py-16 text-center">
            <p className="text-text-secondary mb-4">Berita ini tidak tersedia atau telah dihapus.</p>
            <Link href="/berita" className="text-primary-blue font-medium hover:text-primary-dark">
              Kembali ke halaman berita →
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="pt-20 md:pt-24">
        <PageHeader 
          title={article.title}
          description={article.excerpt}
        />
        {/* breadcrumb removed */}

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
            <div className="prose prose-lg max-w-none mb-12">
              {article.content.map((paragraph, idx) => (
                <p key={idx} className="text-text-primary text-base leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
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
