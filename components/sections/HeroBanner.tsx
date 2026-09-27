"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  buttonLabel: string;
  buttonLink: string;
  image: string;
};

export default function HeroBanner({
  title,
  description,
  buttonLabel,
  buttonLink,
  image,
}: Props) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary-blue leading-tight whitespace-pre-line">
              {title}
            </h1>

            {description && (
              <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-lg">
                {description}
              </p>
            )}

            <motion.a
              href={buttonLink}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-primary-blue text-white font-medium rounded-lg hover:bg-primary-dark transition-colors group"
            >
              {buttonLabel}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-bg-light to-border-color shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
