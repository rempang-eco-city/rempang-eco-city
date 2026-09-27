"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { UmkmListItem } from "@/lib/sanity/queries";

type Props = {
  title: string;
  description?: string;
  umkms: UmkmListItem[];
};

export default function UMKMSection({ title, description, umkms }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // autoplay removed — user controls the carousel

  // No programmatic active changes — users scroll/hover to browse cards.
  useEffect(() => {
    // keep refs stable; nothing to do here
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-16 md:py-24">
      <div className="container-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Left: Title & Description */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="pr-4"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-blue mb-3">
              {title}
            </h2>

            {description && (
              <p className="text-lg text-text-secondary max-w-xl">{description}</p>
            )}
          </motion.div>

          {/* Right: Cards carousel + header (CTA one-line) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div />
              <Link href="/umkm" className="text-primary-blue font-semibold text-sm md:text-base whitespace-nowrap">
                Lihat Semua UMKM →
              </Link>
            </div>

            <div className="relative">
              <div ref={containerRef} className="umkm-carousel flex gap-4 overflow-x-auto pb-4">
                {umkms.map((card) => (
                  <Link
                    key={card._id}
                    href={`/umkm/${card.slug}`}
                    className={`group umkm-card block w-[220px] md:w-[260px] bg-bg-light rounded-2xl border border-border-color overflow-hidden shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]`}
                  >
                    <div className="h-44 md:h-56 w-full overflow-hidden rounded-t-2xl">
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <h4 className="text-base font-semibold text-text-primary">{card.name}</h4>
                      <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{card.cardDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination removed — users control carousel by scroll and hover */}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
