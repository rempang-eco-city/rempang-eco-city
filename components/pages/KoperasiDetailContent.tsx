"use client";

import { useState } from "react";
import {
  CircleCheck,
  ExternalLink,
  File,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Handshake,
  Megaphone,
  MessagesSquare,
  PiggyBank,
  Sparkles,
  Sprout,
  Store,
  Truck,
  Wallet,
  Wrench,
  Fish,
  type LucideIcon,
} from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import type { KoperasiDetail } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";
import type { LayananIconKey } from "@/lib/layananIcons";

const LAYANAN_ICONS: Record<LayananIconKey, LucideIcon> = {
  "simpan-pinjam": Wallet,
  tabungan: PiggyBank,
  toko: Store,
  pertanian: Sprout,
  perikanan: Fish,
  distribusi: Truck,
  pelatihan: GraduationCap,
  pendampingan: Handshake,
  pemasaran: Megaphone,
  konsultasi: MessagesSquare,
  jasa: Wrench,
  lainnya: Sparkles,
};

type ReportFileType = {
  label: string;
  Icon: LucideIcon;
  iconClassName: string;
  /** Office files open in Microsoft's viewer; PDFs open directly. */
  viaOfficeViewer: boolean;
};

const REPORT_FILE_TYPES: Record<string, ReportFileType> = {
  pdf: { label: "PDF", Icon: FileText, iconClassName: "text-[#d93025]", viaOfficeViewer: false },
  xlsx: { label: "Excel", Icon: FileSpreadsheet, iconClassName: "text-[#1d6f42]", viaOfficeViewer: true },
  xls: { label: "Excel", Icon: FileSpreadsheet, iconClassName: "text-[#1d6f42]", viaOfficeViewer: true },
  docx: { label: "Word", Icon: FileText, iconClassName: "text-[#2b579a]", viaOfficeViewer: true },
  doc: { label: "Word", Icon: FileText, iconClassName: "text-[#2b579a]", viaOfficeViewer: true },
};

const FALLBACK_FILE_TYPE: ReportFileType = {
  label: "Dokumen",
  Icon: File,
  iconClassName: "text-text-secondary",
  viaOfficeViewer: false,
};

// Browsers download Excel/Word files instead of showing them, so those open in
// Microsoft's free view-only Office viewer (needs a public URL; Sanity's CDN is).
// PDFs are served inline by Sanity, so the browser's own PDF viewer handles them.
function reportHref(fileUrl: string, type: ReportFileType) {
  return type.viaOfficeViewer
    ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`
    : fileUrl;
}

export default function KoperasiDetailContent({
  koperasi,
}: {
  koperasi: KoperasiDetail;
}) {
  const { name, galleryItems, pengurus, fasilitas, layanan, laporanKeuangan } = koperasi;

  return (
    <>
      <section className="bg-white py-16 md:py-20">
        <div className="container-content">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={koperasi.heroImage}
                alt={name}
                className="h-full min-h-[320px] w-full object-cover"
              />
            </div>

            <div className="space-y-5">
              <h2 className="font-heading text-3xl font-bold text-primary-blue">
                Tentang {name}
              </h2>
              {koperasi.about.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-relaxed text-text-secondary"
                >
                  {paragraph}
                </p>
              ))}

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-text-secondary">Tahun Berdiri</p>
                  <p className="mt-2 text-xl font-bold text-text-primary">
                    {koperasi.yearFounded}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-text-secondary">Anggota</p>
                  <p className="mt-2 text-xl font-bold text-text-primary">
                    {koperasi.memberCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 md:py-12">
        <div className="container-content">
          <h2 className="font-heading text-4xl font-bold text-primary-blue text-center mb-8">
            Struktur Kepengurusan {name}
          </h2>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
            <img
              src={koperasi.structureImage}
              alt={`Struktur kepengurusan ${name}`}
              className="mx-auto w-full max-w-6xl object-contain"
            />
          </div>

          {pengurus.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {pengurus.map((person, index) => (
                <article
                  key={`${person.name}-${index}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
                >
                  <div className="overflow-hidden bg-[#39b7c9]">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="h-72 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-semibold text-primary-blue">
                      {person.name}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {person.role}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {koperasi.membershipWhatsapp && (
        <section className="bg-white py-12 md:py-16">
          <div className="container-content">
            <div className="rounded-3xl border border-primary-blue/15 bg-primary-blue/5 px-6 py-10 text-center md:px-12">
              <h2 className="font-heading text-3xl font-bold text-primary-blue md:text-4xl">
                Keanggotaan {name}
              </h2>
              {koperasi.membershipDescription && (
                <p className="mx-auto mt-4 max-w-3xl whitespace-pre-line text-base leading-relaxed text-text-secondary">
                  {koperasi.membershipDescription}
                </p>
              )}

              <p className="mt-8 text-lg font-semibold text-text-primary">
                Tertarik menjadi anggota?
              </p>
              <a
                href={koperasi.membershipWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2bb673] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#239d63]"
              >
                <WhatsAppIcon />
                Hubungi via WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}

      {fasilitas.length > 0 && (
        <section className="bg-slate-50 py-16 md:py-20">
          <div className="container-content">
            <div className="mb-8 text-center">
              <h2 className="font-heading text-4xl font-bold text-primary-blue">
                Fasilitas {name}
              </h2>
              <p className="mt-3 text-base text-text-secondary">
                Sarana yang tersedia untuk mendukung kegiatan koperasi dan anggota.
              </p>
            </div>

            {/* Flex-wrap so a short list stays centered; widths mirror 1 / 2 / 3 columns (gap-6 = 1.5rem). */}
            <div className="flex flex-wrap justify-center gap-6">
              {fasilitas.map((item, index) => (
                <article
                  key={`${item.name}-${index}`}
                  className="group w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={sanityImageUrl(item.image, 800)}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-bold text-text-primary">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {layanan.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="container-content">
            <div className="mb-8 text-center">
              <h2 className="font-heading text-4xl font-bold text-primary-blue">
                Layanan {name}
              </h2>
              <p className="mt-3 text-base text-text-secondary">
                Layanan yang dapat dimanfaatkan oleh anggota dan masyarakat.
              </p>
            </div>

            {/* Flex-wrap so a short list stays centered; widths mirror 1 / 2 / 3 columns (gap-6 = 1.5rem). */}
            <div className="flex flex-wrap justify-center gap-6">
              {layanan.map((item, index) => {
                const Icon = LAYANAN_ICONS[item.icon] ?? Sparkles;

                return (
                  <article
                    key={`${item.title}-${index}`}
                    className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all hover:-translate-y-1 hover:border-primary-blue/30 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-blue/10 text-primary-blue">
                      <Icon size={24} />
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-bold text-text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {item.description}
                    </p>
                    {item.highlights.length > 0 && (
                      <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                        {item.highlights.map((point, pointIndex) => (
                          <li
                            key={`${point}-${pointIndex}`}
                            className="flex items-start gap-2 text-sm text-text-primary"
                          >
                            <CircleCheck
                              size={16}
                              className="mt-0.5 flex-shrink-0 text-[#2bb673]"
                            />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {galleryItems.length > 0 && (
        <KoperasiGallery name={name} galleryItems={galleryItems} />
      )}

      {laporanKeuangan.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="container-content">
            <div className="mb-8 text-center">
              <h2 className="font-heading text-4xl font-bold text-primary-blue">
                Laporan Keuangan {name}
              </h2>
              <p className="mt-3 text-base text-text-secondary">
                Klik laporan untuk melihat detailnya di tab baru.
              </p>
            </div>

            {/* Flex-wrap so a short list stays centered; widths mirror 2 / 3 / 4 columns (gap-5 = 1.25rem). */}
            <div className="flex flex-wrap justify-center gap-5">
              {laporanKeuangan.map((laporan, index) => {
                const fileType =
                  REPORT_FILE_TYPES[laporan.fileExtension] ?? FALLBACK_FILE_TYPE;
                const { Icon } = fileType;

                return (
                  <a
                    key={`${laporan.title}-${index}`}
                    href={reportHref(laporan.fileUrl, fileType)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-[calc((100%-1.25rem)/2)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] md:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)]"
                  >
                    {/* A-series paper ratio (1 : √2) for poster-style covers */}
                    <div className="relative aspect-[1/1.414] overflow-hidden bg-slate-100">
                      <img
                        src={sanityImageUrl(laporan.cover, 600)}
                        alt={laporan.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-3 p-4">
                      <div className="flex min-w-0 items-start gap-2">
                        <Icon size={18} className={`mt-0.5 flex-shrink-0 ${fileType.iconClassName}`} />
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold leading-snug text-text-primary md:text-base">
                            {laporan.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-text-secondary">{fileType.label}</p>
                        </div>
                      </div>
                      <ExternalLink
                        size={16}
                        className="mt-0.5 flex-shrink-0 text-text-secondary transition-colors group-hover:text-primary-blue"
                      />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function KoperasiGallery({
  name,
  galleryItems,
}: {
  name: string;
  galleryItems: KoperasiDetail["galleryItems"];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const activeItem = galleryItems[activeIndex];
  const activeImage = activeItem.images[photoIndex];

  const goTo = (index: number) => {
    setActiveIndex(index);
    setPhotoIndex(0);
  };

  const goToPhoto = (offset: number) => {
    setPhotoIndex(
      (prev) =>
        (prev + offset + activeItem.images.length) % activeItem.images.length
    );
  };

  return (
    <section className="bg-slate-50 py-16 md:py-20">
      <div className="container-content">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-4xl font-bold text-primary-blue">
            Galeri {name}
          </h2>
          <p className="mt-3 text-base text-text-secondary">
            Kegiatan dan aktivitas yang mendukung pengembangan ekonomi dan
            kesejahteraan warga.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.65fr_0.9fr]">
          <div className="relative h-[420px] overflow-hidden rounded-3xl md:h-[500px]">
            <img
              src={activeImage}
              alt={activeItem.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/75 via-slate-900/30 to-transparent p-6 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-200">
                Kegiatan
              </p>
              <h3 className="mt-2 text-2xl font-bold">{activeItem.title}</h3>
              <p className="mt-2 max-w-xl text-sm text-slate-200">
                {activeItem.description}
              </p>
            </div>

            {activeItem.images.length > 1 && (
              <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-800 shadow-md backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => goToPhoto(-1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-slate-200"
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <span>
                  {photoIndex + 1}/{activeItem.images.length}
                </span>
                <button
                  type="button"
                  onClick={() => goToPhoto(1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-slate-200"
                  aria-label="Next photo"
                >
                  ›
                </button>
              </div>
            )}
          </div>

          <div className="max-h-[520px] overflow-y-auto pr-1">
            <div className="space-y-3">
              {galleryItems.map((item, index) => (
                <button
                  key={`${item.title}-${index}`}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-2 text-left transition-all ${
                    activeIndex === index
                      ? "border-primary-blue bg-primary-blue/5 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {item.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-text-secondary">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
