"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { PetaLokasi } from "@/lib/sanity/queries";

// Leaflet needs `window`, so the map only renders in the browser.
const RempangMap = dynamic(() => import("./RempangMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center bg-slate-100 text-sm font-medium text-slate-500 md:h-[480px] lg:h-[560px]">
      Memuat peta Rempang...
    </div>
  ),
});

type Props = {
  title: string;
  description?: string;
  address: string;
  lokasi: PetaLokasi[];
};

export default function PetaWilayah({ title, description, address, lokasi }: Props) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-blue mb-3">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-xl overflow-hidden border border-border-color shadow-sm"
        >
          <RempangMap lokasi={lokasi} />
        </motion.div>

        <div className="mt-4 text-right">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-blue hover:underline"
          >
            Buka di Google Maps
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
