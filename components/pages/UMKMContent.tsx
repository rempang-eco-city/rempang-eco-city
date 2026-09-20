"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Eye, Search } from "lucide-react";
import type { UmkmListItem } from "@/lib/sanity/queries";

type Props = {
  umkms: UmkmListItem[];
};

const categoryBadgeClass: Record<string, string> = {
  Kuliner: "bg-[#dcfce7] text-[#166534]",
  Kerajinan: "bg-[#f5d0fe] text-[#86198f]",
  Jasa: "bg-[#fed7aa] text-[#9a3412]",
  Fashion: "bg-[#fbcfe8] text-[#9d174d]",
  "Produk Lokal": "bg-[#d1fae5] text-[#065f46]",
};

export default function UMKMContent({ umkms }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const umkmCategories = useMemo(
    () => ["Semua", ...Array.from(new Set(umkms.map((item) => item.category)))],
    [umkms]
  );

  const filteredUMKM = umkms.filter((umkm) => {
    const searchMatch =
      umkm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      umkm.cardDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch =
      activeCategory === "Semua" || umkm.category === activeCategory;
    return searchMatch && categoryMatch;
  });

  return (
    <div className="bg-white pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <input
              type="text"
              placeholder="Cari UMKM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
            />
          </div>
        </motion.div>

        <div className="mb-10 flex flex-wrap gap-3">
          {umkmCategories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "border-primary-blue bg-primary-blue text-white shadow-sm"
                  : "border-slate-300 bg-white text-text-primary hover:border-primary-blue hover:text-primary-blue"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredUMKM.map((umkm, i) => (
            <motion.article
              key={umkm._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group overflow-hidden rounded-[30px] border border-slate-300 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
            >
              <div className="relative h-[250px] overflow-hidden bg-slate-200">
                <img
                  src={umkm.image}
                  alt={umkm.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="px-4 pb-4 pt-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    categoryBadgeClass[umkm.category] ?? "bg-slate-200 text-slate-700"
                  }`}
                >
                  {umkm.category}
                </span>

                <h3 className="mt-3 font-heading text-lg font-bold leading-snug text-text-primary">
                  {umkm.name}
                </h3>

                <p className="mt-2 min-h-[72px] text-sm leading-relaxed text-text-secondary md:min-h-[84px]">
                  {umkm.cardDescription}
                </p>

                <div className="mt-6">
                  <Link
                    href={`/umkm/${umkm.slug}`}
                    className="flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-xl border border-slate-300 bg-white px-3 py-3 text-[12px] font-medium text-slate-700 transition hover:border-primary-blue hover:text-primary-blue"
                  >
                    <Eye size={15} className="stroke-[2.2]" />
                    Lihat Detail UMKM
                    <ArrowRight size={13} className="stroke-[2.2]" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredUMKM.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-text-secondary">Tidak ada UMKM yang sesuai dengan pencarian Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
