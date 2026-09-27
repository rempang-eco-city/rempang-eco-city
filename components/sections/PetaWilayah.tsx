"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const RempangMap = dynamic(() => import("./RempangMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[450px] w-full items-center justify-center bg-slate-100 text-sm font-medium text-slate-500">
      Memuat peta Rempang...
    </div>
  ),
});

type Props = {
  title: string;
  description?: string;
  address: string;
};

export default function PetaWilayah({ title, description, address }: Props) {
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
          <div className="bg-bg-light h-[450px] md:h-[520px] w-full">
            <RempangMap address={address} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
