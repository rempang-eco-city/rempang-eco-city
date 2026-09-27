"use client";

import { useState } from "react";
import Link from "next/link";
import { Fish, MapPin, TreePine } from "lucide-react";
import type { PariwisataDestination } from "@/lib/sanity/queries";

const DESTINATION_TABS = {
  mancing: { label: "Mancing", Icon: Fish },
  mangrove: { label: "Mangrove", Icon: TreePine },
} as const;

export default function PariwisataContent({
  destinations,
}: {
  destinations: PariwisataDestination[];
}) {
  const [activeDestinationId, setActiveDestinationId] = useState(
    destinations[0]?.routeKey
  );
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const activeDestination =
    destinations.find((destination) => destination.routeKey === activeDestinationId) ??
    destinations[0];

  const switchDestination = (destinationId: PariwisataDestination["routeKey"]) => {
    setActiveDestinationId(destinationId);
    setActivePhotoIndex(0);
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

  return (
    <div className="bg-white pt-8 pb-16 md:pt-10 md:pb-24">
      <div className="container-content">
        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
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

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <img
                  src={activeDestination.gallery[activePhotoIndex]}
                  alt={activeDestination.name}
                  className="h-[320px] w-full object-cover md:h-[420px]"
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {activeDestination.gallery.map((image, index) => (
                  <button
                    key={`${activeDestination._id}-${index}`}
                    type="button"
                    onClick={() => setActivePhotoIndex(index)}
                    className={`overflow-hidden rounded-xl border transition ${
                      activePhotoIndex === index
                        ? "border-primary-blue ring-2 ring-primary-blue/20"
                        : "border-slate-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${activeDestination.name} ${index + 1}`}
                      className="h-20 w-full object-cover md:h-24"
                    />
                  </button>
                ))}
              </div>
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
                <div>
                  <p className="text-sm font-semibold text-text-primary">Fasilitas:</p>
                  <ul className="mt-2 space-y-1 text-sm text-text-secondary">
                    {activeDestination.facilities.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Tips kunjungan:</p>
                  <ul className="mt-2 space-y-1 text-sm text-text-secondary">
                    {activeDestination.tips.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href={activeDestination.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2bb673] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#239d63]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 fill-current"
                  >
                    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.55 0 .24 5.3.24 11.82c0 2.08.54 4.11 1.56 5.9L0 24l6.46-1.7a11.75 11.75 0 0 0 5.6 1.43h.01c6.5 0 11.82-5.3 11.82-11.82 0-3.16-1.23-6.12-3.47-8.43Zm-8.46 18.24h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.83 1 1.03-3.74-.24-.38a9.8 9.8 0 0 1-1.5-5.2c0-5.45 4.44-9.88 9.9-9.88 2.65 0 5.14 1.03 7 2.9a9.84 9.84 0 0 1 2.89 6.99c0 5.46-4.44 9.9-9.88 9.9Zm5.43-7.42c-.3-.15-1.77-.88-2.04-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.46-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.12 3.25 5.15 4.55.72.31 1.28.5 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.03-1.42.25-.7.25-1.31.18-1.43-.08-.12-.28-.2-.58-.35Z" />
                  </svg>
                  Hubungi Pengelola Wisata
                </Link>
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}
