import { defineField, defineType } from "sanity";
import { PETA_KATEGORI_OPTIONS, REMPANG_BOUNDS, parseKoordinat } from "../../lib/peta";

const KATEGORI_TITLES = Object.fromEntries(
  PETA_KATEGORI_OPTIONS.map(({ value, title }) => [value, title])
);

// A place shown as a marker on the interactive map on the Beranda
// (warung, masjid, koperasi, dermaga, ...).
export const petaLokasi = defineType({
  name: "petaLokasi",
  title: "Lokasi di Peta",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nama Tempat",
      type: "string",
      description: 'Contoh: "Masjid Al-Ikhlas" atau "Warung Makan Bu Siti"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      description: "Menentukan ikon, warna, dan filter di peta.",
      options: {
        list: PETA_KATEGORI_OPTIONS.map(({ value, title }) => ({ value, title })),
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coordinates",
      title: "Koordinat",
      type: "string",
      description:
        "Buka Google Maps → klik kanan tepat di lokasi → klik angka koordinat paling atas (otomatis tersalin) → tempel di sini. Contoh: 0.81425, 104.22475",
      validation: (rule) => [
        rule.required().custom((value) =>
          !value || parseKoordinat(value)
            ? true
            : 'Format harus "lintang, bujur", contoh: 0.81425, 104.22475'
        ),
        rule
          .custom((value) => {
            const point = parseKoordinat(value);
            if (!point) return true;
            const { minLat, maxLat, minLng, maxLng } = REMPANG_BOUNDS;
            const inside =
              point.lat >= minLat && point.lat <= maxLat && point.lng >= minLng && point.lng <= maxLng;
            return inside || "Koordinat ini berada di luar area Rempang. Pastikan tidak salah salin.";
          })
          .warning(),
      ],
    }),
    defineField({
      name: "photo",
      title: "Foto (opsional)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Keterangan (opsional)",
      type: "text",
      rows: 3,
      description: "Contoh: jam buka, menu andalan, atau patokan lokasi.",
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: "link",
      title: "Link Halaman Terkait (opsional)",
      type: "url",
      description:
        'Halaman di website ini, contoh: "/koperasi/transmigrasi" atau "/umkm/warung-akbar". Muncul sebagai tombol "Lihat Detail".',
      validation: (rule) => rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
  ],
  orderings: [
    { title: "Nama A–Z", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
    { title: "Kategori", name: "category", by: [{ field: "category", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", category: "category", media: "photo" },
    prepare: ({ title, category, media }) => ({
      title,
      subtitle: KATEGORI_TITLES[category as string] ?? "Belum ada kategori",
      media,
    }),
  },
});
