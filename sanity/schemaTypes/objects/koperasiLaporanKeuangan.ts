import { defineField, defineType } from "sanity";

export const koperasiLaporanKeuangan = defineType({
  name: "koperasiLaporanKeuangan",
  title: "Laporan Keuangan",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Judul",
      type: "string",
      description: 'Contoh: "Laporan Keuangan 2025"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cover",
      title: "Cover (portrait)",
      type: "image",
      options: { hotspot: true },
      description: "Gambar poster/cover, disarankan rasio kertas A4 (portrait).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "file",
      title: "File Excel",
      type: "file",
      options: { accept: ".xlsx,.xls" },
      description:
        "Format .xlsx atau .xls, maksimal 5 MB. Ditampilkan view-only lewat Microsoft Office Online.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "file.asset.originalFilename", media: "cover" },
  },
});
