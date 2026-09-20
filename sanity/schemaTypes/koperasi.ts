import { defineField, defineType } from "sanity";

// Only two cooperatives exist today, each with its own static route
// (/koperasi/transmigrasi and /koperasi/merah-putih). routeKey ties a
// document to its page deterministically instead of a free-text slug.
const ROUTE_KEYS = ["transmigrasi", "merah-putih"] as const;

export const koperasi = defineType({
  name: "koperasi",
  title: "Koperasi",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nama Koperasi",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "routeKey",
      title: "Halaman Tujuan",
      type: "string",
      description: "Menentukan halaman /koperasi/... mana yang menampilkan dokumen ini.",
      options: { list: [...ROUTE_KEYS] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "homeCardDescription",
      title: "Deskripsi Singkat (untuk card Beranda)",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "heroImage",
      title: "Foto Utama",
      type: "image",
      options: { hotspot: true },
      description: "Dipakai di card Beranda maupun bagian Tentang.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "about",
      title: "Deskripsi Tentang",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "yearFounded",
      title: "Tahun Berdiri",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "memberCount",
      title: "Jumlah Anggota",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "structureImage",
      title: "Gambar Struktur Kepengurusan",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pengurus",
      title: "Pengurus",
      type: "array",
      of: [{ type: "koperasiPengurus" }],
    }),
    defineField({
      name: "galleryItems",
      title: "Galeri Kegiatan",
      type: "array",
      of: [{ type: "koperasiGalleryItem" }],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "routeKey", media: "heroImage" },
  },
});
