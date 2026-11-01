"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Download } from "lucide-react";
import FasilitasMarquee from "@/components/FasilitasMarquee";
import type { ProfilModulItem, ProfilPage } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";
import { modulSektorTitle, type ModulSektor } from "@/lib/modul";

const SEKTOR_BADGE: Record<ModulSektor, string> = {
  perikanan: "bg-sky-600",
  pariwisata: "bg-emerald-600",
  umkm: "bg-amber-500",
};

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

            {/* Flex-wrap so an incomplete last row is centered; widths mirror
                1 / 2 / 3 columns with the 1.25rem (gap-5) gutter. */}
            <div className="mt-10 flex flex-wrap justify-center gap-5">
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

function ModulCard({ modul }: { modul: ProfilModulItem }) {
  const meta = [modul.penyusun, modul.tahun].filter(Boolean).join(" · ");

  return (
    // Phones: cover thumbnail beside the text, so three modules don't make a
    // very long scroll. Larger screens: cover on top, like the Laporan cards.
    <article className="group flex w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] sm:w-[calc((100%-1.25rem)/2)] sm:flex-col md:w-[calc((100%-2.5rem)/3)]">
      <a
        href={modul.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-[1/1.414] w-28 shrink-0 self-start overflow-hidden bg-slate-100 sm:w-auto"
        aria-label={`Baca ${modul.title}`}
      >
        <img
          src={sanityImageUrl(modul.cover, 600)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white shadow sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs ${SEKTOR_BADGE[modul.sektor]}`}
        >
          {modulSektorTitle(modul.sektor)}
        </span>
      </a>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <h3 className="font-semibold leading-snug text-text-primary">{modul.title}</h3>
        {meta && <p className="mt-1 text-xs text-text-secondary">{meta}</p>}
        {modul.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-secondary sm:line-clamp-none">
            {modul.description}
          </p>
        )}

        <div className="mt-auto flex gap-2 pt-4">
          <a
            href={modul.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-blue px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <BookOpen size={16} />
            Baca
          </a>
          {/* Sanity's ?dl= serves the file as a download under its original name. */}
          <a
            href={`${modul.fileUrl}?dl=`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-color px-3 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-primary-blue hover:text-primary-blue"
          >
            <Download size={16} />
            Unduh
          </a>
        </div>
        <p className="mt-2 text-center text-xs text-text-secondary">PDF · {formatFileSize(modul.fileSize)}</p>
      </div>
    </article>
  );
}

function formatFileSize(bytes: number) {
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toLocaleString("id-ID", { maximumFractionDigits: 1 })} MB` : `${Math.ceil(bytes / 1024)} KB`;
}
