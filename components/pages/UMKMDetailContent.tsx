"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { UmkmItem } from "@/data/umkmCatalog";

type Props = {
  umkm: UmkmItem;
};

const categoryBadgeClass: Record<string, string> = {
  Kuliner: "bg-[#dcfce7] text-[#166534]",
  Kerajinan: "bg-[#f5d0fe] text-[#86198f]",
  Jasa: "bg-[#fed7aa] text-[#9a3412]",
  Fashion: "bg-[#fbcfe8] text-[#9d174d]",
  "Produk Lokal": "bg-[#d1fae5] text-[#065f46]",
};

export default function UMKMDetailContent({ umkm }: Props) {
  const [activeProduct, setActiveProduct] = useState(0);

  const images = useMemo(() => {
    const gallery = umkm.gallery?.length ? umkm.gallery : [];
    if (gallery.length > 0) return gallery;
    if (umkm.products?.length) return umkm.products.map((p) => p.image);
    return [umkm.image];
  }, [umkm]);

  const activeImage = images[activeProduct % images.length] ?? umkm.image;

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container-content">
        <div className="mb-8">
          <Link
            href="/umkm"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary-blue hover:text-primary-blue"
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar UMKM
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_8px_20px_rgba(15,23,42,0.03)] h-[360px] md:h-[460px]">
              <Image src={activeImage} alt={umkm.name} fill className="object-cover" />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href={umkm.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2bb673] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#239d63]"
              >
                Hubungi via WhatsApp
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(15,23,42,0.03)] md:p-8">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                categoryBadgeClass[umkm.category] ?? "bg-slate-200 text-slate-700"
              }`}
            >
              {umkm.category}
            </span>

            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-primary-blue md:text-4xl">
              {umkm.name}
            </h1>

            <p className="mt-2 text-sm text-text-secondary">
              {umkm.owner} • {umkm.location}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base">
              {umkm.description}
            </p>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-text-primary">Produk yang dijual:</p>
              <div className="mt-3 space-y-2">
                {umkm.products.map((product, idx) => (
                  <button
                    key={`${umkm.slug}-${product.name}-${idx}`}
                    type="button"
                    onClick={() => setActiveProduct(idx)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
                      activeProduct === idx
                        ? "border-primary-blue bg-primary-blue/5"
                        : "border-slate-300 bg-white hover:border-primary-blue"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="relative h-6 w-6 overflow-hidden rounded">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </span>
                      <span className="font-medium text-slate-700">{product.name}</span>
                    </span>
                    <span className="text-slate-500">{product.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
              Pilih produk untuk mengganti foto utama.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}