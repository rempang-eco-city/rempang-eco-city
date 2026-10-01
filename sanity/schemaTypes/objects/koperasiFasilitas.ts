import { defineField, defineType } from "sanity";

export const koperasiFasilitas = defineType({
  name: "koperasiFasilitas",
  title: "Fasilitas",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Nama Fasilitas",
      type: "string",
      description: 'Contoh: "Gudang Penyimpanan"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Deskripsi Singkat (opsional)",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "image",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
      description: "Foto landscape (rasio 4:3) paling cocok.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "description", media: "image" },
  },
});
