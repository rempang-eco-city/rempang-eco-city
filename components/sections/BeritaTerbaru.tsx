"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { NewsArticleListItem } from "@/lib/sanity/queries";

type Props = {
  articles: NewsArticleListItem[];
};

export default function BeritaTerbaru({ articles }: Props) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-content">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-blue">
              Berita Terbaru
            </h2>
          </motion.div>

          <motion.a
            href="/berita"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-primary-blue font-medium hover:text-primary-dark transition-colors flex items-center gap-2"
          >
            Lihat Semua Berita →
          </motion.a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, i) => (
            <motion.article
              key={article._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="group overflow-hidden rounded-2xl border border-border-color bg-white shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
            >
              <Link href={`/berita/${article.slug}`} className="block">
                <div className="h-44 w-full overflow-hidden bg-border-color">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <span className="text-xs text-text-secondary">{article.date}</span>
                  </div>
                  <h4 className="font-heading font-bold text-lg text-text-primary mb-2 leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <div>
                    <span className="text-primary-blue font-semibold">Baca selengkapnya ›</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
