import { defineField, defineType } from "sanity";

export const koperasiTestimoni = defineType({
  name: "koperasiTestimoni",
  title: "Testimoni",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Nama Pembeli",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Keterangan (opsional)",
      type: "string",
      description: 'Contoh: "Pemilik rumah makan, Batam"',
    }),
    defineField({
      name: "quote",
      title: "Testimoni",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "purchase",
      title: "Jumlah Pembelian (opsional)",
      type: "string",
      description: 'Contoh: "Beli rutin 50 kg/minggu"',
    }),
    defineField({
      name: "photo",
      title: "Foto (opsional)",
      type: "image",
      options: { hotspot: true },
      description: "Kosongkan untuk menampilkan inisial nama.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "quote", media: "photo" },
  },
});
