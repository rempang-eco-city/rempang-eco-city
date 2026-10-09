// Categories for places on the Beranda map. Shared by the Sanity schema (the
// dropdown in the Studio) and the site (components/sections/RempangMap.tsx
// gives each one a colour and icon), so adding an option here requires adding
// its style there — TypeScript enforces that.
export const PETA_KATEGORI_OPTIONS = [
  { value: "warung-makan", title: "Warung Makan" },
  { value: "warung-jajan", title: "Warung Jajan" },
  { value: "pasar", title: "Pasar" },
  { value: "masjid", title: "Masjid / Mushola" },
  { value: "sekolah", title: "Sekolah" },
  { value: "kesehatan", title: "Fasilitas Kesehatan" },
  { value: "koperasi", title: "Koperasi" },
  { value: "kampung-nelayan", title: "Kampung Nelayan" },
  { value: "dermaga", title: "Dermaga" },
  { value: "lainnya", title: "Lainnya" },
] as const;

export type PetaKategori = (typeof PETA_KATEGORI_OPTIONS)[number]["value"];

const KATEGORI_VALUES = new Set<string>(PETA_KATEGORI_OPTIONS.map(({ value }) => value));

/** Unknown values (e.g. a category removed from the list) fall back to "lainnya". */
export function toPetaKategori(value: string | null | undefined): PetaKategori {
  return value && KATEGORI_VALUES.has(value) ? (value as PetaKategori) : "lainnya";
}

// Roughly Pulau Rempang and its neighbours; used to warn about coordinates
// that were mistyped or copied from the wrong place.
export const REMPANG_BOUNDS = { minLat: 0.6, maxLat: 1.0, minLng: 104.0, maxLng: 104.4 };

/**
 * Parses coordinates as Google Maps copies them on right-click,
 * e.g. "0.81425, 104.22475". Returns null for anything else.
 */
export function parseKoordinat(value: string | null | undefined) {
  const match = value?.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;

  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}
