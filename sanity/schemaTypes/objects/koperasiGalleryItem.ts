import { defineField, defineType } from "sanity";

export const koperasiGalleryItem = defineType({
  name: "koperasiGalleryItem",
  title: "Kegiatan Galeri",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Judul Kegiatan",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Foto Kegiatan",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", media: "images.0" },
  },
});
