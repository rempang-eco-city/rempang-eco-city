// Sectors of the modules on the Profil page. Shared by the Sanity schema (the
// choice in the Studio) and the site (components/pages/ProfilContent.tsx gives
// each one a badge colour), so adding an option here requires adding its style
// there — TypeScript enforces that.
export const MODUL_SEKTOR_OPTIONS = [
  { value: "perikanan", title: "Perikanan" },
  { value: "pariwisata", title: "Pariwisata" },
  { value: "umkm", title: "UMKM" },
] as const;

export type ModulSektor = (typeof MODUL_SEKTOR_OPTIONS)[number]["value"];

export function modulSektorTitle(sektor: ModulSektor) {
  return MODUL_SEKTOR_OPTIONS.find(({ value }) => value === sektor)?.title ?? sektor;
}
