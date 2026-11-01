"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import FasilitasMarquee from "@/components/FasilitasMarquee";
import type { ProfilModulItem, ProfilPage } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";
import { modulSektorTitle } from "@/lib/modul";

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

          {/* Same card style as the Pengurus cards on /koperasi/[routeKey]. This
              container is narrower, so the photo uses a fixed 4:5 ratio instead
              of h-72 to keep the same portrait shape.
              Flex-wrap (not grid) so an incomplete last row is centered; card
              widths mirror 1 / 2 / 4 columns with the 1.25rem (gap-5) gutter. */}
          <div className="mt-10 flex flex-wrap justify-center gap-5">
            {profil.lembagaItems.map((inst, index) => (
              <article
                key={`${inst.title}-${index}`}
                className="group w-full max-w-xs overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] sm:w-[calc((100%-1.25rem)/2)] sm:max-w-none lg:w-[calc((100%-3.75rem)/4)]"
              >
                <div className="overflow-hidden bg-[#39b7c9]">
                  <img
                    src={inst.image}
                    alt={inst.title}
                    className="aspect-[4/5] w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold text-primary-blue">
                    {inst.title}
                  </h3>
                  {inst.description && (
                    <p className="mt-1 text-sm text-text-secondary">
                      {inst.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Fasilitas: the marquee runs full-width, so it sits outside the narrow
          max-w-3xl container; only its heading lines up with the other sections. */}
      {profil.fasilitasItems.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="container-content max-w-3xl">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary-blue mb-6">
              {profil.fasilitasTitle || "Fasilitas"}
            </h2>
            {profil.fasilitasDescription && (
              <p className="text-text-secondary mb-4">{profil.fasilitasDescription}</p>
            )}
          </div>

          <div className="mt-10">
            <FasilitasMarquee items={profil.fasilitasItems} />
          </div>

          <div className="container-content max-w-3xl">
            <div className="mt-16 border-b border-border-color" />
          </div>
        </motion.section>
      )}

      <div className="container-content max-w-3xl">
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

        {/* Modul */}
        {profil.modulItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-16 pt-16 border-t border-border-color"
          >
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary-blue mb-6">
              {profil.modulTitle || "Modul"}
            </h2>
            {profil.modulDescription && (
              <p className="text-text-secondary mb-4">{profil.modulDescription}</p>
            )}

            {/* Three posters fill the row; flex-wrap centers an incomplete last row. */}
            <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-8 sm:gap-x-8">
              {profil.modulItems.map((modul, index) => (
                <ModulCard key={`${modul.title}-${index}`} modul={modul} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

/**
 * Poster-only card, like a magazine rack: on hover the cover lifts, page edges
 * show on the right, and a band with the title appears. Touch screens can't
 * hover, so there the title sits below the poster instead.
 */
function ModulCard({ modul }: { modul: ProfilModulItem }) {
  return (
    <div className="group w-[calc((100%-1.5rem)/2)] sm:w-[calc((100%-4rem)/3)]">
      <div className="relative">
        {/* Page edges behind the cover */}
        <span className="absolute inset-y-1.5 left-0 right-0 rounded-r-sm border border-slate-200 bg-white transition-transform duration-300 group-hover:translate-x-2.5 group-focus-within:translate-x-2.5" />
        <span className="absolute inset-y-1 left-0 right-0 rounded-r-sm border border-slate-200 bg-slate-50 transition-transform duration-300 group-hover:translate-x-1.5 group-focus-within:translate-x-1.5" />

        <div className="relative aspect-[1/1.414] overflow-hidden rounded-sm bg-slate-100 shadow-[0_10px_24px_rgba(15,23,42,0.22)] transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1.5 group-hover:shadow-[0_18px_36px_rgba(15,23,42,0.3)] group-focus-within:-translate-x-1 group-focus-within:-translate-y-1.5">
          <img
            src={sanityImageUrl(modul.cover, 500)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <a
            href={modul.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 focus:outline-none"
            aria-label={`Baca ${modul.title} (PDF)`}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-white/85 px-3 py-3 text-center opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:hidden">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-blue">
              {modulSektorTitle(modul.sektor)}
              {modul.tahun && ` · ${modul.tahun}`}
            </p>
            <h3 className="mt-0.5 line-clamp-3 text-sm font-semibold leading-snug text-text-primary">
              {modul.title}
            </h3>
            {/* Sanity's ?dl= serves the file as a download under its original name. */}
            <a
              href={`${modul.fileUrl}?dl=`}
              className="pointer-events-auto relative mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-primary-blue"
            >
              <Download size={13} />
              Unduh PDF · {formatFileSize(modul.fileSize)}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-3 hidden text-center [@media(hover:none)]:block">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-blue">
          {modulSektorTitle(modul.sektor)}
        </p>
        <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-text-primary">
          {modul.title}
        </p>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number) {
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toLocaleString("id-ID", { maximumFractionDigits: 1 })} MB` : `${Math.ceil(bytes / 1024)} KB`;
}
