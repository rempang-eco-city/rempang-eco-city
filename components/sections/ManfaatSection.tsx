"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Fish, Handshake, Map as MapIcon, Newspaper, Store, type LucideIcon } from "lucide-react";
import type { BerandaPage } from "@/lib/sanity/queries";
import { manfaatBidangTitle, type ManfaatBidang } from "@/lib/manfaat";
import { FEATURES } from "@/lib/features";

const BIDANG_STYLE: Record<ManfaatBidang, { icon: LucideIcon; href: string; linkLabel: string }> = {
  koperasi: { icon: Handshake, href: "/koperasi", linkLabel: "Lihat Koperasi" },
  perikanan: { icon: Fish, href: "/koperasi/transmigrasi", linkLabel: "Lihat Hasil Perikanan" },
  umkm: { icon: Store, href: "/umkm", linkLabel: "Lihat UMKM" },
  pariwisata: { icon: MapIcon, href: "/pariwisata", linkLabel: "Lihat Pariwisata" },
  berita: { icon: Newspaper, href: "/berita", linkLabel: "Lihat Berita" },
};

/** Why the site exists: the purpose on the left, one card per area it helps on the right. */
export default function ManfaatSection({
  title,
  description,
  items,
}: {
  title?: string;
  description?: string;
  items: BerandaPage["manfaatItems"];
}) {
  if (items.length === 0) return null;

  const paragraphs = (description ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container-content grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <span className="inline-flex rounded-full bg-primary-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-dark">
            Manfaat Website
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-primary-blue md:text-4xl">
            {title || "Mengapa Website Ini Penting?"}
          </h2>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mt-4 whitespace-pre-line leading-relaxed text-text-secondary">
              {paragraph}
            </p>
          ))}
        </motion.div>

        <div className="space-y-4">
          {items.map((item, index) => {
            const style = BIDANG_STYLE[item.bidang];
            const Icon = style.icon;
            const showLink = item.bidang !== "pariwisata" || FEATURES.pariwisata;
            return (
              <motion.article
                key={`${item.bidang}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.03)] md:gap-5 md:p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-blue/10 text-primary-blue">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-bold text-text-primary">
                    {manfaatBidangTitle(item.bidang)}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">{item.description}</p>
                  {showLink && (
                    <Link
                      href={style.href}
                      className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-blue hover:text-primary-dark"
                    >
                      {style.linkLabel}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
