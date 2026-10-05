"use client";

import { useState } from "react";
import Link from "next/link";
import { Fish, MapPin, Play, TreePine } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import type {
  PariwisataDestination,
  PariwisataMedia,
  PariwisataPaket,
} from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";

const DESTINATION_TABS = {
  mancing: { label: "Mancing", Icon: Fish },
  mangrove: { label: "Mangrove", Icon: TreePine },
} as const;

const formatRupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

const UNIT_SUFFIX: Record<PariwisataPaket["items"][number]["unit"], string> = {
  orang: " / orang",
  jam: " / jam",
  paket: "",
};

export default function PariwisataContent({
  destinations,
}: {
  destinations: PariwisataDestination[];
}) {
  const [activeDestinationId, setActiveDestinationId] = useState(
    destinations[0]?.routeKey
  );
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const activeDestination =
    destinations.find((destination) => destination.routeKey === activeDestinationId) ??
    destinations[0];

  const switchDestination = (destinationId: PariwisataDestination["routeKey"]) => {
    setActiveDestinationId(destinationId);
    setActiveMediaIndex(0);
  };

  if (!activeDestination) {
    return (
      <div className="bg-white pt-8 pb-16 md:pt-10 md:pb-24">
        <div className="container-content">
          <p className="text-center text-text-secondary">
            Belum ada destinasi wisata yang tersedia.
          </p>
        </div>
      </div>
    );
  }

  const activeMedia = activeDestination.gallery[activeMediaIndex];

  return (
    <div className="bg-white pt-8 pb-16 md:pt-10 md:pb-24">
      <div className="container-content">
        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
          {/* Tabs only make sense when there is more than one destination. */}
          {destinations.length > 1 && (
            <div className="mb-6 flex flex-wrap gap-3">
              {destinations.map((dest) => {
                const tab = DESTINATION_TABS[dest.routeKey];
                const Icon = tab?.Icon ?? MapPin;
                return (
                  <button
                    key={dest._id}
                    type="button"
                    onClick={() => switchDestination(dest.routeKey)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeDestination._id === dest._id
                        ? "bg-primary-blue text-white"
                        : "border border-slate-300 bg-white text-slate-700 hover:border-primary-blue hover:text-primary-blue"
                    }`}
                  >
                    <Icon size={15} />
                    {tab?.label ?? dest.name}
                  </button>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {activeMedia && (
                  <MainMedia media={activeMedia} alt={activeDestination.name} />
                )}
              </div>

              {activeDestination.gallery.length > 1 && (
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {activeDestination.gallery.map((media, index) => (
                    <button
                      key={`${activeDestination._id}-${index}`}
                      type="button"
                      onClick={() => setActiveMediaIndex(index)}
                      aria-label={`${media.type === "video" ? "Video" : "Foto"} ${index + 1}`}
                      className={`relative overflow-hidden rounded-xl border transition ${
                        activeMediaIndex === index
                          ? "border-primary-blue ring-2 ring-primary-blue/20"
                          : "border-slate-200"
                      }`}
                    >
                      <MediaThumbnail media={media} alt={`${activeDestination.name} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-heading text-3xl font-bold text-primary-blue">{activeDestination.name}</h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
                <MapPin size={16} className="text-primary-blue" />
                {activeDestination.location}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base">
                {activeDestination.description}
              </p>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-text-primary">Waktu terbaik kunjungan:</p>
                <p className="mt-1 text-sm text-text-secondary">{activeDestination.bestTime}</p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {activeDestination.facilities.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Fasilitas:</p>
                    <ul className="mt-2 space-y-1 text-sm text-text-secondary">
                      {activeDestination.facilities.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeDestination.tips.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Tips kunjungan:</p>
                    <ul className="mt-2 space-y-1 text-sm text-text-secondary">
                      {activeDestination.tips.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Link
                  href={activeDestination.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2bb673] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#239d63]"
                >
                  <WhatsAppIcon />
                  Hubungi Pengelola Wisata
                </Link>
              </div>
            </div>
          </div>

          {activeDestination.packages.length > 0 && (
            <div className="mt-10">
              <h3 className="font-heading text-2xl font-bold text-primary-blue">Paket & Harga</h3>
              <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
                {activeDestination.packages.map((paket, index) => (
                  <PaketCard key={`${paket.label}-${index}`} paket={paket} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function MainMedia({ media, alt }: { media: PariwisataMedia; alt: string }) {
  if (media.type === "video") {
    return (
      <video
        // Remount on change so the new source loads instead of the old one continuing.
        key={media.url}
        src={media.url}
        controls
        playsInline
        preload="metadata"
        className="h-[320px] w-full bg-black object-contain md:h-[420px]"
      />
    );
  }

  return (
    <img
      src={sanityImageUrl(media.url, 1200)}
      alt={alt}
      className="h-[320px] w-full object-cover md:h-[420px]"
    />
  );
}

function MediaThumbnail({ media, alt }: { media: PariwisataMedia; alt: string }) {
  if (media.type === "video") {
    return (
      <span className="relative block h-20 w-full bg-slate-800 md:h-24">
        {/* "#t=0.1" asks the browser to paint an early frame as the preview. */}
        <video
          src={`${media.url}#t=0.1`}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="pointer-events-none h-full w-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-900">
            <Play size={14} className="ml-0.5 fill-current" />
          </span>
        </span>
      </span>
    );
  }

  return (
    <img
      src={sanityImageUrl(media.url, 320)}
      alt={alt}
      loading="lazy"
      className="h-20 w-full object-cover md:h-24"
    />
  );
}

function PaketCard({ paket }: { paket: PariwisataPaket }) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
      <span className="inline-flex w-fit rounded-full bg-primary-blue/10 px-3 py-1 text-xs font-semibold text-primary-blue">
        {paket.label}
      </span>
      <h4 className="mt-3 font-heading text-lg font-bold text-text-primary">{paket.title}</h4>

      <ul className="mt-4 flex-1 divide-y divide-slate-100">
        {paket.items.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex items-start justify-between gap-4 py-2.5">
            <div className="min-w-0">
              <p className="text-sm text-text-primary">{item.name}</p>
              {item.note && <p className="mt-0.5 text-xs text-text-secondary">{item.note}</p>}
            </div>
            <p className="shrink-0 text-right text-sm font-medium text-text-primary">
              {formatRupiah(item.price)}
              <span className="font-normal text-text-secondary">{UNIT_SUFFIX[item.unit] ?? ""}</span>
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-primary-blue/5 px-4 py-3">
        <p className="text-sm font-semibold text-text-primary">Total Akomodasi</p>
        <p className="font-heading text-xl font-bold text-primary-blue">{formatRupiah(paket.total)}</p>
      </div>
    </article>
  );
}
