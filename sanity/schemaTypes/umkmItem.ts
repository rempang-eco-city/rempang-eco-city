import { defineField, defineType } from "sanity";

const UMKM_CATEGORIES = ["Kuliner", "Kerajinan", "Jasa"] as const;

export const umkmItem = defineType({
  name: "umkmItem",
  title: "UMKM",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nama UMKM",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Dipakai untuk URL /umkm/[slug]",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: { list: [...UMKM_CATEGORIES] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Foto Utama",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cardDescription",
      title: "Deskripsi Singkat (untuk card)",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "description",
      title: "Deskripsi Lengkap",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Lokasi",
      type: "string",
    }),
    defineField({
      name: "owner",
      title: "Pemilik",
      type: "string",
    }),
    defineField({
      name: "whatsapp",
      title: "Link WhatsApp",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shopee",
      title: "Link Shopee (opsional)",
      type: "url",
    }),
    defineField({
      name: "gallery",
      title: "Galeri Foto",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "products",
      title: "Produk yang Dijual",
      type: "array",
      of: [{ type: "umkmProduct" }],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category", media: "image" },
  },
});
