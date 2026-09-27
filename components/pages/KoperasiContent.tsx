"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { KoperasiListItem } from "@/lib/sanity/queries";

export default function KoperasiContent({
  koperasiList,
}: {
  koperasiList: KoperasiListItem[];
}) {
  return (
    <div className="bg-white pt-8 pb-16 md:pt-10 md:pb-24">
      <div className="container-content">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-lg text-text-secondary max-w-3xl mb-12"
        >
          Informasi koperasi dan pemberdayaan ekonomi masyarakat di Rempang Eco City
        </motion.p>

        <div className="space-y-12">
          {koperasiList.map((coop, i) => (
            <motion.div
              key={coop._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-bg-light rounded-xl border border-border-color"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-border-color">
                <img
                  src={coop.heroImage}
                  alt={coop.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div>
                <h3 className="font-heading font-bold text-2xl text-primary-blue mb-3">
                  {coop.name}
                </h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  {coop.homeCardDescription}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border-color">
                  <div>
                    <p className="text-sm text-text-secondary">Tahun Berdiri</p>
                    <p className="font-semibold text-text-primary">{coop.yearFounded}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Jumlah Anggota</p>
                    <p className="font-semibold text-text-primary">{coop.memberCount}</p>
                  </div>
                </div>

                <Link
                  href={`/koperasi/${coop.routeKey}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-primary-blue text-primary-blue font-medium rounded-lg hover:bg-primary-blue hover:text-white transition-colors"
                >
                  Selengkapnya →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
