// Stock status of a fish product in the Koperasi "Hasil Perikanan" catalogue.
// Shared by the Sanity schema (the choice in the Studio) and the site
// (components/pages/KoperasiDetailContent.tsx gives each one a badge style), so
// adding an option here requires adding its style there — TypeScript enforces that.
export const PRODUK_STATUS_OPTIONS = [
  { value: "tersedia", title: "Tersedia" },
  { value: "musiman", title: "Musiman" },
  { value: "habis", title: "Habis" },
] as const;

export type ProdukStatus = (typeof PRODUK_STATUS_OPTIONS)[number]["value"];

export const PRODUK_UNIT_OPTIONS = [
  { value: "kg", title: "per kg" },
  { value: "ekor", title: "per ekor" },
  { value: "paket", title: "per paket" },
] as const;

export type ProdukUnit = (typeof PRODUK_UNIT_OPTIONS)[number]["value"];

// Local fish are sold to buyers inside and outside REC at two price levels;
// export fish are listed by name and usually priced on request.
export const PRODUK_KATEGORI_OPTIONS = [
  { value: "lokal", title: "Ikan Lokal" },
  { value: "ekspor", title: "Ikan Ekspor" },
] as const;

export type ProdukKategori = (typeof PRODUK_KATEGORI_OPTIONS)[number]["value"];

export function produkStatusTitle(status: ProdukStatus) {
  return PRODUK_STATUS_OPTIONS.find(({ value }) => value === status)?.title ?? status;
}

/** "Rp25.000" or, for a range, "Rp25.000–30.000". `add` shifts both ends (the outside-REC markup). */
export function formatHarga(price?: number, priceMax?: number, add = 0) {
  if (price == null) return null;
  const rp = (n: number) => (n + add).toLocaleString("id-ID");
  return priceMax != null && priceMax > price ? `Rp${rp(price)}–${rp(priceMax)}` : `Rp${rp(price)}`;
}
