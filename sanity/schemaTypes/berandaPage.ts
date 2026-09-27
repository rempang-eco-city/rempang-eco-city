import { defineField, defineType } from "sanity";

// Singleton: exactly one document with _id "berandaPage" (see sanity/structure.ts).
// Only the section copy lives here; the Koperasi, UMKM and Berita cards come
// from their own document types.
export const berandaPage = defineType({
  name: "berandaPage",
  title: "Halaman Beranda",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "peta", title: "Peta Wilayah" },
    { name: "koperasi", title: "Koperasi" },
    { name: "pariwisata", title: "Pariwisata" },
    { name: "umkm", title: "UMKM" },
    { name: "berita", title: "Berita" },
  ],
  fields: [
    defineField({
      name: "heroTitle",
      title: "Judul Hero",
      type: "text",
      rows: 2,
      group: "hero",
      description: "Tekan Enter untuk pindah baris.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Deskripsi Hero",
      type: "text",
      rows: 3,
      group: "hero",
    }),
    defineField({
      name: "heroButtonLabel",
      title: "Teks Tombol",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroButtonLink",
      title: "Link Tombol",
      type: "url",
      group: "hero",
      description: 'Halaman di website ini (contoh: "/profil") atau link lengkap (https://...).',
      validation: (rule) =>
        rule.required().uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
    defineField({
      name: "heroImage",
      title: "Gambar Hero",
      type: "image",
      options: { hotspot: true },
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "petaTitle",
      title: "Judul Peta",
      type: "string",
      group: "peta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "petaDescription",
      title: "Deskripsi Peta",
      type: "text",
      rows: 2,
      group: "peta",
    }),
    defineField({
      name: "petaAddress",
      title: "Alamat / Lokasi di Google Maps",
      type: "string",
      group: "peta",
      description: "Teks yang dicari di Google Maps, bisa alamat atau Plus Code.",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "koperasiTitle",
      title: "Judul Section Koperasi",
      type: "string",
      group: "koperasi",
      description: "Card koperasi diambil dari dokumen Koperasi.",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "pariwisataTitle",
      title: "Judul Section Pariwisata",
      type: "string",
      group: "pariwisata",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pariwisataDescription",
      title: "Deskripsi Pariwisata",
      type: "text",
      rows: 3,
      group: "pariwisata",
    }),
    defineField({
      name: "pariwisataImages",
      title: "Foto Carousel Pariwisata",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      group: "pariwisata",
      validation: (rule) => rule.required().min(1),
    }),

    defineField({
      name: "umkmTitle",
      title: "Judul Section UMKM",
      type: "string",
      group: "umkm",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "umkmDescription",
      title: "Deskripsi UMKM",
      type: "text",
      rows: 3,
      group: "umkm",
      description: "Card UMKM diambil dari dokumen UMKM.",
    }),

    defineField({
      name: "beritaTitle",
      title: "Judul Section Berita",
      type: "string",
      group: "berita",
      description: "Card berita diambil dari dokumen Berita.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Halaman Beranda" }),
  },
});
