import { defineField, defineType } from "sanity";

// Only two destinations exist today; routeKey drives which tab/icon is
// shown in the Pariwisata page's destination switcher.
const ROUTE_KEYS = ["mancing", "mangrove"] as const;

export const pariwisataDestination = defineType({
  name: "pariwisataDestination",
  title: "Destinasi Pariwisata",
  type: "document",
  fields: [
    defineField({
      name: "routeKey",
      title: "Kunci Destinasi",
      type: "string",
      options: { list: [...ROUTE_KEYS] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Nama Destinasi",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Lokasi",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      description: 'Contoh: "Jasa", "Alam"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Ringkasan Singkat",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bestTime",
      title: "Waktu Terbaik Kunjungan",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "facilities",
      title: "Fasilitas",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "tips",
      title: "Tips Kunjungan",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "gallery",
      title: "Galeri Foto",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "whatsapp",
      title: "Link WhatsApp",
      type: "url",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "location", media: "gallery.0" },
  },
});
