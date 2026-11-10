import { ArrowRight, Fish, Quote, ShoppingBag } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import type { KoperasiDetail, KoperasiProdukIkan } from "@/lib/sanity/queries";
import { sanityImageUrl } from "@/lib/sanity/image";
import { formatHarga, produkStatusTitle, type ProdukStatus, type ProdukUnit } from "@/lib/perikanan";

const STATUS_BADGE: Record<ProdukStatus, string> = {
  tersedia: "bg-[#2bb673] text-white",
  musiman: "bg-amber-400 text-amber-950",
  habis: "bg-slate-600 text-white",
};

const UNIT_SUFFIX: Record<ProdukUnit, string> = {
  kg: "/kg",
  ekor: "/ekor",
  paket: "/paket",
};

/**
 * "Hasil Perikanan": the cooperative's fish price list with sales figures and
 * buyer testimonials. Local fish get a price table (REC price and, when a
 * markup is set, the price for buyers outside REC); export fish get their own
 * list. All orders go to one WhatsApp number, so the catalogue
 * ends with a single order panel instead of a button on every product.
 * Renders nothing when the figures, products and testimonials are all empty.
 */
export default function KoperasiPerikanan({ koperasi }: { koperasi: KoperasiDetail }) {
  const {
    name,
    perikananDescription,
    perikananWhatsapp,
    perikananStats,
    perikananProduk,
    perikananTestimoni,
    perikananSelisihHarga,
  } = koperasi;

  const lokal = perikananProduk.filter((produk) => produk.kategori === "lokal");
  const ekspor = perikananProduk.filter((produk) => produk.kategori === "ekspor");

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
          </div>
        )}

        {lokal.length > 0 && (
          <HargaTable title="Ikan Lokal" produk={lokal} selisih={perikananSelisihHarga} />
        )}

        {ekspor.length > 0 && <EksporList produk={ekspor} hasLokal={lokal.length > 0} />}

        {perikananProduk.length > 0 && perikananWhatsapp && (
          <OrderPanel koperasi={koperasi} whatsapp={perikananWhatsapp} />
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

/** Price table; on phones each row stacks the prices under their labels on the right. */
function HargaTable({ title, produk, selisih }: { title: string; produk: KoperasiProdukIkan[]; selisih?: number }) {
  const showLuar = selisih != null;

  return (
    <div>
      <h3 className="mb-4 font-heading text-2xl font-bold text-text-primary">{title}</h3>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
        <div className="hidden bg-primary-blue px-5 py-3 text-sm font-semibold text-white md:flex">
          <span className="flex-1">Nama Ikan</span>
          <span className="w-48 text-right">Harga Lokal (REC)</span>
          {showLuar && <span className="w-56 text-right">Harga Luar REC / Ekspor</span>}
        </div>
        <ul>
          {produk.map((item, index) => {
            const lokal = formatHarga(item.price, item.priceMax);
            const luar = formatHarga(item.price, item.priceMax, selisih);
            const unit = UNIT_SUFFIX[item.unit];
            return (
              <li
                key={`${item.name}-${index}`}
                className={`flex items-center gap-3 px-4 py-3 md:px-5 ${index > 0 ? "border-t border-slate-100" : ""} ${
                  item.status === "habis" ? "opacity-60" : ""
                }`}
              >
                <IkanThumb produk={item} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text-primary">{item.name}</p>
                  <StatusBadge status={item.status} />
                  {item.note && <p className="text-xs text-text-secondary">{item.note}</p>}
                </div>
                {lokal ? (
                  <div className="flex shrink-0 flex-col items-end gap-1 text-right md:flex-row md:gap-0">
                    <p className="md:w-48">
                      <span className="block text-[11px] text-text-secondary md:hidden">Lokal</span>
                      <span className="font-semibold text-primary-blue">{lokal}</span>
                      <span className="text-xs text-text-secondary">{unit}</span>
                    </p>
                    {showLuar && luar && (
                      <p className="md:w-56">
                        <span className="block text-[11px] text-text-secondary md:hidden">Luar REC / Ekspor</span>
                        <span className="font-semibold text-text-primary">{luar}</span>
                        <span className="text-xs text-text-secondary">{unit}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="shrink-0 text-right text-sm text-text-secondary">Tanya harga</p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Export fish are usually priced per order, so they are listed as name tiles. */
function EksporList({ produk, hasLokal }: { produk: KoperasiProdukIkan[]; hasLokal: boolean }) {
  return (
    <div className={hasLokal ? "mt-10" : ""}>
      <h3 className="font-heading text-2xl font-bold text-text-primary">Ikan Ekspor</h3>
      <p className="mb-4 mt-1 text-sm text-text-secondary">Harga mengikuti pasar dan jumlah pesanan. Tanyakan lewat WhatsApp.</p>
      {/* Widths mirror 2 / 3 / 4 columns (gap-3 = 0.75rem). */}
      <ul className="flex flex-wrap gap-3">
        {produk.map((item, index) => {
          const harga = formatHarga(item.price, item.priceMax);
          return (
            <li
              key={`${item.name}-${index}`}
              className={`flex w-[calc((100%-0.75rem)/2)] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_20px_rgba(15,23,42,0.03)] md:w-[calc((100%-1.5rem)/3)] lg:w-[calc((100%-2.25rem)/4)] ${
                item.status === "habis" ? "opacity-60" : ""
              }`}
            >
              <IkanThumb produk={item} />
              <div className="min-w-0">
                <p className="font-semibold leading-snug text-text-primary">{item.name}</p>
                {harga && (
                  <p className="text-sm font-semibold text-primary-blue">
                    {harga}
                    <span className="text-xs font-normal text-text-secondary">{UNIT_SUFFIX[item.unit]}</span>
                  </p>
                )}
                <StatusBadge status={item.status} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function IkanThumb({ produk }: { produk: KoperasiProdukIkan }) {
  return produk.image ? (
    <img
      src={sanityImageUrl(produk.image, 96)}
      alt=""
      loading="lazy"
      className={`h-10 w-10 shrink-0 rounded-xl object-cover ${produk.status === "habis" ? "grayscale" : ""}`}
    />
  ) : (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-blue/10 text-primary-blue" aria-hidden="true">
      <Fish size={20} />
    </span>
  );
}

/** Only out-of-the-ordinary stock is flagged; "Tersedia" is the default and stays quiet. */
function StatusBadge({ status }: { status: ProdukStatus }) {
  if (status === "tersedia") return null;
  return (
    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[status]}`}>
      {produkStatusTitle(status)}
    </span>
  );
}

/** One WhatsApp number serves every product, so ordering is a single call to action. */
function OrderPanel({ koperasi, whatsapp }: { koperasi: KoperasiDetail; whatsapp: string }) {
  const { name, perikananOrderTitle, perikananOrderDescription } = koperasi;
  const message = `Halo ${name}, saya ingin memesan hasil perikanan.\n\nProduk: \nJumlah: \nPembeli dari (REC / luar REC): `;
  // Plain wa.me links get a prefilled message; other links are used as they are.
  const href = /^https:\/\/wa\.me\/\d+$/.test(whatsapp)
    ? `${whatsapp}?text=${encodeURIComponent(message)}`
    : whatsapp;

  return (
    <div className="mt-8 flex flex-col items-start gap-5 rounded-2xl border border-[#2bb673]/25 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:p-6">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2bb673]/10 text-[#2bb673]">
        <Fish size={24} aria-hidden="true" />
      </span>
      <div className="flex-1">
        <p className="font-heading text-lg font-bold text-text-primary">
          {perikananOrderTitle || "Pesan hasil perikanan"}
        </p>
        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
          {perikananOrderDescription ||
            `Semua produk dipesan lewat satu nomor WhatsApp ${name}. Sebutkan produk dan jumlahnya, lalu koperasi akan mengonfirmasi harga dan ketersediaannya.`}
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2bb673] px-6 py-3.5 font-semibold text-white shadow-[0_10px_24px_rgba(43,182,115,0.25)] transition hover:-translate-y-0.5 hover:bg-[#239d63] md:w-auto"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Pesan via WhatsApp
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </a>
    </div>
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
