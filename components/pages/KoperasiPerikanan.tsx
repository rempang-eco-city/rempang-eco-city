import { Quote, ShoppingBag } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import type { KoperasiDetail, KoperasiProdukIkan } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";
import { produkStatusTitle, type ProdukStatus, type ProdukUnit } from "@/lib/perikanan";

const STATUS_BADGE: Record<ProdukStatus, string> = {
  tersedia: "bg-[#2bb673] text-white",
  musiman: "bg-amber-400 text-amber-950",
  habis: "bg-slate-600 text-white",
};

const UNIT_SUFFIX: Record<ProdukUnit, string> = {
  kg: " / kg",
  ekor: " / ekor",
  paket: " / paket",
};

/**
 * "Hasil Perikanan": the cooperative's fish catalogue with sales figures and
 * buyer testimonials. Orders go to WhatsApp with the product name prefilled.
 * Renders nothing when the figures, products and testimonials are all empty.
 */
export default function KoperasiPerikanan({ koperasi }: { koperasi: KoperasiDetail }) {
  const {
    name,
    perikananDescription,
    perikananWhatsapp,
    perikananStats,
    perikananStatsNote,
    perikananProduk,
    perikananTestimoni,
  } = koperasi;

  if (perikananStats.length + perikananProduk.length + perikananTestimoni.length === 0) return null;

  return (
    <section className="bg-primary-blue/5 py-16 md:py-20">
      <div className="container-content">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-4xl font-bold text-primary-blue">Hasil Perikanan {name}</h2>
          {perikananDescription && (
            <p className="mx-auto mt-3 max-w-3xl text-base leading-relaxed text-text-secondary">
              {perikananDescription}
            </p>
          )}
        </div>

        {perikananStats.length > 0 && (
          <div className="mb-12">
            {/* Phones: three figures share one row; two or four go two per row. */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {perikananStats.map((stat, index) => (
                <div
                  key={`${stat.label}-${index}`}
                  className={`rounded-2xl border border-primary-blue/10 bg-white px-2 py-5 text-center shadow-[0_8px_20px_rgba(15,23,42,0.03)] md:w-48 md:px-4 ${
                    perikananStats.length === 3 ? "w-[calc((100%-1.5rem)/3)]" : "w-[calc((100%-0.75rem)/2)]"
                  }`}
                >
                  <div className="font-heading text-2xl font-bold text-primary-blue md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-text-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
            {perikananStatsNote && (
              <p className="mt-3 text-center text-xs text-text-secondary">{perikananStatsNote}</p>
            )}
          </div>
        )}

        {perikananProduk.length > 0 && (
          // Flex-wrap so a short list stays centered; widths mirror 2 / 3 / 4 columns (gap-5 = 1.25rem).
          <div className="flex flex-wrap justify-center gap-5">
            {perikananProduk.map((produk, index) => (
              <ProdukCard
                key={`${produk.name}-${index}`}
                produk={produk}
                koperasiName={name}
                whatsapp={perikananWhatsapp}
              />
            ))}
          </div>
        )}

        {perikananTestimoni.length > 0 && (
          <div className={perikananProduk.length > 0 || perikananStats.length > 0 ? "mt-16" : ""}>
            <h3 className="mb-6 text-center font-heading text-2xl font-bold text-text-primary">
              Kata Pembeli
            </h3>
            {/* Widths mirror 1 / 2 / 3 columns (gap-6 = 1.5rem). */}
            <div className="flex flex-wrap justify-center gap-6">
              {perikananTestimoni.map((testi, index) => (
                <figure
                  key={`${testi.name}-${index}`}
                  className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(15,23,42,0.03)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
                >
                  <Quote size={28} className="text-primary-yellow" aria-hidden="true" />
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-text-primary">
                    {testi.quote}
                  </blockquote>
                  {testi.purchase && (
                    <p className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full bg-primary-blue/10 px-3 py-1 text-xs font-semibold text-primary-blue">
                      <ShoppingBag size={14} aria-hidden="true" />
                      {testi.purchase}
                    </p>
                  )}
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                    {testi.photo ? (
                      <img
                        src={sanityImageUrl(testi.photo, 96)}
                        alt=""
                        loading="lazy"
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-blue text-sm font-bold text-white"
                        aria-hidden="true"
                      >
                        {initials(testi.name)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-text-primary">{testi.name}</p>
                      {testi.role && <p className="text-xs text-text-secondary">{testi.role}</p>}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ProdukCard({
  produk,
  koperasiName,
  whatsapp,
}: {
  produk: KoperasiProdukIkan;
  koperasiName: string;
  whatsapp?: string;
}) {
  const soldOut = produk.status === "habis";
  const orderHref = whatsapp
    ? `${whatsapp}?text=${encodeURIComponent(`Halo ${koperasiName}, saya ingin memesan ${produk.name}.`)}`
    : undefined;

  return (
    <article className="flex w-[calc((100%-1.25rem)/2)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.03)] md:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={sanityImageUrl(produk.image, 600)}
          alt={produk.name}
          loading="lazy"
          className={`h-full w-full object-cover ${soldOut ? "grayscale" : ""}`}
        />
        <span
          className={`absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow ${STATUS_BADGE[produk.status]}`}
        >
          {produkStatusTitle(produk.status)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3 md:p-4">
        <h3 className="font-heading font-bold leading-snug text-text-primary">{produk.name}</h3>
        {produk.price != null ? (
          <p className="mt-1 font-semibold text-primary-blue">
            Rp{produk.price.toLocaleString("id-ID")}
            <span className="text-sm font-normal text-text-secondary">{UNIT_SUFFIX[produk.unit]}</span>
          </p>
        ) : (
          <p className="mt-1 text-sm text-text-secondary">Tanya harga via WhatsApp</p>
        )}
        {produk.note && <p className="mt-1 text-xs text-text-secondary">{produk.note}</p>}

        {orderHref && (
          <div className="mt-auto pt-4">
            {soldOut ? (
              <span className="flex w-full items-center justify-center rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-text-secondary">
                Stok habis
              </span>
            ) : (
              <a
                href={orderHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2bb673] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#239d63]"
              >
                <WhatsAppIcon />
                Pesan
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}
