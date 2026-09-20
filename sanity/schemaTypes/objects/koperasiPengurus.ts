import { defineField, defineType } from "sanity";

export const koperasiPengurus = defineType({
  name: "koperasiPengurus",
  title: "Pengurus",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Nama",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Jabatan",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" },
  },
});
