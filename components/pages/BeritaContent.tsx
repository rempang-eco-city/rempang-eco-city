"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { NewsArticleListItem } from "@/lib/sanity/queries";

type Props = {
  articles: NewsArticleListItem[];
};

export default function BeritaContent({ articles }: Props) {
  const filteredArticles = articles;

  return (
    <div className="bg-white pt-8 pb-16 md:pt-10 md:pb-24">
      <div className="container-content">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, i) => (
            <motion.div
              key={article._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link href={`/berita/${article.slug}`} className="group block h-full">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-border-color">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="mb-3">
                  <span className="text-sm text-text-secondary">{article.date}</span>
                </div>

                <h3 className="font-heading font-bold text-lg text-text-primary group-hover:text-primary-blue transition-colors mb-3 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-text-secondary text-sm line-clamp-2 mb-4">
                  {article.excerpt}
                </p>

                <div className="text-primary-blue font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Baca Selengkapnya →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
