"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  images: string[];
};

export default function PariwisataSection({ title, description, images }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section className="bg-bg-light py-16 md:py-24">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
        >
          {/* Left: Carousel */}
          <div className="rounded-2xl overflow-hidden border border-border-color bg-white shadow-sm relative">
            <div className="relative h-[420px] md:h-[520px]">
              {images.map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={`${title} ${i + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    i === index ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                />
              ))}

              {/* Prev / Next */}
              <button
                onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                aria-label="Sebelumnya"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white md:hidden"
              >
                ‹
              </button>
              <button
                onClick={() => setIndex((i) => (i + 1) % images.length)}
                aria-label="Selanjutnya"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white md:hidden"
              >
                ›
              </button>

              {/* Dots */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-10 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      i === index ? "bg-primary-blue" : "bg-white/60"
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-heading font-bold text-3xl md:text-4xl text-primary-blue mb-3"
            >
              {title}
            </motion.h2>

            {description && (
              <p className="text-lg text-text-secondary mb-6 max-w-xl">{description}</p>
            )}

            <Link
              href="/pariwisata"
              className="inline-flex items-center gap-3 px-6 py-3 bg-primary-blue text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Lihat Pariwisata
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
