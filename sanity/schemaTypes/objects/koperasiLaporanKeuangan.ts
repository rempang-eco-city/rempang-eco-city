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
      title: "File Laporan",
      type: "file",
      options: { accept: ".pdf,.xlsx,.xls,.docx,.doc" },
      description:
        "PDF, Excel (.xlsx/.xls, maks. 5 MB), atau Word (.docx/.doc, maks. 10 MB). PDF dibuka langsung di browser; Excel dan Word ditampilkan view-only lewat Microsoft Office Online.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "file.asset.originalFilename", media: "cover" },
  },
});
