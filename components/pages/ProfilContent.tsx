"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ProfilPage } from "@/lib/sanity/queries";

export default function ProfilContent({ profil }: { profil: ProfilPage }) {
  return (
    <div className="bg-white pt-8 pb-16 md:pt-10 md:pb-24">
      <div className="container-content max-w-3xl">
        {/* Tentang REC */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 pb-16 border-b border-border-color"
        >
          <div className="md:flex md:items-start md:gap-8">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <div className="rounded-2xl overflow-hidden border border-border-color bg-bg-light">
                <Image
                  src={profil.aboutImage}
                  alt={profil.aboutTitle}
                  width={1200}
                  height={900}
                  className="object-cover w-full h-64 md:h-96"
                />
              </div>
            </div>

            <div className="md:w-1/2">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary-blue mb-6">
                {profil.aboutTitle}
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                {profil.aboutBody.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Lembaga Kemasyarakatan */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 pb-16 border-b border-border-color"
        >
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary-blue mb-6">
            {profil.lembagaTitle}
          </h2>
          {profil.lembagaDescription && (
            <p className="text-text-secondary mb-4">{profil.lembagaDescription}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profil.lembagaItems.map((inst, index) => (
              <article
                key={`${inst.title}-${index}`}
                className="group overflow-hidden rounded-2xl border border-border-color bg-white shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
              >
                <div className="w-full h-40 relative overflow-hidden rounded-t-2xl">
                  <img
                    src={inst.image}
                    alt={inst.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-text-primary mb-1">{inst.title}</h4>
                  {inst.description && (
                    <p className="text-sm text-text-secondary">{inst.description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        {/* Demografi Penduduk */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary-blue mb-6">
            {profil.demografiTitle}
          </h2>
          {profil.demografiDescription && (
            <p className="text-text-secondary mb-8">{profil.demografiDescription}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {profil.demografiStats.map((stat, index) => (
              <div
                key={`${stat.label}-${index}`}
                className="p-4 bg-bg-light rounded-lg border border-border-color text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary-blue mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>

          {profil.demografiNote && (
            <div className="p-6 bg-yellow-50 rounded-lg border border-primary-yellow/30">
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-primary-yellow">Catatan:</span>{" "}
                {profil.demografiNote}
              </p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
