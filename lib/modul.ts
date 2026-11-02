// Sectors of the modules on the Profil page. Shared by the Sanity schema (the
// choice in the Studio) and the site (components/pages/ProfilContent.tsx shows
// the title above each module's name).
export const MODUL_SEKTOR_OPTIONS = [
  { value: "pengantar", title: "Pengantar" },
  { value: "perikanan", title: "Perikanan" },
  { value: "pariwisata", title: "Pariwisata" },
  { value: "umkm", title: "UMKM" },
  { value: "website", title: "Website" },
] as const;

export type ModulSektor = (typeof MODUL_SEKTOR_OPTIONS)[number]["value"];

export function modulSektorTitle(sektor: ModulSektor) {
  return MODUL_SEKTOR_OPTIONS.find(({ value }) => value === sektor)?.title ?? sektor;
}
