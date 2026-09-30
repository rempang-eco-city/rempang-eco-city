// Icon choices for koperasi "Layanan" cards. Shared by the Sanity schema (the
// dropdown in the Studio) and the site (components/pages/KoperasiDetailContent.tsx
// maps each value to a lucide icon), so adding an option here requires adding
// its icon there — TypeScript enforces that.
export const LAYANAN_ICON_OPTIONS = [
  { value: "simpan-pinjam", title: "Simpan Pinjam / Keuangan" },
  { value: "tabungan", title: "Tabungan" },
  { value: "toko", title: "Toko / Sembako" },
  { value: "pertanian", title: "Pertanian" },
  { value: "perikanan", title: "Perikanan" },
  { value: "distribusi", title: "Distribusi / Pengiriman" },
  { value: "pelatihan", title: "Pelatihan / Edukasi" },
  { value: "pendampingan", title: "Pendampingan / Kemitraan" },
  { value: "pemasaran", title: "Pemasaran / Promosi" },
  { value: "konsultasi", title: "Konsultasi" },
  { value: "jasa", title: "Jasa / Perbaikan" },
  { value: "lainnya", title: "Lainnya" },
] as const;

export type LayananIconKey = (typeof LAYANAN_ICON_OPTIONS)[number]["value"];
