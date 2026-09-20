import { defineField, defineType } from "sanity";

export const umkmProduct = defineType({
  name: "umkmProduct",
  title: "Produk",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Nama Produk",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Harga",
      type: "string",
      description: 'Contoh: "Mulai Rp 20.000"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Foto Produk",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "price", media: "image" },
  },
});
