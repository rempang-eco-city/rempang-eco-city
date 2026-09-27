import { defineField, defineType } from "sanity";

const CATEGORIES = [
  "Development",
  "Community",
  "Investment",
  "Sustainability",
  "Events",
] as const;

export const newsArticle = defineType({
  name: "newsArticle",
  title: "Berita",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Judul",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Dipakai untuk URL /berita/[slug]",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: { list: [...CATEGORIES] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Tanggal Terbit",
      type: "date",
      description: "Dipakai untuk urutan berita dan ditampilkan di website.",
      options: { dateFormat: "D MMMM YYYY" },
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      // Legacy free-text date from before publishedAt existed. Only shown for
      // older documents that still have it; the site falls back to it when
      // publishedAt is empty.
      name: "date",
      title: "Tanggal Tampil (lama)",
      type: "string",
      description: "Tidak dipakai lagi. Isi Tanggal Terbit di atas, lalu kosongkan field ini.",
      hidden: ({ value }) => !value,
    }),
    defineField({
      name: "excerpt",
      title: "Ringkasan",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "content",
      title: "Isi Berita",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "image",
      title: "Gambar Utama",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Tampilkan sebagai Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "image" },
  },
});
