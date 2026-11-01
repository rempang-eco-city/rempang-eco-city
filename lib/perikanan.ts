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

export function produkStatusTitle(status: ProdukStatus) {
  return PRODUK_STATUS_OPTIONS.find(({ value }) => value === status)?.title ?? status;
}
