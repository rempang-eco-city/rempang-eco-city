// Areas for the "Manfaat Website" cards on the Beranda. Shared by the Sanity
// schema (the choice in the Studio) and the site
// (components/sections/ManfaatSection.tsx gives each one an icon and a link),
// so adding an option here requires adding its style there — TypeScript
// enforces that.
export const MANFAAT_BIDANG_OPTIONS = [
  { value: "koperasi", title: "Koperasi" },
  { value: "perikanan", title: "Perikanan" },
  { value: "umkm", title: "UMKM" },
  { value: "pariwisata", title: "Pariwisata" },
  { value: "berita", title: "Berita & Peta" },
] as const;

export type ManfaatBidang = (typeof MANFAAT_BIDANG_OPTIONS)[number]["value"];

export function manfaatBidangTitle(bidang: ManfaatBidang) {
  return MANFAAT_BIDANG_OPTIONS.find(({ value }) => value === bidang)?.title ?? bidang;
}
