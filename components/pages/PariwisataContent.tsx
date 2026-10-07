"use client";

import { useState, type ReactNode } from "react";
import { Play } from "lucide-react";
import type {
  PariwisataDestination,
  PariwisataMedia,
  PariwisataPaket,
} from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";

// Fallback tab text per routeKey when a destination has no tabLabel in the CMS.
const DEFAULT_TAB_LABELS: Record<PariwisataDestination["routeKey"], string> = {
  mancing: "Mancing",
  mangrove: "Mangrove",
  pulau: "Pulau",
};

const formatRupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

const UNIT_SUFFIX: Record<PariwisataPaket["items"][number]["unit"], string> = {
  orang: " / orang",
  jam: " / jam",
  paket: "",
};

export default function PariwisataContent({
  destinations,
  eyebrow,
}: {
  destinations: PariwisataDestination[];
  /** Small label above the "Wisata" heading, e.g. "Destinasi Pokdarwis Lemak Manis". */
  eyebrow: string;
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
      <div className="bg-white pt-14 pb-16 md:pb-24">
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
    <div className="bg-white pt-14 pb-16 md:pb-24">
      <div className="container-content">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0e8c8c]">
              {eyebrow}
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-primary-blue">Wisata</h2>
          </div>

          {/* Tabs only make sense when there is more than one destination. */}
          {destinations.length > 1 && (
            <div className="-mx-1 overflow-x-auto px-1">
              <div
                role="tablist"
                aria-label="Pilih destinasi"
                className="inline-flex gap-1 rounded-full border border-slate-200 bg-slate-50 p-1"
              >
                {destinations.map((dest) => {
                  const isActive = activeDestination._id === dest._id;
                  return (
                    <button
                      key={dest._id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => switchDestination(dest.routeKey)}
                      className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${
                        isActive
                          ? "bg-primary-blue text-white shadow-sm"
                          : "text-slate-600 hover:text-primary-blue"
                      }`}
                    >
                      {dest.tabLabel || DEFAULT_TAB_LABELS[dest.routeKey] || dest.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 lg:aspect-[9/10]">
              {activeMedia && <MainMedia media={activeMedia} alt={activeDestination.name} />}
            </div>

            {activeDestination.gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {activeDestination.gallery.map((media, index) => (
                  <button
                    key={`${activeDestination._id}-${index}`}
                    type="button"
                    onClick={() => setActiveMediaIndex(index)}
                    aria-label={`${media.type === "video" ? "Video" : "Foto"} ${index + 1}`}
                    className={`relative aspect-[5/4] overflow-hidden rounded-lg border-2 transition ${
                      activeMediaIndex === index
                        ? "border-primary-blue"
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <MediaThumbnail media={media} alt={`${activeDestination.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-heading text-3xl font-bold leading-tight text-text-primary">
              {activeDestination.name}
            </h3>
            <span className="mt-4 inline-flex rounded-full bg-primary-blue/10 px-3 py-1 text-xs font-semibold text-primary-blue">
              {activeDestination.location}
            </span>

            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              {activeDestination.description}
            </p>

            <div className="mt-5 space-y-4">
              {activeDestination.bestTime && (
                <InfoCard title="Waktu terbaik kunjungan">
                  <p className="text-sm text-text-secondary">{activeDestination.bestTime}</p>
                </InfoCard>
              )}
              {activeDestination.facilities.length > 0 && (
                <InfoCard title="Fasilitas">
                  <BulletList items={activeDestination.facilities} />
                </InfoCard>
              )}
              {activeDestination.tips.length > 0 && (
                <InfoCard title="Tips kunjungan">
                  <BulletList items={activeDestination.tips} />
                </InfoCard>
              )}
            </div>

            <a
              href={activeDestination.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#16a34a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#15803d]"
            >
              Hubungi Pengelola Wisata
            </a>
          </div>
        </div>

        {activeDestination.packages.length > 0 && (
          <div className="mt-14">
            <h3 className="font-heading text-2xl font-bold text-primary-blue">Paket & Harga</h3>
            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
              {activeDestination.packages.map((paket, index) => (
                <PaketCard key={`${paket.label}-${index}`} paket={paket} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-semibold text-text-primary">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-sm text-text-secondary marker:text-slate-400">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
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
        className="h-full w-full bg-black object-contain"
      />
    );
  }

  return (
    <img
      src={sanityImageUrl(media.url, 1200)}
      alt={alt}
      className="h-full w-full object-cover"
    />
  );
}

function MediaThumbnail({ media, alt }: { media: PariwisataMedia; alt: string }) {
  if (media.type === "video") {
    return (
      <span className="relative block h-full w-full bg-slate-800">
        {/* "#t=0.1" asks the browser to paint an early frame as the preview. */}
        <video
          src={`${media.url}#t=0.1`}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="pointer-events-none h-full w-full object-cover opacity-60"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900">
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
      className="h-full w-full object-cover"
    />
  );
}

function PaketCard({ paket }: { paket: PariwisataPaket }) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
      <span className="inline-flex w-fit rounded-full bg-primary-blue/10 px-3 py-1 text-xs font-semibold text-primary-blue">
        {paket.label}
      </span>
      <h4 className="mt-3 font-heading text-xl font-semibold text-text-primary">{paket.title}</h4>

      <ul className="mt-4">
        {paket.items.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            className="flex items-start justify-between gap-4 border-b border-slate-200 py-3"
          >
            <div className="min-w-0">
              <p className="text-sm text-text-primary">{item.name}</p>
              {item.note && <p className="mt-0.5 text-xs text-text-secondary">{item.note}</p>}
            </div>
            <p className="shrink-0 text-right text-sm text-text-secondary">
              {formatRupiah(item.price)}
              {UNIT_SUFFIX[item.unit] ?? ""}
            </p>
          </li>
        ))}
      </ul>

      {/* mt-auto keeps the total bar at the bottom when cards in a row differ in length. */}
      <div className="mt-auto pt-8">
        <div className="flex items-center justify-between gap-4 rounded-xl bg-primary-blue px-5 py-4 text-white">
          <p className="text-sm">Total Akomodasi</p>
          <p className="font-heading text-2xl font-bold text-primary-yellow">
            {formatRupiah(paket.total)}
          </p>
        </div>
      </div>
    </article>
  );
}
